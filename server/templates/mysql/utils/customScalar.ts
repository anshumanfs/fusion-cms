import { GraphQLScalarType } from 'graphql';
import Errors from '../../../libs/errors';
import { DataTypes } from 'sequelize';

const { BAD_REQUEST, GRAPHQL_PARSE_FAILED } = Errors;
const ARRAY: any = new DataTypes.ARRAY();
const BIGINT: any = new DataTypes.BIGINT();
const BOOLEAN: any = new DataTypes.BOOLEAN();
const CHAR: any = new DataTypes.CHAR();
const CIDR: any = new DataTypes.CIDR();
const CITEXT: any = new DataTypes.CITEXT();
const DATE: any = new DataTypes.DATE();
const DATEONLY: any = new DataTypes.DATEONLY();
const DECIMAL: any = new DataTypes.DECIMAL();
const DOUBLE: any = new DataTypes.DOUBLE();
const ENUM: any = new DataTypes.ENUM();
const FLOAT: any = new DataTypes.FLOAT();
const GEOGRAPHY: any = new DataTypes.GEOGRAPHY();
const GEOMETRY: any = new DataTypes.GEOMETRY();
const HSTORE: any = new DataTypes.HSTORE();
const INET: any = new DataTypes.INET();
const INTEGER: any = new DataTypes.INTEGER();
const JSONB: any = new DataTypes.JSONB();
const JSON: any = new DataTypes.JSON();
const MACADDR: any = new DataTypes.MACADDR();
const MEDIUMINT: any = new DataTypes.MEDIUMINT();
const NOW: any = new DataTypes.NOW();
const NUMBER: any = new DataTypes.NUMBER();
const RANGE: any = new DataTypes.RANGE();
const REAL: any = new DataTypes.REAL();
const SMALLINT: any = new DataTypes.SMALLINT();
const STRING: any = new DataTypes.STRING();
const TEXT: any = new DataTypes.TEXT();
const TIME: any = new DataTypes.TIME();
const TINYINT: any = new DataTypes.TINYINT();
const TSVECTOR: any = new DataTypes.TSVECTOR();
const UUID: any = new DataTypes.UUID();
const UUIDV1: any = new DataTypes.UUIDV1();
const UUIDV4: any = new DataTypes.UUIDV4();
const VIRTUAL: any = new DataTypes.VIRTUAL();

