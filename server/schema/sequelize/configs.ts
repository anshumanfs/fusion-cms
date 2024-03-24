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
  'cms_configs',
  {
    _id: autoIncrement(primaryKey(Types.INTEGER())),
    type: Types.STRING(),
    nextAvailablePort: addDefaultValue(Optional(Types.INTEGER()), 0),
  },
  {
    tableName: 'cms_configs',
    timestamps: true,
  }
);
const services = sequelizeQueryServices(model);

export { model, services };
