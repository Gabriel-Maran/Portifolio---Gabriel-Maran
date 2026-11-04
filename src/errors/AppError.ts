import { ERROR_MESSAGES, type ErrorCode } from '../globals/errorMessages.ts';

export class AppError extends Error {
  readonly code: ErrorCode;

  constructor(code: ErrorCode, options?: ErrorOptions) {
    super(ERROR_MESSAGES[code], options);
    this.name = 'AppError';
    this.code = code;
  }
}

/** Converte qualquer valor lançado num AppError. Se já for um, o código original prevalece. */
export function toAppError(error: unknown, fallbackCode: ErrorCode = 'UNEXPECTED'): AppError {
  if (error instanceof AppError) return error;
  return new AppError(fallbackCode, { cause: error });
}
