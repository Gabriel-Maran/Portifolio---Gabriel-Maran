import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AppError } from '../../src/errors/AppError.ts';
import { logError } from '../../src/errors/logError.ts';
import { ERROR_MESSAGES } from '../../src/globals/errorMessages.ts';

test('registra código, mensagem, causa e detalhes numa linha só', (t) => {
  const consoleError = t.mock.method(console, 'error', () => {});
  const cause = new Error('falha original');

  logError(cause, 'RENDER_FAILED', { componentStack: 'at HomePage' });

  assert.equal(consoleError.mock.callCount(), 1);
  assert.deepEqual(consoleError.mock.calls[0]?.arguments, [
    `[RENDER_FAILED] ${ERROR_MESSAGES.RENDER_FAILED}`,
    { cause, componentStack: 'at HomePage' },
  ]);
});

test('usa UNEXPECTED quando não recebe código', (t) => {
  const consoleError = t.mock.method(console, 'error', () => {});

  logError('falha');

  assert.equal(
    consoleError.mock.calls[0]?.arguments[0],
    `[UNEXPECTED] ${ERROR_MESSAGES.UNEXPECTED}`,
  );
});

test('mantém o código de um AppError já criado', (t) => {
  const consoleError = t.mock.method(console, 'error', () => {});

  logError(new AppError('ROOT_NOT_FOUND'), 'UNCAUGHT');

  assert.equal(
    consoleError.mock.calls[0]?.arguments[0],
    `[ROOT_NOT_FOUND] ${ERROR_MESSAGES.ROOT_NOT_FOUND}`,
  );
});
