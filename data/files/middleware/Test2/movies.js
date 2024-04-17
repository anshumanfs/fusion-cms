const QueryPreMiddleware = {
    movies: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    count_movies: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    movie: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    aggregate_movies: async (root, args, context, info) => {
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
    movies: async (result) => {
        // please write your code here
        return result;
    },
    count_movies: async (result) => {
        // please write your code here
        return result;
    },
    movie: async (result) => {
        // please write your code here
        return result;
    },
    aggregate_movies: async (result) => {
        // please write your code here
        return result;
    }
};
const MutationPreMiddleware = {
    create_movie: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    update_movie: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    delete_movie: async (root, args, context, info) => {
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
    create_movie: async (result) => {
        // please write your code here
        return result;
    },
    update_movie: async (result) => {
        // please write your code here
        return result;
    },
    delete_movie: async (result) => {
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