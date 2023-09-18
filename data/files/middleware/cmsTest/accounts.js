 const QueryPreMiddleware = {
     accounts: async (parent, args, contextValue, info) => {
         // please write your scripts here 
         return {
             parent,
             args,
             contextValue,
             info
         }
     },
     count_accounts: async (parent, args, contextValue, info) => {
         // please write your scripts here 
         return {
             parent,
             args,
             contextValue,
             info
         }
     },
     account: async (parent, args, contextValue, info) => {
         // please write your scripts here 
         return {
             parent,
             args,
             contextValue,
             info
         }
     }
 };

 const QueryPostMiddleware = {
     accounts: async (result) => {
         // please write your scripts here 
         return result
     },
     count_accounts: async (result) => {
         // please write your scripts here 
         return result
     },
     account: async (result) => {
         // please write your scripts here 
         return result
     }
 };

 const MutationPreMiddleware = {
     create_account: async (parent, args, contextValue, info) => {
         // please write your scripts here 
         return {
             parent,
             args,
             contextValue,
             info
         }
     },
     update_account: async (parent, args, contextValue, info) => {
         // please write your scripts here 
         return {
             parent,
             args,
             contextValue,
             info
         }
     },
     delete_account: async (parent, args, contextValue, info) => {
         // please write your scripts here 
         return {
             parent,
             args,
             contextValue,
             info
         }
     }
 };

 const MutationPostMiddleware = {
     create_account: async (result) => {
         // please write your scripts here 
         return result
     },
     update_account: async (result) => {
         // please write your scripts here 
         return result
     },
     delete_account: async (result) => {
         // please write your scripts here 
         return result
     }
 };

 module.exports = {
     QueryPreMiddleware,
     QueryPostMiddleware,
     MutationPreMiddleware,
     MutationPostMiddleware
 }