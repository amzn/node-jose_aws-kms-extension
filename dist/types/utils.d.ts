/// <reference types="node" />
import { KMSError, KMSTransientError, KMSValidationError } from './exceptions';
/**
 * Validates the format of a key.
 * @param {string} key - The key to validate.
 * @throws {KMSInvalidKeyFormatError} Throws an error if the provided key format is invalid.
 */
export declare function validateKeyFormat(key: string): void;
/**
 * Digests data using the specified algorithm.
 * @param {string} alg - The algorithm to use for digesting the data.
 * @param {Buffer} data - The data to digest.
 * @returns {Promise<Buffer>} A promise that resolves to the digested data.
 * @throws {KMSUnSupportedAlgorithmError} Throws an error if the algorithm is unsupported.
 */
export declare function digestData(alg: string, data: Buffer): Promise<Buffer>;
/**
 * Processes errors from AWS KMS service.
 *
 * @param {unknown} error - The error to process
 * @returns {KMSTransientError|KMSValidationError|KMSError}
 *
 * @throws {KMSTransientError}
 * For transient errors like timeout, unavailable key etc.
 *
 * @throws {KMSValidationError}
 * For invalid requests, signatures etc.
 *
 * @throws {KMSError}
 * For other KMS errors.
 */
export declare function processKMSError(
  error: unknown,
): KMSTransientError | KMSValidationError | KMSError;
