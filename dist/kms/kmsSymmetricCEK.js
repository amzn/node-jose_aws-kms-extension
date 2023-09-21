"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KMSSymmetricCEK = void 0;
const client_kms_1 = require("@aws-sdk/client-kms");
const utils_1 = require("../utils");
const jose = require('node-jose');
/**
 * Class for generating symmetric data keys using AWS KMS and encrypt the content
 */
class KMSSymmetricCEK {
    /**
     * Creates an instance of KMSSymmetricCEK.
     *
     * @param {string} keyId - KMS Key Id to use for data key generation.
     * @param {KMSClient} kmsClient - KMS client instance to interact with AWS KMS.
     * @param {string} keySpec - key spec to specify the length of the data key to generate a symmetric data key.
     */
    constructor(keyId, kmsClient, keySpec) {
        (0, utils_1.validateKeyFormat)(keyId);
        this.keyId = keyId;
        this.kmsClient = kmsClient;
        this.keySpec = keySpec;
    }
    /**
     * Generates a new data key using KMS GenerateDataKey Command
     *
     * @returns Promise resolving to object with ciphertext data key
     */
    async get() {
        const input = {
            KeyId: this.keyId,
            KeySpec: this.keySpec,
        };
        const command = new client_kms_1.GenerateDataKeyCommand(input);
        try {
            const response = await this.kmsClient.send(command);
            this.dataKey = response.Plaintext;
            const dataKeyGenerationResult = {
                data: response.CiphertextBlob,
            };
            return dataKeyGenerationResult;
        }
        catch (error) {
            return Promise.reject((0, utils_1.processKMSError)(error));
        }
    }
    /**
     * Encrypts data using the generated data key
     *
     * @param encryptionAlgorithm - Encryption algorithm to use to encrypt the data
     * @param dataToEncrypt - Data to encrypt
     * @param props - Additional encryption properties
     *
     * @returns Encrypted data
     */
    encrypt(encryptionAlgorithm, dataToEncrypt, props) {
        return jose.JWA.encrypt(encryptionAlgorithm, this.dataKey, dataToEncrypt, props);
    }
}
exports.KMSSymmetricCEK = KMSSymmetricCEK;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia21zU3ltbWV0cmljQ0VLLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ttcy9rbXNTeW1tZXRyaWNDRUsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsb0RBSzZCO0FBQzdCLG9DQUE4RDtBQUU5RCxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFFbEM7O0dBRUc7QUFDSCxNQUFhLGVBQWU7SUFNMUI7Ozs7OztPQU1HO0lBQ0gsWUFBWSxLQUFhLEVBQUUsU0FBb0IsRUFBRSxPQUFlO1FBQzlELElBQUEseUJBQWlCLEVBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsR0FBRztRQUNQLE1BQU0sS0FBSyxHQUFnQztZQUN6QyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1NBQ3RCLENBQUM7UUFDRixNQUFNLE9BQU8sR0FBRyxJQUFJLG1DQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xELElBQUk7WUFDRixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQztZQUNsQyxNQUFNLHVCQUF1QixHQUErQjtnQkFDMUQsSUFBSSxFQUFFLFFBQVEsQ0FBQyxjQUFjO2FBQzlCLENBQUM7WUFDRixPQUFPLHVCQUF1QixDQUFDO1NBQ2hDO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBQSx1QkFBZSxFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDL0M7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCxPQUFPLENBQUMsbUJBQTJCLEVBQUUsYUFBcUIsRUFBRSxLQUFVO1FBQ3BFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQ3JCLG1CQUFtQixFQUNuQixJQUFJLENBQUMsT0FBTyxFQUNaLGFBQWEsRUFDYixLQUFLLENBQ04sQ0FBQztJQUNKLENBQUM7Q0FDRjtBQTVERCwwQ0E0REMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBLTVNDbGllbnQsXG4gIEdlbmVyYXRlRGF0YUtleUNvbW1hbmQsXG4gIEdlbmVyYXRlRGF0YUtleUNvbW1hbmRJbnB1dCxcbiAgR2VuZXJhdGVEYXRhS2V5Q29tbWFuZE91dHB1dCxcbn0gZnJvbSAnQGF3cy1zZGsvY2xpZW50LWttcyc7XG5pbXBvcnQgeyB2YWxpZGF0ZUtleUZvcm1hdCwgcHJvY2Vzc0tNU0Vycm9yIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgS01TRGF0YUtleUdlbmVyYXRpb25SZXN1bHQgfSBmcm9tICcuL21vZGVscy9rbXNEYXRhS2V5R2VuZXJhdGlvblJlc3VsdCc7XG5jb25zdCBqb3NlID0gcmVxdWlyZSgnbm9kZS1qb3NlJyk7XG5cbi8qKlxuICogQ2xhc3MgZm9yIGdlbmVyYXRpbmcgc3ltbWV0cmljIGRhdGEga2V5cyB1c2luZyBBV1MgS01TIGFuZCBlbmNyeXB0IHRoZSBjb250ZW50XG4gKi9cbmV4cG9ydCBjbGFzcyBLTVNTeW1tZXRyaWNDRUsge1xuICBrZXlJZDogc3RyaW5nO1xuICBrbXNDbGllbnQ6IEtNU0NsaWVudDtcbiAga2V5U3BlYzogc3RyaW5nO1xuICBkYXRhS2V5OiBVaW50OEFycmF5IHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIEtNU1N5bW1ldHJpY0NFSy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleUlkIC0gS01TIEtleSBJZCB0byB1c2UgZm9yIGRhdGEga2V5IGdlbmVyYXRpb24uXG4gICAqIEBwYXJhbSB7S01TQ2xpZW50fSBrbXNDbGllbnQgLSBLTVMgY2xpZW50IGluc3RhbmNlIHRvIGludGVyYWN0IHdpdGggQVdTIEtNUy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleVNwZWMgLSBrZXkgc3BlYyB0byBzcGVjaWZ5IHRoZSBsZW5ndGggb2YgdGhlIGRhdGEga2V5IHRvIGdlbmVyYXRlIGEgc3ltbWV0cmljIGRhdGEga2V5LlxuICAgKi9cbiAgY29uc3RydWN0b3Ioa2V5SWQ6IHN0cmluZywga21zQ2xpZW50OiBLTVNDbGllbnQsIGtleVNwZWM6IHN0cmluZykge1xuICAgIHZhbGlkYXRlS2V5Rm9ybWF0KGtleUlkKTtcbiAgICB0aGlzLmtleUlkID0ga2V5SWQ7XG4gICAgdGhpcy5rbXNDbGllbnQgPSBrbXNDbGllbnQ7XG4gICAgdGhpcy5rZXlTcGVjID0ga2V5U3BlYztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYSBuZXcgZGF0YSBrZXkgdXNpbmcgS01TIEdlbmVyYXRlRGF0YUtleSBDb21tYW5kXG4gICAqXG4gICAqIEByZXR1cm5zIFByb21pc2UgcmVzb2x2aW5nIHRvIG9iamVjdCB3aXRoIGNpcGhlcnRleHQgZGF0YSBrZXlcbiAgICovXG4gIGFzeW5jIGdldCgpOiBQcm9taXNlPEtNU0RhdGFLZXlHZW5lcmF0aW9uUmVzdWx0PiB7XG4gICAgY29uc3QgaW5wdXQ6IEdlbmVyYXRlRGF0YUtleUNvbW1hbmRJbnB1dCA9IHtcbiAgICAgIEtleUlkOiB0aGlzLmtleUlkLFxuICAgICAgS2V5U3BlYzogdGhpcy5rZXlTcGVjLFxuICAgIH07XG4gICAgY29uc3QgY29tbWFuZCA9IG5ldyBHZW5lcmF0ZURhdGFLZXlDb21tYW5kKGlucHV0KTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmttc0NsaWVudC5zZW5kKGNvbW1hbmQpO1xuICAgICAgdGhpcy5kYXRhS2V5ID0gcmVzcG9uc2UuUGxhaW50ZXh0O1xuICAgICAgY29uc3QgZGF0YUtleUdlbmVyYXRpb25SZXN1bHQ6IEtNU0RhdGFLZXlHZW5lcmF0aW9uUmVzdWx0ID0ge1xuICAgICAgICBkYXRhOiByZXNwb25zZS5DaXBoZXJ0ZXh0QmxvYixcbiAgICAgIH07XG4gICAgICByZXR1cm4gZGF0YUtleUdlbmVyYXRpb25SZXN1bHQ7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChwcm9jZXNzS01TRXJyb3IoZXJyb3IpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRW5jcnlwdHMgZGF0YSB1c2luZyB0aGUgZ2VuZXJhdGVkIGRhdGEga2V5XG4gICAqXG4gICAqIEBwYXJhbSBlbmNyeXB0aW9uQWxnb3JpdGhtIC0gRW5jcnlwdGlvbiBhbGdvcml0aG0gdG8gdXNlIHRvIGVuY3J5cHQgdGhlIGRhdGFcbiAgICogQHBhcmFtIGRhdGFUb0VuY3J5cHQgLSBEYXRhIHRvIGVuY3J5cHRcbiAgICogQHBhcmFtIHByb3BzIC0gQWRkaXRpb25hbCBlbmNyeXB0aW9uIHByb3BlcnRpZXNcbiAgICpcbiAgICogQHJldHVybnMgRW5jcnlwdGVkIGRhdGFcbiAgICovXG4gIGVuY3J5cHQoZW5jcnlwdGlvbkFsZ29yaXRobTogc3RyaW5nLCBkYXRhVG9FbmNyeXB0OiBCdWZmZXIsIHByb3BzOiBhbnkpIHtcbiAgICByZXR1cm4gam9zZS5KV0EuZW5jcnlwdChcbiAgICAgIGVuY3J5cHRpb25BbGdvcml0aG0sXG4gICAgICB0aGlzLmRhdGFLZXksXG4gICAgICBkYXRhVG9FbmNyeXB0LFxuICAgICAgcHJvcHMsXG4gICAgKTtcbiAgfVxufVxuIl19