import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Language } from '../../src/globals/constants.ts';
import { parseLanguage } from '../../src/utils/language.ts';

const cases: Array<[input: string | null | undefined, expected: Language | null]> = [
  ['pt', 'pt'],
  ['en', 'en'],
  ['pt-BR', 'pt'],
  ['en-US', 'en'],
  ['en_US', 'en'],
  ['EN', 'en'],
  ['  en  ', 'en'],
  ['fr', null],
  ['english', null],
  ['-en', null],
  ['', null],
  ['   ', null],
  [null, null],
  [undefined, null],
];

for (const [input, expected] of cases) {
  test(`parseLanguage(${JSON.stringify(input) ?? 'undefined'}) devolve ${expected}`, () => {
    assert.equal(parseLanguage(input), expected);
  });
}
