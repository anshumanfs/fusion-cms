import lodash from 'lodash';

/**
 * Serializes and deserializes data to and from JSON.
 *
 * @param {any} data - The data to be serialized or deserialized.
 * @return {any} - The serialized or deserialized data.
 */
const toJSON = (data: any) => {
  if (lodash.isPlainObject(data)) {
    if ([null, undefined].includes(data)) {
      return data;
    }
    // Serialize
    const json = JSON.stringify(data, (key, value) => (typeof value === 'bigint' ? `BIGINT::${value}` : value));
    // Deserialize
    const deserializedObject = JSON.parse(json, (key, value) => {
      if (typeof value === 'string' && value.startsWith('BIGINT::')) {
        return BigInt(value.substr(8));
      }
      return value;
    });
    return deserializedObject;
  }
  if (lodash.isString(data)) {
    return JSON.parse(data);
  }
};

export { toJSON };
