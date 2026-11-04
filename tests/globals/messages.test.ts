import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DEFAULT_LANGUAGE, LANGUAGES } from '../../src/globals/constants.ts';
import { messages } from '../../src/globals/messages/index.ts';

// Achata o dicionário em pares "errors.title" → valor, para comparar idiomas chave a chave.
function flatten(value: unknown, path = ''): Array<[path: string, value: unknown]> {
  if (typeof value !== 'object' || value === null) return [[path, value]];
  return Object.entries(value).flatMap(([key, child]) =>
    flatten(child, path ? `${path}.${key}` : key),
  );
}

const keysOf = (dictionary: unknown) => flatten(dictionary).map(([path]) => path);

for (const language of LANGUAGES) {
  test(`${language} tem as mesmas chaves do idioma padrão`, () => {
    assert.deepEqual(keysOf(messages[language]), keysOf(messages[DEFAULT_LANGUAGE]));
  });

  test(`${language} não tem texto vazio`, () => {
    const empty = flatten(messages[language]).filter(
      ([, text]) => typeof text !== 'string' || text.trim() === '',
    );
    assert.deepEqual(empty, []);
  });
}
