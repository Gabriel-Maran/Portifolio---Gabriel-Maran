/** Confirma que a chave pertence ao próprio objeto e estreita o tipo dela. */
export function hasKey<T extends object>(record: T, key: PropertyKey): key is keyof T {
  return Object.hasOwn(record, key);
}
