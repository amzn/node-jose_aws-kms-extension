import {
  KMSError,
  KMSInvalidKeyFormatError,
  KMSTransientError,
  KMSUnSupportedAlgorithmError,
  KMSValidationError,
} from './exceptions';
import {
  DependencyTimeoutException,
  KeyUnavailableException,
  KMSInternalException,
  DisabledException,
  DryRunOperationException,
  IncorrectKeyException,
  InvalidGrantTokenException,
  InvalidKeyUsageException,
  KMSInvalidSignatureException,
  KMSInvalidStateException,
  NotFoundException,
} from '@aws-sdk/client-kms';
import { ALG_DIGEST_MAP } from './constants/constants';
import jose from './jose';

/**
 * Validates the format of a key.
 * @param {string} key - The key to validate.
 * @throws {KMSInvalidKeyFormatError} Throws an error if the provided key format is invalid.
 */
export function validateKeyFormat(key: string): void {
  // TODO: update keyFormatPattern
  const keyFormatPattern = /^\S+$/;

  if (typeof key !== 'string' || !keyFormatPattern.test(key)) {
    throw new KMSInvalidKeyFormatError(
      "Provided key isn't supported by KMS. " +
        'Expected a string with key-id, key-id ARN, key-alias, or key-alias ARN.',
    );
  }
}

/**
 * Digests data using the specified algorithm.
 * @param {string} alg - The algorithm to use for digesting the data.
 * @param {Buffer} data - The data to digest.
 * @returns {Promise<Buffer>} A promise that resolves to the digested data.
 * @throws {KMSUnSupportedAlgorithmError} Throws an error if the algorithm is unsupported.
 */
export function digestData(alg: string, data: Buffer): Promise<Buffer> {
  const digestAlg = ALG_DIGEST_MAP.get(alg);

  if (!digestAlg) {
    return Promise.reject(
      new KMSUnSupportedAlgorithmError(`Unsupported algorithm: ${alg}`),
    );
  }

  return jose.JWA.digest(digestAlg, data);
}

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
export function processKMSError(
  error: unknown,
): KMSTransientError | KMSValidationError | KMSError {
  if (isKMSTransientError(error)) {
    return new KMSTransientError('A temporary exception was thrown from KMS.');
  }

  if (isKMSValidationError(error)) {
    return new KMSValidationError(
      'A validation exception was thrown from KMS.',
    );
  }

  return new KMSError(
    error instanceof Error
      ? error.message
      : 'An unknown exception was thrown from KMS.',
  );
}

/**
 *
 * @param error
 * @returns true if the error is a KMS transient error, false otherwise.
 */
function isKMSTransientError(error: unknown) {
  if (
    error instanceof DependencyTimeoutException ||
    error instanceof KeyUnavailableException ||
    error instanceof KMSInternalException
  ) {
    return true;
  }
  return false;
}

/**
 *
 * @param error
 * @returns true if the error is a KMS validation error, false otherwise.
 */
function isKMSValidationError(error: unknown) {
  if (
    error instanceof DisabledException ||
    error instanceof DryRunOperationException ||
    error instanceof IncorrectKeyException ||
    error instanceof InvalidGrantTokenException ||
    error instanceof InvalidKeyUsageException ||
    error instanceof KMSInvalidSignatureException ||
    error instanceof KMSInvalidStateException ||
    error instanceof NotFoundException
  ) {
    return true;
  }
  return false;
}
