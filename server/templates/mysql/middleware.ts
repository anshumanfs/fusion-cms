const generateMiddlewareFile = (pluralCollectionName: string, singularCollectionName: string) => {
    const fileContent = ` 
      const QueryPreMiddleware = { 
          ${pluralCollectionName} : async(parent, args, contextValue, info) => { 
              // please write your scripts here 
              return {parent, args, contextValue, info} 
          }, 
          count_${pluralCollectionName} : async (parent, args, contextValue, info) => { 
              // please write your scripts here 
              return {parent, args, contextValue, info} 
          }, 
          ${singularCollectionName} : async (parent, args, contextValue, info) => { 
              // please write your scripts here 
              return {parent, args, contextValue, info} 
          } 
      }; 
   
      const QueryPostMiddleware = { 
          ${pluralCollectionName} : async(result) => { 
              // please write your scripts here 
              return result 
          }, 
          count_${pluralCollectionName} : async (result) => { 
              // please write your scripts here 
              return result 
          }, 
          ${singularCollectionName} : async (result) => { 
              // please write your scripts here 
              return result 
          } 
      }; 
       
      const MutationPreMiddleware = { 
          create_${singularCollectionName} : async (parent, args, contextValue, info) => { 
              // please write your scripts here 
              return {parent, args, contextValue, info} 
          }, 
          update_${singularCollectionName} : async (parent, args, contextValue, info) => { 
              // please write your scripts here 
              return {parent, args, contextValue, info} 
          }, 
          delete_${singularCollectionName} : async (parent, args, contextValue, info) => { 
              // please write your scripts here 
              return {parent, args, contextValue, info} 
          } 
      }; 
   
      const MutationPostMiddleware = { 
          create_${singularCollectionName} : async (result) => { 
              // please write your scripts here 
              return result 
          }, 
          update_${singularCollectionName} : async (result) => { 
              // please write your scripts here 
              return result 
          }, 
          delete_${singularCollectionName} : async (result) => { 
              // please write your scripts here 
              return result 
          } 
      };
   
      module.exports= { QueryPreMiddleware, QueryPostMiddleware, MutationPreMiddleware, MutationPostMiddleware } `;

    return fileContent;
};

const rawSQLMiddlewareGenerator = () => {
    return `const rawSQLMiddleware = { 
          pre: async(parent, args, contextValue, info) => { 
              // please write your scripts here 
              return {parent, args, contextValue, info} 
          }, 
          post: async (result) => { 
              // please write your scripts here 
              return result 
          } 
      };
      module.exports = { rawSQLMiddleware };`;
};

export { generateMiddlewareFile, rawSQLMiddlewareGenerator };
