const jose = require('node-jose');
import { KMSAsymmetricSigningKey } from './kms/kmsAsymmetricSigningKey';
import { KMSSymmetricCEK } from './kms/kmsSymmetricCEK';
import { KMSSymmetricKey } from './kms/kmsSymmetricKey';

const originalAsKey = jose.JWK.asKey;
const originalIsKey = jose.JWK.isKey;

/**
 * Overrides the jose.JWK.isKey function to recognize our custom kms keys
 *
 * @param key - The key to check
 * @returns True if key is a custom class, original function otherwise
 */
jose.JWK.isKey = function (key: any) {
  if (key instanceof KMSSymmetricKey || key instanceof KMSAsymmetricSigningKey)
    return true;

  return originalIsKey(key);
};

/**
 * Overrides the jose.JWK.asKey function to recognize and return ou custom kms keys
 *
 * @param key - The key
 * @param form - The form of the key
 * @param extras - Additional options
 * @returns A promise resolving to the key
 */
jose.JWK.asKey = function (key: any, form: any, extras: any) {
  if (
    key instanceof KMSAsymmetricSigningKey ||
    key instanceof KMSSymmetricCEK ||
    key instanceof KMSSymmetricKey
  )
    return Promise.resolve(key);

  return originalAsKey(key, form, extras);
};

export default jose;
