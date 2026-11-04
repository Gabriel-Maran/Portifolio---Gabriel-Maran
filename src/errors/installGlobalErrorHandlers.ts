import { logError } from './logError.ts';

type ErrorEventTarget = Pick<Window, 'addEventListener' | 'removeEventListener'>;

// O preventDefault evita que o navegador registre o mesmo erro uma segunda vez.
function handleError(event: ErrorEvent) {
  event.preventDefault();
  logError(event.error ?? event.message, 'UNCAUGHT');
}

function handleRejection(event: PromiseRejectionEvent) {
  event.preventDefault();
  logError(event.reason, 'UNHANDLED_REJECTION');
}

/**
 * Leva para o logError os erros que escapam de qualquer try/catch.
 * Devolve a função que remove os listeners.
 */
export function installGlobalErrorHandlers(target: ErrorEventTarget = window): () => void {
  target.addEventListener('error', handleError);
  target.addEventListener('unhandledrejection', handleRejection);

  return () => {
    target.removeEventListener('error', handleError);
    target.removeEventListener('unhandledrejection', handleRejection);
  };
}
