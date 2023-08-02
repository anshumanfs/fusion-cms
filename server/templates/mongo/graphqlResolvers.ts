const generateIndexResolver = () => {
    const indexResolverContent = `
        const path = require('path');
        const keys = require('./config.json');
        const directory = path.resolve(__dirname, './graphqlResolvers');
        const { resolvers:scalarResolvers } = require('graphql-scalars');
        const { customScalarResolvers } = require('./customScalarResolver');
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
    sourceName: string,
    originalCollectionName: string,
    singularCollectionName: string,
    pluralCollectionName: string
) => {};

export { generateResolver, generateIndexResolver };
