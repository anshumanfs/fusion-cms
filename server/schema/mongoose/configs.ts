import { Schema } from 'mongoose';
import { conn } from '../../db';
import mongooseQueryServices from '../services/mongoose';

const { Types, Optional, addDefaultValue } = require('../../templates/mongo/utils/schemaHelper');
const QuerySchema: any = new Schema(
  {
    _id: Types.ObjectId(),
    type: Types.String(),
    nextAvailablePort: addDefaultValue(Optional(Types.Number()), 0),
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
const model = conn.model('cms_configs', QuerySchema, 'cms_configs');
const services = mongooseQueryServices(model);
export { model, services };
