 const QueryPreMiddleware = {
     customers: async (parent, args, contextValue, info) => {
         // please write your scripts here 
         return {
             parent,
             args,
             contextValue,
             info
         }
     },
     count_customers: async (parent, args, contextValue, info) => {
         // please write your scripts here 
         return {
             parent,
             args,
             contextValue,
             info
         }
     },
     customer: async (parent, args, contextValue, info) => {
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
     customers: async (result) => {
         // please write your scripts here 
         return result
     },
     count_customers: async (result) => {
         // please write your scripts here 
         return result
     },
     customer: async (result) => {
         // please write your scripts here 
         return result
     }
 };

 const MutationPreMiddleware = {
     create_customer: async (parent, args, contextValue, info) => {
         // please write your scripts here 
         return {
             parent,
             args,
             contextValue,
             info
         }
     },
     update_customer: async (parent, args, contextValue, info) => {
         // please write your scripts here 
         return {
             parent,
             args,
             contextValue,
             info
         }
     },
     delete_customer: async (parent, args, contextValue, info) => {
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
     create_customer: async (result) => {
         // please write your scripts here 
         return result
     },
     update_customer: async (result) => {
         // please write your scripts here 
         return result
     },
     delete_customer: async (result) => {
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