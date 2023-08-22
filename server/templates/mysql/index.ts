import { generateMiddlewareFile, rawSQLMiddlewareGenerator } from './middleware';
const fs = require('fs-extra');
const beautify = require('js-beautify').js;
const path = require('path');
const { dbModels } = require('../../db');
const { generateMySqlSchema } = require('./dbModels');
const { createIndexSchema, generateGqlSchema } = require('./graphqlSchemas');
const { createIndexResolver, generateResolver } = require('./graphqlResolvers');

const { generateDbConFile } = require('./db');
const { serverJSGenerator } = require('./server');
const { generateAppJsonFile } = require('./appJson');
const beautifyOption = require('../../libs/beautify.json').beautifyOptions;

const updateGlobalConfig = async (appName: string, running: boolean) => {
  let port;
  const appConfig = await dbModels.apps.findOne({ appName });
  if (appConfig !== null) {
    port = appConfig.port;
    await dbModels.apps.findOneAndUpdate({ _id: appConfig._id }, { running });
  } else {
    const portConfigs = await dbModels.configs.findOneAndUpdate(
      { type: 'portConfigs' },
      { $inc: { nextAvailablePort: 1 } },
      { upsert: true, new: true }
    );
    if (portConfigs === null) {
      throw Error('Could not update');
    }
    port = portConfigs.nextAvailablePort - 1;
    await dbModels.apps.create({ appName, port, running, isAppCompleted: false, dbType: 'mysql' });
    // setting isAppCompleted to false since (0 -> Incomplete)
  }
  return port; // since default port set for this will start from 3500
};

const createApp = async (fields: any, files: any) => {
  const { appName, env, credentials } = fields;
  // add to db
  await dbModels.dbCredentials.findOneAndUpdate({ appName, env }, { credentials }, { upsert: true });
  await updateGlobalConfig(appName, false); // by default apps will not be running so running = false
};

const createDbModels = async (options: DbModelsInput) => {
  const { originalCollectionName, singularCollectionName, pluralCollectionName, schema, appName } = options;
  const appDir = path.resolve(__dirname, '../../apps/' + appName);
  const appJson = appDir + '/app.json';
  const dbModelsDir = path.resolve(__dirname, '../../apps/' + appName + '/dbModels');
  const graphQlSchemaDir = path.resolve(__dirname, '../../apps/' + appName + '/graphQlSchemas');
  const resolverDir = path.resolve(__dirname, '../../apps/' + appName + '/resolvers');
  const rawSQLMiddlewareFile = path.resolve(__dirname, `../../../data/files/middleware/${appName}/rawSQL.js`);
  const middlewareFile = path.resolve(
    __dirname,
    `../../../data/files/middleware/${appName}/${pluralCollectionName}.js`
  );

  //const subDirs = ['/middleware', '/dbModels', '/certs', '/graphQlSchemas', '/resolvers', '/routes']
  const subDirs = ['/middleware', '/dbModels', '/graphQlSchemas', '/resolvers'];
  let dirPromises = subDirs.map((e) => {
    fs.ensureDirSync(appDir + e);
  });
  await Promise.allSettled(dirPromises);
  // update the schema to db
  await dbModels.dbSchemas.findOneAndUpdate(
    { appName, originalCollectionName, singularCollectionName, pluralCollectionName },
    { schema },
    { upsert: true }
  );

  // write app json file
  fs.ensureFileSync(appJson);
  fs.writeJsonSync(appJson, await generateAppJsonFile(appName), { spaces: '\t' });

  // for mongoose schema
  fs.ensureFileSync(`${dbModelsDir}/${pluralCollectionName}.js`);
  fs.writeFileSync(
    `${dbModelsDir}/${pluralCollectionName}.js`,
    beautify(generateMySqlSchema(originalCollectionName, pluralCollectionName, schema), beautifyOption)
  );

  // disabled app specific REST endpoints for time unless its required
  //generate other routes
  // fs.ensureFileSync(${appDir}/routes/${pluralCollectionName}.js)
  // fs.writeFileSync(${appDir}/routes/${pluralCollectionName}.js, beautify(routesGenerator(pluralCollectionName, singularCollectionName), beautifyOption))

  //generate index route
  // fs.ensureFileSync(${appDir}/indexRouter.js)
  // fs.writeFileSync(${appDir}/indexRouter.js, beautify(generateIndexRoute(appName), beautifyOption))

  // for graphql schema
  fs.ensureFileSync(`${graphQlSchemaDir}/${pluralCollectionName}.js`);
  fs.writeFileSync(
    `${graphQlSchemaDir}/${pluralCollectionName}.js`,
    beautify(generateGqlSchema(schema, singularCollectionName, pluralCollectionName), beautifyOption)
  );

  //create index Schema
  fs.ensureFileSync(`${appDir}/indexSchema.js`);
  fs.writeFileSync(`${appDir}/indexSchema.js`, beautify(createIndexSchema(), beautifyOption));

  //create raw sql middleware
  if (!fs.pathExistsSync(rawSQLMiddlewareFile)) {
    // if file exists don't replace that
    // Please don't replace the file if it exists
    fs.ensureFileSync(rawSQLMiddlewareFile);
    fs.writeFileSync(rawSQLMiddlewareFile, beautify(rawSQLMiddlewareGenerator()));
  }
  //create middleware files
  if (!fs.pathExistsSync(middlewareFile)) {
    // if file exists don't replace that
    // Please don't replace the file if it exists
    fs.ensureFileSync(middlewareFile);
    fs.writeFileSync(middlewareFile, beautify(generateMiddlewareFile(pluralCollectionName, singularCollectionName)));
  }
  //for graphql resolvers
  fs.ensureFileSync(`${resolverDir}/${pluralCollectionName}.js`);
  fs.writeFileSync(
    `${resolverDir}/${pluralCollectionName}.js`,
    beautify(generateResolver(appName, singularCollectionName, pluralCollectionName), beautifyOption)
  );

  //create index Resolver
  fs.ensureFileSync(`${appDir}/indexResolver.js`);
  fs.writeFileSync(`${appDir}/indexResolver.js`, beautify(createIndexResolver(appName), beautifyOption));

  // copy utils
  fs.copySync(path.resolve(__dirname, './utils'), appDir + '/utils', { overwrite: true });

  //write db.js file
  fs.writeFileSync(`${appDir}/db.js`, beautify(generateDbConFile(appName), beautifyOption));
  const { port }: { port: number } = await dbModels.apps.findOne({ appName });
  // write server.js file
  fs.writeFileSync(`${appDir}/server.js`, beautify(serverJSGenerator(3500 + port, appName), beautifyOption));

  await dbModels.apps.findOneAndUpdate({ appName }, { isAppCompleted: true }); // set app to completed status
};

export { createApp, createDbModels };
