import assert from 'node:assert/strict';
import { test } from 'node:test';
import { installGlobalErrorHandlers } from '../../src/errors/installGlobalErrorHandlers.ts';
import { ERROR_MESSAGES } from '../../src/globals/errorMessages.ts';

// O Node não tem ErrorEvent nem PromiseRejectionEvent, então os testes montam eventos equivalentes.
const errorEvent = (error: unknown) =>
  Object.assign(new Event('error', { cancelable: true }), {
    error,
    message: 'mensagem do navegador',
  });

const rejectionEvent = (reason: unknown) =>
  Object.assign(new Event('unhandledrejection', { cancelable: true }), { reason });

test('registra erros não tratados e evita o registro duplicado do navegador', (t) => {
  const consoleError = t.mock.method(console, 'error', () => {});
  const target = new EventTarget();
  const dispose = installGlobalErrorHandlers(target);
  const cause = new Error('falha');
  const event = errorEvent(cause);

  target.dispatchEvent(event);
  dispose();

  assert.ok(event.defaultPrevented);
  assert.deepEqual(consoleError.mock.calls[0]?.arguments, [
    `[UNCAUGHT] ${ERROR_MESSAGES.UNCAUGHT}`,
    { cause },
  ]);
});

test('usa a mensagem do evento quando o erro não vem junto', (t) => {
  const consoleError = t.mock.method(console, 'error', () => {});
  const target = new EventTarget();
  const dispose = installGlobalErrorHandlers(target);

  target.dispatchEvent(errorEvent(null));
  dispose();

  assert.deepEqual(consoleError.mock.calls[0]?.arguments[1], { cause: 'mensagem do navegador' });
});

test('registra promises rejeitadas sem tratamento', (t) => {
  const consoleError = t.mock.method(console, 'error', () => {});
  const target = new EventTarget();
  const dispose = installGlobalErrorHandlers(target);
  const event = rejectionEvent('motivo');

  target.dispatchEvent(event);
  dispose();

  assert.ok(event.defaultPrevented);
  assert.deepEqual(consoleError.mock.calls[0]?.arguments, [
    `[UNHANDLED_REJECTION] ${ERROR_MESSAGES.UNHANDLED_REJECTION}`,
    { cause: 'motivo' },
  ]);
});

test('para de escutar depois de removido', (t) => {
  const consoleError = t.mock.method(console, 'error', () => {});
  const target = new EventTarget();

  installGlobalErrorHandlers(target)();
  target.dispatchEvent(errorEvent(new Error('falha')));
  target.dispatchEvent(rejectionEvent('motivo'));

  assert.equal(consoleError.mock.callCount(), 0);
});
