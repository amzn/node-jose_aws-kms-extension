import {
  KMSClient,
  SignCommandOutput,
  SignCommand,
  SignCommandInput,
  VerifyCommandInput,
  VerifyCommandOutput,
  VerifyCommand,
} from '@aws-sdk/client-kms';
import { DIGEST_MESSAGE_TYPE } from '../constants/constants';
import { validateKeyFormat, digestData, processKMSError } from '../utils';
import { KMSSigningResult } from './models/kmsSigningResult';
import { KMSVerificationResult } from './models/kmsVerificationResult';

/**
 * Asymmetric signing key using AWS KMS
 */
export class KMSAsymmetricSigningKey {
  keyId: string;
  kmsClient: KMSClient;

  /**
   * Creates an instance of KMSAsymmetricSigningKey
   *
   * @param {string} keyId - KMS key ID to use for signing.
   * @param {KMSClient} kmsClient - KMS client instance to interact with AWS KMS
   */
  constructor(keyId: string, kmsClient: KMSClient) {
    validateKeyFormat(keyId);
    this.keyId = keyId;
    this.kmsClient = kmsClient;
  }

  /**
   * Signs the provided data using KMS Sign Command
   *
   * @param {string} signingAlgorithm - The algorithm to use for signing
   * @param {Buffer} dataToSign - The data to sign
   * @returns {Promise<KMSSigningResult>} - Promise resolving to object with the signature result
   */
  async sign(
    signingAlgorithm: string,
    dataToSign: Buffer,
  ): Promise<KMSSigningResult> {
    const digestToSign = await digestData(signingAlgorithm, dataToSign);

    const input: SignCommandInput = {
      KeyId: this.keyId,
      Message: digestToSign,
      MessageType: DIGEST_MESSAGE_TYPE,
      SigningAlgorithm: signingAlgorithm,
    };

    const command = new SignCommand(input);
    try {
      const response: SignCommandOutput = await this.kmsClient.send(command);
      const signingResult: KMSSigningResult = {
        mac: response.Signature,
      };
      return signingResult;
    } catch (error) {
      console.error('Error while signing from KMS:', error);
      return Promise.reject(processKMSError(error));
    }
  }

  /**
   * Verifies the signature of the provided data using KMS Verify Command
   *
   * @param {string} signingAlgorithm - The algorithm used to generate the signature
   * @param {Buffer} dataToVerify - The original data that was signed
   * @param {Buffer} signature - The signature to verify
   * @returns {Promise<KMSVerificationResult>} - Promise resolving to object with the verification result
   */
  async verify(
    signingAlgorithm: string,
    dataToVerify: Buffer,
    signature: Buffer,
  ): Promise<KMSVerificationResult> {
    const digestToVerify = await digestData(signingAlgorithm, dataToVerify);

    const input: VerifyCommandInput = {
      KeyId: this.keyId,
      Message: digestToVerify,
      MessageType: DIGEST_MESSAGE_TYPE,
      Signature: signature,
      SigningAlgorithm: signingAlgorithm,
    };

    const command = new VerifyCommand(input);
    try {
      const response: VerifyCommandOutput = await this.kmsClient.send(command);
      const verificationResult: KMSVerificationResult = {
        mac: response.SignatureValid,
      };
      return verificationResult;
    } catch (error) {
      console.error('Error while verifying from KMS:', error);
      return Promise.reject(processKMSError(error));
    }
  }
}
