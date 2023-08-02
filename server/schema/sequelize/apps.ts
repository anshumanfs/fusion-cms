import { DataTypes } from 'sequelize';
import { conn } from '../../db';
import sequelizeQueryServices from '../services/sequelize';
const {
  addEnums,
  unique,
  addDefaultValue,
  primaryKey,
  ObjArray,
  Optional,
  autoIncrement,
  Nullable,
  Types,
} = require('../../templates/mysql/utils/schemaHelper');
const model: any = conn.define(
  'cms_apps',
  {
    _id: autoIncrement(primaryKey(Types.NUMBER)),
    appName: Types.STRING,
    port: Types.NUMBER,
    running: Types.BOOLEAN,
    isAppCompleted: Types.BOOLEAN,
    dbType: addEnums(Types.STRING, ['mongo', 'snowflake']),
  },
  {
    tableName: 'cms_apps',
  }
);
const services = sequelizeQueryServices(model);

export { model, services };
