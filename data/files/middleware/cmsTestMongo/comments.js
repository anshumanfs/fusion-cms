const QueryPreMiddleware = {
    comments: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    count_comments: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    comment: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    aggregate_comments: async (root, args, context, info) => {
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
    comments: async (result) => {
        // please write your code here
        return result;
    },
    count_comments: async (result) => {
        // please write your code here
        return result;
    },
    comment: async (result) => {
        // please write your code here
        return result;
    },
    aggregate_comments: async (result) => {
        // please write your code here
        return result;
    }
};
const MutationPreMiddleware = {
    create_comment: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    update_comment: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    delete_comment: async (root, args, context, info) => {
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
    create_comment: async (result) => {
        // please write your code here
        return result;
    },
    update_comment: async (result) => {
        // please write your code here
        return result;
    },
    delete_comment: async (result) => {
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