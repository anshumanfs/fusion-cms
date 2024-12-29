import { conn } from '../../db';
import sequelizeQueryServices from '../services/sequelize';
const {
  addEnums,
  addDefaultValue,
  primaryKey,
  autoIncrement,
  Types,
  index,
  Optional,
} = require('../../templates/mysql/utils/schemaHelper');

const model: any = conn.define(
  'cms_auth_codes',
  {
    _id: autoIncrement(primaryKey(Types.INTEGER())),
    email: index(Types.EMAIL()),
    phone: index(Types.STRING()),
    code: Types.STRING(),
    type: index(addEnums(Types.STRING(), ['otp', 'reg-inv'])),
    isUsed: addDefaultValue(Types.BOOLEAN(), false),
    usedAt: Optional(Types.DATE()),
    expiresAt: Optional(Types.DATE()),
  },
  {
    tableName: 'cms_auth_codes',
    timestamps: true,
  }
);
const services = sequelizeQueryServices(model);

export { model, services };
