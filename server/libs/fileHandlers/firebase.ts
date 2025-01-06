import { initializeApp } from 'firebase/app';
import { getStorage, getStream } from 'firebase/storage';

require('dotenv').config();

class FirebaseHandler {
  private bucketName: string;
  private storage: any;

  constructor(bucketName: string, firebaseConfig: any) {
    const app = initializeApp({ ...firebaseConfig });
    this.storage = getStorage(app);
    this.bucketName = bucketName;
  }

  async uploadFile(filePath: string, destination: string) {
    try {
      await this.storage.upload(filePath, {
        destination: destination,
      });
      console.log(`${filePath} uploaded to ${this.bucketName}`);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteFile(fileName: string) {
    try {
      await this.storage.file(fileName).delete();
      console.log(`File ${fileName} deleted from ${this.bucketName}`);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getFile(fileName: string) {
    try {
      const file = this.storage.file(fileName);
      const [metadata] = await file.getMetadata();
      return metadata;
    } catch (error) {
      console.error(error);
    }
  }

  async downloadFile(fileName: string, destination: string) {
    try {
      const options = {
        destination: destination,
      };
      await this.storage.file(fileName).download(options);
      console.log(`File ${fileName} downloaded to ${destination}`);
    } catch (error) {
      console.error(error);
    }
  }
}

export { FirebaseHandler };
