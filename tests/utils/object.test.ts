import { expect, test } from 'vitest';
import { hasKey } from '../../src/utils/object.ts';

const record = { linkedin: 'a', github: 'b' };

test.each(['linkedin', 'github'])('reconhece a chave própria %s', (key) => {
  expect(hasKey(record, key)).toBe(true);
});

test.each(['twitter', '', 'toString', '__proto__'])(
  'recusa a chave de fora ou herdada %j',
  (key) => {
    expect(hasKey(record, key)).toBe(false);
  },
);
