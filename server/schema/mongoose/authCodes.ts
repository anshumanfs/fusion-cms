import { Schema } from 'mongoose';
import { conn } from '../../db';
import mongooseQueryServices from '../services/mongoose';
const { Types, addEnums, addDefaultValue, index, Optional } = require('../../templates/mongo/utils/schemaHelper');

const authCodesSchema: any = new Schema(
  {
    _id: Types.ObjectId(),
    email: Optional(index(Types.Email())),
    phone: Optional(index(Types.String())),
    code: Types.String(),
    type: index(addEnums(Types.String(), ['otp', 'reg-inv'])),
    isUsed: addDefaultValue(Types.Boolean(), false),
    usedAt: Optional(Types.Date()),
    expiresAt: Optional(Types.Date()),
  },
  {
    timestamps: true,
    toJSON: {
      getters: true,
    },
    toObject: {
      getters: true,
    },
    autoIndex: true,
  }
);
const model = conn.model('cms_auth_codes', authCodesSchema, 'cms_auth_codes');
const services = mongooseQueryServices(model);
export { model, services };
