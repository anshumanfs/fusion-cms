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
  'cms_users',
  {
    _id: autoIncrement(primaryKey(Types.INTEGER())),
    userName: Types.STRING(),
    email: Types.EMAIL(),
    password: Types.STRING(),
    apiKey: Types.STRING(),
  },
  {
    tableName: 'cms_users',
    timestamps: true,
  }
);
const services = sequelizeQueryServices(model);

export { model, services };
