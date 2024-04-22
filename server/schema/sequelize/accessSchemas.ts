import { toJSON } from '../../libs/customLibs';
import { conn } from '../../db';
import sequelizeQueryServices from '../services/sequelize';
const {
  addEnums,
  addGetter,
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
    email: Types.STRING(),
    appName: Types.STRING(),
    endPointName: Types.STRING(),
    isAllowed: addDefaultValue(Types.STRING(), 'false'),
    allowedInChain: addDefaultValue(Types.BOOLEAN(), false), // to check if previous resolver has allowed the access
  },
  {
    tableName: 'cms_accessSchemas',
    timestamps: true,
    alter: true,
  }
);
const services = sequelizeQueryServices(model);

export { model, services };
