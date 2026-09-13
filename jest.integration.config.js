/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/.build', '<rootDir>/.next'],
  testMatch: ['<rootDir>/server/__test__/database/**/*.test.ts'],
  testTimeout: 120000,
};
