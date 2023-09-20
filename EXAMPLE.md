```ts
import {
  jose,
  KMSAsymmetricSigningKey,
  KMSSymmetricCEK,
  KMSSymmetricKey,
} from 'node-jose-aws-kms-extension';
import { KMSClient } from "@aws-sdk/client-kms";

const kmsClient: KMSClient = new KMSClient({
  region: 'us-west-1',
  credentials: {
    accessKeyId: 'EXAMPLEACCESSKEY',
    secretAccessKey: 'examplesecretkey/K',
  },
});

//  Signing

const signingOpts = {
  format: 'compact',
  compact: true,
  fields: {
    exp: 1714194877000,
    alg: 'RSASSA_PSS_SHA_512',
    kid: 'arn:aws:kms:eu-west-1:123456123456:alias/ExampleSigningKey',
    crit: ['exp'],
  },
};

const signatory = {
  reference: false,
  key: new KMSAsymmetricSigningKey('alias/ExampleSigningKey', kmsClient),
};

const dataToSign = 'This is the data to sign';
const signer = jose.JWS.createSign(signingOpts, signatory);
const jws: Promise<string> = signer
  .update(dataToSign)
  .final()
  .then(function (result: string) {
    console.log('JWS: ', result);
    return result;
  });

// Encryption

const encryptionOpts = {
  format: 'compact',
  contentAlg: 'A256GCM',
  fields: {
    kid: 'arn:aws:kms:eu-west-1:123456123456:alias/ExampleEncryptionKey',
    alg: 'SYMMETRIC_DEFAULT',
    enc: 'A256GCM',
  },
  cek: new KMSSymmetricCEK('alias/ExampleEncryptionKey', kmsClient, 'AES_256'),
};

const encryptionRecipient = {
  reference: false,
  key: new KMSSymmetricKey('alias/ExampleEncryptionKey', kmsClient),
};

const encrypter = jose.JWE.createEncrypt(
  encryptionOpts,
  encryptionRecipient,
);
const jwe: Promise<string> = jws.then(function (jws: string) {
  return encrypter
    .update(jws)
    .final()
    .then(function (result: string) {
      console.log('JWE: ', result);
      return result;
    });
});

//  Decryption

const decryption_opts = {
  handlers: {
    exp: true,
  },
};

const decryption_assumedKey = new KMSSymmetricKey(
  'alias/ExampleEncryptionKey',
  kmsClient,
);

const decrypter = jose.JWE.createDecrypt(
  decryption_assumedKey,
  decryption_opts,
);

const decyptedContent: Promise<any> = jwe.then(function (jwe: string) {
  return decrypter.decrypt(jwe).then(function (result: any) {
    console.log('JWE decryption result: ', result);
    return result;
  });
});

//  Verification

const verificationAssumedKey = new KMSAsymmetricSigningKey(
  'alias/ExampleSigningKey',
  kmsClient,
);

const verifier = jose.JWS.createVerify(
  verificationAssumedKey,
  decryption_opts,
);
const verificationResult: Promise<any> = decyptedContent.then(function (
  decryptedContent: any,
) {
  const payloadToVerify = jose.util.utf8.encode(decryptedContent.payload);
  return verifier.verify(payloadToVerify).then(function (result: any) {
    console.log('JWS verification result: ', result);
    console.log('Verified payload: ', jose.util.utf8.encode(result.payload));
    return result;
  });
});
```