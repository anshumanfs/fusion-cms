import fs from 'fs';
import os from 'os';
import path from 'path';
import { ensureSecureConfigRuntime, getDefaultConfigRoot, getSecureConfigPath, loadSecureConfig } from '../secureConfig';

const makeTempRoot = () => fs.mkdtempSync(path.join(os.tmpdir(), 'fusion-cms-secure-config-'));

describe('secure config loader', () => {
  it('falls back to local sqlite metadata config when .secure.json is missing', () => {
    const rootDir = makeTempRoot();
    const config = loadSecureConfig(rootDir);

    expect(getSecureConfigPath(rootDir)).toBe(path.join(rootDir, '.secure.json'));
    expect(config.db.metadataDb).toEqual({
      type: 'sqlite',
      orm: 'sequelize',
      configs: {
        storage: '.temp/fusion-cms-metadata.sqlite',
      },
    });
  });

  it('loads .secure.json when the file exists', () => {
    const rootDir = makeTempRoot();
    const expectedConfig = {
      db: {
        metadataDb: {
          type: 'mongo',
          orm: 'mongoose',
          configs: {
            uri: 'mongodb://127.0.0.1:27017/fusion-cms-test',
          },
        },
      },
    };

    fs.writeFileSync(getSecureConfigPath(rootDir), JSON.stringify(expectedConfig));

    expect(loadSecureConfig(rootDir)).toEqual(expectedConfig);
  });

  it('creates the sqlite storage directory needed for first boot', () => {
    const rootDir = makeTempRoot();
    const config = loadSecureConfig(rootDir);
    const storageDir = path.join(rootDir, '.temp');

    ensureSecureConfigRuntime(config, rootDir);

    expect(fs.existsSync(storageDir)).toBe(true);
  });

  it('can use FUSION_CMS_CONFIG_ROOT as the runtime config root', () => {
    const originalConfigRoot = process.env.FUSION_CMS_CONFIG_ROOT;
    const rootDir = makeTempRoot();

    process.env.FUSION_CMS_CONFIG_ROOT = rootDir;

    expect(getDefaultConfigRoot()).toBe(rootDir);
    expect(loadSecureConfig().db.metadataDb.type).toBe('sqlite');

    if (originalConfigRoot === undefined) {
      delete process.env.FUSION_CMS_CONFIG_ROOT;
    } else {
      process.env.FUSION_CMS_CONFIG_ROOT = originalConfigRoot;
    }
  });
});
