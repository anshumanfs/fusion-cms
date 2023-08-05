import { Schema } from 'mongoose';
import { conn } from '../../db';
import mongooseQueryServices from '../services/mongoose';
const { Types } = require('../../templates/mongo/utils/schemaHelper');

const QuerySchema: any = new Schema(
  {
    _id: Types.ObjectId,
    userName: Types.String,
    appName: Types.String,
    canCreate: Types.Mixed,
    canRead: Types.Mixed,
    canUpdate: Types.Mixed,
    canDelete: Types.Mixed,
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
