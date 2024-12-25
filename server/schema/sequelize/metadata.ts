import { conn } from '../../db';
import sequelizeQueryServices from '../services/sequelize';
const { primaryKey, autoIncrement, Types, index } = require('../../templates/mysql/utils/schemaHelper');

const model: any = conn.define(
  'cms_table_metas',
  {
    _id: autoIncrement(primaryKey(Types.INTEGER())),
    tableName: index(Types.STRING()),
    key: index(Types.STRING()),
    value: index(Types.STRING()),
  },
  {
    tableName: 'cms_table_metas',
    timestamps: true,
  }
);
const services = sequelizeQueryServices(model);

export { model, services };
