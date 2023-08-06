import sequelize from 'sequelize';

export default function sequelizeQueryServices(model: any) {
  return {
    find: async (filter = {}, projection = {}, options = {}) => {
      // modify filter to include $in functionality to sequelize
      const filterKeys = Object.keys(filter);
      const filterValues: any = Object.values(filter);
      const newFilter: any = {};
      filterKeys.forEach((key, index) => {
        if (filterValues[index].$in) {
          newFilter[key] = filterValues[index].$in;
        } else {
          newFilter[key] = filterValues[index];
        }
      });
      return model.findAll({ where: newFilter, attributes: projection, ...options });
    },
    findOne: async (filter = {}, projection = {}, options = {}) => {
      return model.findOne({ where: filter, attributes: projection, ...options });
    },
    findOneAndUpdate: async (filter: any, update: any = {}, options: any = {}) => {
      if (!filter) {
        throw new Error('Filter is required for findOneAndUpdate');
      }
      const existing = await model.findOne({ where: filter, ...options });
      if (existing) {
        if (update.$inc) {
          for (const key in update.$inc) {
            if (update.$inc.hasOwnProperty(key)) {
              const value = update.$inc[key];
              update[key] = existing[key] + value;
            }
          }
          delete update.$inc;
        }
        return model.update(update, { where: filter, ...options });
      } else {
        if (options.upsert) {
          return model.create({ ...filter, ...update }, { ...options });
        }
        throw new Error('No document found to update');
      }
    },
    findOneAndDelete: async (filter = {}, options = {}) => {
      return model.destroy({ where: filter, ...options });
    },
    create: async (data = {}) => {
      return model.create(data);
    },
    updateOne: async (filter: any, update = {}, options = {}) => {
      if (!filter) {
        throw new Error('Filter is required for updateOne');
      }
      return model.update(update, { where: filter, ...options });
    },
    updateMany: async (filter: any, update = {}, options = {}) => {
      if (!filter) {
        throw new Error('Filter is required for updateMany');
      }
      return model.update(update, { where: filter, ...options });
    },
    deleteOne: async (filter: any, options = {}) => {
      if (!filter) {
        throw new Error('Filter is required for deleteOne');
      }
      return model.destroy({ where: filter, ...options });
    },
    deleteMany: async (filter: any, options = {}) => {
      if (!filter) {
        throw new Error('Filter is required for deleteMany');
      }
      return model.destroy({ where: filter, ...options });
    },
  };
}
