import { Schema } from 'mongoose';
import { conn } from '../../db';
import mongooseQueryServices from '../services/mongoose';

const { Types, addEnums, unique } = require('../../templates/mongo/utils/schemaHelper');
const QuerySchema: any = new Schema(
  {
    _id: Types.ObjectId,
    appName: unique(Types.String),
    port: Types.Number,
    running: Types.Boolean,
    isAppCompleted: Types.Boolean,
    dbType: addEnums(Types.String, ['mongo', 'snowflake']),
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
QuerySchema.virtual('creds', {
  ref: 'gateway_dbCreds',
  localField: 'appName',
  foreignField: 'appName',
});

QuerySchema.virtual('schemas', {
  ref: 'cms_dbSchemas',
  localField: 'appName',
  foreignField: 'appName',
});

const model = conn.model('cms_apps', QuerySchema, 'cms_apps');
const services = mongooseQueryServices(model);
export { model, services };
