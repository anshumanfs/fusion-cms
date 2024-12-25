import { toJSON } from '../../libs/customLibs';
import { conn } from '../../db';
import sequelizeQueryServices from '../services/sequelize';

const {
  addEnums,
  index,
  unique,
  addDefaultValue,
  addGetter,
  primaryKey,
  references,
  ObjArray,
  Optional,
  autoIncrement,
  Nullable,
  Types,
} = require('../../templates/mysql/utils/schemaHelper');

const appsSchema = require('./apps');

const model: any = conn.define(
  'cms_db_schemas',
  {
    _id: autoIncrement(primaryKey(Types.INTEGER())),
    appName: index(references(Types.STRING(), { model: appsSchema.model, key: 'appName' })),
    singularCollectionName: index(Types.STRING()),
    originalCollectionName: index(Types.STRING()),
    pluralCollectionName: Types.STRING(),
    schema: addGetter(Types.JSON(), 'schema', toJSON),
  },
  {
    tableName: 'cms_db_schemas',
    timestamps: true,
  }
);

model.belongsTo(appsSchema.model, { foreignKey: 'appName' });
appsSchema.model.hasMany(model, { foreignKey: 'appName' });

const services = sequelizeQueryServices(model);

export { model, services };
