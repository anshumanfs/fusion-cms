import { Request, Response, NextFunction } from 'express';
import CryptoJS from 'crypto-js';
import Config from '../../config.json';
import { dbModels } from '../../db';

const tokenLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { userName, password } = req.body;
  const user = await dbModels.users.findOne({ userName });
  if (!user) {
    res.status(401).send({ message: 'Invalid username' });
    return;
  }
  const encryptedPassword = CryptoJS.HmacSHA256(password, Config.secrets.passwordSecret);
  if (user.password !== encryptedPassword) {
    res.status(401).send({ message: 'Invalid password' });
    return;
  }
  const tokenCredentials = {
    userName,
    createdAt: new Date().toISOString(),
  };
  const token = CryptoJS.AES.encrypt(
    JSON.stringify({
      ...tokenCredentials,
      type: 'token',
    }),
    Config.secrets.bearerSecret
  ).toString();

  const refreshToken = CryptoJS.AES.encrypt(
    JSON.stringify({
      ...tokenCredentials,
      type: 'refreshToken',
    }),
    Config.secrets.refreshTokenSecret
  ).toString();

  res.send({ token, refreshToken });
};

// write a function to return refreshed Token
const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(401).send({ message: 'Refresh token not found' });
    return;
  }
  const decryptedRefreshToken = JSON.parse(
    CryptoJS.AES.decrypt(refreshToken, Config.secrets.refreshTokenSecret).toString(CryptoJS.enc.Utf8)
  );
  const refreshTokenValidityInMs = 24 * 60 * 60 * 1000; // 24 hours
  const refreshTokenCreatedAt = new Date(decryptedRefreshToken.createdAt).getTime();
  const currentTime = new Date().getTime();
  if (currentTime - refreshTokenCreatedAt > refreshTokenValidityInMs) {
    res.status(401).send({ message: 'Refresh token expired' });
    return;
  }
  const user = await dbModels.users.findOne({ userName: decryptedRefreshToken.userName });
  if (!user) {
    res.status(401).send({ message: 'Invalid refresh token' });
    return;
  }
  const token = CryptoJS.AES.encrypt(
    JSON.stringify({
      userName: decryptedRefreshToken.userName,
      createdAt: new Date().toISOString(),
    }),
    Config.secrets.bearerSecret
  ).toString();
  const newRefreshToken = CryptoJS.AES.encrypt(
    JSON.stringify({
      userName: decryptedRefreshToken.userName,
      createdAt: new Date().toISOString(),
    }),
    Config.secrets.refreshTokenSecret
  ).toString();
  res.send({ token, refreshToken: newRefreshToken });
};

const tokenBasedAuth = async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) {
    // check if body contains username and password
    if (req.body.userName && req.body.password) {
      await tokenLogin(req, res, () => {});
      return;
    }
    // check if body contains refresh token
    if (req.body.refreshToken) {
      await refreshToken(req, res, () => {});
      return;
    }
    res.status(401).send({ message: 'Token not found' });
    return;
  }

  const decryptedToken = JSON.parse(
    CryptoJS.AES.decrypt(token || '', Config.secrets.bearerSecret).toString(CryptoJS.enc.Utf8)
  );

  const tokenValidityInMs = 15 * 60 * 1000; // 15 minutes
  const tokenCreatedAt = new Date(decryptedToken.createdAt).getTime();
  const currentTime = new Date().getTime();
  if (currentTime - tokenCreatedAt > tokenValidityInMs) {
    res.status(401).send({ message: 'Token expired' });
    return;
  }

  req.body.user = decryptedToken.user;
};

const apiKeyBasedAuth = async (req: Request, res: Response) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    res.status(401).send({ message: 'API key not found' });
    return;
  }
  const encryptedApiKey = CryptoJS.HmacSHA256(apiKey?.toString() || '', Config.secrets.apiKeySecret);
  const user = await dbModels.users.findOne({ apiKey: encryptedApiKey });
  if (!user) {
    res.status(401).send({ message: 'Invalid API key' });
    return;
  }
  req.body.user = user;
};

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization || (req.body.userName && req.body.password)) {
    await tokenBasedAuth(req, res);
  } else if (req.headers['x-api-key']) {
    await apiKeyBasedAuth(req, res);
  } else {
    res.status(401).send({ message: 'API key or token not found' });
    return;
  }
  next();
};

export { apiKeyBasedAuth, authMiddleware, tokenBasedAuth };
