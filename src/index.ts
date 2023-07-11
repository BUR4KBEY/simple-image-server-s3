import 'dotenv/config';

import { createHash } from 'crypto';
import express, { json, urlencoded } from 'express';
import multer from 'multer';
import { extname, join } from 'path';

import AmazonS3 from './structures/AmazonS3';
import FileStore from './structures/stores/FileStore';
import { BACKEND, SETTINGS } from './utils/Constants';

const app = express();

const s3 = new AmazonS3();
const fileStore = new FileStore(s3);

const upload = multer({
  fileFilter(req, file, callback) {
    const ext = extname(file.originalname);

    if (!SETTINGS.VALID_FILE_EXTENSIONS.includes(ext)) {
      callback(new Error('Invalid file extension.'));
      return;
    }

    callback(null, true);
  },
  limits: {
    fileSize: SETTINGS.MAX_FILE_SIZE
  }
});

app.use(json());
app.use(urlencoded({ extended: true }));

app.get('/', (req, res) =>
  res.sendFile(join(__dirname, '../upload_form.html'))
);

app.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

  const hashSum = createHash('sha256');
  hashSum.update(req.file.buffer);

  const hex = hashSum.digest('hex');
  const ext = extname(req.file.originalname);
  const key = `${hex}${ext}`;

  try {
    await fileStore.getObject(key);

    fileStore.removeInvalidKeyFromCache(key);

    res.status(200).json({ message: 'File uploaded successfully. (1)' });
  } catch (error) {
    await s3.uploadObject(key, req.file.buffer);

    fileStore._saveFile(key, req.file.buffer);

    fileStore.removeInvalidKeyFromCache(key);

    res.status(200).json({ message: 'File uploaded successfully. (2)' });
  }
});

app.get('/images/:key', async (req, res) => {
  const { key } = req.params;

  const longestValidFileExtensionLength = SETTINGS.VALID_FILE_EXTENSIONS.reduce(
    (a, b) => (a.length > b.length ? a : b)
  ).length;

  const maxKeyLength = 64 + longestValidFileExtensionLength;

  if (key.length > maxKeyLength || fileStore.invalidKeys.includes(key))
    return res.status(400).json({ message: 'Invalid key.' });

  try {
    const data = await fileStore.getObject(key);

    res.setHeader('Content-Type', 'image/jpeg').send(data);
  } catch (error) {
    if (!fileStore.invalidKeys.includes(key)) {
      fileStore.invalidKeys.push(key);

      setTimeout(() => {
        fileStore.removeInvalidKeyFromCache(key);
      }, SETTINGS.FILE_STORE_CACHE_RESET_MS);
    }

    res.status(404).json({ message: 'File not found.' });
  }
});

app.listen(BACKEND.PORT, () => {
  console.log(`Server is running on port ${BACKEND.PORT}.`);
});
