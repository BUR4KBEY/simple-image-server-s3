import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import BaseStore from './BaseStore';

export default class FileStore extends BaseStore {
  private readonly folderPath = join(__dirname, '../../../uploads');

  invalidKeys: string[] = [];

  private isFileExist(key: string): boolean {
    return existsSync(join(this.folderPath, key));
  }

  private getFile(key: string) {
    return readFileSync(join(this.folderPath, key));
  }

  _saveFile(key: string, data: Uint8Array) {
    return writeFileSync(join(this.folderPath, key), data);
  }

  getObject(key: string): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      const dataInStore = this.isFileExist(key);

      if (dataInStore) {
        console.log('[FILE-STORE] Object found in disk.');
        const file = this.getFile(key);
        resolve(file);
      } else {
        console.log(
          '[FILE-STORE] Object not found in disk. Fetching from S3...'
        );

        try {
          const obj = await this.s3.getObject(key);
          const byteArr = await obj.Body.transformToByteArray();

          // Save to disk
          this._saveFile(key, byteArr);

          console.log('[FILE-STORE] Object found in S3. Saved to the disk.');

          resolve(Buffer.from(byteArr));
        } catch (error) {
          console.log('[FILE-STORE] Object not found in S3.');
          reject(error);
        }
      }
    });
  }

  removeInvalidKeyFromCache(key: string) {
    if (this.invalidKeys.includes(key)) {
      this.invalidKeys.splice(this.invalidKeys.indexOf(key), 1);
    }
  }
}
