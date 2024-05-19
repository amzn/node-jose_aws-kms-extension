# node-jose_aws-kms-extension

This library is an extension of the [node-jose](https://www.npmjs.com/package/node-jose) library, and uses monkey-patching to extend the capabilities of node-jose. It provides JWE-based encrypters/decrypters and JWS-based signers/verifiers for cryptographic operations with keys stored in AWS Key Management Service (KMS).

## Installation

You can install the library from [npm](https://www.npmjs.com/package/@aws-crypto/node-jose_aws-kms-extension) using the following command. This library requires Node.js 18 or above.

```bash
npm install @aws-crypto/node-jose_aws-kms-extension
```


## Usage
Import the necessary classes from `@aws-crypto/node-jose_aws-kms-extension` module:

```ts
import {
  KMSAsymmetricSigningKey,
  KMSSymmetricCEK,
  KMSSymmetricKey,
} from '@aws-crypto/node-jose_aws-kms-extension';
```

Import the main jose object.
```ts
import { jose } from '@aws-crypto/node-jose_aws-kms-extension';
```

Now, you can use all existing node-jose features as you would in the absence of this library. This library adds AWS KMS support transparently. You can use your AWS KMS keys for various encryption and signing operations using the regular node-jose functions. AWS KMS-specific algorithm names are supported.


Supported `node-jose` functions include:

1. `jose.JWE.createEncrypt()`
1. `jose.JWE.createDecrypt()`
1. `jose.JWS.createSign()`
1. `jose.JWS.createVerify()`

This library uses [@aws-sdk/client-kms](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/kms/)
for all its communication with AWS KMS.

[Supported KMS Signing Algorithms](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-kms/Variable/SigningAlgorithmSpec/)

[Supported KMS Encryption Algorithms](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-kms/Variable/EncryptionAlgorithmSpec/)

[Supported Data Key Spec](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-kms/Variable/DataKeySpec/)

## Examples

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

### Creating AWS KMS Client

```ts
const kmsClient: KMSClient = new KMSClient({ region: 'REGION' });
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
  key: new KMSAsymmetricSigningKey('KMS_SIGNING_KEY_ID', kmsClient),
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
2. Prepare encryption recipient with reference as `false`, and key as KMSSymmetricKey object. Use same KMS key to create KMSSymmetricCEK and KMSSymmetricKey.
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
  cek: new KMSSymmetricCEK('KMS_ENCRYPTION_KEY_ID', kmsClient, 'KEY_SPEC'),
};

const encryptionRecipient = {
  reference: false,
  key: new KMSSymmetricKey('KMS_ENCRYPTION_KEY_ID', kmsClient),
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
  'KMS_ENCRYPTION_KEY_ID',
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
  'KMS_SIGNING_KEY_ID',
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

#### Note: KMS_SIGNING_KEY_ID and KMS_ENCRYPTION_KEY_ID can be KMS key ID, key ARN, alias name, or alias ARN. When using an alias name, it will have prefix `alias/`. It should be key ARN or alias ARN to specify in different Amazon Web Services account.


# Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.


## License

This library is distributed under the
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0),
see [LICENSE](LICENSE) and [NOTICE](NOTICE) for more information.