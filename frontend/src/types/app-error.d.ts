declare global {
  type AppErrorOptions = {
    code: ErrorCode;  // standardized error code
    status?: number;  // http status
    message?: string;  // human-readable message
    cause?: unknown;  // raw error
    timestamp?: Date; // timestamp
  }

  type ErrorCode =
  // api errors
  | "api.endpoint_not_found"            // api endpoint doesn't exist
  | "api.incomplete_request"            // request is missing required parts
  | "api.invalid_content_type"          // invalid or missing content type
  | "api.invalid_parameters"            // invalid query parameters
  | "api.invalid_request"               // malformed request
  | "api.method_not_allowed"            // http method not allowed for endpoint
  | "api.rate_limit_exceeded"           // too many requests in time period
  | "api.service_unavailable"           // api service temporarily unavailable
  | "api.unsupported_media_type"        // content type not supported
  | "api.version_deprecated"            // api version is deprecated

  // authentication errors
  | "auth.account_locked"               // user account is locked or disabled
  | "auth.expired_token"                // jwt or session token has expired
  | "auth.insufficient_permissions"     // user doesn't have required permissions
  | "auth.invalid_credentials"          // invalid username/password combination
  | "auth.invalid_token"                // token is malformed or invalid
  | "auth.mfa_required"                 // multi-factor authentication required
  | "auth.missing_token"                // required authentication token not provided
  | "auth.password_expired"             // password has expired and needs reset
  | "auth.social_provider_error"        // error with OAuth or social login provider
  | "auth.verification_failed"          // verification (email, phone, captcha) failed
  | "auth.verification_required"        // account needs email/phone verification

  // business Logic errors
  | "business.expired_resource"         // resource has expired
  | "business.inactive_account"         // account is inactive or suspended
  | "business.insufficient_funds"       // not enough funds/credits for operation
  | "business.insufficient_permissions" // user doesn't have required permissions
  | "business.invalid_operation"        // operation violates business rules
  | "business.invalid_parameters"       // parameters and not valid against business rules
  | "business.invalid_status"           // invalid status transition
  | "business.limit_exceeded"           // user or account limit exceeded
  | "business.precondition_failed"      // required precondition not met
  | "business.resource_conflict"        // operation would create conflicting state
  | "business.unavailable_resource"     // resource temporarily unavailable
  | "business.workflow_violation"       // violates defined business process

  // database errors
  | "database.already_exists"           // record already exists (duplicate)
  | "database.connection_error"         // failed to connect to database
  | "database.constraint_violation"     // database constraint violation
  | "database.deadlock"                 // deadlock detected in database
  | "database.foreign_key_violation"    // foreign key constraint error
  | "database.not_found"                // requested record not found
  | "database.query_error"              // generic database query error
  | "database.regex_violation"          // value does not conform to acceptable regex
  | "database.timeout"                  // database operation timed out
  | "database.transaction_error"        // transaction failed or rolled back
  | "database.unique_violation"         // unique constraint violation
  | "database.unknown_error"            // unknown error
  | "database.validation_error"         // validation error with no PXXXX code

  // external Service errors
  | "external.authentication_error"     // failed to authenticate with external service
  | "external.configuration_error"      // external service misconfigured
  | "external.invalid_request"          // external service rejected request
  | "external.invalid_response"         // invalid response from external service
  | "external.quota_exceeded"           // external service quota exceeded
  | "external.rate_limited"             // external service rate limit reached
  | "external.service_error"            // generic external service error
  | "external.service_unavailable"      // external service is down or unreachable
  | "external.timeout"                  // external service request timed out
  | "external.unsupported_feature"      // feature not supported by external service

  // file errors
  | "file.corrupt"                      // file is corrupt or damaged
  | "file.exceeded_limit"               // user exceeded storage quota
  | "file.invalid_format"               // file format not supported
  | "file.invalid_operation"            // operation not allowed on file
  | "file.not_found"                    // file not found
  | "file.read_error"                   // error reading file
  | "file.storage_error"                // error storing file
  | "file.upload_too_large"             // uploaded file exceeds size limit
  | "file.virus_detected"               // security scan detected malware
  | "file.write_error"                  // error writing file

  // security errors
  | "security.csrf_failure"             // csrf token validation failed
  | "security.encryption_error"         // error during encryption/decryption
  | "security.injection_detected"       // potential injection attack detected
  | "security.invalid_origin"           // request from unauthorized origin
  | "security.invalid_signature"        // invalid request signature
  | "security.ip_blocked"               // ip address is blocked or blacklisted
  | "security.recaptcha_failed"         // reCAPTCHA or bot check failed
  | "security.suspicious_activity"      // suspicious activity detected
  | "security.too_many_attempts"        // too many failed attempts (e.g., login)
  | "security.xss_detected"             // potential XSS attack detected

  // system errors
  | "system.configuration_error"        // system misconfiguration
  | "system.critical_error"             // critical system error
  | "system.dependency_failure"         // system dependency failure
  | "system.environment_error"          // environment setup error
  | "system.internal_error"             // unspecified internal server error
  | "system.maintenance_mode"           // system in maintenance mode
  | "system.not_implemented"            // feature not implemented
  | "system.resource_exhausted"         // system resources exhausted
  | "system.service_unavailable"        // system service unavailable
  | "system.unexpected_state"           // system in unexpected state

  // validation errors
  | "validation.complex_validation"     // failed complex validation rule
  | "validation.duplicate_value"        // value must be unique but already exists
  | "validation.expired"                // provided data has expired (e.g., reset token)
  | "validation.invalid_combination"    // combination of fields is invalid
  | "validation.invalid_format"         // data doesn't match expected format
  | "validation.invalid_length"         // string too short/long or array size issue
  | "validation.invalid_state"          // operation invalid in current state
  | "validation.invalid_type"           // wrong data type provided
  | "validation.invalid_value"          // value outside of allowed range/set
  | "validation.required_field"         // a required field is missing

  // unknown
  | "unknown.error"                     // fuck if I know
}

export { AppErrorOptions, ErrorCode };