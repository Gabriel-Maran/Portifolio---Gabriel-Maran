import assert from 'node:assert/strict';
import { test } from 'node:test';
import { hasKey } from '../../src/utils/object.ts';

const record = { linkedin: 'a', github: 'b' };

test('reconhece as chaves do próprio objeto', () => {
  assert.equal(hasKey(record, 'linkedin'), true);
  assert.equal(hasKey(record, 'github'), true);
});

test('recusa chaves de fora e as herdadas do protótipo', () => {
  assert.equal(hasKey(record, 'twitter'), false);
  assert.equal(hasKey(record, ''), false);
  assert.equal(hasKey(record, 'toString'), false);
  assert.equal(hasKey(record, '__proto__'), false);
});
