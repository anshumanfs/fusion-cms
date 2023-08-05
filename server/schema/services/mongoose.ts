export default function mongooseQueryServices(model: any) {
  return {
    find: async (filter = {}, projection = {}, options = {}) => {
      return model.find(filter, projection, options);
    },
    findOne: async (filter = {}, projection = {}, options = {}) => {
      return model.findOne(filter, projection, options);
    },
    findOneAndUpdate: async (filter = {}, update = {}, options = {}) => {
      return model.findOneAndUpdate(filter, update, options);
    },
    findOneAndDelete: async (filter = {}, options = {}) => {
      return model.findOneAndDelete(filter, options);
    },
    create: async (data = {}) => {
      return model.create(data);
    },
    updateOne: async (filter: any, update = {}, options = {}) => {
      if (!filter) {
        throw new Error('Filter is required for updateOne');
      }
      return model.updateOne(filter, update, options);
    },
    updateMany: async (filter: any, update = {}, options = {}) => {
      if (!filter) {
        throw new Error('Filter is required for updateMany');
      }
      return model.updateMany(filter, update, options);
    },
    deleteOne: async (filter: any, options = {}) => {
      if (!filter) {
        throw new Error('Filter is required for deleteOne');
      }
      return model.deleteOne(filter, options);
    },
    deleteMany: async (filter: any, options = {}) => {
      if (!filter) {
        throw new Error('Filter is required for deleteMany');
      }
      return model.deleteMany(filter, options);
    },
  };
}
