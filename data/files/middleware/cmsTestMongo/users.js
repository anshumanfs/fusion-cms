const QueryPreMiddleware = {
    users: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    count_users: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    user: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    aggregate_users: async (root, args, context, info) => {
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
    users: async (result) => {
        // please write your code here
        return result;
    },
    count_users: async (result) => {
        // please write your code here
        return result;
    },
    user: async (result) => {
        // please write your code here
        return result;
    },
    aggregate_users: async (result) => {
        // please write your code here
        return result;
    }
};
const MutationPreMiddleware = {
    create_user: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    update_user: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    delete_user: async (root, args, context, info) => {
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
    create_user: async (result) => {
        // please write your code here
        return result;
    },
    update_user: async (result) => {
        // please write your code here
        return result;
    },
    delete_user: async (result) => {
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