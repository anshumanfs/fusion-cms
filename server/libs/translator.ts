const { Op } = require('sequelize');

function translateMongooseToSequelize(mongooseQuery: any, options?: any) {
  const sequelizeQuery: any = {
    where: {},
  };

  for (const key in mongooseQuery) {
    if (mongooseQuery.hasOwnProperty(key)) {
      const value = mongooseQuery[key];
      if (key === '$gte') {
        sequelizeQuery.where[key] = {
          [Op.gte]: value,
        };
      } else if (key === '$regex') {
        sequelizeQuery.where.name = {
          [Op.iLike]: `%${value}%`,
        };
      } else {
        sequelizeQuery.where[key] = value;
      }
    }
  }

  return sequelizeQuery;
}
