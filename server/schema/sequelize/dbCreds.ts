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
  'cms_dbCreds',
  {
    _id: autoIncrement(primaryKey(Types.NUMBER)),
    type: Types.STRING,
    nextAvailablePort: Optional(Types.NUMBER),
  },
  {
    tableName: 'cms_dbCreds',
  }
);
const services = sequelizeQueryServices(model);

export { model, services };
