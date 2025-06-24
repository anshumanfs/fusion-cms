import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
require('dotenv').config();

class S3Handler {
  private s3Client: S3Client;
  private bucketName: string;
  constructor(region: string, accessKeyId: string, secretAccessKey: string, bucketName: string) {
    this.s3Client = new S3Client({
      region: region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });
    this.bucketName = bucketName;
  }

  async createBucket(bucketName: string) {
    try {
      const command = new CreateBucketCommand({ Bucket: bucketName });
      await this.s3Client.send(command);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteBucket(bucketName: string) {
    try {
      const command = new DeleteBucketCommand({ Bucket: bucketName });
      await this.s3Client.send(command);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async uploadFile(bucketName: string, key: string, body: any) {
    try {
      const command = new PutObjectCommand({ Bucket: bucketName, Key: key, Body: body });
      await this.s3Client.send(command);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteFile(bucketName: string, key: string) {
    try {
      const command = new DeleteObjectCommand({ Bucket: bucketName, Key: key });
      await this.s3Client.send(command);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getFile(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      const response = await this.s3Client.send(command);
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getSignedUrl(key: string, expiration: number) {
    try {
      const url = await getSignedUrl(this.s3Client, new GetObjectCommand({ Bucket: this.bucketName, Key: key }), {
        expiresIn: expiration,
      });
      return url;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export { S3Handler };
