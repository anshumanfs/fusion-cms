/* eslint-disable react-hooks/rules-of-hooks */
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { useSofa } from 'sofa-api';
import { makeExecutableSchema } from '@graphql-tools/schema';
import path from 'path';
import logger from './libs/logger';
import { conn, dbModels } from './db';
import pm2 from 'pm2';
import { buildAppsFromDB } from './controllers/manageApp';
import { json } from 'body-parser';
import cors from 'cors';
import { customFileParser } from './libs/customFileParser';
import Application from './controllers/appStatus';
import cmsConfig from './config.json';
import fs from 'fs-extra';
import { authMiddleware } from './middlewares/auth';

const work_env = 'NODE_ENV' in process.env ? process.env.NODE_ENV.trim() : 'development';
const ROOT = 'ROOT' in process.env ? process?.env?.ROOT?.trim() : '';
const checkEnv = ['production', 'performance'];

const getSofa = ({ Schema, Resolver, appName }: { Schema: any; Resolver: any; appName: string }) => {
  return useSofa({
    schema: makeExecutableSchema({
      resolvers: Resolver,
      typeDefs: Schema,
    }),
    basePath: `/rest/${appName}`,
    openAPI: {
      info: {
        title: `${appName} APIs`,
        version: '3.0.0',
      },
      endpoint: '/openapi.json',
    },
    swaggerUI: {
      path: `/docs`,
    },
  });
};

const startApolloServer = async ({ app, dev, subfolder }: { app: any; dev: boolean; subfolder: string }) => {
  const Resolver = require(`./apps/${subfolder}/indexResolver`);
  const Schema = require(`./apps/${subfolder}/indexSchema`);
  const apollo = new ApolloServer({
    introspection: !checkEnv.includes(work_env),
    resolvers: Resolver,
    typeDefs: Schema,
  });
  await apollo.start();
  app.use(
    `/graphql/${subfolder}`,
    cors(),
    json(),
    expressMiddleware(apollo, {
      context: async ({ req }: any) => {
        return await authMiddleware(req);
      },
    })
  );
  app.use(`/rest/${subfolder}`, getSofa({ Schema, Resolver, appName: subfolder }));
  logger.info(`✓ ${subfolder} :- GraphQL running on /graphql/${subfolder}`);
  logger.info(`✓ ${subfolder} :- Swagger docs on /rest/${subfolder}/docs`);
  return true;
};

const appManagerApolloServer = async ({ app }: { app: any }) => {
  const Resolver = require('./graphQL/resolvers/index');
  const Schema = require('./graphQl/schemas/index');
  const apollo = new ApolloServer({
    resolvers: Resolver,
    typeDefs: Schema,
  });
  await apollo.start();
  app.use(
    `/appManager`,
    cors(),
    json(),
    customFileParser,
    expressMiddleware(apollo, {
      context: async ({ req }: any) => {
        return await authMiddleware(req);
      },
    })
  );
  app.use(`/rest/appManager`, getSofa({ Schema, Resolver, appName: 'appManager' }));
  logger.info(`✓ appManager :- GraphQL running on /appManager`);
  return true;
};

const runAppWithPM2 = ({ appName, script }: { appName: string; script: string }) => {
  return new Promise((resolve, reject) => {
    pm2.connect(function (err: any) {
      if (err) {
        reject(err);
        console.error(err);
        process.exit(2);
      } else {
        pm2.list((err: any, list: any) => {
          if (err) {
            reject(err);
          }
          const listRunningApps = list.map((e: any) => e.name);
          if (listRunningApps.includes(appName)) {
            pm2.restart(appName, (err: any, _apps: any) => {
              if (err) {
                reject(err);
              } else {
                logger.info(`✓ Restarted ${appName} on microservices mode`);
                resolve(true);
              }
            });
          } else {
            pm2.start({ script: script, name: appName }, (err: any, _apps: any) => {
              if (err) {
                reject(err);
              }
              logger.info(`✓ Started ${appName} on microservices mode`);
              resolve(true);
            });
          }
        });
      }
    });
  });
};

