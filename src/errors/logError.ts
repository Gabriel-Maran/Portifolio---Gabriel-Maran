import type { ErrorCode } from '../globals/errorMessages.ts';
import { toAppError } from './AppError.ts';

// Único ponto do site que escreve no console: o lint barra console em qualquer outro arquivo.
export function logError(
  error: unknown,
  code: ErrorCode = 'UNEXPECTED',
  details?: Record<string, unknown>,
): void {
  const appError = toAppError(error, code);
  console.error(`[${appError.code}] ${appError.message}`, { cause: appError.cause, ...details });
}
