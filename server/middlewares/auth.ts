import Config from '../../config.json';
import Errors from '../libs/errors';
import lodash from 'lodash';
import { Request, Response, NextFunction } from 'express';
import { dbModels } from '../db';
import { oneWayEncoder, twoWayDecoder, twoWayEncoder } from '../libs/encoderDecoder';
import { parse } from 'graphql';

const getTopLevelFields = (query: string) => {
  const ast = parse(query);
  // Get the first operation definition
  const operationDefinition = ast.definitions[0];
  // Check if it's a valid query
  if (operationDefinition.kind !== 'OperationDefinition') {
    throw Errors.BAD_REQUEST('Invalid GraphQL query');
  }

  // Extract field names from selection set
  const fields = operationDefinition.selectionSet.selections.map((field: any) => field.name.value);

  return fields;
};

// operations for which the auth middleware should be excluded
// this is a very specific operation for security purposes
const excludedEndpoints = [
  'login',
  'registerUser',
  'forgotPassword',
  'requestPasswordChangeEmail',
  'activateAccount',
  'requestNewToken',
  '__schema',
];

const endpointsAllowedForPublicAfterLogin = ['getOwnDetails', 'modifyOwnDetails', 'changePasswordByOldPass'];

const tokenBasedAuth = async (req: Request, requestedFields: any) => {
  const isEndpointAllowedForPublicAfterLogin = lodash.every(requestedFields, (element) =>
    lodash.includes(endpointsAllowedForPublicAfterLogin, element)
  );
  const path = req.baseUrl;
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
  const tokenCreatedAt = new Date(tokenCredentials.createdAt);
  const currentTime = new Date();
  const timeDifference = (currentTime.getTime() - tokenCreatedAt.getTime()) / (1000 * 60);
  if (timeDifference > Config.envConfigurations.tokenExpiration) {
    throw Errors.UNAUTHORIZED('Token expired');
  }
  const user = await dbModels.users.findOne({ email: tokenCredentials.email }, { password: 0 });
  if (!user || user.isBlocked || !user.isVerified) {
    throw Errors.UNAUTHORIZED('User is either not verified or blocked by the admin');
  }
  if (path === '/appManager' && user.role !== 'admin' && !isEndpointAllowedForPublicAfterLogin) {
    throw Errors.UNAUTHORIZED('Unauthorized access');
  }
  const metadata = (await dbModels.metadata.find({ referenceId: user._id })) || [];
  const parsedMetadata = metadata.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
  user.metadata = parsedMetadata;
  req.body.user = user || {};
};

const apiKeyBasedAuth = async (req: Request, requestedFields: any) => {
  const isEndpointAllowedForPublicAfterLogin = lodash.every(requestedFields, (element) =>
    lodash.includes(endpointsAllowedForPublicAfterLogin, element)
  );
  const apiKey = req.headers['x-api-key'];
  const path = req.baseUrl;
  if (!apiKey) {
    throw Errors.UNAUTHORIZED('API key not found');
  }
  const encryptedApiKey = CryptoJS.HmacSHA256(apiKey?.toString() || '', Config.secrets.apiKeySecret);
  const user = await dbModels.users.findOne({ apiKey: encryptedApiKey }, { password: 0 });
  if (!user) {
    throw Errors.UNAUTHORIZED('Invalid API key');
  }
  if (path === '/appManager' && user.role !== 'admin' && !isEndpointAllowedForPublicAfterLogin) {
    throw Errors.UNAUTHORIZED('Unauthorized access');
  }
  const metadata = (await dbModels.metadata.find({ referenceId: user._id })) || [];
  const parsedMetadata = metadata.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
  user.metadata = parsedMetadata;
  req.body.user = user || {};
};

const authMiddleware = async (req: Request) => {
  const requestedFields = getTopLevelFields(req.body.query);
  const path = req.baseUrl;
  const isSubset = lodash.every(requestedFields, (element) => lodash.includes(excludedEndpoints, element));
  // this is a very strict implementation which needs to be exact or else it will fail
  if (path === '/appManager' && isSubset) {
    return { req };
  }

  if (req.headers.authorization) {
    await tokenBasedAuth(req, requestedFields);
  } else if (req.headers['x-api-key']) {
    await apiKeyBasedAuth(req, requestedFields);
  } else {
    throw Errors.UNAUTHORIZED('API key or token not found');
  }
  return { req };
};

export { apiKeyBasedAuth, authMiddleware, tokenBasedAuth };
