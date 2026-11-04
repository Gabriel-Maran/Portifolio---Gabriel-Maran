/*
 * O localStorage lança erro em modo privado, com cookies bloqueados ou sem espaço.
 * Estas funções tratam isso como "sem armazenamento": quem chama segue sem lembrar o valor.
 */

export function getLocalStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readStorage(storage: Pick<Storage, 'getItem'> | null, key: string): string | null {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

/** Devolve false quando não conseguiu gravar. */
export function writeStorage(
  storage: Pick<Storage, 'setItem'> | null,
  key: string,
  value: string,
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
