import {
  KMSTransientError,
  KMSValidationError,
  KMSError,
} from '../../src/exceptions';

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

export const VALID_KMS_KEY_ID =
  'arn:aws:kms:eu-west-1:112233445566:alias/AliasName';
export const INVALID_KMS_KEY_ID = '654679365 78897';
export const SHA256_ALGORITHM = 'SHA256';
export const RSASSA_PSS_SHA_256_ALGORITHM = 'RSASSA_PSS_SHA_256';
export const SIGNED_DATA = 'SIGNED_DATA';
export const TEST_MESSAGE = 'TEST_MESSAGE';
export const DIGEST_MESSAGE_TYPE = 'DIGEST';
export const KEY_OTHER_THAN_KMS = { kty: 'RSA', e: 'AQAB', n: 'n' };
export const AES_256_KEY_SPEC = 'AES_256';
export const CONTENT_ALGORITHM = 'AES256GCM';
export const ENCRYPTED_CONTENT = 'encrypted-content';
export const MOCKED_CIPHER_DATA_KEY = new Uint8Array([
  0x6d, 0x6f, 0x63, 0x6b, 0x65, 0x64, 0x2d, 0x63, 0x69, 0x70, 0x68, 0x65, 0x72,
  0x74, 0x65, 0x78, 0x74,
]);
export const MOCKED_PLAIN_DATA_KEY = new Uint8Array([
  0x6d, 0x6f, 0x63, 0x6b, 0x65, 0x64, 0x2d, 0x70, 0x6c, 0x61, 0x69, 0x6e, 0x74,
  0x2d, 0x6b, 0x65, 0x79,
]);
export const SIGNATURE = 'SIGNATURE';
export const TEST_KMS_ERRORS = [
  {
    error: DependencyTimeoutException,
    expected: KMSTransientError,
  },
  {
    error: KeyUnavailableException,
    expected: KMSTransientError,
  },
  {
    error: KMSInternalException,
    expected: KMSTransientError,
  },
  {
    error: DisabledException,
    expected: KMSValidationError,
  },
  {
    error: DryRunOperationException,
    expected: KMSValidationError,
  },
  {
    error: IncorrectKeyException,
    expected: KMSValidationError,
  },
  {
    error: InvalidGrantTokenException,
    expected: KMSValidationError,
  },
  {
    error: InvalidKeyUsageException,
    expected: KMSValidationError,
  },
  {
    error: KMSInvalidSignatureException,
    expected: KMSValidationError,
  },
  {
    error: KMSInvalidStateException,
    expected: KMSValidationError,
  },
  {
    error: NotFoundException,
    expected: KMSValidationError,
  },
  {
    error: Error,
    expected: KMSError,
  },
];
