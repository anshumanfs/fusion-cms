import fs from 'fs';
import path from 'path';

type SecureConfig = {
  db: {
    metadataDb: {
      type: string;
      orm: string;
      configs: Record<string, any>;
    };
  };
  smtp?: Record<string, any>;
  kafka?: Record<string, any>;
};

const defaultSecureConfig: SecureConfig = {
  db: {
    metadataDb: {
      type: 'sqlite',
      orm: 'sequelize',
      configs: {
        storage: '.temp/fusion-cms-metadata.sqlite',
      },
    },
  },
};

const cloneDefaultSecureConfig = () => JSON.parse(JSON.stringify(defaultSecureConfig)) as SecureConfig;

const getDefaultConfigRoot = () => process.env.FUSION_CMS_CONFIG_ROOT || process.cwd();

const getSecureConfigPath = (rootDir = getDefaultConfigRoot()) => path.resolve(rootDir, '.secure.json');

const loadSecureConfig = (rootDir = getDefaultConfigRoot()): SecureConfig => {
  const secureConfigPath = getSecureConfigPath(rootDir);

  if (!fs.existsSync(secureConfigPath)) {
    return cloneDefaultSecureConfig();
  }

  return JSON.parse(fs.readFileSync(secureConfigPath, 'utf8'));
};

const ensureSecureConfigRuntime = (config: SecureConfig, rootDir = getDefaultConfigRoot()) => {
  const metadataDb = config.db?.metadataDb;

  if (metadataDb?.type === 'sqlite' && typeof metadataDb.configs?.storage === 'string') {
    fs.mkdirSync(path.resolve(rootDir, path.dirname(metadataDb.configs.storage)), { recursive: true });
  }
};

const secureConfig = loadSecureConfig();
ensureSecureConfigRuntime(secureConfig);

export { defaultSecureConfig, ensureSecureConfigRuntime, getDefaultConfigRoot, getSecureConfigPath, loadSecureConfig };
export default secureConfig;
