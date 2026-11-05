import { describe, expect, test } from 'vitest';
import { LANGUAGES } from '../../src/globals/constants.ts';
import { messages } from '../../src/globals/messages/index.ts';

describe.each(LANGUAGES)('stack em %s', (language) => {
  const { groups } = messages[language].stack;

  // Promover uma tecnologia de "também conheço" para o dia a dia não pode deixar uma cópia para trás.
  test('nenhuma tecnologia aparece duas vezes', () => {
    const items = groups.flatMap((group) => [...group.main, ...group.also]);
    const repeated = items.filter((item, index) => items.indexOf(item) !== index);

    expect(repeated).toEqual([]);
  });

  test('todo grupo tem o que uso no dia a dia e o que também conheço', () => {
    for (const group of groups) {
      expect(group.main.length).toBeGreaterThan(0);
      expect(group.also.length).toBeGreaterThan(0);
    }
  });
});
