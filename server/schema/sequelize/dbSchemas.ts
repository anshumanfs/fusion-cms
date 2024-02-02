import { toJSON } from '../../libs/customLibs';
import { conn } from '../../db';
import sequelizeQueryServices from '../services/sequelize';
const {
  addEnums,
  unique,
  addDefaultValue,
  addGetter,
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
    schema: addGetter(Types.JSON(), 'schema', toJSON),
  },
  {
    tableName: 'cms_dbSchemas',
    timestamps: true,
    alter: true,
  }
);
const services = sequelizeQueryServices(model);

export { model, services };
