/**
 * Generates the function comment for the given function body.
 *
 * @param {string} appName - The name of the application.
 * @return {string} The content of the index resolver.
 */
const createIndexResolver = (appName: string) => {
  const indexResolverContent = ` 
        const path = require('path'); 
        const keys = require('./app.json'); 
        const directory = path.resolve(__dirname,'./resolvers'); 
        const conn = require('./db'); 
        const { QueryTypes } = require('sequelize'); 
        const { customScalarResolvers } = require('./utils/customScalar');
        const { rawSQLMiddleware } = require('../../../data/files/middleware/${appName}/rawSQL.js'); 
        let Query = { 
          RAW_SQL : async (parent, args, contextValue, info) => { 
            const preMiddlewareResult = await rawSQLMiddleware.pre(parent, args, contextValue, info); 
            const { sql, Type } = preMiddlewareResult.args; 
            const result = await conn.query(sql, { 
              type: QueryTypes[Type] 
            }); 
            const postMiddlewareResult = await rawSQLMiddleware.post(result); 
            return postMiddlewareResult; 
          }, 
        }; 
        let Mutation = {}; 
        keys.collections.forEach(async(e)=>{ 
          const { pluralCollectionName } = e; 
          const ref = require(path.join(directory, pluralCollectionName)); 
          Query = { ...Query, ...ref.Query } 
          Mutation = { ...Mutation, ...ref.Mutation } 
        }); 
        module.exports = { ...customScalarResolvers , Query , Mutation};`;
  return indexResolverContent;
};

/**
 * Generates a resolver file content based on the provided parameters.
 *
 * @param {string} appName - The name of the application.
 * @param {string} singularCollectionName - The name of the singular collection.
 * @param {string} pluralCollectionName - The name of the plural collection.
 * @return {string} The generated resolver file content.
 */
const generateResolver = (appName: string, singularCollectionName: string, pluralCollectionName: string) => {
  const resolverFileContent = `
    const ${pluralCollectionName} = require('../dbModels/${pluralCollectionName}.js'); 
    const { QueryPreMiddleware, QueryPostMiddleware, MutationPreMiddleware, MutationPostMiddleware } = require('../../../../data/files/middleware/${appName}/${pluralCollectionName}.js'); 
    const { mapGqlFieldToSql } = require('../utils/resolverUtils');
    const { translateQueryToSequelize, translateWhereToSequelize } = require('../utils/translator');
    const Errors = require('../../../libs/errors');

    const resolvers = { 
      Query: { 
        ${pluralCollectionName}: async (parent, args, contextValue, info) => { 
          const preMiddlewareResult = await QueryPreMiddleware.${pluralCollectionName}(parent, args, contextValue, info); 
          const { attributes } = mapGqlFieldToSql(info);
          const { where , order, group, limit, offset } = preMiddlewareResult.args;
          const query = translateQueryToSequelize({ where, attributes, order, group, limit, offset },${pluralCollectionName});
          let result = await ${pluralCollectionName}.findAll(query);       
          const postMiddlewareResult = await QueryPostMiddleware.${pluralCollectionName}(result); 
          return postMiddlewareResult;
        }, 
        count_${pluralCollectionName} : async (parent, args, contextValue, info) => { 
          const preMiddlewareResult = await QueryPreMiddleware.count_${pluralCollectionName}(parent, args, contextValue, info); 
          const { filters } = preMiddlewareResult.args; 
          const result = await ${pluralCollectionName}.count({where: filters || {}}); 
          const postMiddlewareResult = await QueryPostMiddleware.count_${pluralCollectionName}(result); 
          return postMiddlewareResult; 
        },

        ${singularCollectionName}: async (parent, args, contextValue, info) =>{  
            const preMiddlewareResult = await QueryPreMiddleware.${singularCollectionName}(parent, args, contextValue, info); 
            const { attributes } = mapGqlFieldToSql(info); 
            const { where , order, group, limit, offset } = preMiddlewareResult.args; 
            const query = translateQueryToSequelize({ where, attributes, order, group, limit, offset },${pluralCollectionName});
            let result = await ${pluralCollectionName}.findOne(query);
            const postMiddlewareResult = await QueryPostMiddleware.${singularCollectionName}(result); 
            return postMiddlewareResult; 
          } 
        }, 
        Mutation: { 
          create_${singularCollectionName}: async (parent, args, contextValue, info) => { 
            const preMiddlewareResult = await MutationPreMiddleware.create_${singularCollectionName}(parent, args, contextValue, info); 
            const result = await ${pluralCollectionName}.create(preMiddlewareResult.args.input); 
            const postMiddlewareResult = await MutationPostMiddleware.create_${singularCollectionName}(result); 
            return postMiddlewareResult; 
          }, 
          update_${singularCollectionName}: async (parent, args, contextValue, info) => { 
            const preMiddlewareResult = await MutationPreMiddleware.update_${singularCollectionName}(parent, args, contextValue, info);  
            let { where, updates } = preMiddlewareResult.args;
            if(Object.keys(where).length === 0 || Object.keys(where).length ===0){
              throw Errors.default.BAD_REQUEST('No updates or where condition provided');
            }
            where = translateWhereToSequelize(where,${pluralCollectionName});
            let result = await ${pluralCollectionName}.update(updates , { 
              where
            }); 
            if(result[0] === 0){
              throw Errors.default.BAD_REQUEST('Nothing to update');
            }else if(result[0] === 1){
              result = await ${pluralCollectionName}.findOne({where});
            }
            const postMiddlewareResult = await MutationPostMiddleware.update_${singularCollectionName}(result);
            return postMiddlewareResult; 
          }, 
          delete_${singularCollectionName}: async (parent, args, contextValue, info) => { 
            const preMiddlewareResult = await MutationPreMiddleware.delete_${singularCollectionName}(parent, args, contextValue, info); 
            let { where } =  preMiddlewareResult.args; 
            if(Object.keys(where).length ===0){
              throw Errors.default.BAD_REQUEST('No where conditions provided');
            } 
            where = translateWhereToSequelize(where,${pluralCollectionName});
            const findResult = await ${pluralCollectionName}.findOne({where});
            const result = await ${pluralCollectionName}.destroy({ 
              where
            });
            if(result === 0){
              throw Errors.default.BAD_REQUEST('Nothing to delete');
            }
            const postMiddlewareResult = await MutationPostMiddleware.delete_${singularCollectionName}(findResult); 
            return postMiddlewareResult; 
          } 
        } 
      }; 
      module.exports = resolvers;
    `;
  return resolverFileContent;
};

export { generateResolver, createIndexResolver };
