jest.mock('@aws-sdk/client-kms');
import { KMSSymmetricCEK } from '../../src/kms/kmsSymmetricCEK';
import {
  KMSClient,
  GenerateDataKeyCommandOutput,
  GenerateDataKeyCommand,
} from '@aws-sdk/client-kms';
import { KMSInvalidKeyFormatError } from '../../src/exceptions';
const jose = require('node-jose');
const testConstants = require('../constants/testConstants');
import { TEST_KMS_ERRORS } from '../constants/testConstants';

const mockedPlaintext = new Uint8Array([
  0x6d, 0x6f, 0x63, 0x6b, 0x65, 0x64, 0x2d, 0x70, 0x6c, 0x61, 0x69, 0x6e, 0x74,
  0x2d, 0x6b, 0x65, 0x79,
]);

const mockGenerateDataKeyCommandResponse: GenerateDataKeyCommandOutput = {
  Plaintext: mockedPlaintext,
  CiphertextBlob: testConstants.MOCKED_CIPHER_DATA_KEY,
  $metadata: {},
};

describe('KMSSymmetricCEK', () => {
  let kmsClient: KMSClient;
  let kmsSymmetricCEK: KMSSymmetricCEK;

  beforeEach(() => {
    kmsClient = new KMSClient({ region: 'eu-west-1' });
    kmsClient.send = jest
      .fn()
      .mockResolvedValue(mockGenerateDataKeyCommandResponse);
    jose.JWA.encrypt = jest
      .fn()
      .mockReturnValue(testConstants.ENCRYPTED_CONTENT);
    kmsSymmetricCEK = new KMSSymmetricCEK(
      testConstants.VALID_KMS_KEY_ID,
      kmsClient,
      testConstants.AES_256_KEY_SPEC,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('throws KMSInvalidKeyFormatError when creating an instance with an invalid key format', () => {
    expect(
      () =>
        new KMSSymmetricCEK(
          testConstants.INVALID_KMS_KEY_ID,
          kmsClient,
          testConstants.AES_256_KEY_SPEC,
        ),
    ).toThrow(KMSInvalidKeyFormatError);
  });

  describe('get', () => {
    it('should call GenerateDataKeyCommand with correct params and return encrypted datakey in result', async () => {
      const result = await kmsSymmetricCEK.get();

      expect(GenerateDataKeyCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          KeyId: testConstants.VALID_KMS_KEY_ID,
          KeySpec: testConstants.AES_256_KEY_SPEC,
        }),
      );

      expect(result).toEqual({ data: testConstants.MOCKED_CIPHER_DATA_KEY });
    });

    describe.each(TEST_KMS_ERRORS)(
      'process %s with %s',
      ({ error, expected }) => {
        it('should reject with KMSTransientError, KMSValidationError or KMSError when encountered error while generating data key', async () => {
          kmsClient.send = jest
            .fn()
            .mockRejectedValue(new error(testConstants.ERROR_MESSAGE));

          await expect(async () => {
            await kmsSymmetricCEK.get();
          }).rejects.toThrow(expected);
        });
      },
    );
  });

  describe('encrypt', () => {
    it('should call JWA.encrypt with correct params and return encrypt data using jose.JWA.encrypt', async () => {
      await kmsSymmetricCEK.get();
      const result = await kmsSymmetricCEK.encrypt(
        testConstants.CONTENT_ALGORITHM,
        testConstants.SIGNED_CONTENT,
        {},
      );

      expect(jose.JWA.encrypt).toHaveBeenCalledWith(
        testConstants.CONTENT_ALGORITHM,
        mockedPlaintext,
        testConstants.SIGNED_CONTENT,
        {},
      );

      expect(result).toEqual(testConstants.ENCRYPTED_CONTENT);
    });
  });
});
