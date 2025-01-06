const fs = require('fs-extra');
const localFileStoragePath = process.env.LOCAL_FILE_STORAGE_PATH || 'uploads';

class LocalStorageHandler {
  private localFileStoragePath = localFileStoragePath;
  private bucketName: string = 'localBucket';
  async createBucket(bucketName: string, localFileStoragePath: string = this.localFileStoragePath) {
    this.bucketName = bucketName;
    this.localFileStoragePath = localFileStoragePath;
    try {
      await fs.ensureDir(`${localFileStoragePath}/${bucketName}`);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteBucket(bucketName: string, localFileStoragePath: string = this.localFileStoragePath) {
    try {
      await fs.remove(`${localFileStoragePath}/${bucketName}`);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async uploadFile(
    bucketName: string,
    key: string,
    body: any,
    localFileStoragePath: string = this.localFileStoragePath
  ) {
    try {
      await fs.ensureDir(`${localFileStoragePath}/${bucketName}`);
      await fs.writeFile(`${localFileStoragePath}/${bucketName}/${key}`, body);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteFile(bucketName: string, key: string, localFileStoragePath: string = this.localFileStoragePath) {
    try {
      await fs.remove(`${localFileStoragePath}/${bucketName}/${key}`);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getFile(key: string, localFileStoragePath: string = this.localFileStoragePath) {
    try {
      return await fs.readFile(`${localFileStoragePath}/${this.bucketName}/${key}`);
    } catch (error) {
      console.error(error);
    }
  }
}

export { LocalStorageHandler };
