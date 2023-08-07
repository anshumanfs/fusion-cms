 const QueryPreMiddleware = {
     test1_col1s: async (parent, args, contextValue, info) => {
         // please write your scripts here 
         return {
             parent,
             args,
             contextValue,
             info
         }
     },
     count_test1_col1s: async (parent, args, contextValue, info) => {
         // please write your scripts here 
         return {
             parent,
             args,
             contextValue,
             info
         }
     },
     test1_col1: async (parent, args, contextValue, info) => {
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
     test1_col1s: async (result) => {
         // please write your scripts here 
         return result
     },
     count_test1_col1s: async (result) => {
         // please write your scripts here 
         return result
     },
     test1_col1: async (result) => {
         // please write your scripts here 
         return result
     }
 };

 const MutationPreMiddleware = {
     create_test1_col1: async (parent, args, contextValue, info) => {
         // please write your scripts here 
         return {
             parent,
             args,
             contextValue,
             info
         }
     },
     update_test1_col1: async (parent, args, contextValue, info) => {
         // please write your scripts here 
         return {
             parent,
             args,
             contextValue,
             info
         }
     },
     delete_test1_col1: async (parent, args, contextValue, info) => {
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
     create_test1_col1: async (result) => {
         // please write your scripts here 
         return result
     },
     update_test1_col1: async (result) => {
         // please write your scripts here 
         return result
     },
     delete_test1_col1: async (result) => {
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