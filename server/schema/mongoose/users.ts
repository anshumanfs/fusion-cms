import { Schema } from 'mongoose';
import { conn } from '../../db';
import mongooseQueryServices from '../services/mongoose';
import config from '../../config.json';
const { Types, addEnums, addDefaultValue } = require('../../templates/mongo/utils/schemaHelper');

const additionalRoles = config.user.additionalRoles || [];
const QuerySchema: any = new Schema(
  {
    _id: Types.ObjectId(),
    userName: Types.String(),
    email: Types.Email(),
    password: Types.String(),
    apiKey: Types.String(),
    role: addDefaultValue(addEnums(Types.String(), ['admin', 'user', ...additionalRoles]), 'user'),
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
const model = conn.model('cms_users', QuerySchema, 'cms_users');
const services = mongooseQueryServices(model);
export { model, services };
