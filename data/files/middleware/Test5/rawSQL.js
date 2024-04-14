const rawSQLMiddleware = {
    pre: async (parent, args, contextValue, info) => {
        // please write your scripts here 
        return {
            parent,
            args,
            contextValue,
            info
        }
    },
    post: async (result) => {
        // please write your scripts here 
        return result
    }
};
module.exports = {
    rawSQLMiddleware
};