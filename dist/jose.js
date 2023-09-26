'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const jose = require('node-jose');
const kmsAsymmetricSigningKey_1 = require('./kms/kmsAsymmetricSigningKey');
const kmsSymmetricCEK_1 = require('./kms/kmsSymmetricCEK');
const kmsSymmetricKey_1 = require('./kms/kmsSymmetricKey');
const originalAsKey = jose.JWK.asKey;
const originalIsKey = jose.JWK.isKey;
/**
 * Overrides the jose.JWK.isKey function to recognize our custom kms keys
 *
 * @param key - The key to check
 * @returns True if key is a custom class, original function otherwise
 */
jose.JWK.isKey = function (key) {
  if (
    key instanceof kmsSymmetricKey_1.KMSSymmetricKey ||
    key instanceof kmsAsymmetricSigningKey_1.KMSAsymmetricSigningKey
  )
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
jose.JWK.asKey = function (key, form, extras) {
  if (
    key instanceof kmsAsymmetricSigningKey_1.KMSAsymmetricSigningKey ||
    key instanceof kmsSymmetricCEK_1.KMSSymmetricCEK ||
    key instanceof kmsSymmetricKey_1.KMSSymmetricKey
  )
    return Promise.resolve(key);
  return originalAsKey(key, form, extras);
};
exports.default = jose;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9zZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9qb3NlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ2xDLDJFQUF3RTtBQUN4RSwyREFBd0Q7QUFDeEQsMkRBQXdEO0FBRXhELE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO0FBQ3JDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO0FBRXJDOzs7OztHQUtHO0FBQ0gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsVUFBVSxHQUFRO0lBQ2pDLElBQUksR0FBRyxZQUFZLGlDQUFlLElBQUksR0FBRyxZQUFZLGlEQUF1QjtRQUMxRSxPQUFPLElBQUksQ0FBQztJQUVkLE9BQU8sYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLENBQUMsQ0FBQztBQUVGOzs7Ozs7O0dBT0c7QUFDSCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxVQUFVLEdBQVEsRUFBRSxJQUFTLEVBQUUsTUFBVztJQUN6RCxJQUNFLEdBQUcsWUFBWSxpREFBdUI7UUFDdEMsR0FBRyxZQUFZLGlDQUFlO1FBQzlCLEdBQUcsWUFBWSxpQ0FBZTtRQUU5QixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFOUIsT0FBTyxhQUFhLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMxQyxDQUFDLENBQUM7QUFFRixrQkFBZSxJQUFJLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBqb3NlID0gcmVxdWlyZSgnbm9kZS1qb3NlJyk7XG5pbXBvcnQgeyBLTVNBc3ltbWV0cmljU2lnbmluZ0tleSB9IGZyb20gJy4va21zL2ttc0FzeW1tZXRyaWNTaWduaW5nS2V5JztcbmltcG9ydCB7IEtNU1N5bW1ldHJpY0NFSyB9IGZyb20gJy4va21zL2ttc1N5bW1ldHJpY0NFSyc7XG5pbXBvcnQgeyBLTVNTeW1tZXRyaWNLZXkgfSBmcm9tICcuL2ttcy9rbXNTeW1tZXRyaWNLZXknO1xuXG5jb25zdCBvcmlnaW5hbEFzS2V5ID0gam9zZS5KV0suYXNLZXk7XG5jb25zdCBvcmlnaW5hbElzS2V5ID0gam9zZS5KV0suaXNLZXk7XG5cbi8qKlxuICogT3ZlcnJpZGVzIHRoZSBqb3NlLkpXSy5pc0tleSBmdW5jdGlvbiB0byByZWNvZ25pemUgb3VyIGN1c3RvbSBrbXMga2V5c1xuICpcbiAqIEBwYXJhbSBrZXkgLSBUaGUga2V5IHRvIGNoZWNrXG4gKiBAcmV0dXJucyBUcnVlIGlmIGtleSBpcyBhIGN1c3RvbSBjbGFzcywgb3JpZ2luYWwgZnVuY3Rpb24gb3RoZXJ3aXNlXG4gKi9cbmpvc2UuSldLLmlzS2V5ID0gZnVuY3Rpb24gKGtleTogYW55KSB7XG4gIGlmIChrZXkgaW5zdGFuY2VvZiBLTVNTeW1tZXRyaWNLZXkgfHwga2V5IGluc3RhbmNlb2YgS01TQXN5bW1ldHJpY1NpZ25pbmdLZXkpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIG9yaWdpbmFsSXNLZXkoa2V5KTtcbn07XG5cbi8qKlxuICogT3ZlcnJpZGVzIHRoZSBqb3NlLkpXSy5hc0tleSBmdW5jdGlvbiB0byByZWNvZ25pemUgYW5kIHJldHVybiBvdSBjdXN0b20ga21zIGtleXNcbiAqXG4gKiBAcGFyYW0ga2V5IC0gVGhlIGtleVxuICogQHBhcmFtIGZvcm0gLSBUaGUgZm9ybSBvZiB0aGUga2V5XG4gKiBAcGFyYW0gZXh0cmFzIC0gQWRkaXRpb25hbCBvcHRpb25zXG4gKiBAcmV0dXJucyBBIHByb21pc2UgcmVzb2x2aW5nIHRvIHRoZSBrZXlcbiAqL1xuam9zZS5KV0suYXNLZXkgPSBmdW5jdGlvbiAoa2V5OiBhbnksIGZvcm06IGFueSwgZXh0cmFzOiBhbnkpIHtcbiAgaWYgKFxuICAgIGtleSBpbnN0YW5jZW9mIEtNU0FzeW1tZXRyaWNTaWduaW5nS2V5IHx8XG4gICAga2V5IGluc3RhbmNlb2YgS01TU3ltbWV0cmljQ0VLIHx8XG4gICAga2V5IGluc3RhbmNlb2YgS01TU3ltbWV0cmljS2V5XG4gIClcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGtleSk7XG5cbiAgcmV0dXJuIG9yaWdpbmFsQXNLZXkoa2V5LCBmb3JtLCBleHRyYXMpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgam9zZTtcbiJdfQ==
