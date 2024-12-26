import { Schema } from 'mongoose';
import { conn } from '../../db';
import mongooseQueryServices from '../services/mongoose';

const { Types, index } = require('../../templates/mongo/utils/schemaHelper');

const QuerySchema: any = new Schema(
  {
    _id: Types.ObjectId(),
    appName: index(Types.String()),
    singularCollectionName: index(Types.String()),
    originalCollectionName: index(Types.String()),
    pluralCollectionName: index(Types.String()),
    schema: Types.Mixed(),
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
const model = conn.model('cms_db_schemas', QuerySchema, 'cms_db_schemas');
const services = mongooseQueryServices(model);
export { model, services };
