import { describe, expect, test } from 'vitest';
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

    expect(writeStorage(storage, 'language', 'en')).toBe(true);
    expect(readStorage(storage, 'language')).toBe('en');
  });

  test('chave que não existe devolve null', () => {
    expect(readStorage(memoryStorage(), 'language')).toBeNull();
  });

  test('armazenamento que lança erro vira "sem armazenamento"', () => {
    expect(readStorage(failingStorage, 'language')).toBeNull();
    expect(writeStorage(failingStorage, 'language', 'en')).toBe(false);
  });

  test('sem armazenamento, lê null e não grava', () => {
    expect(readStorage(null, 'language')).toBeNull();
    expect(writeStorage(null, 'language', 'en')).toBe(false);
  });

  test('fora do navegador, não há localStorage', () => {
    expect(getLocalStorage()).toBeNull();
  });
});
