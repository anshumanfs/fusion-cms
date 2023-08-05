import { DataTypes } from 'sequelize';
import { conn } from '../../db';
import { AES, enc } from 'crypto-js';
import sequelizeQueryServices from '../services/sequelize';
const {
  addEnums,
  addGetter,
  addSetter,
  unique,
  addDefaultValue,
  primaryKey,
  ObjArray,
  Optional,
  autoIncrement,
  Nullable,
  Types,
} = require('../../templates/mysql/utils/schemaHelper');

require('dotenv').config();
const CIPHER_KEY = process.env.CIPHER_KEY;

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
  'cms_dbCreds',
  {
    _id: autoIncrement(primaryKey(Types.INTEGER())),
    appName: Types.STRING(),
    env: Types.STRING(),
    dbUsername: addGetter(addSetter(Optional(Types.STRING()), cipherSetter), 'dbUsername', deCipherGetter), // mongo
    dbPassword: addGetter(addSetter(Optional(Types.STRING()), cipherSetter), 'dbPassword', deCipherGetter), // mongo
    username: addGetter(addSetter(Optional(Types.STRING()), cipherSetter), 'username', deCipherGetter), // snowflake
    password: addGetter(addSetter(Optional(Types.STRING()), cipherSetter), 'password', deCipherGetter), // snowflake
    dbUrl: addGetter(addSetter(Optional(Types.STRING()), cipherSetter), 'dbUrl', deCipherGetter), // mongo
    useSSL: Optional(Types.BOOLEAN()), // mongo
    sslFileName: Optional(Types.STRING()), // mongo
    accountName: addGetter(addSetter(Optional(Types.STRING()), cipherSetter), 'accountName', deCipherGetter), // snowflake
    dbName: addGetter(addSetter(Optional(Types.STRING()), cipherSetter), 'dbName', deCipherGetter), // snowflake
    dbSchemaName: Optional(Types.STRING()), // snowflake
    dbWarehouseName: addGetter(addSetter(Optional(Types.STRING()), cipherSetter), 'dbWarehouseName', deCipherGetter), // snowflake
    roleName: addGetter(addSetter(Optional(Types.STRING()), cipherSetter), 'roleName', deCipherGetter), // snowflake
  },
  {
    tableName: 'cms_dbCreds',
    timestamps: true,
  }
);
const services = sequelizeQueryServices(model);

export { model, services };
