import { Readable } from 'stream';

import {
  GetObjectCommandInput,
  GetObjectCommandOutput,
  PutObjectCommandInput,
  S3
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import { AWS_CONFIG } from '../utils/Constants';

type CustomGetObjectCommandOutput = Omit<GetObjectCommandOutput, 'Body'> &
  Required<Pick<GetObjectCommandOutput, 'Body'>>;

export default class AmazonS3 {
  private client = new S3({
    region: AWS_CONFIG.BUCKET_REGION,
    credentials: {
      accessKeyId: AWS_CONFIG.ACCESS_KEY,
      secretAccessKey: AWS_CONFIG.SECRET_ACCESS_KEY
    }
  });
  private readonly bucketName = AWS_CONFIG.BUCKET_NAME;

  // Required Permission: PutObject
  uploadObject(
    key: string,
    body: Readable | ReadableStream | Blob | string | Uint8Array | Buffer
  ) {
    const data: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Body: body,
      Key: key
    };

    return new Upload({
      client: this.client,
      params: data
    }).done();
  }

  // Required Permission: GetObject
  getObject(key: string) {
    const data: GetObjectCommandInput = {
      Bucket: this.bucketName,
      Key: key
    };

    return new Promise<CustomGetObjectCommandOutput>(
      async (resolve, reject) => {
        try {
          const object = await this.client.getObject(data);

          if (!object.Body) reject(`Object body not found.`);

          resolve(object as CustomGetObjectCommandOutput);
        } catch (error) {
          reject(error);
        }
      }
    );
  }

  // Required Permission: DeleteObject
  // deleteObject(key: string) {
  //   const data: DeleteObjectCommandInput = {
  //     Bucket: this.bucketName,
  //     Key: key
  //   };

  //   return this.client.deleteObject(data);
  // }
}
