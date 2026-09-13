import {
  developmentSecretPrefix,
  getDevelopmentSecretKeys,
  isProductionLikeEnvironment,
  validateRuntimeSecrets,
} from '../runtimeSecrets';

const secrets = {
  bearerSecret: `${developmentSecretPrefix}bearer-secret`,
  refreshTokenSecret: `${developmentSecretPrefix}refresh-token-secret`,
  apiKeySecret: `${developmentSecretPrefix}api-key-secret`,
};

describe('runtime secret validation', () => {
  it('allows development-only secrets outside production-like environments', () => {
    expect(validateRuntimeSecrets(secrets, 'development')).toEqual({
      isValid: true,
      errors: [],
    });
  });

  it('rejects development-only secrets in production-like environments', () => {
    const result = validateRuntimeSecrets(secrets, 'production');

    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('bearerSecret');
    expect(result.errors[0]).toContain('refreshTokenSecret');
    expect(result.errors[0]).toContain('apiKeySecret');
  });

  it('detects production-like environment names', () => {
    expect(isProductionLikeEnvironment('production')).toBe(true);
    expect(isProductionLikeEnvironment('performance')).toBe(true);
    expect(isProductionLikeEnvironment('development')).toBe(false);
  });

  it('returns the keys still using development-only secrets', () => {
    expect(getDevelopmentSecretKeys(secrets)).toEqual(['bearerSecret', 'refreshTokenSecret', 'apiKeySecret']);
  });
});
