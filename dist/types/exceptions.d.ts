export declare class KMSError extends Error {}
export declare class KMSValidationError extends KMSError {}
export declare class KMSInvalidKeyFormatError
  extends TypeError
  implements KMSValidationError {}
export declare class KMSTransientError extends KMSError {}
export declare class KMSUnSupportedAlgorithmError extends Error {}
