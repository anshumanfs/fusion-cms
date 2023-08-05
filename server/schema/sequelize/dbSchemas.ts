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
  'cms_dbSchemas',
  {
    _id: autoIncrement(primaryKey(Types.INTEGER())),
    appName: Types.STRING(),
    singularCollectionName: Types.STRING(),
    originalCollectionName: Types.STRING(),
    pluralCollectionName: Types.STRING(),
    schema: Types.JSON(),
  },
  {
    tableName: 'cms_dbSchemas',
    timestamps: true,
  }
);
const services = sequelizeQueryServices(model);

export { model, services };
