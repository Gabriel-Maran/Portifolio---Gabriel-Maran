import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { AppError, toAppError } from '../../src/errors/AppError.ts';
import { ERROR_MESSAGES } from '../../src/globals/errorMessages.ts';

describe('AppError', () => {
  test('usa a mensagem central do código', () => {
    const error = new AppError('ROOT_NOT_FOUND');

    assert.ok(error instanceof Error);
    assert.equal(error.name, 'AppError');
    assert.equal(error.code, 'ROOT_NOT_FOUND');
    assert.equal(error.message, ERROR_MESSAGES.ROOT_NOT_FOUND);
  });

  test('guarda a causa original', () => {
    const cause = new Error('falha original');

    assert.equal(new AppError('UNCAUGHT', { cause }).cause, cause);
  });
});

describe('toAppError', () => {
  test('devolve o mesmo AppError, mantendo o código original', () => {
    const original = new AppError('ROOT_NOT_FOUND');

    assert.equal(toAppError(original, 'UNCAUGHT'), original);
  });

  test('usa UNEXPECTED quando não recebe código', () => {
    assert.equal(toAppError(new Error('x')).code, 'UNEXPECTED');
  });

  const thrownValues: Array<[description: string, value: unknown]> = [
    ['um Error', new Error('falha')],
    ['uma string', 'falha'],
    ['uma string vazia', ''],
    ['null', null],
    ['undefined', undefined],
    ['um objeto', { reason: 'falha' }],
    ['um número', 0],
  ];

  for (const [description, value] of thrownValues) {
    test(`embrulha ${description} e guarda o valor como causa`, () => {
      const error = toAppError(value, 'UNCAUGHT');

      assert.ok(error instanceof AppError);
      assert.equal(error.code, 'UNCAUGHT');
      assert.equal(error.cause, value);
    });
  }
});
