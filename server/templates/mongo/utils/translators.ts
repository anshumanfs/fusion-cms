import lodash from 'lodash';
import mongoose from 'mongoose';

/**
 * Translates the given filter object by replacing any string values that start with 'ObjectId('
 * with the corresponding mongoose.mongo.ObjectId value. Recursively translates any nested
 * objects as well.
 *
 * @param {any} filter - The filter object to be translated.
 * @returns {any} - The translated filter object.
 */
const filterTranslator = (filter: any): any => {
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

export { filterTranslator };
