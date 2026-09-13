/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/.build', '<rootDir>/.next'],
  testPathIgnorePatterns: ['<rootDir>/.build', '<rootDir>/.next', '<rootDir>/server/__test__/database'],
};
