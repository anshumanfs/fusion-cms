import lodash from 'lodash';
import { DataTypes } from 'sequelize';

const Nullable = {
  /**
   *
   * @param {object} Object Array of objects
   * @return {object} Returns schema for Nullable array
   */
  ObjArray: (Object: any) => {
    const obj = lodash.cloneDeep(Object);
    obj.defaultValue = [];
    obj.allowNull = true;
    return obj;
  },

  /**
   *
   * @param {object} Object Types Object
   * @return {object} Sequelize schema for Nullable Types
   */
  Types: (Object: any) => {
    const obj = lodash.cloneDeep(Object);
    obj.defaultValue = null;
    obj.allowNull = true;
    return obj;
  },
};

const addDefaultValue = (obj: any, defaultValue: any) => {
  const Obj = lodash.cloneDeep(obj);
  Obj.defaultValue = defaultValue;
  return Obj;
};
const addEnums = (obj: any, enums: any) => {
  return {
    type: DataTypes.ENUM(enums),
    allowNull: false,
  };
};
const primaryKey = (obj: any) => {
  const Obj = lodash.cloneDeep(obj);
  Obj.primaryKey = true;
  return Obj;
};

const autoIncrement = (obj: any) => {
  const Obj = lodash.cloneDeep(obj);
  Obj.autoIncrement = true;
  return Obj;
};

const Optional = (obj: any) => {
  const Obj = lodash.cloneDeep(obj);
  Obj.defaultValue = null;
  return Obj;
};

const unique = (obj: any) => {
  const Obj = lodash.cloneDeep(obj);
  Obj.unique = true;
  return Obj;
};

/**
 * Adds a setter method to an object.
 *
 * @param {any} obj - The object to add the setter method to.
 * @param {any} setter - The setter function to be called when the setter method is invoked.
 * @return {object} - The modified object with the setter method.
 */
const addSetter = (obj: any, setter: any) => {
  return {
    ...obj,
    set(value: any) {
      return setter(value);
    },
  };
};

/**
 * Adds a getter method to an object.
 *
 * @param {any} obj - The object to add the getter method to.
 * @param {string} propertyName - The name of the property to get.
 * @param {any} getter - The getter function to apply to the property value.
 * @return {object} - The updated object with the getter method.
 */
const addGetter = (obj: any, propertyName: string, getter: any) => {
  return {
    ...obj,
    get() {
      const value = this.getDataValue(propertyName);
      return getter(value);
    },
  };
};

/**
 *
 * @param {object} Object
 * @return {object} Sequelize Schema for Array of Objects
 */

function ObjArray(Obj: any) {
  const obj = lodash.cloneDeep(Obj);
  obj.type = DataTypes.ARRAY(obj.type);
  return obj;
}
const Types = {
  ARRAY: {
    allowNull: false,
    type: DataTypes.ARRAY,
  },
  BIGINT: {
    allowNull: false,
    type: DataTypes.BIGINT,
  },
  BOOLEAN: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
  },
  CHAR: {
    allowNull: false,
    type: DataTypes.CHAR,
  },
  CIDR: {
    allowNull: false,
    type: DataTypes.CIDR,
  },
  CITEXT: {
    allowNull: false,
    type: DataTypes.CITEXT,
  },
  DATE: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  DATEONLY: {
    allowNull: false,
    type: DataTypes.DATEONLY,
  },
  DECIMAL: {
    allowNull: false,
    type: DataTypes.DECIMAL,
  },
  DOUBLE: {
    allowNull: false,
    type: DataTypes.DOUBLE,
  },
  ENUM: {
    allowNull: false,
    type: DataTypes.ENUM,
  },
  FLOAT: {
    allowNull: false,
    type: DataTypes.FLOAT,
  },
  GEOGRAPHY: {
    allowNull: false,
    type: DataTypes.GEOGRAPHY,
  },
  GEOMETRY: {
    allowNull: false,
    type: DataTypes.GEOMETRY,
  },
  HSTORE: {
    allowNull: false,
    type: DataTypes.HSTORE,
  },
  INET: {
    allowNull: false,
    type: DataTypes.INET,
  },
  INTEGER: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  JSONB: {
    allowNull: false,
    type: DataTypes.JSONB,
  },
  JSON: {
    allowNull: false,
    type: DataTypes.JSON,
  },
  MACADDR: {
    allowNull: false,
    type: DataTypes.MACADDR,
  },
  MEDIUMINT: {
    allowNull: false,
    type: DataTypes.MEDIUMINT,
  },
  NOW: {
    allowNull: false,
    type: DataTypes.NOW,
  },
  NUMBER: {
    allowNull: false,
    type: DataTypes.NUMBER,
  },
  RANGE: {
    allowNull: false,
    type: DataTypes.RANGE,
  },
  REAL: {
    allowNull: false,
    type: DataTypes.REAL,
  },
  SMALLINT: {
    allowNull: false,
    type: DataTypes.SMALLINT,
  },
  STRING: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  TEXT: {
    allowNull: false,
    type: DataTypes.TEXT,
  },
  TIME: {
    allowNull: false,
    type: DataTypes.TIME,
  },
  TINYINT: {
    allowNull: false,
    type: DataTypes.TINYINT,
  },
  TSVECTOR: {
    allowNull: false,
    type: DataTypes.TSVECTOR,
  },
  UUID: {
    allowNull: false,
    type: DataTypes.UUID,
  },
  UUIDV1: {
    allowNull: false,
    type: DataTypes.UUIDV1,
  },
  UUIDV4: {
    allowNull: false,
    type: DataTypes.UUIDV4,
  },
  VIRTUAL: {
    allowNull: false,
    type: DataTypes.VIRTUAL,
  },
};

module.exports = {
  addEnums,
  addGetter,
  addSetter,
  unique,
  addDefaultValue,
  primaryKey,
  ObjArray,
  Optional,
  autoIncrement,
  Nullable,
  Types,
};
