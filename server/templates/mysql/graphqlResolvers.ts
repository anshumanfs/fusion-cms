import lodash from 'lodash';
import tempJson from '../../../data/.temp.json';

const generateFederatedResolver = (
  appName: string,
  originalCollectionName: string,
  singularCollectionName: string,
  pluralCollectionName: string,
  schema: any
) => {
  let federationImports = '';
  let federationResolver = `${singularCollectionName}: {`;
  try {
    let schemaKeys = Object.keys(schema);
    schemaKeys.forEach((key: string) => {
      let { federate, type }: any = schema[key as keyof typeof schema];
      if (lodash.isString(type) && lodash.isPlainObject(federate)) {
        let { appName, collection, foreignField } = federate;
        let collectionSchema = lodash.filter(tempJson.dbSchemas, { appName, originalCollectionName: collection });
        let { dbType } = lodash.filter(tempJson.apps, { appName })[0];
        let collectionName = collectionSchema[0].singularCollectionName;
        let pluralCollectionName = collectionSchema[0].pluralCollectionName;
        federationImports += `const ${appName}${collectionName}Resolver = require('../../${appName}/graphqlResolvers/${pluralCollectionName}');\n`;
        let args = dbType === 'mongo' ? `{${foreignField}: parent.${key}}` : `{where:{${foreignField}: parent.${key}}}`;
        federationResolver += `
          async ${key}(parent, args, contextValue, info) {
            return await ${appName}${collectionName}Resolver.Query.${collectionName}(parent, ${args}, contextValue, info);
          },`;
      }

      if (lodash.isPlainObject(type)) {
        let result = generateFederatedResolver(
          appName,
          originalCollectionName,
          key,
          pluralCollectionName,
          lodash.cloneDeep(type)
        );
        federationImports += result.federationImports;
        federationResolver += result.federationResolver;
      }
    });
  } catch (error) {
    throw error;
  }
  federationResolver += `},`;
  return { federationImports, federationResolver };
};

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
        const { resolvers:scalarResolvers } = require('graphql-scalars'); 
        const sqlCustomScalarResolvers = require('./utils/customScalar');
        const mongoCustomScalarResolvers = require('../../templates/mongo/utils/customScalar');
        const { rawSQLMiddleware } = require('../../../../data/files/middleware/${appName}/rawSQL.js'); 
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
        let OtherResolvers = {};
        keys.collections.forEach(async(e)=>{ 
          const { pluralCollectionName } = e; 
          const ref = require(path.join(directory, pluralCollectionName)); 
          Query = { ...Query, ...ref.Query };
          Mutation = { ...Mutation, ...ref.Mutation };
          OtherResolvers = { ...OtherResolvers, ...ref };
        }); 
        module.exports = { ...sqlCustomScalarResolvers.customScalarResolvers, ...mongoCustomScalarResolvers.customScalarResolvers , ...scalarResolvers, ...OtherResolvers, Query , Mutation};`;
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
const generateResolver = (
  appName: string,
  originalCollectionName: string,
  singularCollectionName: string,
  pluralCollectionName: string,
  schema: string
) => {
  const { federationImports, federationResolver } = generateFederatedResolver(
    appName,
    originalCollectionName,
    singularCollectionName,
    pluralCollectionName,
    schema
  );

  const resolverFileContent = `
    const ${pluralCollectionName} = require('../dbModels/${pluralCollectionName}.js'); 
    const { QueryPreMiddleware, QueryPostMiddleware, MutationPreMiddleware, MutationPostMiddleware } = require('../../../../../data/files/middleware/${appName}/${pluralCollectionName}.js'); 
    const { mapGqlFieldToSql, getEagerLoadingOptions } = require('../utils/resolverUtils');
    const { translateQueryToSequelize, translateWhereToSequelize, translateResponseAfterEagerLoading } = require('../utils/translators');
    const Errors = require('../../../libs/errors');

    ${federationImports}

    const resolvers = { 
      Query: { 
        ${pluralCollectionName}: async (parent, args, contextValue, info) => { 
          const preMiddlewareResult = await QueryPreMiddleware.${pluralCollectionName}(parent, args, contextValue, info); 
          const { attributes } = mapGqlFieldToSql(info);
          const include = getEagerLoadingOptions(info, '${pluralCollectionName}');
          const { where , order, group, limit, offset } = preMiddlewareResult.args;
          const query = translateQueryToSequelize({ where, attributes, order, group, limit, offset, include },${pluralCollectionName});
          let result = await ${pluralCollectionName}.findAll(query);
          result = translateResponseAfterEagerLoading(result, '${pluralCollectionName}');
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
        },
        ${federationResolver} 
      }; 
      module.exports = resolvers;
    `;
  return resolverFileContent;
};

export { generateResolver, createIndexResolver };
