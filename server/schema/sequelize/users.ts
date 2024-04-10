import { conn } from '../../db';
import config from '../../config.json';
import sequelizeQueryServices from '../services/sequelize';
const {
  addEnums,
  addDefaultValue,
  primaryKey,
  autoIncrement,
  Types,
} = require('../../templates/mysql/utils/schemaHelper');
const additionalRoles = config.user.additionalRoles || [];

const model: any = conn.define(
  'cms_users',
  {
    _id: autoIncrement(primaryKey(Types.INTEGER())),
    userName: Types.STRING(),
    email: Types.EMAIL(),
    password: Types.STRING(),
    apiKey: Types.STRING(),
    role: addDefaultValue(addEnums(Types.STRING(), ['admin', 'user', ...additionalRoles]), 'user'),
    isVerified: addDefaultValue(Types.BOOLEAN(), false), // true if user has verified the email and account is active
    isBlocked: addDefaultValue(Types.BOOLEAN(), false), // true if user is blocked by admin
  },
  {
    tableName: 'cms_users',
    timestamps: true,
  }
);
const services = sequelizeQueryServices(model);

export { model, services };
