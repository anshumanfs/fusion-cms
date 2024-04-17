import { Request, Response } from 'express';
import fs from 'fs-extra';
import crypto from 'crypto';
import path from 'path';

interface metadataDbConfigs {
  type: string;
  orm: string;
  configs: any;
}

const configJsonFile = path.resolve(__dirname, '../config.json');
const defaultConfig = Object.freeze({
  metadataDb: {},
  secrets: {
    bearerSecret: crypto.randomUUID(),
    refreshTokenSecret: crypto.randomUUID(),
    apiKeySecret: crypto.randomUUID(),
    passwordSecret: crypto.randomUUID(),
  },
  appStatus: {
    isNextPrepared: false, // present inside server/app.ts
    isMetadataDbConfigured: false, // present inside server/db.ts
    isMetadataDbConnected: false,
    isManageAppEndpointsLive: false,
    isAppsGeneratedSuccessfully: false,
    isOtherAppEndpointsLive: false,
  },
  orms: {
    mongo: 'mongoose',
    mysql: 'sequelize',
    postgresql: 'sequelize',
    sqlite: 'sequelize',
  },
});

const setMetaDataDbConfigs = (req: Request, res: Response) => {
  const { dbType, dbName, dbConfigs } = req.body;
  const metadataDb: metadataDbConfigs = {
    type: '',
    orm: '',
    configs: {},
  };
  metadataDb.type = dbType;
  metadataDb.orm = defaultConfig.orms[dbName as keyof typeof defaultConfig.orms];
  metadataDb.configs = dbConfigs;
};

const resetAppStatus = () => {
  const config = require('../config.json');
  if (!fs.existsSync(configJsonFile)) {
    fs.ensureFileSync(path.resolve(__dirname, '../config.json'));
    fs.writeJsonSync(configJsonFile, defaultConfig, { spaces: '\t' });
  } else {
    const newConfig = {
      ...config,
      appStatus: {
        ...defaultConfig.appStatus,
      },
    };
    fs.writeJsonSync(path.resolve(__dirname, '../config.json'), newConfig, { spaces: '\t' });
  }
  return;
};

const setAppStatus = (status: any) => {
  const config = require('../config.json');
  const newConfig = {
    ...config,
    appStatus: {
      ...config.appStatus,
      ...status,
    },
  };
  fs.writeJsonSync(path.resolve(__dirname, '../config.json'), newConfig, { spaces: '\t' });
};
