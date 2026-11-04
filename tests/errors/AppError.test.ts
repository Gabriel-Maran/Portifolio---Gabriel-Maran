import { describe, expect, test } from 'vitest';
import { AppError, toAppError } from '../../src/errors/AppError.ts';
import { ERROR_MESSAGES } from '../../src/globals/errorMessages.ts';

describe('AppError', () => {
  test('usa a mensagem central do código', () => {
    const error = new AppError('ROOT_NOT_FOUND');

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('AppError');
    expect(error.code).toBe('ROOT_NOT_FOUND');
    expect(error.message).toBe(ERROR_MESSAGES.ROOT_NOT_FOUND);
  });

  test('guarda a causa original', () => {
    const cause = new Error('falha original');

    expect(new AppError('UNCAUGHT', { cause }).cause).toBe(cause);
  });
});

describe('toAppError', () => {
  test('devolve o mesmo AppError, mantendo o código original', () => {
    const original = new AppError('ROOT_NOT_FOUND');

    expect(toAppError(original, 'UNCAUGHT')).toBe(original);
  });

  test('usa UNEXPECTED quando não recebe código', () => {
    expect(toAppError(new Error('x')).code).toBe('UNEXPECTED');
  });

  test.each<[description: string, value: unknown]>([
    ['um Error', new Error('falha')],
    ['uma string', 'falha'],
    ['uma string vazia', ''],
    ['null', null],
    ['undefined', undefined],
    ['um objeto', { reason: 'falha' }],
    ['um número', 0],
  ])('embrulha %s e guarda o valor como causa', (_description, value) => {
    const error = toAppError(value, 'UNCAUGHT');

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('UNCAUGHT');
    expect(error.cause).toBe(value);
  });
});
