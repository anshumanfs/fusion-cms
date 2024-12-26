import { describe, test, expect } from '@jest/globals';
import { generateMySqlSchema } from '../../dbModels';
import appJson from './app.test.json';

describe('Testing dbModels translation', () => {
  test('1. Testing simple schema translation', () => {
    // test 1
    const jsonSchema1: MySQLSchemaInput = {
      username: {
        type: 'STRING(10)',
        required: true,
        isUnique: true,
      },
      firstName: {
        type: 'STRING(10)',
        required: true,
      },
      lastName: {
        type: 'STRING(10)',
        required: true,
      },
      email: {
        type: 'STRING(10)',
        required: true,
        isUnique: true,
      },
    };
    const expctedOutput1 = `
    const conn = require('../db.js');
    const { DataTypes } = require('sequelize');
    const sequelize = require('../db.js');
    const {
      addEnums,
      index,
      unique,
      addDefaultValue,
      primaryKey,
      ObjArray,
      autoIncrement,
      Nullable,
      Types,
      Optional
    } = require('../utils/schemaHelper');
    const usersSchema = sequelize.define('users', {
      username: unique({
        type: DataTypes.STRING(10)
      }),
      firstName:{
        type: DataTypes.STRING(10)
      },
      lastName: {
        type: DataTypes.STRING(10)
      },
      email:unique({
        type: DataTypes.STRING(10)
      }),
    },
    {
    tableName : 'user',
    timestamps: false
    });usersSchema.sync();module.exports=usersSchema;`.replace(/[\n\s]/g, '');

    expect(generateMySqlSchema('user', 'users', jsonSchema1, appJson).replace(/[\n\s]/g, '')).toEqual(expctedOutput1);
  });
  test('2. Testing composite index', () => {
    // test 2
    const jsonSchema2: MySQLSchemaInput = {
      userId: {
        type: 'INTEGER',
        required: true,
        isUnique: 'compositeIndex',
      },
      username: {
        type: 'STRING(10)',
        required: true,
        isUnique: 'compositeIndex',
      },
      firstName: {
        type: 'STRING(10)',
        required: true,
      },
      lastName: {
        type: 'STRING(10)',
        required: true,
      },
      email: {
        type: 'STRING(10)',
        required: true,
        isUnique: true,
      },
    };

    const expctedOutput2 = `
        const conn = require('../db.js');
        const { DataTypes } = require('sequelize');
        const sequelize = require('../db.js');
        const {
          addEnums,
          index,
          unique,
          addDefaultValue,
          primaryKey,
          ObjArray,
          autoIncrement,
          Nullable,
          Types,
          Optional
        } = require('../utils/schemaHelper');
        const usersSchema = sequelize.define('users', {
          userId: unique({
              type: DataTypes.INTEGER
          },true),
          username: unique({
            type: DataTypes.STRING(10)
          },true),
          firstName:{
            type: DataTypes.STRING(10)
          },
          lastName: {
            type: DataTypes.STRING(10)
          },
          email:unique({
            type: DataTypes.STRING(10)
          }),
        },
        {
        tableName : 'user',
        timestamps: false
        });usersSchema.sync();module.exports=usersSchema;`.replace(/[\n\s]/g, '');

    expect(generateMySqlSchema('user', 'users', jsonSchema2, appJson).replace(/[\n\s]/g, '')).toEqual(expctedOutput2);
  });
  test('3. Testing Relations', () => {
    const jsonSchema: MySQLSchemaInput = {
      userId: {
        type: 'INTEGER',
        required: true,
        isUnique: 'compositeIndex',
      },
      username: {
        type: 'STRING(10)',
        required: true,
        isUnique: 'compositeIndex',
      },
      firstName: {
        type: 'STRING(10)',
        required: true,
      },
      lastName: {
        type: 'STRING(10)',
        required: true,
      },
      email: {
        type: 'STRING(10)',
        required: true,
        isUnique: true,
      },
      courseId: {
        type: 'INTEGER',
        required: false,
        isIndex: true,
        ref: {
          to: 'customer',
          type: 'hasMany',
          options: {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            foreignKey: 'courseId',
          },
        },
      },
    };

    const expctedOutput = `
          const conn = require('../db.js');
          const { DataTypes } = require('sequelize');
          const sequelize = require('../db.js');
          const {
            addEnums,
            index,
            unique,
            addDefaultValue,
            primaryKey,
            ObjArray,
            autoIncrement,
            Nullable,
            Types,
            Optional
          } = require('../utils/schemaHelper');
          const customersSchema = require('./customers.js');
          const usersSchema = sequelize.define('users', {
            userId: unique({
                type: DataTypes.INTEGER
            },true),
            username: unique({
              type: DataTypes.STRING(10)
            },true),
            firstName:{
              type: DataTypes.STRING(10)
            },
            lastName: {
              type: DataTypes.STRING(10)
            },
            email:unique({
              type: DataTypes.STRING(10)
            }),
            courseId:index(Optional({
              type: DataTypes.INTEGER
            })),
          },
          {
            tableName : 'user',
            timestamps: false
          });
          usersSchema.hasMany(customersSchema, {
            "onDelete":"CASCADE",
            "onUpdate":"CASCADE",
            "foreignKey":"courseId"
          });
          usersSchema.sync();
          module.exports=usersSchema;`.replace(/[\n\s]/g, '');

    expect(generateMySqlSchema('user', 'users', jsonSchema, appJson).replace(/[\n\s]/g, '')).toEqual(expctedOutput);
  });
});
