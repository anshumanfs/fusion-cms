import { Optional, Types, addGetter, addSetter } from '../../templates/mongo/utils/schemaHelper';
import { Schema } from 'mongoose';
import { conn } from '../../db';
import { AES, enc } from 'crypto-js';

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

const QuerySchema: any = new Schema(
  {
    _id: Optional(Types.ObjectId),
    appName: Types.String,
    env: Types.String,
    dbUsername: addGetter(addSetter(Optional(Types.String), cipherSetter), deCipherGetter), // mongo
    dbPassword: addGetter(addSetter(Optional(Types.String), cipherSetter), deCipherGetter), // mongo
    username: addGetter(addSetter(Optional(Types.String), cipherSetter), deCipherGetter), // snowflake
    password: addGetter(addSetter(Optional(Types.String), cipherSetter), deCipherGetter), // snowflake
    dbUrl: addGetter(addSetter(Optional(Types.String), cipherSetter), deCipherGetter), // mongo
    useSSL: Optional(Types.Boolean), // mongo
    sslFileName: Optional(Types.String), // mongo
    accountName: addGetter(addSetter(Optional(Types.String), cipherSetter), deCipherGetter), // snowflake
    dbName: addGetter(addSetter(Optional(Types.String), cipherSetter), deCipherGetter), // snowflake
    dbSchemaName: Optional(Types.String), // snowflake
    dbWarehouseName: addGetter(addSetter(Optional(Types.String), cipherSetter), deCipherGetter), // snowflake
    roleName: addGetter(addSetter(Optional(Types.String), cipherSetter), deCipherGetter), // snowflake
  },
  {
    timestamps: true,
    toJSON: {
      getters: true,
    },
    toObject: {
      getters: true,
    },
  }
);

export default conn.model('cms_dbCreds', QuerySchema, 'cms_dbCreds');
