import { toJSON } from '../../libs/customLibs';
import { conn } from '../../db';
import sequelizeQueryServices from '../services/sequelize';
const {
  addEnums,
  addGetter,
  index,
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
  'cms_access_schemas',
  {
    _id: autoIncrement(primaryKey(Types.INTEGER())),
    email: index(Types.STRING()),
    appName: index(Types.STRING()),
    endPointName: index(Types.STRING()),
    isAllowed: addDefaultValue(Types.STRING(), 'false'),
    allowedInChain: addDefaultValue(Types.BOOLEAN(), false), // to check if previous resolver has allowed the access
  },
  {
    tableName: 'cms_access_schemas',
    timestamps: true,
    alter: true,
  }
);
const services = sequelizeQueryServices(model);

export { model, services };
