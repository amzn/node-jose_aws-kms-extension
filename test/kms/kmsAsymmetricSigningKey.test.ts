jest.mock('@aws-sdk/client-kms');
import { KMSClient, SignCommand, VerifyCommand } from '@aws-sdk/client-kms';
import { KMSAsymmetricSigningKey } from '../../src/kms/kmsAsymmetricSigningKey';
import {
  KMSInvalidKeyFormatError,
  KMSUnSupportedAlgorithmError,
} from '../../src/exceptions';
import jose from '../../src/jose';
var testConstants = require('../constants/testConstants');
import { TEST_KMS_ERRORS } from '../constants/testConstants';

describe('KMSAsymmetricSigningKey', () => {
  let kmsClient: KMSClient;
  let kmsAsymmetricSigningKey: KMSAsymmetricSigningKey;

  beforeEach(() => {
    kmsClient = new KMSClient({});
    kmsClient.send = jest
      .fn()
      .mockResolvedValue(
        Promise.resolve({ Signature: testConstants.SIGNED_DATA }),
      );

    jose.JWA.digest = jest
      .fn()
      .mockResolvedValue(
        Promise.resolve(Buffer.from(testConstants.TEST_MESSAGE)),
      );

    kmsAsymmetricSigningKey = new KMSAsymmetricSigningKey(
      testConstants.VALID_KMS_KEY_ID,
      kmsClient,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sign', () => {
    it('calls KMS sign API', async () => {
      const result = await kmsAsymmetricSigningKey.sign(
        testConstants.RSASSA_PSS_SHA_256_ALGORITHM,
        Buffer.from(testConstants.TEST_MESSAGE),
      );

      expect(SignCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          Message: Buffer.from(testConstants.TEST_MESSAGE),
          MessageType: testConstants.DIGEST_MESSAGE_TYPE,
          SigningAlgorithm: testConstants.RSASSA_PSS_SHA_256_ALGORITHM,
        }),
      );

      expect(result).toEqual({
        mac: testConstants.SIGNED_DATA,
      });
    });

    it('throws KMSInvalidKeyFormatError when creating an instance with an invalid key format', () => {
      expect(
        () =>
          new KMSAsymmetricSigningKey(
            testConstants.INVALID_KMS_KEY_ID,
            kmsClient,
          ),
      ).toThrow(KMSInvalidKeyFormatError);
    });

    it('throws UnSupportedAlgorithmError when signing data with unsupported algorithm', async () => {
      await expect(async () => {
        await kmsAsymmetricSigningKey.sign(
          testConstants.SHA256_ALGORITHM,
          Buffer.from(testConstants.TEST_MESSAGE),
        );
      }).rejects.toThrow(KMSUnSupportedAlgorithmError);
    });

    describe.each(TEST_KMS_ERRORS)(
      'process %s with %s',
      ({ error, expected }) => {
        it('should reject with KMSTransientError, KMSValidationError or KMSError when encountered error while signing', async () => {
          kmsClient.send = jest
            .fn()
            .mockRejectedValue(new error(testConstants.ERROR_MESSAGE));

          await expect(async () => {
            await kmsAsymmetricSigningKey.sign(
              testConstants.RSASSA_PSS_SHA_256_ALGORITHM,
              Buffer.from(testConstants.TEST_MESSAGE),
            );
          }).rejects.toThrow(expected);
        });
      },
    );
  });

  describe('verify', () => {
    it('should verify the signature', async () => {
      kmsClient.send = jest
        .fn()
        .mockResolvedValue(Promise.resolve({ SignatureValid: true }));

      const result = await kmsAsymmetricSigningKey.verify(
        testConstants.RSASSA_PSS_SHA_256_ALGORITHM,
        Buffer.from(testConstants.TEST_MESSAGE),
        Buffer.from(testConstants.SIGNATURE),
      );

      expect(VerifyCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          KeyId: testConstants.VALID_KMS_KEY_ID,
          Message: Buffer.from(testConstants.TEST_MESSAGE),
          MessageType: testConstants.DIGEST_MESSAGE_TYPE,
          Signature: Buffer.from(testConstants.SIGNATURE),
          SigningAlgorithm: testConstants.RSASSA_PSS_SHA_256_ALGORITHM,
        }),
      );

      expect(result).toEqual({
        mac: true,
      });
    });

    describe.each(TEST_KMS_ERRORS)(
      'process %s with %s',
      ({ error, expected }) => {
        it('should reject with KMSTransientError, KMSValidationError or KMSError when encountered error while verification', async () => {
          kmsClient.send = jest
            .fn()
            .mockRejectedValue(new error(testConstants.ERROR_MESSAGE));

          await expect(async () => {
            await kmsAsymmetricSigningKey.verify(
              testConstants.RSASSA_PSS_SHA_256_ALGORITHM,
              Buffer.from(testConstants.TEST_MESSAGE),
              Buffer.from(testConstants.SIGNATURE),
            );
          }).rejects.toThrow(expected);
        });
      },
    );
  });
});
