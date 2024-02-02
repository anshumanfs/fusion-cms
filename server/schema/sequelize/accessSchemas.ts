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
    userName: Types.STRING(),
    appName: Types.STRING(),
    canCreate: addGetter(Types.JSON(), 'canCreate', toJSON),
    canRead: addGetter(Types.JSON(), 'canRead', toJSON),
    canUpdate: addGetter(Types.JSON(), 'canUpdate', toJSON),
    canDelete: addGetter(Types.JSON(), 'canDelete', toJSON),
  },
  {
    tableName: 'cms_accessSchemas',
    timestamps: true,
    alter: true,
  }
);
const services = sequelizeQueryServices(model);

export { model, services };
