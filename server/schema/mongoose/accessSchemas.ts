import { Schema } from 'mongoose';
import { conn } from '../../db';
import mongooseQueryServices from '../services/mongoose';
const { Types, addDefaultValue } = require('../../templates/mongo/utils/schemaHelper');

const QuerySchema: any = new Schema(
  {
    _id: Types.ObjectId(),
    email: Types.String(),
    appName: Types.String(),
    endPointName: Types.String(),
    isAllowed: addDefaultValue(Types.String(), 'false'),
    allowedInChain: addDefaultValue(Types.Boolean(), false), // to check if previous resolver has allowed the access
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

const model = conn.model('cms_accessSchemas', QuerySchema, 'cms_accessSchemas');
const services = mongooseQueryServices(model);

export { model, services };
