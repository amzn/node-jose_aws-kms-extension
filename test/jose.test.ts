jest.mock('node-jose');
jest.mock('@aws-sdk/client-kms');
import jose from '../src/jose';
import { KMSClient } from '@aws-sdk/client-kms';
import { KMSAsymmetricSigningKey } from '../src/kms/kmsAsymmetricSigningKey';
import { KMSSymmetricKey } from '../src/kms/kmsSymmetricKey';
import { KMSSymmetricCEK } from '../src/kms/kmsSymmetricCEK';
const asKeySpy = jest.spyOn(jose.JWK, 'asKey');
const isKeySpy = jest.spyOn(jose.JWK, 'isKey');
var testConstants = require('./constants/testConstants');

describe('jose.JWK', () => {
  let kmsClient: KMSClient;

  beforeEach(() => {
    kmsClient = new KMSClient({ region: 'eu-west-1' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('asKey', () => {
    it('should return original key if KMSASymmetricSigningKey', async () => {
      const kmsKey = new KMSAsymmetricSigningKey(
        testConstants.VALID_KMS_KEY_ID,
        kmsClient,
      );
      const result = await jose.JWK.asKey(kmsKey);

      expect(result).toBe(kmsKey);
    });

    it('should return original key if KMSSymmetricKey', async () => {
      const kmsSymmetricKey = new KMSSymmetricKey(
        testConstants.VALID_KMS_KEY_ID,
        kmsClient,
      );
      const result = await jose.JWK.asKey(kmsSymmetricKey);

      expect(result).toBe(kmsSymmetricKey);
    });

    it('should return original key if KMSSymmetricCEK', async () => {
      const kmsClient = new KMSClient({});
      const cek = new KMSSymmetricCEK(
        testConstants.VALID_KMS_KEY_ID,
        kmsClient,
        testConstants.AES_256_KEY_SPEC,
      );
      const result = await jose.JWK.asKey(cek);

      expect(result).toBe(cek);
    });

    it('should call original method if not KMSASymmetricSigningKey,KMSSymmetricKey or KMSSymmetricCEK', async () => {
      const nonKMSKey = testConstants.KEY_OTHER_THAN_KMS;
      await jose.JWK.asKey(nonKMSKey, 'form', 'extras');

      expect(asKeySpy).toHaveBeenCalledWith(nonKMSKey, 'form', 'extras');
    });
  });

  describe('isKey', () => {
    it('should return original key if KMSASymmetricSigningKey', async () => {
      const kmsClient = new KMSClient({});
      const kmsAsymmetricSigningKey = new KMSAsymmetricSigningKey(
        testConstants.VALID_KMS_KEY_ID,
        kmsClient,
      );
      const result = await jose.JWK.isKey(kmsAsymmetricSigningKey);

      expect(result).toBe(true);
    });

    it('should return original key if KMSSymmetricKey', async () => {
      const kmsClient = new KMSClient({});
      const kmsSymmetricKey = new KMSSymmetricKey(
        testConstants.VALID_KMS_KEY_ID,
        kmsClient,
      );
      const result = await jose.JWK.isKey(kmsSymmetricKey);

      expect(result).toBe(true);
    });

    it('should call original method if not KMSASymmetricSigningKey or KMSSymmetricKey', async () => {
      const nonKMSKey = testConstants.KEY_OTHER_THAN_KMS;
      await jose.JWK.isKey(nonKMSKey);

      expect(isKeySpy).toHaveBeenCalledWith(nonKMSKey);
    });
  });
});
