import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { getLocalStorage, readStorage, writeStorage } from '../../src/utils/storage.ts';

function memoryStorage(): Pick<Storage, 'getItem' | 'setItem'> {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => void values.set(key, value),
  };
}

const failingStorage: Pick<Storage, 'getItem' | 'setItem'> = {
  getItem: () => {
    throw new Error('SecurityError');
  },
  setItem: () => {
    throw new Error('QuotaExceededError');
  },
};

describe('storage', () => {
  test('grava e lê um valor', () => {
    const storage = memoryStorage();

    assert.equal(writeStorage(storage, 'language', 'en'), true);
    assert.equal(readStorage(storage, 'language'), 'en');
  });

  test('chave que não existe devolve null', () => {
    assert.equal(readStorage(memoryStorage(), 'language'), null);
  });

  test('armazenamento que lança erro vira "sem armazenamento"', () => {
    assert.equal(readStorage(failingStorage, 'language'), null);
    assert.equal(writeStorage(failingStorage, 'language', 'en'), false);
  });

  test('sem armazenamento, lê null e não grava', () => {
    assert.equal(readStorage(null, 'language'), null);
    assert.equal(writeStorage(null, 'language', 'en'), false);
  });

  test('fora do navegador, não há localStorage', () => {
    assert.equal(getLocalStorage(), null);
  });
});
