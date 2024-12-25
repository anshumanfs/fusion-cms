import { Schema } from 'mongoose';
import { conn } from '../../db';
import { AES, enc } from 'crypto-js';
import mongooseQueryServices from '../services/mongoose';

const { Optional, Types } = require('../../templates/mongo/utils/schemaHelper');
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
    _id: Optional(Types.ObjectId()),
    appName: Types.String(),
    env: Types.String(),
    credentials: Types.Mixed(),
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

const model = conn.model('cms_db_credentials', QuerySchema, 'cms_db_credentials');
const services = mongooseQueryServices(model);
export { model, services };
