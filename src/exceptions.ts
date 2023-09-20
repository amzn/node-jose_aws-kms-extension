export class KMSError extends Error {
  /**
   * Base class for all custom KMS backend specific exceptions.
   */
}

export class KMSValidationError extends KMSError {
  /**
   * Base class for KMS validation errors.
   */
}

export class KMSInvalidKeyFormatError
  extends TypeError
  implements KMSValidationError {
  /**
   * Exception class for invalid KMS key format.
   */
}

export class KMSTransientError extends KMSError {
  /**
   * Base class for KMS transient errors.
   */
}

export class KMSUnSupportedAlgorithmError extends Error {
  /**
   * Base class for KMS unsupported algorithm error.
   */
}
