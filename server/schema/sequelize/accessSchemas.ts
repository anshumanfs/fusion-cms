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
    canCreate: addGetter(Types.JSON(), 'schema', toJSON),
    canRead: addGetter(Types.JSON(), 'schema', toJSON),
    canUpdate: addGetter(Types.JSON(), 'schema', toJSON),
    canDelete: addGetter(Types.JSON(), 'schema', toJSON),
  },
  {
    tableName: 'cms_accessSchemas',
    timestamps: true,
  }
);
const services = sequelizeQueryServices(model);

export { model, services };
