import { describe, expect, test } from 'vitest';
import { GLYPH_CELLS, glyphColors, scrambledColor, SPIRAL_ORDER } from '../../src/cube/glyph.ts';
import { FACES } from '../../src/cube/model.ts';

describe('miniatura de face', () => {
  test.each(FACES)(
    'embaralhada, a face %s só tem a cor certa no centro e em poucas casas',
    (face) => {
      const colors = glyphColors(face, 0);

      expect(colors).toHaveLength(GLYPH_CELLS);
      expect(colors[4]).toBe(face);
      expect(colors.filter((color) => color !== face).length).toBeGreaterThanOrEqual(5);
    },
  );

  test.each(FACES)('resolvida, a face %s fica inteira na cor dela', (face) => {
    expect(glyphColors(face, GLYPH_CELLS)).toEqual(Array(GLYPH_CELLS).fill(face));
  });

  test('resolve em espiral, a partir do centro', () => {
    const face = 'U';
    for (let solvedCells = 1; solvedCells <= GLYPH_CELLS; solvedCells += 1) {
      const colors = glyphColors(face, solvedCells);
      for (const cell of SPIRAL_ORDER.slice(0, solvedCells)) {
        expect(colors[cell]).toBe(face);
      }
    }
  });

  test('a mistura é sempre a mesma, para a miniatura não piscar a cada render', () => {
    expect(glyphColors('R', 3)).toEqual(glyphColors('R', 3));
    expect(scrambledColor(0, 'F')).toBe(scrambledColor(0, 'F'));
  });
});
