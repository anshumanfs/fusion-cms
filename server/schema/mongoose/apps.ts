import { Schema } from 'mongoose';
import { conn } from '../../db';
import mongooseQueryServices from '../services/mongoose';

const { Types, addEnums, index, unique } = require('../../templates/mongo/utils/schemaHelper');
const QuerySchema: any = new Schema(
  {
    _id: Types.ObjectId(),
    appName: index(unique(Types.String())),
    port: Types.Number(),
    running: index(Types.Boolean()),
    isAppCompleted: index(Types.Boolean()),
    dbType: index(addEnums(Types.String(), ['mongo', 'mysql'])),
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
QuerySchema.virtual('creds', {
  ref: 'cms_db_creds',
  localField: 'appName',
  foreignField: 'appName',
});

QuerySchema.virtual('schemas', {
  ref: 'cms_db_schemas',
  localField: 'appName',
  foreignField: 'appName',
});

const model = conn.model('cms_apps', QuerySchema, 'cms_apps');
const services = mongooseQueryServices(model);
export { model, services };
