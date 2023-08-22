import { generateMiddleware } from './middleware';
const fs = require('fs-extra');
const beautify = require('js-beautify').js;
const path = require('path');
const { dbModels } = require('../../db');
const { generateModelFileContent } = require('./dbModels');
const { createIndexSchema, generateGraphqlSchema } = require('./graphqlSchemas');
const { generateIndexResolver, generateResolver } = require('./graphqlResolvers');
const { generateDbFile } = require('./db');
const { serverJSGenerator } = require('./server');
const { generateAppJsonFile } = require('./appJson');
const beautifyOption = require('../../libs/beautify.json').beautifyOptions;
const DEFAULT_INDIVIDUAL_PORT = 3500;

const createApp = async (fields: any, files: any) => {
  const { appName, env, credentials } = fields;
  // add to db
  await dbModels.dbCredentials.findOneAndUpdate({ appName, env }, { credentials }, { upsert: true });
  await updateGlobalConfig(appName, false); // by default apps will not be running so running = false
};

const updateGlobalConfig = async (appName: string, running: boolean) => {
  let port;
  const appConfig = await dbModels.apps.findOne({ appName });
  if (appConfig !== null) {
    port = appConfig.port;
    await dbModels.apps.findOneAndUpdate({ _id: appConfig._id }, { $set: { running } });
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
    await dbModels.apps.create({ appName, port, running, isAppCompleted: false, dbType: 'mongo' });
    // setting isAppCompleted to false since (0 -> Incomplete)
  }
  return port;
};

const createDbModels = async (options: DbModelsInput) => {
  const { originalCollectionName, singularCollectionName, pluralCollectionName, schema, appName } = options;
  const appDir = path.resolve(__dirname, '../../apps/' + appName);
  const appJson = appDir + '/app.json';
  const dbModelsDir = path.resolve(__dirname, '../../apps/' + appName + '/dbModels');
  const graphQlSchemaDir = path.resolve(__dirname, '../../apps/' + appName + '/graphQlSchemas');
  const resolverDir = path.resolve(__dirname, '../../apps/' + appName + '/graphqlResolvers');
  const middlewareFile = path.resolve(
    __dirname,
    `../../../data/files/middleware/${appName}/${pluralCollectionName}.js`
  );

  const subDirs = ['/middleware', '/dbModels', '/graphQlSchemas', '/graphqlResolvers'];
  let dirPromises = subDirs.map((e) => {
    fs.ensureDirSync(appDir + e);
  });
  await Promise.allSettled(dirPromises);

  // write app json file
  fs.ensureFileSync(appJson);
  fs.writeJsonSync(appJson, await generateAppJsonFile(appName), { spaces: '\t' });

  // update the schema to db
  await dbModels.dbSchemas.findOneAndUpdate(
    { appName, originalCollectionName, singularCollectionName, pluralCollectionName },
    { schema },
    { upsert: true }
  );

  // for mongoose schema
  fs.ensureFileSync(`${dbModelsDir}/${pluralCollectionName}.js`);
  fs.writeFileSync(
    `${dbModelsDir}/${pluralCollectionName}.js`,
    beautify(generateModelFileContent(originalCollectionName, pluralCollectionName, schema), beautifyOption)
  );

  // for graphql schema
  fs.ensureFileSync(`${graphQlSchemaDir}/${pluralCollectionName}.js`);
  fs.writeFileSync(
    `${graphQlSchemaDir}/${pluralCollectionName}.js`,
    beautify(generateGraphqlSchema(schema, singularCollectionName, pluralCollectionName, appName), beautifyOption)
  );

  //create index Schema
  fs.ensureFileSync(`${appDir}/indexSchema.js`);
  fs.writeFileSync(`${appDir}/indexSchema.js`, beautify(createIndexSchema(), beautifyOption));

  //create middleware files
  if (!fs.pathExistsSync(middlewareFile)) {
    // if file exists don't replace that
    // Please don't replace the file if it exists
    fs.ensureFileSync(middlewareFile);
    fs.writeFileSync(middlewareFile, beautify(generateMiddleware(pluralCollectionName, singularCollectionName)));
  }

  //for graphql resolvers
  fs.ensureFileSync(`${resolverDir}/${pluralCollectionName}.js`);
  fs.writeFileSync(
    `${resolverDir}/${pluralCollectionName}.js`,
    beautify(
      generateResolver(appName, originalCollectionName, singularCollectionName, pluralCollectionName),
      beautifyOption
    )
  );

  //create index Resolver
  fs.ensureFileSync(`${appDir}/indexResolver.js`);
  fs.writeFileSync(`${appDir}/indexResolver.js`, beautify(generateIndexResolver(), beautifyOption));

  // copy utils
  fs.copySync(path.resolve(__dirname, './utils'), appDir + '/utils', { overwrite: true });

  //write db.js file
  fs.writeFileSync(`${appDir}/db.js`, beautify(generateDbFile(appName), beautifyOption));
  const { port }: { port: number } = await dbModels.apps.findOne({ appName });
  // write server.js file
  fs.writeFileSync(
    `${appDir}/server.js`,
    beautify(serverJSGenerator(DEFAULT_INDIVIDUAL_PORT + port, appName), beautifyOption)
  );

  await dbModels.apps.findOneAndUpdate({ appName }, { isAppCompleted: true }); // set app to completed status
};

export { createApp, createDbModels };
