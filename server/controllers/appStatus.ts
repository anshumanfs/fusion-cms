import config from '../config.json';
import logger from '../libs/logger';
import lodash from 'lodash';
import { z } from 'zod';
import { metaDataDbSchema, secretSchema } from '../schema/zod/configJsonSchema';
import { dbModels } from '../db';

class Application {
  isRunning: boolean;
  version: string;
  isMetadataDbConfigured: boolean;
  isMetadataDbConnected: boolean;
  isSecretsConfigured: boolean;

  public constructor() {
    this.isRunning = true;
    this.version = '1.0.0';
    this.isMetadataDbConfigured = false;
    this.isMetadataDbConnected = false;
    this.isSecretsConfigured = false;
  }

  public checkAppStaus(): void {
    this.checkIfMetadataDbConfigured();
    this.checkIfSecretsConfigured();
  }

  public async checkIfAdminRegistered() {
    const { users } = dbModels;
    const result = await users.find({ role: 'admin' });
    if (result.length > 0) {
      return true;
    }
    return false;
  }

  private checkIfMetadataDbConfigured(): void {
    const configJson = lodash.cloneDeep(config);
    try {
      metaDataDbSchema.parse(configJson.metadataDb);
      this.isMetadataDbConfigured = true;
    } catch (error: string | any) {
      logger.error(error);
      if (error instanceof z.ZodError) {
        this.isMetadataDbConfigured = false;
      }
    }
  }

  private checkIfSecretsConfigured(): void {
    const configJson = lodash.cloneDeep(config);
    try {
      secretSchema.parse(configJson.secrets);
      this.isSecretsConfigured = true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.isSecretsConfigured = false;
      }
    }
  }
}

export default Application;
