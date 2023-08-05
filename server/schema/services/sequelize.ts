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
    findOneAndUpdate: async (filter: any, update = {}, options: any = {}) => {
      if (!filter) {
        throw new Error('Filter is required for findOneAndUpdate');
      }
      // snippet to handle $inc coming inside update
      const updateKeys = Object.keys(update);
      const updateValues: any = Object.values(update);
      const newUpdate: any = {};
      updateKeys.forEach((key, index) => {
        if (updateValues[index].$inc) {
          newUpdate[key] = sequelize.literal(`${key} + ${updateValues[index].$inc}`);
        } else {
          newUpdate[key] = updateValues[index];
        }
      });

      if (options.upsert === true) {
        const existing = await model.findOne({ where: filter, ...options });
        if (existing) {
          return model.update(update, { where: filter, ...options });
        } else {
          return model.create({ ...filter, ...update }, { ...options });
        }
      } else {
        return model.update(update, { where: filter, ...options });
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
