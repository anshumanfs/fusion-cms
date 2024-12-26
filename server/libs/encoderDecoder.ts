import CryptoJS from 'crypto-js';
import Config from '../../config.json';

const oneWayEncoder = (data: string): string => {
  return CryptoJS.SHA512(data).toString();
};

const oneWayMatch = (data: string, encryptedData: string): boolean => {
  return oneWayEncoder(data) === encryptedData;
};

const twoWayEncoder = (data: string, secret: string = ''): string => {
  secret = secret || Config.secrets.twoWayEncryptionSecret;
  return CryptoJS.AES.encrypt(data, secret).toString();
};

const twoWayDecoder = (data: string, secret: string = ''): string => {
  secret = secret || Config.secrets.twoWayEncryptionSecret;
  return CryptoJS.AES.decrypt(data, secret).toString(CryptoJS.enc.Utf8);
};

const twoWayMatcher = (data: string, encryptedData: string, dataType: string, secret: string = ''): boolean => {
  secret = secret || Config.secrets.twoWayEncryptionSecret;
  const decryptedData = CryptoJS.AES.decrypt(encryptedData, secret).toString(CryptoJS.enc.Utf8);
  if (dataType === 'string') {
    return data === decryptedData;
  } else if (dataType === 'number') {
    return Number(data) === Number(decryptedData);
  } else if (dataType === 'boolean') {
    return Boolean(data) === Boolean(decryptedData);
  } else if (dataType === 'object') {
    return JSON.stringify(data) === decryptedData;
  }
  return false;
};

export { oneWayEncoder, oneWayMatch, twoWayEncoder, twoWayDecoder, twoWayMatcher };
