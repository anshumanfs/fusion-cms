 const QueryPreMiddleware = {
     books: async (parent, args, contextValue, info) => {
         // please write your scripts here 
         return {
             parent,
             args,
             contextValue,
             info
         }
     },
     count_books: async (parent, args, contextValue, info) => {
         // please write your scripts here 
         return {
             parent,
             args,
             contextValue,
             info
         }
     },
     book: async (parent, args, contextValue, info) => {
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
     books: async (result) => {
         // please write your scripts here 
         return result
     },
     count_books: async (result) => {
         // please write your scripts here 
         return result
     },
     book: async (result) => {
         // please write your scripts here 
         return result
     }
 };

 const MutationPreMiddleware = {
     create_book: async (parent, args, contextValue, info) => {
         // please write your scripts here 
         return {
             parent,
             args,
             contextValue,
             info
         }
     },
     update_book: async (parent, args, contextValue, info) => {
         // please write your scripts here 
         return {
             parent,
             args,
             contextValue,
             info
         }
     },
     delete_book: async (parent, args, contextValue, info) => {
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
     create_book: async (result) => {
         // please write your scripts here 
         return result
     },
     update_book: async (result) => {
         // please write your scripts here 
         return result
     },
     delete_book: async (result) => {
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