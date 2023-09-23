# node-jose-aws-kms-extension

This library is an extension of the [node-jose](https://www.npmjs.com/package/node-jose) library, and uses monkey-patching to extend the capabilities of node-jose. It provides JWE-based encrypters/decrypters and JWS-based signers/verifiers for cryptographic operations with keys stored in AWS Key Management Service (KMS).

## Installation

You can install the library from npm using the following command. This library requires Node.js 18 or above.

```bash
npm install https://github.com/amzn/node-jose-aws-kms-extension.git
```


## Usage
Import the necessary classes from `node-jose-aws-kms-extension`` module:

```ts
import {
  KMSAsymmetricSigningKey,
  KMSSymmetricCEK,
  KMSSymmetricKey,
} from 'node-jose-aws-kms-extension';
```

Import the main jose object.
```ts
import { jose } from 'node-jose-aws-kms-extension';
```

Now, you can use all existing node-jose features as you would in the absence of this library. This library adds AWS KMS support transparently. You can use your AWS KMS keys for various encryption and signing operations using the regular node-jose functions. AWS KMS-specific algorithm names are supported.


Supported `node-jose` functions include:

1. `jose.JWE.createEncrypt()`
1. `jose.JWE.createDecrypt()`
1. `jose.JWS.createSign()`
1. `jose.JWS.createVerify()`

This library uses [@aws-sdk/client-kms](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/kms/)
for all its communication with AWS KMS.

For consolidated usage examples, see [Example](EXAMPLE.md)


# Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.


## License

This library is distributed under the
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0),
see [LICENSE](LICENSE) and [NOTICE](NOTICE) for more information.
