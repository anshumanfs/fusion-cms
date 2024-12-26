import cmsConfigs from './config.json';

const connectorLocations = {
  mongo: './connectors/mongo',
  mysql: './connectors/mysql',
  postgres: './connectors/postgres',
  sqlite: './connectors/sqlite',
  mariadb: './connectors/mysql',
  mssql: './connectors/mssql',
  oracle: './connectors/oracle',
  db2: './connectors/db2',
};

const orms = {
  mongo: 'mongoose',
  mysql: 'sequelize',
  postgres: 'sequelize',
  sqlite: 'sequelize',
  mariadb: 'sequelize',
  mssql: 'sequelize',
  oracle: 'sequelize',
  db2: 'sequelize',
};

let conn: any;

const dbType = cmsConfigs.metadataDb.type || 'sqlite';
const { connector } = require(connectorLocations[dbType as keyof typeof connectorLocations]);
conn = connector('metadata', cmsConfigs.metadataDb.configs);
const ormType = orms[dbType as keyof typeof connectorLocations];

const users = require(`./schema/${ormType}/users`).services;
const metadata = require(`./schema/${ormType}/metadata`).services;
const dbSchemas = require(`./schema/${ormType}/dbSchemas`).services;
const apps = require(`./schema/${ormType}/apps`).services;
const configs = require(`./schema/${ormType}/configs`).services;
const dbCredentials = require(`./schema/${ormType}/dbCredentials`).services;
const accessSchema = require(`./schema/${ormType}/accessSchemas`).services;

const dbModels = {
  users,
  metadata,
  dbSchemas,
  apps,
  configs,
  dbCredentials,
  accessSchema,
};

export { conn, dbModels, connectorLocations };
