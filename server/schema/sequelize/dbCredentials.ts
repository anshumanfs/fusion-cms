import { toJSON } from '../../libs/customLibs';
import { conn } from '../../db';
import { AES, enc } from 'crypto-js';
import sequelizeQueryServices from '../services/sequelize';

const appsSchema = require('./apps');
const {
  addEnums,
  addGetter,
  addSetter,
  unique,
  addDefaultValue,
  primaryKey,
  ObjArray,
  Optional,
  references,
  autoIncrement,
  Nullable,
  Types,
} = require('../../templates/mysql/utils/schemaHelper');

require('dotenv').config();
const CIPHER_KEY: string = process.env.CIPHER_KEY || '';

const deCipherGetter = (value: string) => {
  if (!['null', 'undefined', null, undefined].includes(value)) {
    const bytes = AES.decrypt(value, CIPHER_KEY);
    const decipheredString = bytes.toString(enc.Utf8);
    return decipheredString;
  } else {
    return value;
  }
};

const cipherSetter = (value: any) => {
  if (!['null', 'undefined', null, undefined].includes(value)) {
    return AES.encrypt(value.toString(), CIPHER_KEY).toString();
  } else {
    return value;
  }
};

const model: any = conn.define(
  'cms_db_credentials',
  {
    _id: autoIncrement(primaryKey(Types.INTEGER())),
    appName: references(Types.STRING(), { model: appsSchema.model, key: 'appName' }),
    env: Types.STRING(),
    credentials: addGetter(Types.JSON(), 'credentials', toJSON),
  },
  {
    tableName: 'cms_db_credentials',
    timestamps: true,
  }
);

model.belongsTo(appsSchema.model, { foreignKey: 'appName' });
appsSchema.model.hasMany(model, { foreignKey: 'appName' });

const services = sequelizeQueryServices(model);

export { model, services };
