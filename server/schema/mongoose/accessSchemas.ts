import { Schema } from 'mongoose';
import { conn } from '../../db';
import mongooseQueryServices from '../services/mongoose';
const { Types, addDefaultValue, index } = require('../../templates/mongo/utils/schemaHelper');

const QuerySchema: any = new Schema(
  {
    _id: Types.ObjectId(),
    email: index(Types.String()),
    appName: index(Types.String()),
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
    autoIndex: true,
  }
);

const model = conn.model('cms_access_schemas', QuerySchema, 'cms_access_schemas');
const services = mongooseQueryServices(model);

export { model, services };
