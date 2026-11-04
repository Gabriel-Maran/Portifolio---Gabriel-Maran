import { expect, test } from 'vitest';
import { silenceConsoleError } from '../support/silenceConsoleError.ts';
import { rootErrorHandlers } from '../../src/errors/rootErrorHandlers.ts';
import { ERROR_MESSAGES, type ErrorCode } from '../../src/globals/errorMessages.ts';

test.each<[handler: keyof typeof rootErrorHandlers, code: ErrorCode]>([
  ['onCaughtError', 'RENDER_FAILED'],
  ['onUncaughtError', 'UNCAUGHT'],
  ['onRecoverableError', 'RECOVERABLE'],
])('%s registra como %s, com a pilha de componentes', (handler, code) => {
  const consoleError = silenceConsoleError();
  const cause = new Error('falha');

  rootErrorHandlers[handler](cause, { componentStack: 'at HomePage' });

  expect(consoleError).toHaveBeenCalledWith(`[${code}] ${ERROR_MESSAGES[code]}`, {
    cause,
    componentStack: 'at HomePage',
  });
});

test('aceita erro sem pilha de componentes', () => {
  const consoleError = silenceConsoleError();

  rootErrorHandlers.onRecoverableError('falha', {});

  expect(consoleError.mock.calls[0]?.[1]).toEqual({ cause: 'falha', componentStack: undefined });
});
