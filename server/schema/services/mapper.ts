const mongoose = require('mongoose');
const { Sequelize, Op } = require('sequelize');

// Helper function to convert comparison operators from Mongoose to Sequelize
const convertComparisonOperator = (operator: string) => {
  switch (operator) {
    case '$eq':
      return Op.eq;
    case '$ne':
      return Op.ne;
    case '$gt':
      return Op.gt;
    case '$gte':
      return Op.gte;
    case '$lt':
      return Op.lt;
    case '$lte':
      return Op.lte;
    case '$in':
      return Op.in;
    case '$nin':
      return Op.notIn;
    default:
      return operator;
  }
};

const mongooseToSequelizeMapper = {
  /**
   * Converts a Mongoose query to a Sequelize query.
   *
   * @param {any} mongooseQuery - The Mongoose query object to be converted.
   * @return {any} The converted Sequelize query object.
   */
  find: (mongooseQuery: any) => {
    const sequelizeQuery: any = {};
    for (const key in mongooseQuery) {
      if (mongooseQuery.hasOwnProperty(key)) {
        const value = mongooseQuery[key];

        if (key === '$and' || key === '$or') {
          const op = key === '$and' ? Op.and : Op.or;
          sequelizeQuery[op] = value.map((subQuery: any) => mongooseToSequelizeMapper.find(subQuery));
        } else if (key === '$not') {
          sequelizeQuery[Op.not] = mongooseToSequelizeMapper.find(value);
        } else if (key === '$nor') {
          sequelizeQuery[Op.not] = value.map((subQuery: any) => mongooseToSequelizeMapper.find(subQuery));
        } else if (typeof value === 'object') {
          for (const subKey in value) {
            if (value.hasOwnProperty(subKey)) {
              const subValue = value[subKey];
              if (subKey === '$regex') {
                sequelizeQuery[key] = {
                  [Op.regexp]: subValue,
                };
              } else {
                sequelizeQuery[key] = {
                  [convertComparisonOperator(subKey)]: subValue,
                };
              }
            }
          }
        } else {
          sequelizeQuery[key] = value;
        }
      }
    }
    return sequelizeQuery;
  },
};

export default mongooseToSequelizeMapper;
