// AppError.ts
import { AppErrorOptions, ErrorCode } from '@/types/app-error'; 

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;
  public readonly message: string;
  public readonly cause?: unknown;
  public readonly timestamp: Date;

  constructor(options: AppErrorOptions) {
    super(options.message);
    this.name = "AppError";
    this.code = options.code;
    this.status = options.status || 500;
    this.message = options.message || "unknown error"
    this.cause = options.cause;
    this.timestamp = options.timestamp || new Date();
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      status: this.status,
      message: this.message,
      cause: this.cause,
      timestamp: this.timestamp
    };
  }
}