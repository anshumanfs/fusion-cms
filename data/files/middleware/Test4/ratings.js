const QueryPreMiddleware = {
    ratings: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    count_ratings: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    rating: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    aggregate_ratings: async (root, args, context, info) => {
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
    ratings: async (result) => {
        // please write your code here
        return result;
    },
    count_ratings: async (result) => {
        // please write your code here
        return result;
    },
    rating: async (result) => {
        // please write your code here
        return result;
    },
    aggregate_ratings: async (result) => {
        // please write your code here
        return result;
    }
};
const MutationPreMiddleware = {
    create_rating: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    update_rating: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    delete_rating: async (root, args, context, info) => {
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
    create_rating: async (result) => {
        // please write your code here
        return result;
    },
    update_rating: async (result) => {
        // please write your code here
        return result;
    },
    delete_rating: async (result) => {
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