const runAsMicroService = async () => {
  const appStatus = new Application();
  appStatus.checkAppStaus();
  if (!appStatus.isMetadataDbConfigured) {
    logger.error(`✗ DataBase not configured for metadata`);
    process.exit(1);
  }
  if (!appStatus.isSecretsConfigured) {
    logger.error(`✗ Secrets not configured`);
    process.exit(1);
  }

  return new Promise<void>(async (resolve, reject) => {
    const microservicesFunctions = async () => {
      if (work_env === 'development') {
        await buildAppsFromDB();
      }
      const promiseArr: any = [];
      const apps: any = await dbModels.apps.find({});
      apps.forEach((e: any) => {
        const { appName, running } = e;
        const script = path.resolve(__dirname, `./apps/${appName}/server.js`);
        if (running) {
          promiseArr.push(runAppWithPM2({ appName, script }));
        }
      });
      await Promise.allSettled(promiseArr);
      pm2.disconnect();
    };

    if (cmsConfig.metadataDb.orm === 'mongoose') {
      conn.on('connected', async () => {
        const checkIfAdminRegistered = await appStatus.checkIfAdminRegistered();
        if (!checkIfAdminRegistered) {
          logger.error(`✗ Admin user not registered. Register admin at ${ROOT}/auth/`);
        } else {
          await microservicesFunctions();
        }
        writeAppJson();
        resolve();
      });
      conn.on('disconnected', async () => {
        reject(`✗ Metadata DB could not be connected`);
      });
    }

    if (cmsConfig.metadataDb.orm === 'sequelize') {
      try {
        await conn.sync();
        writeAppJson();
        const checkIfAdminRegistered = await appStatus.checkIfAdminRegistered();
        if (!checkIfAdminRegistered) {
          await microservicesFunctions();
          logger.error(`✗ Admin user not registered. Register admin at ${ROOT}/auth`);
        } else {
          await microservicesFunctions();
        }
        resolve();
      } catch (error) {
        reject(`✗ Metadata DB could not be connected due to : ${error}`);
      }
    }
  });
};

const writeAppJson = async () => {
  try {
    const tempJsonPath = path.resolve(__dirname, '../../data/.temp.json');
    const env = work_env;
    const [apps, dbSchemas, dbCredentials] = await Promise.all([
      await dbModels.apps.find({}),
      await dbModels.dbSchemas.find({}),
      await dbModels.dbCredentials.find({ env }),
    ]);
    fs.writeJSONSync(tempJsonPath, { apps, dbSchemas, dbCredentials }, { spaces: '\t' });
  } catch (error) {
    logger.error(`${error}`);
  }
  return true;
};

const runAsMonolith = async ({ app, dev }: { app: any; dev: boolean }) => {
  const appStatus = new Application();
  appStatus.checkAppStaus();
  if (!appStatus.isMetadataDbConfigured) {
    logger.error(`✗ DataBase not configured for metadata`);
    process.exit(1);
  }
  if (!appStatus.isSecretsConfigured) {
    logger.error(`✗ Secrets not configured`);
    process.exit(1);
  }

  return new Promise<void>(async (resolve, reject) => {
    const monolithFunctions = async () => {
      if (work_env === 'development') {
        await buildAppsFromDB();
      }
      const promiseArr: any = [];
      const apps = await dbModels.apps.find({});
      if (work_env === 'development') {
        promiseArr.push(appManagerApolloServer({ app }));
      }
      //start GraphQL and add REST routes
      apps.forEach((e: any) => {
        if (e.running) {
          promiseArr.push(startApolloServer({ app, dev, subfolder: e.appName }));
          //importedModules.push(require(./apps/${e.appName}/indexRouter)) // disabled app specific REST endpoints
        }
      });

      await Promise.all(promiseArr);
    };
    if (cmsConfig.metadataDb.orm === 'mongoose') {
      conn.on('connected', async () => {
        const checkIfAdminRegistered = await appStatus.checkIfAdminRegistered();
        if (!checkIfAdminRegistered) {
          logger.error(`✗ Admin user not registered. Register admin at ${ROOT}/auth/`);
        } else {
          await monolithFunctions();
        }
        writeAppJson();
        resolve();
      });
      conn.on('disconnected', async () => {
        reject(`✗ Metadata DB could not be connected`);
      });
    }

    if (cmsConfig.metadataDb.orm === 'sequelize') {
      try {
        await conn.sync();
        writeAppJson();
        const checkIfAdminRegistered = await appStatus.checkIfAdminRegistered();
        if (!checkIfAdminRegistered) {
          await monolithFunctions();
          logger.error(`✗ Admin user not registered. Register admin at ${ROOT}/auth`);
        } else {
          await monolithFunctions();
        }
        resolve();
      } catch (error) {
        reject(`✗ Metadata DB could not be connected due to : ${error}`);
      }
    }
  });
};

export { runAsMicroService, runAsMonolith };
