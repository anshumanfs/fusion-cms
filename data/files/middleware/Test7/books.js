const QueryPreMiddleware = {
    books: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    count_books: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    book: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    aggregate_books: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    }
};
const QueryPostMiddleware = {
    books: async (result) => {
        // please write your code here
        return result;
    },
    count_books: async (result) => {
        // please write your code here
        return result;
    },
    book: async (result) => {
        // please write your code here
        return result;
    },
    aggregate_books: async (result) => {
        // please write your code here
        return result;
    }
};
const MutationPreMiddleware = {
    create_book: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    update_book: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    delete_book: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    }
};

const MutationPostMiddleware = {
    create_book: async (result) => {
        // please write your code here
        return result;
    },
    update_book: async (result) => {
        // please write your code here
        return result;
    },
    delete_book: async (result) => {
        // please write your code here
        return result;
    }
};

module.exports = {
    QueryPreMiddleware,
    QueryPostMiddleware,
    MutationPreMiddleware,
    MutationPostMiddleware
}