import { expect, test } from 'vitest';
import { silenceConsoleError } from '../support/silenceConsoleError.ts';
import { AppError } from '../../src/errors/AppError.ts';
import { logError } from '../../src/errors/logError.ts';
import { ERROR_MESSAGES } from '../../src/globals/errorMessages.ts';

test('registra código, mensagem, causa e detalhes numa linha só', () => {
  const consoleError = silenceConsoleError();
  const cause = new Error('falha original');

  logError(cause, 'RENDER_FAILED', { componentStack: 'at HomePage' });

  expect(consoleError).toHaveBeenCalledOnce();
  expect(consoleError).toHaveBeenCalledWith(`[RENDER_FAILED] ${ERROR_MESSAGES.RENDER_FAILED}`, {
    cause,
    componentStack: 'at HomePage',
  });
});

test('usa UNEXPECTED quando não recebe código', () => {
  const consoleError = silenceConsoleError();

  logError('falha');

  expect(consoleError).toHaveBeenCalledWith(`[UNEXPECTED] ${ERROR_MESSAGES.UNEXPECTED}`, {
    cause: 'falha',
  });
});

test('mantém o código de um AppError já criado', () => {
  const consoleError = silenceConsoleError();

  logError(new AppError('ROOT_NOT_FOUND'), 'UNCAUGHT');

  expect(consoleError.mock.calls[0]?.[0]).toBe(`[ROOT_NOT_FOUND] ${ERROR_MESSAGES.ROOT_NOT_FOUND}`);
});
