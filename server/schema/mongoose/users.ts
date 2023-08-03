import { Types } from '../../templates/mongo/utils/schemaHelper';
import { Schema } from 'mongoose';
import { conn } from '../../db';
import mongooseQueryServices from '../services/mongoose';

const QuerySchema: any = new Schema(
  {
    _id: Types.ObjectId,
    userName: Types.String,
    useSSO: Types.Boolean,
    contactPerson: Types.String,
    apiKey: Types.String,
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
