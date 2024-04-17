import Config from '../config.json';
import Errors from '../libs/errors';
import { Request, Response, NextFunction } from 'express';
import { dbModels } from '../db';
import { oneWayEncoder, twoWayDecoder, twoWayEncoder } from '../libs/encoderDecoder';

// operations for which the auth middleware should be excluded
const excludedOperations = ['login', 'register', 'forgotPassword', 'resetPassword', 'verifyEmail'];

const tokenBasedAuth = async (req: Request, res: Response) => {
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
  return user;
};

const apiKeyBasedAuth = async (req: Request, res: Response) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    throw Errors.UNAUTHORIZED('API key not found');
  }
  const encryptedApiKey = CryptoJS.HmacSHA256(apiKey?.toString() || '', Config.secrets.apiKeySecret);
  const user = await dbModels.users.findOne({ apiKey: encryptedApiKey }, { password: 0 });
  if (!user) {
    throw Errors.UNAUTHORIZED('Invalid API key');
  }
  return user;
};

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    await tokenBasedAuth(req, res);
  } else if (req.headers['x-api-key']) {
    await apiKeyBasedAuth(req, res);
  } else {
    throw Errors.UNAUTHORIZED('API key or token not found');
  }
};

export { apiKeyBasedAuth, authMiddleware, tokenBasedAuth };
