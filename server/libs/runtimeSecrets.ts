type RuntimeSecrets = Record<string, string>;

const productionLikeEnvironments = ['production', 'performance'];
const developmentSecretPrefix = 'dev-only-change-me-';

const isProductionLikeEnvironment = (nodeEnv: string = process.env.NODE_ENV || 'development') =>
  productionLikeEnvironments.includes(nodeEnv.trim().toLowerCase());

const getDevelopmentSecretKeys = (secrets: RuntimeSecrets) =>
  Object.entries(secrets)
    .filter(([, value]) => value.startsWith(developmentSecretPrefix))
    .map(([key]) => key);

const validateRuntimeSecrets = (secrets: RuntimeSecrets, nodeEnv: string = process.env.NODE_ENV || 'development') => {
  const developmentSecretKeys = getDevelopmentSecretKeys(secrets);

  if (isProductionLikeEnvironment(nodeEnv) && developmentSecretKeys.length > 0) {
    return {
      isValid: false,
      errors: [`Development-only secrets cannot be used in ${nodeEnv}. Replace: ${developmentSecretKeys.join(', ')}`],
    };
  }

  return {
    isValid: true,
    errors: [],
  };
};

export { developmentSecretPrefix, getDevelopmentSecretKeys, isProductionLikeEnvironment, validateRuntimeSecrets };
