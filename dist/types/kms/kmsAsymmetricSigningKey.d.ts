/// <reference types="node" />
import { KMSClient } from '@aws-sdk/client-kms';
import { KMSSigningResult } from './models/kmsSigningResult';
import { KMSVerificationResult } from './models/kmsVerificationResult';
/**
 * Asymmetric signing key using AWS KMS
 */
export declare class KMSAsymmetricSigningKey {
    keyId: string;
    kmsClient: KMSClient;
    /**
     * Creates an instance of KMSAsymmetricSigningKey
     *
     * @param {string} keyId - KMS key ID to use for signing.
     * @param {KMSClient} kmsClient - KMS client instance to interact with AWS KMS
     */
    constructor(keyId: string, kmsClient: KMSClient);
    /**
     * Signs the provided data using KMS Sign Command
     *
     * @param {string} signingAlgorithm - The algorithm to use for signing
     * @param {Buffer} dataToSign - The data to sign
     * @returns {Promise<KMSSigningResult>} - Promise resolving to object with the signature result
     */
    sign(signingAlgorithm: string, dataToSign: Buffer): Promise<KMSSigningResult>;
    /**
     * Verifies the signature of the provided data using KMS Verify Command
     *
     * @param {string} signingAlgorithm - The algorithm used to generate the signature
     * @param {Buffer} dataToVerify - The original data that was signed
     * @param {Buffer} signature - The signature to verify
     * @returns {Promise<KMSVerificationResult>} - Promise resolving to object with the verification result
     */
    verify(signingAlgorithm: string, dataToVerify: Buffer, signature: Buffer): Promise<KMSVerificationResult>;
}
