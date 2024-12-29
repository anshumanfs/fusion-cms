import lodash from 'lodash';
import nodeCrypto from 'node:crypto';

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

const generateUniqueRandomId = (length: number = 6, useSpecialChars: boolean = false): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const specialChars = '!@#$%^&*()_+{}:"<>?|[];\',./`~';
  const charSet = useSpecialChars ? chars + specialChars : chars;
  const charSetLength = charSet.length;

  // Generate a random string
  const randomBytes = nodeCrypto.randomBytes(length);

  // map random bytes to the character set
  let uniqueId = '';
  for (let i = 0; i < length; i++) {
    uniqueId += charSet[randomBytes[i] % charSetLength];
  }

  return uniqueId;
};

export { toJSON, generateUniqueRandomId };
