import mongoose from 'mongoose';
import configs from './config.json';

const connectorLocations = {
    mongo: './connectors/mongo.ts',
    mysql: './connectors/mysql.ts',
    postgres: './connectors/postgres.ts',
    sqlite: './connectors/sqlite.ts',
};

const orms = {
    mongo: 'mongoose',
    mysql: 'sequelize',
    postgres: 'sequelize',
    sqlite: 'sequelize',
};

let conn: any;

const dbType = configs.metadataDb.type || 'sqlite';
const connector = require(connectorLocations[dbType as keyof typeof connectorLocations]);
conn = connector(configs.metadataDb.configs);
const ormType = orms[dbType as keyof typeof connectorLocations];

require(`./schema/${ormType}/users`);
require(`./schema/${ormType}/dbSchemas`);
require(`./schema/${ormType}/apps`);
require(`./schema/${ormType}/configs`);
require(`./schema/${ormType}/dbCreds`);
require(`./schema/${ormType}/accessSchemas`);

export { conn };
