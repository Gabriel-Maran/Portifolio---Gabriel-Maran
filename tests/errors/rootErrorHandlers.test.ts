import assert from 'node:assert/strict';
import { test } from 'node:test';
import { rootErrorHandlers } from '../../src/errors/rootErrorHandlers.ts';
import { ERROR_MESSAGES, type ErrorCode } from '../../src/globals/errorMessages.ts';

const expectedCodes: Array<[handler: keyof typeof rootErrorHandlers, code: ErrorCode]> = [
  ['onCaughtError', 'RENDER_FAILED'],
  ['onUncaughtError', 'UNCAUGHT'],
  ['onRecoverableError', 'RECOVERABLE'],
];

for (const [handler, code] of expectedCodes) {
  test(`${handler} registra como ${code}, com a pilha de componentes`, (t) => {
    const consoleError = t.mock.method(console, 'error', () => {});
    const cause = new Error('falha');

    rootErrorHandlers[handler](cause, { componentStack: 'at HomePage' });

    assert.deepEqual(consoleError.mock.calls[0]?.arguments, [
      `[${code}] ${ERROR_MESSAGES[code]}`,
      { cause, componentStack: 'at HomePage' },
    ]);
  });
}

test('aceita erro sem pilha de componentes', (t) => {
  const consoleError = t.mock.method(console, 'error', () => {});

  rootErrorHandlers.onRecoverableError('falha', {});

  assert.deepEqual(consoleError.mock.calls[0]?.arguments[1], {
    cause: 'falha',
    componentStack: undefined,
  });
});
