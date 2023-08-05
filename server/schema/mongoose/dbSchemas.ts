import { Schema } from 'mongoose';
import { conn } from '../../db';
import mongooseQueryServices from '../services/mongoose';

const { Types } = require('../../templates/mongo/utils/schemaHelper');

const QuerySchema: any = new Schema(
  {
    _id: Types.ObjectId,
    appName: Types.String,
    singularCollectionName: Types.String,
    originalCollectionName: Types.String,
    pluralCollectionName: Types.String,
    schema: Types.Mixed,
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
const model = conn.model('cms_dbSchemas', QuerySchema, 'cms_dbSchemas');
const services = mongooseQueryServices(model);
export { model, services };
