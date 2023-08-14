const lodash = require('lodash');

function customFilter(collection: any[], query: any) {
  return lodash.filter(collection, (item: any) => {
    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        const queryValue = query[key];
        const itemValue = lodash.get(item, key);

        if (lodash.isObject(queryValue)) {
          for (const operator in queryValue) {
            if (queryValue.hasOwnProperty(operator)) {
              const value = queryValue[operator as keyof typeof queryValue];

              switch (operator) {
                case '$eq':
                  if (itemValue !== value) {
                    return false;
                  }
                  break;
                case '$ne':
                  if (itemValue === value) {
                    return false;
                  }
                  break;
                case '$gt':
                  if (!(typeof itemValue === 'number' && typeof value === 'number')) {
                    throw new Error('$gt operator requires numeric values');
                  }
                  if (!(itemValue > value)) {
                    return false;
                  }
                  break;
                case '$lt':
                  if (!(typeof itemValue === 'number' && typeof value === 'number')) {
                    throw new Error('$lt operator requires numeric values');
                  }
                  if (!(itemValue < value)) {
                    return false;
                  }
                  break;
                case '$gte':
                  if (!(typeof itemValue === 'number' && typeof value === 'number')) {
                    throw new Error('$gte operator requires numeric values');
                  }
                  if (!(itemValue >= value)) {
                    return false;
                  }
                  break;
                case '$lte':
                  if (!(typeof itemValue === 'number' && typeof value === 'number')) {
                    throw new Error('$lte operator requires numeric values');
                  }
                  if (!(itemValue <= value)) {
                    return false;
                  }
                  break;
                case '$in':
                  if (!Array.isArray(value)) {
                    throw new Error('$in operator requires an array value');
                  }
                  if (!value.includes(itemValue)) {
                    return false;
                  }
                  break;
                case '$nin':
                  if (!Array.isArray(value)) {
                    throw new Error('$nin operator requires an array value');
                  }
                  if (value.includes(itemValue)) {
                    return false;
                  }
                  break;
                case '$exists':
                  if (value && itemValue === undefined) {
                    return false;
                  }
                  if (!value && itemValue !== undefined) {
                    return false;
                  }
                  break;
                case '$type':
                  if (typeof value !== 'number') {
                    throw new Error('$type operator requires a numeric value');
                  }
                  if (typeof itemValue !== typeToBSONType(value)) {
                    return false;
                  }
                  break;
                case '$all':
                  if (!Array.isArray(itemValue) || !Array.isArray(value)) {
                    throw new Error('$all operator requires array values');
                  }
                  if (!lodash.every(value, (val: any) => itemValue.includes(val))) {
                    return false;
                  }
                  break;
                case '$size':
                  if (!Array.isArray(itemValue) || typeof value !== 'number') {
                    throw new Error('$size operator requires an array value and a numeric size');
                  }
                  if (itemValue.length !== value) {
                    return false;
                  }
                  break;
                case '$regex':
                  if (typeof value !== 'string') {
                    throw new Error('$regex operator requires a string value');
                  }
                  if (!new RegExp(value).test(itemValue)) {
                    return false;
                  }
                  break;
                case '$options':
                  // Ignored for this example
                  break;
                case '$text':
                  // Ignored for this example
                  break;
                case '$geoWithin':
                  // Ignored for this example
                  break;
                case '$geoIntersects':
                  // Ignored for this example
                  break;
                case '$near':
                  // Ignored for this example
                  break;
                case '$nearSphere':
                  // Ignored for this example
                  break;
                case '$bitsAllSet':
                  // Ignored for this example
                  break;
                case '$bitsAnySet':
                  // Ignored for this example
                  break;
                case '$bitsAllClear':
                  // Ignored for this example
                  break;
                case '$bitsAnyClear':
                  // Ignored for this example
                  break;
                default:
                  throw new Error(`Unsupported operator: ${operator}`);
              }
            }
          }
        } else {
          if (itemValue !== queryValue) {
            return false;
          }
        }
      }
    }
    return true;
  });
}

// Helper function to map numeric types to BSON types
function typeToBSONType(type: number) {
  switch (type) {
    case 1:
      return 'double';
    case 2:
      return 'string';
    case 3:
      return 'object';
    case 4:
      return 'array';
    case 5:
      return 'binData';
    case 7:
      return 'object';
    case 8:
      return 'boolean';
    case 9:
      return 'date';
    case 10:
      return 'null';
    case 11:
      return 'regexp';
    case 16:
      return 'int';
    case 18:
      return 'timestamp';
    case 19:
      return 'int';
    case 32:
      return 'int';
    case 64:
      return 'object';
    case 128:
      return 'object';
    case 133:
      return 'object';
    default:
      throw new Error(`Unsupported BSON type: ${type}`);
  }
}

export { customFilter };
