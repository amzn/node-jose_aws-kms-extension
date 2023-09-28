/// <reference types="node" />
import { KMSClient } from '@aws-sdk/client-kms';
import { KMSDataKeyGenerationResult } from './models/kmsDataKeyGenerationResult';
/**
 * Class for generating symmetric data keys using AWS KMS and encrypt the content
 */
export declare class KMSSymmetricCEK {
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
    constructor(keyId: string, kmsClient: KMSClient, keySpec: string);
    /**
     * Generates a new data key using KMS GenerateDataKey Command
     *
     * @returns Promise resolving to object with ciphertext data key
     */
    get(): Promise<KMSDataKeyGenerationResult>;
    /**
     * Encrypts data using the generated data key
     *
     * @param encryptionAlgorithm - Encryption algorithm to use to encrypt the data
     * @param dataToEncrypt - Data to encrypt
     * @param props - Additional encryption properties
     *
     * @returns Encrypted data
     */
    encrypt(encryptionAlgorithm: string, dataToEncrypt: Buffer, props: any): any;
}