const customScalarResolvers = {
  ARRAY: new GraphQLScalarType({
    name: 'ARRAY',
    description: 'Scalar Representing MySQL data type ARRAY',
    serialize(value: any) {
      try {
        if (ARRAY.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type ARRAY');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type ARRAY');
      }
    },
    parseValue(value: any) {
      try {
        if (ARRAY.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type ARRAY');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type ARRAY');
      }
    },
  }),
  BIGINT: new GraphQLScalarType({
    name: 'BIGINT',
    description: 'Scalar Representing MySQL data type BIGINT',
    serialize(value: any) {
      try {
        if (BIGINT.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type BIGINT');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type BIGINT');
      }
    },
    parseValue(value: any) {
      try {
        if (BIGINT.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type BIGINT');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type BIGINT');
      }
    },
  }),
  BOOLEAN: new GraphQLScalarType({
    name: 'BOOLEAN',
    description: 'Scalar Representing MySQL data type BOOLEAN',
    serialize(value: any) {
      try {
        if (BOOLEAN.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type BOOLEAN');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type BOOLEAN');
      }
    },
    parseValue(value: any) {
      try {
        if (BOOLEAN.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type BOOLEAN');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type BOOLEAN');
      }
    },
  }),
  CHAR: new GraphQLScalarType({
    name: 'CHAR',
    description: 'Scalar Representing MySQL data type CHAR',
    serialize(value: any) {
      try {
        if (CHAR.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type CHAR');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type CHAR');
      }
    },
    parseValue(value: any) {
      try {
        if (CHAR.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type CHAR');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type CHAR');
      }
    },
  }),
  CIDR: new GraphQLScalarType({
    name: 'CIDR',
    description: 'Scalar Representing MySQL data type CIDR',
    serialize(value: any) {
      try {
        if (CIDR.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type CIDR');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type CIDR');
      }
    },
    parseValue(value: any) {
      try {
        if (CIDR.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type CIDR');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type CIDR');
      }
    },
  }),
  CITEXT: new GraphQLScalarType({
    name: 'CITEXT',
    description: 'Scalar Representing MySQL data type CITEXT',
    serialize(value: any) {
      try {
        if (CITEXT.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type CITEXT');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type CITEXT');
      }
    },
    parseValue(value: any) {
      try {
        if (CITEXT.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type CITEXT');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type CITEXT');
      }
    },
  }),
  DATE: new GraphQLScalarType({
    name: 'DATE',
    description: 'Scalar Representing MySQL data type DATE',
    serialize(value: any) {
      try {
        if (DATE.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type DATE');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type DATE');
      }
    },
    parseValue(value: any) {
      try {
        if (DATE.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type DATE');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type DATE');
      }
    },
  }),
  DATEONLY: new GraphQLScalarType({
    name: 'DATEONLY',
    description: 'Scalar Representing MySQL data type DATEONLY',
    serialize(value: any) {
      try {
        if (DATEONLY.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type DATEONLY');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type DATEONLY');
      }
    },
    parseValue(value: any) {
      try {
        if (DATEONLY.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type DATEONLY');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type DATEONLY');
      }
    },
  }),
  DECIMAL: new GraphQLScalarType({
    name: 'DECIMAL',
    description: 'Scalar Representing MySQL data type DECIMAL',
    serialize(value: any) {
      try {
        if (DECIMAL.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type DECIMAL');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type DECIMAL');
      }
    },
    parseValue(value: any) {
      try {
        if (DECIMAL.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type DECIMAL');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type DECIMAL');
      }
    },
  }),
  DOUBLE: new GraphQLScalarType({
    name: 'DOUBLE',
    description: 'Scalar Representing MySQL data type DOUBLE',
    serialize(value: any) {
      try {
        if (DOUBLE.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type DOUBLE');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type DOUBLE');
      }
    },
    parseValue(value: any) {
      try {
        if (DOUBLE.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type DOUBLE');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type DOUBLE');
      }
    },
  }),
  ENUM: new GraphQLScalarType({
    name: 'ENUM',
    description: 'Scalar Representing MySQL data type ENUM',
    serialize(value: any) {
      try {
        if (ENUM.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type ENUM');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type ENUM');
      }
    },
    parseValue(value: any) {
      try {
        if (ENUM.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type ENUM');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type ENUM');
      }
    },
  }),
  FLOAT: new GraphQLScalarType({
    name: 'FLOAT',
    description: 'Scalar Representing MySQL data type FLOAT',
    serialize(value: any) {
      try {
        if (FLOAT.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type FLOAT');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type FLOAT');
      }
    },
    parseValue(value: any) {
      try {
        if (FLOAT.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type FLOAT');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type FLOAT');
      }
    },
  }),
  GEOGRAPHY: new GraphQLScalarType({
    name: 'GEOGRAPHY',
    description: 'Scalar Representing MySQL data type GEOGRAPHY',
    serialize(value: any) {
      try {
        if (GEOGRAPHY.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type GEOGRAPHY');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type GEOGRAPHY');
      }
    },
    parseValue(value: any) {
      try {
        if (GEOGRAPHY.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type GEOGRAPHY');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type GEOGRAPHY');
      }
    },
  }),
  GEOMETRY: new GraphQLScalarType({
    name: 'GEOMETRY',
    description: 'Scalar Representing MySQL data type GEOMETRY',
    serialize(value: any) {
      try {
        if (GEOMETRY.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type GEOMETRY');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type GEOMETRY');
      }
    },
    parseValue(value: any) {
      try {
        if (GEOMETRY.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type GEOMETRY');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type GEOMETRY');
      }
    },
  }),
  HSTORE: new GraphQLScalarType({
    name: 'HSTORE',
    description: 'Scalar Representing MySQL data type HSTORE',
    serialize(value: any) {
      try {
        if (HSTORE.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type HSTORE');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type HSTORE');
      }
    },
    parseValue(value: any) {
      try {
        if (HSTORE.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type HSTORE');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type HSTORE');
      }
    },
  }),
  INET: new GraphQLScalarType({
    name: 'INET',
    description: 'Scalar Representing MySQL data type INET',
    serialize(value: any) {
      try {
        if (INET.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type INET');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type INET');
      }
    },
    parseValue(value: any) {
      try {
        if (INET.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type INET');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type INET');
      }
    },
  }),
  INTEGER: new GraphQLScalarType({
    name: 'INTEGER',
    description: 'Scalar Representing MySQL data type INTEGER',
    serialize(value: any) {
      try {
        if (INTEGER.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type INTEGER');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type INTEGER');
      }
    },
    parseValue(value: any) {
      try {
        if (INTEGER.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type INTEGER');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type INTEGER');
      }
    },
  }),
  JSON: new GraphQLScalarType({
    name: 'JSON',
    description: 'Scalar Representing MySQL data type JSON',
    serialize(value: any) {
      try {
        if (JSON.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type JSON');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type JSON');
      }
    },
    parseValue(value: any) {
      try {
        if (JSON.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type JSON');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type JSON');
      }
    },
  }),
  JSONB: new GraphQLScalarType({
    name: 'JSONB',
    description: 'Scalar Representing MySQL data type JSONB',
    serialize(value: any) {
      try {
        if (JSONB.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type JSONB');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type JSONB');
      }
    },
    parseValue(value: any) {
      try {
        if (JSONB.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type JSONB');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type JSONB');
      }
    },
  }),
  MACADDR: new GraphQLScalarType({
    name: 'MACADDR',
    description: 'Scalar Representing MySQL data type MACADDR',
    serialize(value: any) {
      try {
        if (MACADDR.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type MACADDR');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type MACADDR');
      }
    },
    parseValue(value: any) {
      try {
        if (MACADDR.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type MACADDR');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type MACADDR');
      }
    },
  }),
  MEDIUMINT: new GraphQLScalarType({
    name: 'MEDIUMINT',
    description: 'Scalar Representing MySQL data type MEDIUMINT',
    serialize(value: any) {
      try {
        if (MEDIUMINT.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type MEDIUMINT');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type MEDIUMINT');
      }
    },
    parseValue(value: any) {
      try {
        if (MEDIUMINT.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type MEDIUMINT');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type MEDIUMINT');
      }
    },
  }),
  NOW: new GraphQLScalarType({
    name: 'NOW',
    description: 'Scalar Representing MySQL data type NOW',
    serialize(value: any) {
      try {
        if (NOW.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type NOW');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type NOW');
      }
    },
    parseValue(value: any) {
      try {
        if (NOW.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type NOW');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type NOW');
      }
    },
  }),
  NUMBER: new GraphQLScalarType({
    name: 'NUMBER',
    description: 'Scalar Representing MySQL data type NUMBER',
    serialize(value: any) {
      try {
        if (NUMBER.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type NUMBER');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type NUMBER');
      }
    },
    parseValue(value: any) {
      try {
        if (NUMBER.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type NUMBER');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type NUMBER');
      }
    },
  }),
  RANGE: new GraphQLScalarType({
    name: 'RANGE',
    description: 'Scalar Representing MySQL data type RANGE',
    serialize(value: any) {
      try {
        if (RANGE.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type RANGE');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type RANGE');
      }
    },
    parseValue(value: any) {
      try {
        if (RANGE.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type RANGE');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type RANGE');
      }
    },
  }),
  REAL: new GraphQLScalarType({
    name: 'REAL',
    description: 'Scalar Representing MySQL data type REAL',
    serialize(value: any) {
      try {
        if (REAL.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type REAL');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type REAL');
      }
    },
    parseValue(value: any) {
      try {
        if (REAL.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type REAL');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type REAL');
      }
    },
  }),
  SMALLINT: new GraphQLScalarType({
    name: 'SMALLINT',
    description: 'Scalar Representing MySQL data type SMALLINT',
    serialize(value: any) {
      try {
        if (SMALLINT.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type SMALLINT');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type SMALLINT');
      }
    },
    parseValue(value: any) {
      try {
        if (SMALLINT.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type SMALLINT');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type SMALLINT');
      }
    },
  }),
  STRING: new GraphQLScalarType({
    name: 'STRING',
    description: 'Scalar Representing MySQL data type STRING',
    serialize(value: any) {
      try {
        if (STRING.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type STRING');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type STRING');
      }
    },
    parseValue(value: any) {
      try {
        if (STRING.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type STRING');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type STRING');
      }
    },
  }),
  TEXT: new GraphQLScalarType({
    name: 'TEXT',
    description: 'Scalar Representing MySQL data type TEXT',
    serialize(value: any) {
      try {
        if (TEXT.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type TEXT');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type TEXT');
      }
    },
    parseValue(value: any) {
      try {
        if (TEXT.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type TEXT');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type TEXT');
      }
    },
  }),
  TIME: new GraphQLScalarType({
    name: 'TIME',
    description: 'Scalar Representing MySQL data type TIME',
    serialize(value: any) {
      try {
        if (TIME.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type TIME');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type TIME');
      }
    },
    parseValue(value: any) {
      try {
        if (TIME.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type TIME');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type TIME');
      }
    },
  }),
  TINYINT: new GraphQLScalarType({
    name: 'TINYINT',
    description: 'Scalar Representing MySQL data type TINYINT',
    serialize(value: any) {
      try {
        if (TINYINT.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type TINYINT');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type TINYINT');
      }
    },
    parseValue(value: any) {
      try {
        if (TINYINT.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type TINYINT');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type TINYINT');
      }
    },
  }),
  TSVECTOR: new GraphQLScalarType({
    name: 'TSVECTOR',
    description: 'Scalar Representing MySQL data type TSVECTOR',
    serialize(value: any) {
      try {
        if (TSVECTOR.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type TSVECTOR');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type TSVECTOR');
      }
    },
    parseValue(value: any) {
      try {
        if (TSVECTOR.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type TSVECTOR');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type TSVECTOR');
      }
    },
  }),
  UUID: new GraphQLScalarType({
    name: 'UUID',
    description: 'Scalar Representing MySQL data type UUID',
    serialize(value: any) {
      try {
        if (UUID.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type UUID');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type UUID');
      }
    },
    parseValue(value: any) {
      try {
        if (UUID.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type UUID');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type UUID');
      }
    },
  }),
  UUIDV1: new GraphQLScalarType({
    name: 'UUIDV1',
    description: 'Custom Scalar Representing MySQL data type UUIDV1',
    serialize(value: any) {
      try {
        if (UUIDV1.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type UUIDV1');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type UUIDV1');
      }
    },
    parseValue(value: any) {
      try {
        if (UUIDV1.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type UUIDV1');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type UUIDV1');
      }
    },
  }),
  UUIDV4: new GraphQLScalarType({
    name: 'UUIDV4',
    description: 'Scalar Representing MySQL data type UUIDV4',
    serialize(value: any) {
      try {
        if (UUIDV4.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type UUIDV4');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type UUIDV4');
      }
    },
    parseValue(value: any) {
      try {
        if (UUIDV4.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type UUIDV4');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type UUIDV4');
      }
    },
  }),
  VIRTUAL: new GraphQLScalarType({
    name: 'VIRTUAL',
    description: 'Scalar Representing MySQL data type VIRTUAL',
    serialize(value: any) {
      try {
        if (VIRTUAL.validate(value)) {
          return value;
        } else {
          throw GRAPHQL_PARSE_FAILED('Must be of type VIRTUAL');
        }
      } catch (error) {
        throw GRAPHQL_PARSE_FAILED('Must be of type VIRTUAL');
      }
    },
    parseValue(value: any) {
      try {
        if (VIRTUAL.validate(value)) {
          return value;
        } else {
          throw BAD_REQUEST('Must be of type VIRTUAL');
        }
      } catch (error) {
        throw BAD_REQUEST('Must be of type VIRTUAL');
      }
    },
  }),
};

const customScalarTypeDefs = Object.keys(customScalarResolvers)
  .map((e) => `scalar ${e}`)
  .join('\n');

export { customScalarResolvers, customScalarTypeDefs };
