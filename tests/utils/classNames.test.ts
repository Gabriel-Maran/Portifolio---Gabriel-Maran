import { expect, test } from 'vitest';
import { cx } from '../../src/utils/classNames.ts';

test('junta as classes com espaço', () => {
  expect(cx('a', 'b', 'c')).toBe('a b c');
});

test('ignora valores vazios ou falsos', () => {
  expect(cx('a', false, null, undefined, '', 'b')).toBe('a b');
});

test('sem classes, devolve texto vazio', () => {
  expect(cx()).toBe('');
  expect(cx(false, undefined)).toBe('');
});
