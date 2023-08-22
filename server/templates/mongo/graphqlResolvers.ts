const generateIndexResolver = () => {
  const indexResolverContent = `
        const path = require('path');
        const keys = require('./app.json');
        const directory = path.resolve(__dirname, './graphqlResolvers');
        const { resolvers:scalarResolvers } = require('graphql-scalars');
        const { customScalarResolvers } = require('./utils/customScalar');
        let Query = {};
        let Mutation = {};
        keys.collections.forEach(async(collection) => {
            const { pluralCollectionName } = collection;
            const ref = require(path.join(directory, pluralCollectionName));
            Query = { ...Query, ...ref.Query };
            Mutation = { ...Mutation, ...ref.Mutation };
        });
        module.exports = {
            ...customScalarResolvers,
            ...scalarResolvers,
            Query,
            Mutation
        };
    `;
  return indexResolverContent;
};

const generateResolver = (
  appName: string,
  originalCollectionName: string,
  singularCollectionName: string,
  pluralCollectionName: string
) => {
  const resolverString = `
  const ${pluralCollectionName} = require('../dbModels/${pluralCollectionName}.js'); 
  const { populate } = require('../utils/populate'); 
  const { QueryPreMiddleware, QueryPostMiddleware, MutationPreMiddleware, MutationPostMiddleware } = require('../../../../data/files/middleware/${appName}/${pluralCollectionName}.js'); 
  const { getProjections, getPopulateOptions } = require('../utils/resolverUtils'); 
  const { translateFilter, translateOptions } = require('../utils/translators');
  const Errors = require('../../../libs/errors');

  const resolvers = { 
    Query: { 
      ${pluralCollectionName}: async (parent, args, contextValue, info) => { 
        const projection = getProjections(info);
        const populate = getPopulateOptions(info);
        const preMiddlewareResult = await QueryPreMiddleware.${pluralCollectionName}(parent, args, contextValue, info);
        let { filters, options , resolveDbRefs, dbRefPreserveFields } = preMiddlewareResult.args;
        filters = translateFilter(filters);
        options = { ...options, populate };
        options = translateOptions(options, 'find');
        let result = await ${pluralCollectionName}.find(filters, projection, options);
        if(resolveDbRefs){
          result = await populate(result, dbRefPreserveFields);
        }
        const postMiddlewareResult = await QueryPostMiddleware.${pluralCollectionName}(result);
        return postMiddlewareResult;
      }, 
      count_${pluralCollectionName} : async (parent, args, contextValue, info) => { 
        const preMiddlewareResult = await QueryPreMiddleware.count_${pluralCollectionName}(parent, args, contextValue, info);
        let { filters } = preMiddlewareResult.args;
        filters = translateFilter(filters);
        const result = await ${pluralCollectionName}.find(filters).count();
        const postMiddlewareResult = await QueryPostMiddleware.count_${pluralCollectionName}(result);
        return postMiddlewareResult;
      },
      aggregate_${pluralCollectionName} : async (parent, args, contextValue, info) => { 
        try {
          const preMiddlewareResult = await QueryPreMiddleware.aggregation_${pluralCollectionName}(parent, args, contextValue, info);
          let { pipeline } = preMiddlewareResult.args;
          pipeline = validateAggregatePipeline(pipeline);
          const result = await ${pluralCollectionName}.aggregate(pipeline).allowDiskUse(true);
          const postMiddlewareResult = await QueryPostMiddleware.aggregation_${pluralCollectionName}(result);
          return postMiddlewareResult;
        } catch (error) { 
          throw Errors.default.BAD_REQUEST(error);
        }  
      }, 
      ${singularCollectionName}: async (parent, args, contextValue, info) =>{ 
        const projection = getProjections(info);
        const populate = getPopulateOptions(info);
        const preMiddlewareResult = await QueryPreMiddleware.${singularCollectionName}(parent, args, contextValue, info);
        let { filters, options, resolveDbRefs, dbRefPreserveFields } = preMiddlewareResult.args;
        filters = translateFilter(filters);
        options = { ...options, populate };
        options = translateOptions(options, 'findOne');
        let result = await ${pluralCollectionName}.findOne(filters, projection, options);
        if(resolveDbRefs){
          result = await populate(result, dbRefPreserveFields);
        }
        const postMiddlewareResult = await QueryPostMiddleware.${singularCollectionName}(result);
        return postMiddlewareResult;
      }
    }, 
    Mutation: { 
      create_${singularCollectionName}: async (parent, args, contextValue, info) => { 
        const preMiddlewareResult = await MutationPreMiddleware.create_${singularCollectionName}(parent, args, contextValue, info);
        const model = new ${pluralCollectionName}(preMiddlewareResult.args.input);
        const result = await model.save();
        const postMiddlewareResult = await MutationPostMiddleware.create_${singularCollectionName}(result);
        return postMiddlewareResult;
      }, 
      update_${singularCollectionName}: async (parent, args, contextValue, info) => { 
        const preMiddlewareResult = await MutationPreMiddleware.update_${singularCollectionName}(parent, args, contextValue, info);
        let { filters, updates, options } = preMiddlewareResult.args;
        filters = translateFilter(filters);
        if(Object.keys(updates).length === 0 || Object.keys(filters).length === 0){
         throw Errors.default.BAD_REQUEST('Empty update or filter object');
        }
        options = translateOptions(options, 'findOneAndUpdate');
        options = { ...options, new: true };
        const result = await ${pluralCollectionName}.findOneAndUpdate(filters, updates, options);
        const postMiddlewareResult = await MutationPostMiddleware.update_${singularCollectionName}(result);
        return postMiddlewareResult;
      }, 
      delete_${singularCollectionName}: async (parent, args, contextValue, info) => { 
        const preMiddlewareResult = await MutationPreMiddleware.delete_${singularCollectionName}(parent, args, contextValue, info);
        let { filters, options } =  preMiddlewareResult.args;
        filters = translateFilter(filters);
        if(Object.keys(filters).length === 0){
          throw Errors.default.BAD_REQUEST('Empty filter object');
        }
        options = translateOptions(options, 'findOneAndDelete');
        const result = await ${pluralCollectionName}.findOneAndDelete(filters, options);
        const postMiddlewareResult = await MutationPostMiddleware.delete_${singularCollectionName}(result);
        return postMiddlewareResult;
      }
    } 
  }; 
  module.exports = resolvers;`;
  return resolverString;
};

export { generateResolver, generateIndexResolver };
