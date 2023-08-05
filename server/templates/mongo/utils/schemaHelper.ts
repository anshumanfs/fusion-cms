import mongoose from 'mongoose';
import lodash from 'lodash';
import { randomUUID } from 'crypto';

const schemaTypes = mongoose.SchemaTypes;
const Nullable = {
  /**
   *
   * @param {object} object Array of objects
   * @return {object} Returns schema for Nullable array
   */
  ObjArray: (object: any) => {
    const obj = lodash.cloneDeep(object);
    obj.default = null;
    obj.required = false;
    return obj;
  },

  /**
   *
   * @param {object} object Types Object
   * @return {object} Mongoose schema for Nullable Types
   */
  Types: (object: any) => {
    const obj = lodash.cloneDeep(object);
    obj.default = null;
    obj.required = false;
    return obj;
  },
};

const defaults = {
  Date: () => new Date().toISOString().split('T')[0],
  DateTime: () => new Date().toISOString(),
  ObjectId: () => new mongoose.mongo.ObjectId(),
  Time: () => new Date().toTimeString().split(' ')[0], // get in HH:mm:ss
  UUID: () => randomUUID(),
};

const setters = {
  Array: (v: any) => Array.from(v),
  Date: (v: any) => new Date(v).toISOString(),
  DateTime: (v: any) => new Date(v).toISOString(),
  Time: (v: any) => {
    const [hours, minutes, seconds] = v.split(':');
    const date = new Date('1970-01-01T00:00:00.000Z');
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    return date;
  },
};

const addEnums = (obj: any, enums: any) => {
  const Obj = lodash.cloneDeep(obj);
  Obj.enum = enums;
  return Obj;
};

const addDefaultValue = (obj: any, defaultValue: any) => {
  const Obj = lodash.cloneDeep(obj);
  switch (defaultValue) {
    case 'CurrentDateTime':
      Obj.default = defaults.DateTime;
      break;
    case 'CurrentDate':
      Obj.default = defaults.Date;
      break;
    case 'CurrentTime':
      Obj.default = defaults.Time;
      break;
    default:
      Obj.default = defaultValue;
      break;
  }
  return Obj;
};

const unique = (obj: any) => {
  const Obj = lodash.cloneDeep(obj);
  Obj.unique = true;
  return Obj;
};

const index = (obj: any) => {
  const Obj = lodash.cloneDeep(obj);
  Obj.index = true;
  return Obj;
};

const sparse = (obj: any) => {
  const Obj = lodash.cloneDeep(obj);
  Obj.sparse = true;
  return Obj;
};

function Optional(obj: any) {
  const Obj = lodash.cloneDeep(obj);
  Obj.required = false;
  return Obj;
}

const addGetter = (obj: any, getter: any) => {
  if (typeof getter !== 'function') {
    throw new Error('Getter should be a function');
  }
  return { ...obj, get: getter };
};

const addSetter = (obj: any, setter: any) => {
  if (typeof setter !== 'function') {
    throw new Error('Setter should be a function');
  }
  return { ...obj, set: setter };
};

function FormatDbRefs(value: any, ref: any) {
  let param;

  if (value === null) {
    param = null;
  }

  if (typeof value === 'string') {
    param = {
      $id: new mongoose.mongo.ObjectId(value),
      $ref: ref,
    };
  }

  if (Array.isArray(value)) {
    param = [];
    value.forEach((e) => {
      if (e) {
        param.push({
          $id: new mongoose.mongo.ObjectId(e),
          $ref: ref,
        });
      }
    });
  }

  if (Object.prototype.toString.call(value) === '[object Object]') {
    param = value;
  }

  return param;
}

/**
 * Formats a given date value into a specific format.
 *
 * @param {string|Date} value - The date value to be formatted. Can be either a string or a Date object.
 * @return {string|null} - The formatted date value. Returns null if the input value is empty or null.
 */
function FormatDate(value: any) {
  let result;
  if (value === '' || value === null) {
    result = null;
  } else {
    try {
      const regex = /^(\d{4})(\d{2})(\d{2})$/;
      let newDate = value;
      if (newDate instanceof Date) {
        result = new Date(newDate).toISOString().slice(0, -5).replace('T', ' ');
      } else {
        if (newDate.match(regex)) {
          newDate = newDate.replace(regex, '$1-$2-$3');
        }
        result = new Date(newDate).toISOString().slice(0, -5).replace('T', ' ');
      }
    } catch (error) {
      throw error;
    }
    const [date, time] = result.split(' ');
    result = date;
    if (time !== '00:00:00') {
      result = `${result} ${time}`;
    }
  }
  return result;
}

const getters = {
  Date: (v: any) => (v == null ? null : new Date(v).toISOString().split('T')[0]),
  DateTime: (v: any) => (v == null ? null : new Date(v).toISOString()),
  Time: (v: any) =>
    v == null
      ? null
      : v.toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric' }),
};

/**
 *
 * @param {object} Obj
 * @return {object} Mongoose Schema for Array of Objects
 */

function ObjArray(Obj: any) {
  const schema: any = {};
  const obj = lodash.cloneDeep(Obj);
  schema.type = [obj.type];
  schema.required = obj.required;
  if (Object.prototype.hasOwnProperty.call(obj, 'set')) {
    schema.set = obj.set;
  }
  if (Object.prototype.hasOwnProperty.call(obj, 'get')) {
    schema.get = obj.get;
  }
  schema.default = [];
  return schema;
}
const Types = Object.freeze({
  Array: () => ({
    required: true,
    set: setters.Array,
    type: schemaTypes.Array,
  }),
  Boolean: () => ({
    required: true,
    type: schemaTypes.Boolean,
  }),
  Buffer: () => ({
    required: true,
    type: schemaTypes.Buffer,
  }),
  Date: () => ({
    get: getters.Date,
    required: true,
    set: setters.Date,
    type: schemaTypes.Date, // have to make it to compensate with older saving format
  }),
  DateTime: () => ({
    get: getters.DateTime,
    required: true,
    set: setters.DateTime,
    type: schemaTypes.Date, // have to make it to compensate with older saving format
  }),
  DbRef: (collectionName: string) => {
    return {
      required: true,
      set: (value: any) => FormatDbRefs(value, collectionName),
      type: {},
    };
  },
  Decimal128: () => ({
    required: true,
    type: schemaTypes.Decimal128,
  }),
  Map: () => ({
    required: true,
    type: schemaTypes.Map,
  }),
  Mixed: () => ({
    required: true,
    type: schemaTypes.Mixed,
  }),
  NegativeNumber: () => ({
    max: 0,
    required: true,
    type: schemaTypes.Number,
  }),
  Number: () => ({
    required: true,
    type: schemaTypes.Number,
  }),
  ObjectId: () => ({
    default: defaults.ObjectId,
    required: true,
    type: schemaTypes.ObjectId,
  }),
  PositiveNumber: () => ({
    min: 0,
    required: true,
    type: schemaTypes.Number,
  }),
  String: () => ({
    required: true,
    type: schemaTypes.String,
  }),
  Time: () => ({
    get: getters.Time,
    required: true,
    set: setters.Time,
    type: schemaTypes.Date,
  }),
  UUID: () => ({
    default: defaults.UUID,
    required: true,
    type: schemaTypes.UUID,
  }),
});

module.exports = {
  addDefaultValue,
  addEnums,
  addGetter,
  addSetter,
  Nullable,
  ObjArray,
  Optional,
  Types,
  unique,
  index,
  sparse,
};
