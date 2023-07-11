import AmazonS3 from '../AmazonS3';

export default abstract class BaseStore {
  constructor(protected s3: AmazonS3) {}

  abstract getObject(key: string): Promise<Buffer>;
}
