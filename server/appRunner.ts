import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import { conn, dbModels } from './db';
import pm2 from 'pm2';
import { buildAppsFromDB } from './controllers/manageApp';
import { json } from 'body-parser';
import cors from 'cors';
import { customFileParser } from './libs/customFileParser';
import cmsConfig from './config.json';

const work_env = 'NODE_ENV' in process.env ? process.env.NODE_ENV.trim() : 'development';
const checkEnv = ['production', 'performance'];

const startApolloServer = async ({ app, dev, subfolder }: { app: any; dev: boolean; subfolder: string }) => {
  const Resolver = require(`./apps/${subfolder}/indexResolver`);
  const Schema = require(`./apps/${subfolder}/indexSchema`);
  const apollo = new ApolloServer({
    introspection: !checkEnv.includes(work_env),
    resolvers: Resolver,
    typeDefs: Schema,
  });
  await apollo.start();
  app.use(`/graphql/${subfolder}`, cors(), json(), expressMiddleware(apollo));
  console.log(`✔ ${subfolder} :- GraphQL running on /graphql/${subfolder}`);
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
        return { req };
      },
    })
  );
  console.log(`✔ appManager :- GraphQL running on /appManager`);
  return true;
};

const createGraphQlFederation = async (app: any) => {
  const Schemas = require('./federatedEP/schema');
  const Resolvers = require('./federatedEP/resolvers');
  const apollo = new ApolloServer({
    introspection: !checkEnv.includes(work_env),
    resolvers: Resolvers,
    typeDefs: Schemas,
  });
  await apollo.start();
  app.use(`/graphql`, cors(), json(), expressMiddleware(apollo));
  console.log(`✔ Federated GraphQL running on /graphql`);
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
                console.log(`🔁 Restarted ${appName} on microservices mode`);
                resolve(true);
              }
            });
          } else {
            pm2.start({ script: script, name: appName }, (err: any, _apps: any) => {
              if (err) {
                reject(err);
              }
              console.log(`☑ Started ${appName} on microservices mode`);
              resolve(true);
            });
          }
        });
      }
    });
  });
};

const runAsMicroService = async () => {
  conn.on('connected', async () => {
    if (work_env === 'local') {
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
  });
};

const runAsMonolith = async ({ app, dev }: { app: any; dev: boolean }) => {
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
        await monolithFunctions();
        resolve();
      });
    }

    if (cmsConfig.metadataDb.orm === 'sequelize') {
      await conn.sync();
      await monolithFunctions();
      resolve();
    }
  });
};

export { runAsMicroService, runAsMonolith };
