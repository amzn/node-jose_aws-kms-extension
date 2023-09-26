import { KMSClient } from '@aws-sdk/client-kms';
import { KMSDataKeyGenerationResult } from './models/kmsDataKeyGenerationResult';
/**
 * Class for wrapping/unwrapping symmetric keys using AWS KMS, it implements limited functions needed for `Key` operations
 */
export declare class KMSSymmetricKey {
  keyId: string;
  kmsClient: KMSClient;
  /**
   * Create an instance of KMSSymmetricKey
   *
   * @param keyId - KMS key ID to decrypt the cipher data key
   * @param kmsClient - KMS client instance to interact with AWS KMS
   */
  constructor(keyId: string, kmsClient: KMSClient);
  /**
   * Passes through data key generation result to be used in creating JWE.
   * See https://github.com/cisco/node-jose/blob/master/lib/jwe/encrypt.js
   *
   * @param encryptionAlgorithm - Encryption algorithm
   * @param kmsDataKeyGenerationResult - Result from KMS containing ciphertext
   * @returns Data key generation result to be used in creating JWE.
   */
  wrap(
    encryptionAlgorithm: string,
    kmsDataKeyGenerationResult: KMSDataKeyGenerationResult,
  ): KMSDataKeyGenerationResult;
  /**
   * Unwraps an encrypted symmetric key using KMS Decrypt Command
   * See https://github.com/cisco/node-jose/blob/master/lib/jwe/decrypt.js
   *
   * @param algorithm - Encryption algorithm
   * @param wrappedKey - Wrapped key to unwrap
   * @returns Promise resolving to plaintext key
   */
  unwrap(
    encryptionAlgorithm: string,
    wrappedKey: Uint8Array,
  ): Promise<Uint8Array | undefined>;
}
