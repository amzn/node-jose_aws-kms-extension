"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KMSSymmetricKey = void 0;
const client_kms_1 = require("@aws-sdk/client-kms");
const utils_1 = require("../utils");
/**
 * Class for wrapping/unwrapping symmetric keys using AWS KMS, it implements limited functions needed for `Key` operations
 */
class KMSSymmetricKey {
    /**
     * Create an instance of KMSSymmetricKey
     *
     * @param keyId - KMS key ID to decrypt the cipher data key
     * @param kmsClient - KMS client instance to interact with AWS KMS
     */
    constructor(keyId, kmsClient) {
        (0, utils_1.validateKeyFormat)(keyId);
        this.keyId = keyId;
        this.kmsClient = kmsClient;
    }
    /**
     * Passes through data key generation result to be used in creating JWE.
     * See https://github.com/cisco/node-jose/blob/master/lib/jwe/encrypt.js
     *
     * @param encryptionAlgorithm - Encryption algorithm
     * @param kmsDataKeyGenerationResult - Result from KMS containing ciphertext
     * @returns Data key generation result to be used in creating JWE.
     */
    wrap(encryptionAlgorithm, kmsDataKeyGenerationResult) {
        return kmsDataKeyGenerationResult;
    }
    /**
     * Unwraps an encrypted symmetric key using KMS Decrypt Command
     * See https://github.com/cisco/node-jose/blob/master/lib/jwe/decrypt.js
     *
     * @param algorithm - Encryption algorithm
     * @param wrappedKey - Wrapped key to unwrap
     * @returns Promise resolving to plaintext key
     */
    async unwrap(encryptionAlgorithm, wrappedKey) {
        const input = {
            CiphertextBlob: wrappedKey,
            KeyId: this.keyId,
            EncryptionAlgorithm: encryptionAlgorithm,
        };
        const command = new client_kms_1.DecryptCommand(input);
        try {
            const response = await this.kmsClient.send(command);
            return response.Plaintext;
        }
        catch (error) {
            return Promise.reject((0, utils_1.processKMSError)(error));
        }
    }
}
exports.KMSSymmetricKey = KMSSymmetricKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia21zU3ltbWV0cmljS2V5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ttcy9rbXNTeW1tZXRyaWNLZXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsb0RBSzZCO0FBQzdCLG9DQUE4RDtBQUc5RDs7R0FFRztBQUNILE1BQWEsZUFBZTtJQUkxQjs7Ozs7T0FLRztJQUNILFlBQVksS0FBYSxFQUFFLFNBQW9CO1FBQzdDLElBQUEseUJBQWlCLEVBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDN0IsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxJQUFJLENBQ0YsbUJBQTJCLEVBQzNCLDBCQUFzRDtRQUV0RCxPQUFPLDBCQUEwQixDQUFDO0lBQ3BDLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsS0FBSyxDQUFDLE1BQU0sQ0FDVixtQkFBMkIsRUFDM0IsVUFBc0I7UUFFdEIsTUFBTSxLQUFLLEdBQXdCO1lBQ2pDLGNBQWMsRUFBRSxVQUFVO1lBQzFCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixtQkFBbUIsRUFBRSxtQkFBbUI7U0FDekMsQ0FBQztRQUNGLE1BQU0sT0FBTyxHQUFHLElBQUksMkJBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQyxJQUFJO1lBQ0YsTUFBTSxRQUFRLEdBQXlCLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDMUUsT0FBTyxRQUFRLENBQUMsU0FBUyxDQUFDO1NBQzNCO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBQSx1QkFBZSxFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDL0M7SUFDSCxDQUFDO0NBQ0Y7QUF4REQsMENBd0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgS01TQ2xpZW50LFxuICBEZWNyeXB0Q29tbWFuZCxcbiAgRGVjcnlwdENvbW1hbmRJbnB1dCxcbiAgRGVjcnlwdENvbW1hbmRPdXRwdXQsXG59IGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1rbXMnO1xuaW1wb3J0IHsgdmFsaWRhdGVLZXlGb3JtYXQsIHByb2Nlc3NLTVNFcnJvciB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IEtNU0RhdGFLZXlHZW5lcmF0aW9uUmVzdWx0IH0gZnJvbSAnLi9tb2RlbHMva21zRGF0YUtleUdlbmVyYXRpb25SZXN1bHQnO1xuXG4vKipcbiAqIENsYXNzIGZvciB3cmFwcGluZy91bndyYXBwaW5nIHN5bW1ldHJpYyBrZXlzIHVzaW5nIEFXUyBLTVMsIGl0IGltcGxlbWVudHMgbGltaXRlZCBmdW5jdGlvbnMgbmVlZGVkIGZvciBgS2V5YCBvcGVyYXRpb25zXG4gKi9cbmV4cG9ydCBjbGFzcyBLTVNTeW1tZXRyaWNLZXkge1xuICBrZXlJZDogc3RyaW5nO1xuICBrbXNDbGllbnQ6IEtNU0NsaWVudDtcblxuICAvKipcbiAgICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIEtNU1N5bW1ldHJpY0tleVxuICAgKlxuICAgKiBAcGFyYW0ga2V5SWQgLSBLTVMga2V5IElEIHRvIGRlY3J5cHQgdGhlIGNpcGhlciBkYXRhIGtleVxuICAgKiBAcGFyYW0ga21zQ2xpZW50IC0gS01TIGNsaWVudCBpbnN0YW5jZSB0byBpbnRlcmFjdCB3aXRoIEFXUyBLTVNcbiAgICovXG4gIGNvbnN0cnVjdG9yKGtleUlkOiBzdHJpbmcsIGttc0NsaWVudDogS01TQ2xpZW50KSB7XG4gICAgdmFsaWRhdGVLZXlGb3JtYXQoa2V5SWQpO1xuICAgIHRoaXMua2V5SWQgPSBrZXlJZDtcbiAgICB0aGlzLmttc0NsaWVudCA9IGttc0NsaWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXNzZXMgdGhyb3VnaCBkYXRhIGtleSBnZW5lcmF0aW9uIHJlc3VsdCB0byBiZSB1c2VkIGluIGNyZWF0aW5nIEpXRS5cbiAgICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jaXNjby9ub2RlLWpvc2UvYmxvYi9tYXN0ZXIvbGliL2p3ZS9lbmNyeXB0LmpzXG4gICAqXG4gICAqIEBwYXJhbSBlbmNyeXB0aW9uQWxnb3JpdGhtIC0gRW5jcnlwdGlvbiBhbGdvcml0aG1cbiAgICogQHBhcmFtIGttc0RhdGFLZXlHZW5lcmF0aW9uUmVzdWx0IC0gUmVzdWx0IGZyb20gS01TIGNvbnRhaW5pbmcgY2lwaGVydGV4dFxuICAgKiBAcmV0dXJucyBEYXRhIGtleSBnZW5lcmF0aW9uIHJlc3VsdCB0byBiZSB1c2VkIGluIGNyZWF0aW5nIEpXRS5cbiAgICovXG4gIHdyYXAoXG4gICAgZW5jcnlwdGlvbkFsZ29yaXRobTogc3RyaW5nLFxuICAgIGttc0RhdGFLZXlHZW5lcmF0aW9uUmVzdWx0OiBLTVNEYXRhS2V5R2VuZXJhdGlvblJlc3VsdCxcbiAgKTogS01TRGF0YUtleUdlbmVyYXRpb25SZXN1bHQge1xuICAgIHJldHVybiBrbXNEYXRhS2V5R2VuZXJhdGlvblJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVbndyYXBzIGFuIGVuY3J5cHRlZCBzeW1tZXRyaWMga2V5IHVzaW5nIEtNUyBEZWNyeXB0IENvbW1hbmRcbiAgICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jaXNjby9ub2RlLWpvc2UvYmxvYi9tYXN0ZXIvbGliL2p3ZS9kZWNyeXB0LmpzXG4gICAqXG4gICAqIEBwYXJhbSBhbGdvcml0aG0gLSBFbmNyeXB0aW9uIGFsZ29yaXRobVxuICAgKiBAcGFyYW0gd3JhcHBlZEtleSAtIFdyYXBwZWQga2V5IHRvIHVud3JhcFxuICAgKiBAcmV0dXJucyBQcm9taXNlIHJlc29sdmluZyB0byBwbGFpbnRleHQga2V5XG4gICAqL1xuICBhc3luYyB1bndyYXAoXG4gICAgZW5jcnlwdGlvbkFsZ29yaXRobTogc3RyaW5nLFxuICAgIHdyYXBwZWRLZXk6IFVpbnQ4QXJyYXksXG4gICk6IFByb21pc2U8VWludDhBcnJheSB8IHVuZGVmaW5lZD4ge1xuICAgIGNvbnN0IGlucHV0OiBEZWNyeXB0Q29tbWFuZElucHV0ID0ge1xuICAgICAgQ2lwaGVydGV4dEJsb2I6IHdyYXBwZWRLZXksXG4gICAgICBLZXlJZDogdGhpcy5rZXlJZCxcbiAgICAgIEVuY3J5cHRpb25BbGdvcml0aG06IGVuY3J5cHRpb25BbGdvcml0aG0sXG4gICAgfTtcbiAgICBjb25zdCBjb21tYW5kID0gbmV3IERlY3J5cHRDb21tYW5kKGlucHV0KTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2U6IERlY3J5cHRDb21tYW5kT3V0cHV0ID0gYXdhaXQgdGhpcy5rbXNDbGllbnQuc2VuZChjb21tYW5kKTtcbiAgICAgIHJldHVybiByZXNwb25zZS5QbGFpbnRleHQ7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChwcm9jZXNzS01TRXJyb3IoZXJyb3IpKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==