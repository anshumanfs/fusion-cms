import lodash from 'lodash';
import mongoose from 'mongoose';

const operationOptions: Record<string, any> = {
  find: ['allowDiskUse', 'limit', 'skip', 'hint', 'comment', 'lean', 'populate', 'useBigInt64', 'maxTimeMs', 'sort'],
  findOne: ['lean', 'populate'],
  findOneAndUpdate: ['lean', 'populate', 'upsert', 'timestamps', 'sort', 'useBigInt64'],
  findOneAndDelete: ['lean', 'populate', 'sort', 'useBigInt64'],
};

const defaultOptionValues: Record<string, any> = {
  allowDiskUse: true,
  limit: 20,
  skip: 0,
  hint: null,
  comment: null,
  lean: true,
  populate: null,
  useBigInt64: false,
  maxTimeMs: null,
  sort: null,
  upsert: false,
  timestamps: false,
};

/**
 * Translates the given filter object by replacing any string values that start with 'ObjectId('
 * with the corresponding mongoose.mongo.ObjectId value. Recursively translates any nested
 * objects as well.
 *
 * @param {any} filter - The filter object to be translated.
 * @returns {any} - The translated filter object.
 */
const translateFilter = (filter: any = {}): any => {
  const translateValue = (value: any): any => {
    if (lodash.isString(value) && value.startsWith('ObjectId(')) {
      return new mongoose.mongo.ObjectId(value.replace('ObjectId(', '').replace(')', ''));
    }
    if (lodash.isString(value) && value.startsWith('DbRef(')) {
      const ref = value.replace('DbRef(', '').replace(')', '').split(',');
      return new mongoose.mongo.DBRef(ref[0], new mongoose.mongo.ObjectId(ref[1]));
    }
    return value;
  };

  const translateArray = (arr: any[]): any[] => {
    return arr.map((element: any) => {
      if (lodash.isString(element) && element.startsWith('ObjectId(')) {
        return new mongoose.mongo.ObjectId(element.replace('ObjectId(', '').replace(')', ''));
      }
      if (lodash.isString(element) && element.startsWith('DbRef(')) {
        const ref = element.replace('DbRef(', '').replace(')', '').split(',');
        return new mongoose.mongo.DBRef(ref[0], new mongoose.mongo.ObjectId(ref[1]));
      }
      return element;
    });
  };

  const translateObject = (obj: any): any => {
    const translatedObj: any = {};
    Object.keys(obj).forEach((key) => {
      translatedObj[key] = translate(obj[key]);
    });
    return translatedObj;
  };

  const translate = (value: any): any => {
    if (lodash.isString(value) && value.startsWith('ObjectId(')) {
      return new mongoose.mongo.ObjectId(value.replace('ObjectId(', '').replace(')', '').trim());
    }
    if (lodash.isString(value) && value.startsWith('DbRef(')) {
      const ref = value
        .replace('DbRef(', '')
        .replace(')', '')
        .split(',')
        .map((val) => val.trim());
      return new mongoose.mongo.DBRef(ref[0], new mongoose.mongo.ObjectId(ref[1]));
    }
    if (lodash.isArray(value) && value.length > 0) {
      return translateArray(value);
    }
    if (lodash.isPlainObject(value)) {
      return translateObject(value);
    }
    return value;
  };

  const translatedFilter = lodash.cloneDeep(filter);
  return translate(translatedFilter);
};

/**
 * Translates the given options object into a new object that only contains
 * the valid options for the specified operation. If an option is missing from
 * the given options object, it will be set to the default value.
 *
 * @param {Record<string, any>} options - The options object to translate.
 * @param {string} operation - The operation for which to translate the options.
 * @returns {Record<string, any>} The translated options object.
 */
const translateOptions = (options: Record<string, any> = {}, operation: string): Record<string, any> => {
  const translatedOptions: Record<string, any> = {};

  const validOptions: string[] = operationOptions[operation];

  validOptions.forEach((option) => {
    if (options.hasOwnProperty(option)) {
      translatedOptions[option] = options[option];
    } else {
      let defaultValue = defaultOptionValues[option];
      if (![null, undefined].includes(defaultValue)) {
        translatedOptions[option] = defaultValue;
      }
    }
  });
  return translatedOptions;
};

export { translateFilter, translateOptions };
