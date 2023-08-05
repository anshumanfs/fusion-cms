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
    findOneAndUpdate: async (filter = {}, update = {}, options: any = {}) => {
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
    updateOne: async (filter = {}, update = {}, options = {}) => {
      return model.update(update, { where: filter, ...options });
    },
    updateMany: async (filter = {}, update = {}, options = {}) => {
      return model.update(update, { where: filter, ...options });
    },
    deleteOne: async (filter = {}, options = {}) => {
      return model.destroy({ where: filter, ...options });
    },
  };
}
