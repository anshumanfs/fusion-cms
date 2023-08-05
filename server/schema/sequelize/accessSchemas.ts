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
  'cms_accessSchemas',
  {
    _id: autoIncrement(primaryKey(Types.INTEGER())),
    userName: Types.STRING(),
    appName: Types.STRING(),
    canCreate: Types.JSON(),
    canRead: Types.JSON(),
    canUpdate: Types.JSON(),
    canDelete: Types.JSON(),
  },
  {
    tableName: 'cms_accessSchemas',
    timestamps: true,
  }
);
const services = sequelizeQueryServices(model);

export { model, services };
