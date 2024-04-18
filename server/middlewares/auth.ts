import Config from '../config.json';
import Errors from '../libs/errors';
import { Request, Response, NextFunction } from 'express';
import { dbModels } from '../db';
import { oneWayEncoder, twoWayDecoder, twoWayEncoder } from '../libs/encoderDecoder';

// operations for which the auth middleware should be excluded
// this is a very specific operation for security purposes
const excludedOperations = [
  'Login',
  'RegisterUser',
  'ForgotPassword',
  'RequestPasswordChangeEmail',
  'ActivateAccount',
  'IntrospectionQuery',
];

const tokenBasedAuth = async (req: Request) => {
  const token = req.headers.authorization;
  const bearerToken = token?.split(' ')[1];
  if (!bearerToken) {
    throw Errors.UNAUTHORIZED('Token not found');
  }
  const decodedToken = twoWayDecoder(bearerToken, Config.secrets.bearerSecret);
  if (!decodedToken) {
    throw Errors.UNAUTHORIZED('Invalid token');
  }
  const tokenCredentials = JSON.parse(decodedToken);
  if (!tokenCredentials.email || !tokenCredentials.createdAt) {
    throw Errors.UNAUTHORIZED('Invalid token');
  }
  const user = await dbModels.users.findOne({ email: tokenCredentials.email }, { password: 0 });
  if (!user || !user.isBlocked || !user.isVerified) {
    throw Errors.UNAUTHORIZED('User is either not verified or blocked by the admin');
  }
  req.body.user = user || {};
};

const apiKeyBasedAuth = async (req: Request) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    throw Errors.UNAUTHORIZED('API key not found');
  }
  const encryptedApiKey = CryptoJS.HmacSHA256(apiKey?.toString() || '', Config.secrets.apiKeySecret);
  const user = await dbModels.users.findOne({ apiKey: encryptedApiKey }, { password: 0 });
  if (!user) {
    throw Errors.UNAUTHORIZED('Invalid API key');
  }
  req.body.user = user || {};
};

const authMiddleware = async (req: Request) => {
  const operationName = req.body.operationName;
  const path = req.baseUrl;
  // this is a very strict implementation which needs to be exact or else it will fail
  if (path === '/appManager' && excludedOperations.includes(operationName)) {
    return { req };
  }

  if (req.headers.authorization) {
    await tokenBasedAuth(req);
  } else if (req.headers['x-api-key']) {
    await apiKeyBasedAuth(req);
  } else {
    throw Errors.UNAUTHORIZED('API key or token not found');
  }
  return { req };
};

export { apiKeyBasedAuth, authMiddleware, tokenBasedAuth };
