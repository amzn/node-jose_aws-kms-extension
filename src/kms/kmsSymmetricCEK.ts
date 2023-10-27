import {
  KMSClient,
  GenerateDataKeyCommand,
  GenerateDataKeyCommandInput,
  GenerateDataKeyCommandOutput,
} from '@aws-sdk/client-kms';
import { validateKeyFormat, processKMSError } from '../utils';
import { KMSDataKeyGenerationResult } from './models/kmsDataKeyGenerationResult';
const jose = require('node-jose');

/**
 * Class for generating symmetric data keys using AWS KMS and encrypt the content
 */
export class KMSSymmetricCEK {
  keyId: string;
  kmsClient: KMSClient;
  keySpec: string;
  dataKey: Uint8Array | undefined;

  /**
   * Creates an instance of KMSSymmetricCEK.
   *
   * @param {string} keyId - KMS Key Id to use for data key generation.
   * @param {KMSClient} kmsClient - KMS client instance to interact with AWS KMS.
   * @param {string} keySpec - key spec to specify the length of the data key to generate a symmetric data key.
   */
  constructor(keyId: string, kmsClient: KMSClient, keySpec: string) {
    validateKeyFormat(keyId);
    this.keyId = keyId;
    this.kmsClient = kmsClient;
    this.keySpec = keySpec;
  }

  /**
   * Generates a new data key using KMS GenerateDataKey Command
   *
   * @returns Promise resolving to object with ciphertext data key
   */
  async get(): Promise<KMSDataKeyGenerationResult> {
    const input: GenerateDataKeyCommandInput = {
      KeyId: this.keyId,
      KeySpec: this.keySpec,
    };
    const command = new GenerateDataKeyCommand(input);
    try {
      const response = await this.kmsClient.send(command);
      this.dataKey = response.Plaintext;
      const dataKeyGenerationResult: KMSDataKeyGenerationResult = {
        data: response.CiphertextBlob,
      };
      return dataKeyGenerationResult;
    } catch (error) {
      console.error('Error while generating data key from KMS:', error);
      return Promise.reject(processKMSError(error));
    }
  }

  /**
   * Encrypts data using the generated data key
   *
   * @param encryptionAlgorithm - Encryption algorithm to use to encrypt the data
   * @param dataToEncrypt - Data to encrypt
   * @param props - Additional encryption properties
   *
   * @returns Encrypted data
   */
  encrypt(encryptionAlgorithm: string, dataToEncrypt: Buffer, props: any) {
    return jose.JWA.encrypt(
      encryptionAlgorithm,
      this.dataKey,
      dataToEncrypt,
      props,
    );
  }
}
