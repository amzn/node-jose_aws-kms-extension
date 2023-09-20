import {
  KMSClient,
  DecryptCommand,
  DecryptCommandInput,
  DecryptCommandOutput,
} from '@aws-sdk/client-kms';
import { validateKeyFormat, processKMSError } from '../utils';
import { KMSDataKeyGenerationResult } from './models/kmsDataKeyGenerationResult';

/**
 * Class for wrapping/unwrapping symmetric keys using AWS KMS, it implements limited functions needed for `Key` operations
 */
export class KMSSymmetricKey {
  keyId: string;
  kmsClient: KMSClient;

  /**
   * Create an instance of KMSSymmetricKey
   *
   * @param keyId - KMS key ID to decrypt the cipher data key
   * @param kmsClient - KMS client instance to interact with AWS KMS
   */
  constructor(keyId: string, kmsClient: KMSClient) {
    validateKeyFormat(keyId);
    this.keyId = keyId;
    this.kmsClient = kmsClient;
  }

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
  ): KMSDataKeyGenerationResult {
    return kmsDataKeyGenerationResult;
  }

  /**
   * Unwraps an encrypted symmetric key using KMS Decrypt Command
   * See https://github.com/cisco/node-jose/blob/master/lib/jwe/decrypt.js
   *
   * @param algorithm - Encryption algorithm
   * @param wrappedKey - Wrapped key to unwrap
   * @returns Promise resolving to plaintext key
   */
  async unwrap(
    encryptionAlgorithm: string,
    wrappedKey: Uint8Array,
  ): Promise<Uint8Array | undefined> {
    const input: DecryptCommandInput = {
      CiphertextBlob: wrappedKey,
      KeyId: this.keyId,
      EncryptionAlgorithm: encryptionAlgorithm,
    };
    const command = new DecryptCommand(input);
    try {
      const response: DecryptCommandOutput = await this.kmsClient.send(command);
      return response.Plaintext;
    } catch (error) {
      return Promise.reject(processKMSError(error));
    }
  }
}
