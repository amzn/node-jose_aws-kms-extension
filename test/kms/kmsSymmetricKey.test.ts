jest.mock('@aws-sdk/client-kms');
import { KMSSymmetricKey } from '../../src/kms/kmsSymmetricKey';
import {
  KMSClient,
  DecryptCommand,
  DecryptCommandOutput,
} from '@aws-sdk/client-kms';
import { KMSInvalidKeyFormatError } from '../../src/exceptions';
import { KMSDataKeyGenerationResult } from '../../src/kms/models/kmsDataKeyGenerationResult';
import { TEST_KMS_ERRORS } from '../constants/testConstants';
var testConstants = require('../constants/testConstants');

const mockDecryptCommandOutput: DecryptCommandOutput = {
  Plaintext: testConstants.MOCKED_PLAIN_DATA_KEY,
  $metadata: {},
};

const dataKeyGenerationResult: KMSDataKeyGenerationResult = {
  data: testConstants.MOCKED_CIPHER_DATA_KEY,
};

describe('KMSSymmetricKey', () => {
  let kmsClient: KMSClient;
  let kmsSymmetricKey: KMSSymmetricKey;

  beforeEach(() => {
    kmsClient = new KMSClient({ region: 'eu-west-1' });
    kmsClient.send = jest.fn().mockResolvedValue(mockDecryptCommandOutput);
    kmsSymmetricKey = new KMSSymmetricKey(
      testConstants.VALID_KMS_KEY_ID,
      kmsClient,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('wrap', () => {
    it('should return the cipherDataKey as is', () => {
      const result = kmsSymmetricKey.wrap(
        testConstants.AES_256_KEY_SPEC,
        dataKeyGenerationResult,
      );
      expect(result).toEqual(dataKeyGenerationResult);
    });
  });

  describe('unwrap', () => {
    it('should unwrap the key', async () => {
      const result = await kmsSymmetricKey.unwrap(
        testConstants.AES_256_KEY_SPEC,
        testConstants.MOCKED_CIPHER_DATA_KEY,
      );

      expect(DecryptCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          CiphertextBlob: testConstants.MOCKED_CIPHER_DATA_KEY,
          KeyId: testConstants.VALID_KMS_KEY_ID,
          EncryptionAlgorithm: testConstants.AES_256_KEY_SPEC,
        }),
      );
      expect(result).toEqual(testConstants.MOCKED_PLAIN_DATA_KEY);
    });

    it('throws KMSInvalidKeyFormatError when creating an instance with an invalid key format', () => {
      expect(
        () => new KMSSymmetricKey(testConstants.INVALID_KMS_KEY_ID, kmsClient),
      ).toThrow(KMSInvalidKeyFormatError);
    });

    describe.each(TEST_KMS_ERRORS)(
      'process %s with %s',
      ({ error, expected }) => {
        it('should reject with KMSTransientError, KMSValidationError or KMSError when encountered error while unwrapping data key', async () => {
          kmsClient.send = jest
            .fn()
            .mockRejectedValue(new error(testConstants.ERROR_MESSAGE));

          await expect(async () => {
            await kmsSymmetricKey.unwrap(
              testConstants.AES_256_KEY_SPEC,
              testConstants.MOCKED_CIPHER_DATA_KEY,
            );
          }).rejects.toThrow(expected);
        });
      },
    );
  });
});
