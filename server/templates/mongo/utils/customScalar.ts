import lodash from 'lodash';
import Error from '../../../libs/errors';
import { GraphQLScalarType } from 'graphql';
import { Types } from 'mongoose';

const { ObjectId } = Types;
const { GRAPHQL_VALIDATION_FAILED } = Error;

function validateDBRef(value: any) {
  if (!value || typeof value !== 'object') {
    throw GRAPHQL_VALIDATION_FAILED('Invalid DbRef');
  }
  const keys = Object.keys(value);
  const DbRefSet = new Set(['$id', '$ref']);

  if (!lodash.isEqual(keys, DbRefSet)) {
    throw GRAPHQL_VALIDATION_FAILED('DbRef should only have $id and $ref');
  }

  if (!value.$id || !value.$ref) {
    throw GRAPHQL_VALIDATION_FAILED('DbRef must have $id and $ref');
  }

  if (!ObjectId.isValid(value.$id)) {
    throw GRAPHQL_VALIDATION_FAILED('DbRef must have a valid Object ID');
  }

  if (typeof value.$ref !== 'string') {
    throw GRAPHQL_VALIDATION_FAILED('DbRef must have a valid reference collection name');
  }

  return value;
}
function validateDomainId(value: any) {
  if (!value || typeof value !== 'string') {
    throw GRAPHQL_VALIDATION_FAILED('Invalid DomainId');
  }
  if (value.length < 7) {
    throw GRAPHQL_VALIDATION_FAILED('Invalid DomainId');
  }
  return value;
}

function validateMap(value: any) {
  try {
    value = JSON.parse(JSON.stringify(value));
  } catch (error) {
    throw GRAPHQL_VALIDATION_FAILED('Invalid JSON value');
  }
  return value;
}

function validateDecimal128(value: any) {
  if (isNaN(value)) {
    throw GRAPHQL_VALIDATION_FAILED('Invalid value');
  }
  const max = 1e6144;
  const min = -1e6143;
  if (value > max || value < min) {
    throw GRAPHQL_VALIDATION_FAILED('Value is out of range for Decimal128');
  }
  return value;
}

function validateBuffer(value: any) {
  if (typeof value === 'string') {
    return Buffer.from(value);
  } else if (Buffer.isBuffer(value)) {
    return value;
  } else {
    throw GRAPHQL_VALIDATION_FAILED('Expected a string or buffer');
  }
}
function defaultSerialize(value: any) {
  return value;
}

const customScalarResolvers = {
  Buffer: new GraphQLScalarType({
    name: 'Buffer',
    description: 'A scalar type representing a binary string',
    serialize: validateBuffer,
    parseValue: validateBuffer,
    parseLiteral(ast: any) {
      if (ast.kind === 'StringValue') {
        return Buffer.from(ast.value);
      } else {
        throw GRAPHQL_VALIDATION_FAILED('Expected a string literal');
      }
    },
  }),
  Decimal128: new GraphQLScalarType({
    name: 'Decimal128',
    description: 'A scalar type representing Decimal128 values.',
    serialize: defaultSerialize,
    parseValue: validateDecimal128,
    parseLiteral(ast: any) {
      return parseFloat(ast.value);
    },
  }),
  Map: new GraphQLScalarType({
    name: 'Map',
    description: 'A scalar type representing Map. You have to input JSON for Map',
    serialize: defaultSerialize,
    parseValue: validateMap,
    parseLiteral(ast: any) {
      return ast.value;
    },
  }),
  Mixed: new GraphQLScalarType({
    name: 'Mixed',
    description: 'A scalar type representing Mixed values',
    serialize: defaultSerialize,
    parseValue(value: any) {
      if (!value) {
        throw GRAPHQL_VALIDATION_FAILED('Invalid value');
      }
      return value;
    },
    parseLiteral(ast: any) {
      return ast.value;
    },
  }),
  DomainId: new GraphQLScalarType({
    name: 'DomainId',
    description: 'A scalar type representing a DomainId, which should be alphaNumeric and of minimum length 7',
    serialize: defaultSerialize,
    parseValue: validateDomainId,
    parseLiteral(ast: any) {
      const value = ast.value;
      return value.toString();
    },
  }),
  DbRef: new GraphQLScalarType({
    name: 'DbRef',
    description: 'A scalar type for representing Mongo DbRef',
    serialize(value: any) {
      if (!value || typeof value !== 'object') {
        throw GRAPHQL_VALIDATION_FAILED('Invalid DbRef');
      }
      return value;
    },
    parseValue: validateDBRef,
    parseLiteral(ast: any) {
      return ast.value;
    },
  }),
};
const customScalarTypeDefs = Object.keys(customScalarResolvers)
  .map((e) => `scalar ${e}`)
  .join('\n');

export { customScalarResolvers, customScalarTypeDefs };
