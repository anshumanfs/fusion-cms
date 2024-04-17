import sequelize from 'sequelize';

const convertProjectionToAttribute = (projection: any, model: any) => {
  const allAttributes: string[] = Object.keys(model.rawAttributes);
  const newAttributes: string[] = [];
  const uniqueArr: any[] = [];
  const projectionKeys = Object.keys(projection);
  projectionKeys.forEach((key) => {
    if (!uniqueArr.includes(projection[key])) {
      uniqueArr.push(projection[key]);
    }
  });
  // all elements of uniqueArr is 0
  // all elements of uniqueArr is 1
  // all elements of uniqueArr is 1 and 0
  if (uniqueArr.length === 1) {
    if (uniqueArr[0] === 0) {
      allAttributes.forEach((key: string) => {
        if (!projectionKeys.includes(key)) {
          newAttributes.push(key);
        }
      });
    } else if (uniqueArr[0] === 1) {
      allAttributes.forEach((key: string) => {
        if (projectionKeys.includes(key)) {
          newAttributes.push(key);
        }
      });
    }
  } else if (uniqueArr.length === 2) {
    projectionKeys.forEach((key) => {
      if (projection[key] === 1) {
        newAttributes.push(key);
      }
    });
  } else {
    newAttributes.push(...allAttributes);
  }
  return newAttributes;
};

export default function sequelizeQueryServices(model: any) {
  return {
    countDocuments: async (filter = {}) => {
      return model.count({ where: filter });
    },
    find: async (filter = {}, projection = {}, options = {}) => {
      const attributes = convertProjectionToAttribute(projection, model);
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

      return model.findAll({ where: newFilter, attributes, ...options });
    },
    findOne: async (filter = {}, projection = {}, options = {}) => {
      const attributes = convertProjectionToAttribute(projection, model);
      return model.findOne({ where: filter, attributes, ...options });
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
        await model.update(update, { where: filter, ...options });
        return model.findOne({ where: filter });
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
