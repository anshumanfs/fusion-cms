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
    updateOne: async (filter = {}, update = {}, options = {}) => {
      return model.updateOne(filter, update, options);
    },
    updateMany: async (filter = {}, update = {}, options = {}) => {
      return model.updateMany(filter, update, options);
    },
    deleteOne: async (filter = {}, options = {}) => {
      return model.deleteOne(filter, options);
    },
  };
}
