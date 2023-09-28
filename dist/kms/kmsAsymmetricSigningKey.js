"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KMSAsymmetricSigningKey = void 0;
const client_kms_1 = require("@aws-sdk/client-kms");
const constants_1 = require("../constants/constants");
const utils_1 = require("../utils");
/**
 * Asymmetric signing key using AWS KMS
 */
class KMSAsymmetricSigningKey {
    /**
     * Creates an instance of KMSAsymmetricSigningKey
     *
     * @param {string} keyId - KMS key ID to use for signing.
     * @param {KMSClient} kmsClient - KMS client instance to interact with AWS KMS
     */
    constructor(keyId, kmsClient) {
        (0, utils_1.validateKeyFormat)(keyId);
        this.keyId = keyId;
        this.kmsClient = kmsClient;
    }
    /**
     * Signs the provided data using KMS Sign Command
     *
     * @param {string} signingAlgorithm - The algorithm to use for signing
     * @param {Buffer} dataToSign - The data to sign
     * @returns {Promise<KMSSigningResult>} - Promise resolving to object with the signature result
     */
    async sign(signingAlgorithm, dataToSign) {
        const digestToSign = await (0, utils_1.digestData)(signingAlgorithm, dataToSign);
        const input = {
            KeyId: this.keyId,
            Message: digestToSign,
            MessageType: constants_1.DIGEST_MESSAGE_TYPE,
            SigningAlgorithm: signingAlgorithm,
        };
        const command = new client_kms_1.SignCommand(input);
        try {
            const response = await this.kmsClient.send(command);
            const signingResult = {
                mac: response.Signature,
            };
            return signingResult;
        }
        catch (error) {
            return Promise.reject((0, utils_1.processKMSError)(error));
        }
    }
    /**
     * Verifies the signature of the provided data using KMS Verify Command
     *
     * @param {string} signingAlgorithm - The algorithm used to generate the signature
     * @param {Buffer} dataToVerify - The original data that was signed
     * @param {Buffer} signature - The signature to verify
     * @returns {Promise<KMSVerificationResult>} - Promise resolving to object with the verification result
     */
    async verify(signingAlgorithm, dataToVerify, signature) {
        const digestToVerify = await (0, utils_1.digestData)(signingAlgorithm, dataToVerify);
        const input = {
            KeyId: this.keyId,
            Message: digestToVerify,
            MessageType: constants_1.DIGEST_MESSAGE_TYPE,
            Signature: signature,
            SigningAlgorithm: signingAlgorithm,
        };
        const command = new client_kms_1.VerifyCommand(input);
        try {
            const response = await this.kmsClient.send(command);
            const verificationResult = {
                mac: response.SignatureValid,
            };
            return verificationResult;
        }
        catch (error) {
            return Promise.reject((0, utils_1.processKMSError)(error));
        }
    }
}
exports.KMSAsymmetricSigningKey = KMSAsymmetricSigningKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia21zQXN5bW1ldHJpY1NpZ25pbmdLZXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMva21zL2ttc0FzeW1tZXRyaWNTaWduaW5nS2V5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG9EQVE2QjtBQUM3QixzREFBNkQ7QUFDN0Qsb0NBQTBFO0FBSTFFOztHQUVHO0FBQ0gsTUFBYSx1QkFBdUI7SUFJbEM7Ozs7O09BS0c7SUFDSCxZQUFZLEtBQWEsRUFBRSxTQUFvQjtRQUM3QyxJQUFBLHlCQUFpQixFQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQzdCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxLQUFLLENBQUMsSUFBSSxDQUNSLGdCQUF3QixFQUN4QixVQUFrQjtRQUVsQixNQUFNLFlBQVksR0FBRyxNQUFNLElBQUEsa0JBQVUsRUFBQyxnQkFBZ0IsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUVwRSxNQUFNLEtBQUssR0FBcUI7WUFDOUIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLE9BQU8sRUFBRSxZQUFZO1lBQ3JCLFdBQVcsRUFBRSwrQkFBbUI7WUFDaEMsZ0JBQWdCLEVBQUUsZ0JBQWdCO1NBQ25DLENBQUM7UUFFRixNQUFNLE9BQU8sR0FBRyxJQUFJLHdCQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkMsSUFBSTtZQUNGLE1BQU0sUUFBUSxHQUFzQixNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZFLE1BQU0sYUFBYSxHQUFxQjtnQkFDdEMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxTQUFTO2FBQ3hCLENBQUM7WUFDRixPQUFPLGFBQWEsQ0FBQztTQUN0QjtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUEsdUJBQWUsRUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQy9DO0lBQ0gsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxLQUFLLENBQUMsTUFBTSxDQUNWLGdCQUF3QixFQUN4QixZQUFvQixFQUNwQixTQUFpQjtRQUVqQixNQUFNLGNBQWMsR0FBRyxNQUFNLElBQUEsa0JBQVUsRUFBQyxnQkFBZ0IsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUV4RSxNQUFNLEtBQUssR0FBdUI7WUFDaEMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLE9BQU8sRUFBRSxjQUFjO1lBQ3ZCLFdBQVcsRUFBRSwrQkFBbUI7WUFDaEMsU0FBUyxFQUFFLFNBQVM7WUFDcEIsZ0JBQWdCLEVBQUUsZ0JBQWdCO1NBQ25DLENBQUM7UUFFRixNQUFNLE9BQU8sR0FBRyxJQUFJLDBCQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekMsSUFBSTtZQUNGLE1BQU0sUUFBUSxHQUF3QixNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3pFLE1BQU0sa0JBQWtCLEdBQTBCO2dCQUNoRCxHQUFHLEVBQUUsUUFBUSxDQUFDLGNBQWM7YUFDN0IsQ0FBQztZQUNGLE9BQU8sa0JBQWtCLENBQUM7U0FDM0I7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFBLHVCQUFlLEVBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUMvQztJQUNILENBQUM7Q0FDRjtBQWxGRCwwREFrRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBLTVNDbGllbnQsXG4gIFNpZ25Db21tYW5kT3V0cHV0LFxuICBTaWduQ29tbWFuZCxcbiAgU2lnbkNvbW1hbmRJbnB1dCxcbiAgVmVyaWZ5Q29tbWFuZElucHV0LFxuICBWZXJpZnlDb21tYW5kT3V0cHV0LFxuICBWZXJpZnlDb21tYW5kLFxufSBmcm9tICdAYXdzLXNkay9jbGllbnQta21zJztcbmltcG9ydCB7IERJR0VTVF9NRVNTQUdFX1RZUEUgfSBmcm9tICcuLi9jb25zdGFudHMvY29uc3RhbnRzJztcbmltcG9ydCB7IHZhbGlkYXRlS2V5Rm9ybWF0LCBkaWdlc3REYXRhLCBwcm9jZXNzS01TRXJyb3IgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBLTVNTaWduaW5nUmVzdWx0IH0gZnJvbSAnLi9tb2RlbHMva21zU2lnbmluZ1Jlc3VsdCc7XG5pbXBvcnQgeyBLTVNWZXJpZmljYXRpb25SZXN1bHQgfSBmcm9tICcuL21vZGVscy9rbXNWZXJpZmljYXRpb25SZXN1bHQnO1xuXG4vKipcbiAqIEFzeW1tZXRyaWMgc2lnbmluZyBrZXkgdXNpbmcgQVdTIEtNU1xuICovXG5leHBvcnQgY2xhc3MgS01TQXN5bW1ldHJpY1NpZ25pbmdLZXkge1xuICBrZXlJZDogc3RyaW5nO1xuICBrbXNDbGllbnQ6IEtNU0NsaWVudDtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBLTVNBc3ltbWV0cmljU2lnbmluZ0tleVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5SWQgLSBLTVMga2V5IElEIHRvIHVzZSBmb3Igc2lnbmluZy5cbiAgICogQHBhcmFtIHtLTVNDbGllbnR9IGttc0NsaWVudCAtIEtNUyBjbGllbnQgaW5zdGFuY2UgdG8gaW50ZXJhY3Qgd2l0aCBBV1MgS01TXG4gICAqL1xuICBjb25zdHJ1Y3RvcihrZXlJZDogc3RyaW5nLCBrbXNDbGllbnQ6IEtNU0NsaWVudCkge1xuICAgIHZhbGlkYXRlS2V5Rm9ybWF0KGtleUlkKTtcbiAgICB0aGlzLmtleUlkID0ga2V5SWQ7XG4gICAgdGhpcy5rbXNDbGllbnQgPSBrbXNDbGllbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2lnbnMgdGhlIHByb3ZpZGVkIGRhdGEgdXNpbmcgS01TIFNpZ24gQ29tbWFuZFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2lnbmluZ0FsZ29yaXRobSAtIFRoZSBhbGdvcml0aG0gdG8gdXNlIGZvciBzaWduaW5nXG4gICAqIEBwYXJhbSB7QnVmZmVyfSBkYXRhVG9TaWduIC0gVGhlIGRhdGEgdG8gc2lnblxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxLTVNTaWduaW5nUmVzdWx0Pn0gLSBQcm9taXNlIHJlc29sdmluZyB0byBvYmplY3Qgd2l0aCB0aGUgc2lnbmF0dXJlIHJlc3VsdFxuICAgKi9cbiAgYXN5bmMgc2lnbihcbiAgICBzaWduaW5nQWxnb3JpdGhtOiBzdHJpbmcsXG4gICAgZGF0YVRvU2lnbjogQnVmZmVyLFxuICApOiBQcm9taXNlPEtNU1NpZ25pbmdSZXN1bHQ+IHtcbiAgICBjb25zdCBkaWdlc3RUb1NpZ24gPSBhd2FpdCBkaWdlc3REYXRhKHNpZ25pbmdBbGdvcml0aG0sIGRhdGFUb1NpZ24pO1xuXG4gICAgY29uc3QgaW5wdXQ6IFNpZ25Db21tYW5kSW5wdXQgPSB7XG4gICAgICBLZXlJZDogdGhpcy5rZXlJZCxcbiAgICAgIE1lc3NhZ2U6IGRpZ2VzdFRvU2lnbixcbiAgICAgIE1lc3NhZ2VUeXBlOiBESUdFU1RfTUVTU0FHRV9UWVBFLFxuICAgICAgU2lnbmluZ0FsZ29yaXRobTogc2lnbmluZ0FsZ29yaXRobSxcbiAgICB9O1xuXG4gICAgY29uc3QgY29tbWFuZCA9IG5ldyBTaWduQ29tbWFuZChpbnB1dCk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlOiBTaWduQ29tbWFuZE91dHB1dCA9IGF3YWl0IHRoaXMua21zQ2xpZW50LnNlbmQoY29tbWFuZCk7XG4gICAgICBjb25zdCBzaWduaW5nUmVzdWx0OiBLTVNTaWduaW5nUmVzdWx0ID0ge1xuICAgICAgICBtYWM6IHJlc3BvbnNlLlNpZ25hdHVyZSxcbiAgICAgIH07XG4gICAgICByZXR1cm4gc2lnbmluZ1Jlc3VsdDtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHByb2Nlc3NLTVNFcnJvcihlcnJvcikpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBWZXJpZmllcyB0aGUgc2lnbmF0dXJlIG9mIHRoZSBwcm92aWRlZCBkYXRhIHVzaW5nIEtNUyBWZXJpZnkgQ29tbWFuZFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2lnbmluZ0FsZ29yaXRobSAtIFRoZSBhbGdvcml0aG0gdXNlZCB0byBnZW5lcmF0ZSB0aGUgc2lnbmF0dXJlXG4gICAqIEBwYXJhbSB7QnVmZmVyfSBkYXRhVG9WZXJpZnkgLSBUaGUgb3JpZ2luYWwgZGF0YSB0aGF0IHdhcyBzaWduZWRcbiAgICogQHBhcmFtIHtCdWZmZXJ9IHNpZ25hdHVyZSAtIFRoZSBzaWduYXR1cmUgdG8gdmVyaWZ5XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEtNU1ZlcmlmaWNhdGlvblJlc3VsdD59IC0gUHJvbWlzZSByZXNvbHZpbmcgdG8gb2JqZWN0IHdpdGggdGhlIHZlcmlmaWNhdGlvbiByZXN1bHRcbiAgICovXG4gIGFzeW5jIHZlcmlmeShcbiAgICBzaWduaW5nQWxnb3JpdGhtOiBzdHJpbmcsXG4gICAgZGF0YVRvVmVyaWZ5OiBCdWZmZXIsXG4gICAgc2lnbmF0dXJlOiBCdWZmZXIsXG4gICk6IFByb21pc2U8S01TVmVyaWZpY2F0aW9uUmVzdWx0PiB7XG4gICAgY29uc3QgZGlnZXN0VG9WZXJpZnkgPSBhd2FpdCBkaWdlc3REYXRhKHNpZ25pbmdBbGdvcml0aG0sIGRhdGFUb1ZlcmlmeSk7XG5cbiAgICBjb25zdCBpbnB1dDogVmVyaWZ5Q29tbWFuZElucHV0ID0ge1xuICAgICAgS2V5SWQ6IHRoaXMua2V5SWQsXG4gICAgICBNZXNzYWdlOiBkaWdlc3RUb1ZlcmlmeSxcbiAgICAgIE1lc3NhZ2VUeXBlOiBESUdFU1RfTUVTU0FHRV9UWVBFLFxuICAgICAgU2lnbmF0dXJlOiBzaWduYXR1cmUsXG4gICAgICBTaWduaW5nQWxnb3JpdGhtOiBzaWduaW5nQWxnb3JpdGhtLFxuICAgIH07XG5cbiAgICBjb25zdCBjb21tYW5kID0gbmV3IFZlcmlmeUNvbW1hbmQoaW5wdXQpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZTogVmVyaWZ5Q29tbWFuZE91dHB1dCA9IGF3YWl0IHRoaXMua21zQ2xpZW50LnNlbmQoY29tbWFuZCk7XG4gICAgICBjb25zdCB2ZXJpZmljYXRpb25SZXN1bHQ6IEtNU1ZlcmlmaWNhdGlvblJlc3VsdCA9IHtcbiAgICAgICAgbWFjOiByZXNwb25zZS5TaWduYXR1cmVWYWxpZCxcbiAgICAgIH07XG4gICAgICByZXR1cm4gdmVyaWZpY2F0aW9uUmVzdWx0O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocHJvY2Vzc0tNU0Vycm9yKGVycm9yKSk7XG4gICAgfVxuICB9XG59XG4iXX0=