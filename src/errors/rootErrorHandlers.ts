import type { RootOptions } from 'react-dom/client';
import type { ErrorCode } from '../globals/errorMessages.ts';
import { logError } from './logError.ts';

interface ReactErrorInfo {
  componentStack?: string | undefined;
}

const logReactError = (code: ErrorCode) => (error: unknown, errorInfo: ReactErrorInfo) =>
  logError(error, code, { componentStack: errorInfo.componentStack });

// O React entrega aqui todos os erros da árvore, então o registro não se espalha pelos componentes.
export const rootErrorHandlers = {
  onCaughtError: logReactError('RENDER_FAILED'),
  onUncaughtError: logReactError('UNCAUGHT'),
  onRecoverableError: logReactError('RECOVERABLE'),
} satisfies RootOptions;
