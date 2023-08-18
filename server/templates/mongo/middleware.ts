const generateMiddleware = (pluralCollectionName: string, singularCollectionName: string) => {
  const fileContent = `
        const QueryPreMiddleware = {
            ${pluralCollectionName} : async (root, args, context, info) => {
                // please write your code here
                return {root, args, context, info};
            },
            count_${pluralCollectionName} : async (root, args, context, info) => {
                // please write your code here
                return {root, args, context, info};
            },
            ${singularCollectionName} : async (root, args, context, info) => {
                // please write your code here
                return {root, args, context, info};
            },
            aggregate_${pluralCollectionName} : async (root, args, context, info) => {
                // please write your code here
                return {root, args, context, info};
            }
        };
        const QueryPostMiddleware = {
            ${pluralCollectionName} : async (root, args, context, info) => {
                // please write your code here
                return {root, args, context, info};
            },
            count_${pluralCollectionName} : async (root, args, context, info) => {
                // please write your code here
                return {root, args, context, info};
            },
            ${singularCollectionName} : async (root, args, context, info) => {
                // please write your code here
                return {root, args, context, info};
            },
            aggregate_${pluralCollectionName} : async (root, args, context, info) => {
                // please write your code here
                return {root, args, context, info};
            }
        };
        const MutationPreMiddleware = {
            create_${singularCollectionName} : async (root, args, context, info) => {
                // please write your code here
                return {root, args, context, info};
            },
            update_${singularCollectionName} : async (root, args, context, info) => {
                // please write your code here
                return {root, args, context, info};
            },
            delete_${singularCollectionName} : async (root, args, context, info) => {
                // please write your code here
                return {root, args, context, info};
            }
        };

        const MutationPostMiddleware = {
            create_${singularCollectionName} : async (root, args, context, info) => {
                // please write your code here
                return {root, args, context, info};
            },
            update_${singularCollectionName} : async (root, args, context, info) => {
                // please write your code here
                return {root, args, context, info};
            },
            delete_${singularCollectionName} : async (root, args, context, info) => {
                // please write your code here
                return {root, args, context, info};
            }
        };

        module.exports = {
            QueryPreMiddleware,
            QueryPostMiddleware,
            MutationPreMiddleware,
            MutationPostMiddleware
        }
    `;
  return fileContent;
};

export { generateMiddleware };
