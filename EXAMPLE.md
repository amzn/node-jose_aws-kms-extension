### Importing variables from modules @aws-crypto/node-jose_aws-kms-extension and @aws-sdk/client-kms

```ts
import {
  jose,
  KMSAsymmetricSigningKey,
  KMSSymmetricCEK,
  KMSSymmetricKey,
} from '@aws-crypto/node-jose_aws-kms-extension';
import { KMSClient } from "@aws-sdk/client-kms";
```

### Creating KMS Client

```ts
const kmsClient: KMSClient = new KMSClient({
  region: 'REGION',
  credentials: {
    accessKeyId: 'EXAMPLEACCESSKEY',
    secretAccessKey: 'examplesecretkey/K',
  },
});
```

### Signing

1. Prepare signing options with format as `compact`, and header fields.
2. Prepare signatory with key as KMSAsymmetricSigningKey object.
3. Use jose.JWS.createSign method to sign the payload.

```ts
const signingOpts = {
  format: 'compact',
  fields: {
    alg: 'SIGNING_ALGORITHM',
    kid: 'KMS_SIGNING_KEY_ID',
    JWS_CRIT_HEADER1: 'JWS_CRIT_HEADER1_VALUE',
    JWS_CRIT_HEADER2: 'JWS_CRIT_HEADER2_VALUE',
    crit: ['JWS_CRIT_HEADER1', 'JWS_CRIT_HEADER2'],
  },
};

const signatory = {
  key: new KMSAsymmetricSigningKey('KMS_SIGNING_KEY', kmsClient),
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

  ```

### Encryption

1. Prepare encryption options with format as `compact`, header fields and cek as KMSSymmetricCEK object.
2. Prepare encryption recipient with reference as `false`, and key as KMSSymmetricKey object. Use same kms key to create KMSSymmetricCEK and KMSSymmetricKey.
3. Use jose.JWE.createEncrypt method to encrypt jws payload.

```ts
const encryptionOpts = {
  format: 'compact',
  fields: {
    kid: 'ENCRYPTION_KMS_KEY_ID',
    alg: 'KEY_ENCRYPTION_ALGORITHM',
    enc: 'CONTENT_ENCRYPTION_ALGORITHM',
    JWE_CRIT_HEADER1: 'JWE_CRIT_HEADER1_VALUE',
    JWE_CRIT_HEADER2: 'JWE_CRIT_HEADER2_VALUE',
    crit: ['JWE_CRIT_HEADER1', 'JWE_CRIT_HEADER2'],
  },
  cek: new KMSSymmetricCEK('KMS_ENCRYPTION_KEY', kmsClient, 'KEY_ENCRYPTION_ALGORITHM'),
};

const encryptionRecipient = {
  reference: false,
  key: new KMSSymmetricKey('KMS_ENCRYPTION_KEY', kmsClient),
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

```

###  Decryption

1. Prepare decryption options with handlers to process jwe critical headers.
2. Preare decryption assumed key as KMSSymmetricKey object
3. Use jose.JWE.createDecrypt method to decrypt jwe payload.

```ts
const decryption_opts = {
  handlers: {
    JWE_CRIT_HEADER1: function(jwe: any) { 
      console.log(jwe.header.JWE_CRIT_HEADER1)
      // process JWE_CRIT_HEADER1
    },
    JWE_CRIT_HEADER2: function(jwe: any) {
      console.log(jwe.header.JWE_CRIT_HEADER2)
      // process JWE_CRIT_HEADER2
    }
  },
};

const decryption_assumedKey = new KMSSymmetricKey(
  'KMS_ENCRYPTION_KEY',
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
```

###  Verification

1. Prepare verification options with handlers to process jws critical headers.
2. Prepare verification assumed key as KMSAsymmetricSigningKey object
3. Use jose.JWS.createVerify method to verify jws payload.

```ts
const verification_opts = {
  handlers: {
    JWS_CRIT_HEADER1: function(jws: any) { 
      console.log(jws.header.JWS_CRIT_HEADER1)
      // process JWS_CRIT_HEADER1
    },
    JWS_CRIT_HEADER2: function(jws: any) {
      console.log(jws.header.JWS_CRIT_HEADER2)
      // process JWS_CRIT_HEADER2
    }
  },
};

const verificationAssumedKey = new KMSAsymmetricSigningKey(
  'KMS_SIGNING_KEY',
  kmsClient,
);

const verifier = jose.JWS.createVerify(
  verificationAssumedKey,
  verification_opts,
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