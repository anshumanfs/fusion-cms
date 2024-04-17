const QueryPreMiddleware = {
    cms_tests: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    count_cms_tests: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    cms_test: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    aggregate_cms_tests: async (root, args, context, info) => {
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
    cms_tests: async (result) => {
        // please write your code here
        return result;
    },
    count_cms_tests: async (result) => {
        // please write your code here
        return result;
    },
    cms_test: async (result) => {
        // please write your code here
        return result;
    },
    aggregate_cms_tests: async (result) => {
        // please write your code here
        return result;
    }
};
const MutationPreMiddleware = {
    create_cms_test: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    update_cms_test: async (root, args, context, info) => {
        // please write your code here
        return {
            root,
            args,
            context,
            info
        };
    },
    delete_cms_test: async (root, args, context, info) => {
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
    create_cms_test: async (result) => {
        // please write your code here
        return result;
    },
    update_cms_test: async (result) => {
        // please write your code here
        return result;
    },
    delete_cms_test: async (result) => {
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