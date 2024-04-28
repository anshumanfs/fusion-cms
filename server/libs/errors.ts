import { GraphQLError } from 'graphql';

const Error = {
  BAD_REQUEST: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'BAD_REQUEST',
        http: {
          status: 400,
        },
      },
    });
  },
  UNAUTHORIZED: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'UNAUTHORIZED',
        http: { status: 401 },
      },
    });
  },
  FORBIDDEN: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'FORBIDDEN',
        http: { status: 403 },
      },
    });
  },
  NOT_FOUND: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'NOT_FOUND',
        http: { status: 404 },
      },
    });
  },
  METHOD_NOT_ALLOWED: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'METHOD_NOT_ALLOWED',
        http: { status: 405 },
      },
    });
  },
  NOT_ACCEPTABLE: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'NOT_ACCEPTABLE',
        http: { status: 406 },
      },
    });
  },
  PROXY_AUTHENTICATION_REQUIRED: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'PROXY_AUTHENTICATION_REQUIRED',
        http: { status: 407 },
      },
    });
  },
  REQUEST_TIMEOUT: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'REQUEST_TIMEOUT',
        http: { status: 408 },
      },
    });
  },
  CONFLICT: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'CONFLICT',
        http: { status: 409 },
      },
    });
  },
  GONE: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'GONE',
        http: { status: 410 },
      },
    });
  },
  LENGTH_REQUIRED: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'LENGTH_REQUIRED',
        http: { status: 411 },
      },
    });
  },
  INTERNAL_SERVER_ERROR: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        http: { status: 500 },
      },
    });
  },
  NOT_IMPLEMENTED: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'NOT_IMPLEMENTED',
        http: { status: 501 },
      },
    });
  },
  BAD_GATEWAY: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'BAD_GATEWAY',
        http: { status: 502 },
      },
    });
  },
  SERVICE_UNAVAILABLE: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'SERVICE_UNAVAILABLE',
        http: { status: 503 },
      },
    });
  },
  GATEWAY_TIMEOUT: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'GATEWAY_TIMEOUT',
        http: { status: 504 },
      },
    });
  },
  HTTP_VERSION_NOT_SUPPORTED: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'HTTP_VERSION_NOT_SUPPORTED',
        http: { status: 505 },
      },
    });
  },
  VARIANT_ALSO_NEGOTIATES: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'VARIANT_ALSO_NEGOTIATES',
        http: { status: 506 },
      },
    });
  },
  INSUFFICIENT_STORAGE: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'INSUFFICIENT_STORAGE',
        http: { status: 507 },
      },
    });
  },
  LOOP_DETECTED: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'LOOP_DETECTED',
        http: { status: 508 },
      },
    });
  },
  BANDWIDTH_LIMIT_EXCEEDED: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'BANDWIDTH_LIMIT_EXCEEDED',
        http: { status: 509 },
      },
    });
  },
  NOT_EXTENDED: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'NOT_EXTENDED',
        http: { status: 510 },
      },
    });
  },
  NETWORK_AUTHENTICATION_REQUIRED: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'NETWORK_AUTHENTICATION_REQUIRED',
        http: { status: 511 },
      },
    });
  },
  NETWORK_CONNECT_TIMEOUT_ERROR: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'NETWORK_CONNECT_TIMEOUT_ERROR',
        http: { status: 599 },
      },
    });
  },
  GRAPHQL_VALIDATION_FAILED: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'GRAPHQL_VALIDATION_FAILED',
        http: { status: 400 },
      },
    });
  },
  GRAPHQL_PARSE_FAILED: (message: string) => {
    return new GraphQLError(message, {
      extensions: {
        code: 'GRAPHQL_PARSE_FAILED',
        http: { status: 400 },
      },
    });
  },
};

export default Error;
