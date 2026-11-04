import { describe, expect, test } from 'vitest';
import { FACES } from '../../src/cube/model.ts';
import { cubieTransform, easeInOut, stickerShade, viewMatrix } from '../../src/cube/render.ts';
import { IDENTITY } from '../../src/utils/matrix3.ts';

describe('desenho do cubo', () => {
  test('a peça na origem, sem giro, tem a matriz identidade', () => {
    expect(cubieTransform({ position: [0, 0, 0], turn: IDENTITY }, 40)).toBe(
      'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)',
    );
  });

  test('a posição vira pixels, com y para baixo na tela', () => {
    expect(cubieTransform({ position: [1, 1, -1], turn: IDENTITY }, 40)).toMatch(
      /,40,-40,-40,1\)$/,
    );
  });

  test('a sombra fica entre 0 e 0,22 para qualquer face e vista', () => {
    for (const tilt of [viewMatrix(-27, -37), viewMatrix(0, 0), viewMatrix(60, 120)]) {
      for (const face of FACES) {
        const shade = stickerShade(face, IDENTITY, tilt);
        expect(shade).toBeGreaterThanOrEqual(0);
        expect(shade).toBeLessThanOrEqual(0.22);
      }
    }
  });

  test('a face de cima, voltada para a luz, fica mais clara que a de baixo', () => {
    const view = viewMatrix(-27, -37);
    expect(stickerShade('U', IDENTITY, view)).toBeLessThan(stickerShade('D', IDENTITY, view));
  });

  test('a suavização começa em 0, passa pelo meio e termina em 1', () => {
    expect(easeInOut(0)).toBe(0);
    expect(easeInOut(0.5)).toBe(0.5);
    expect(easeInOut(1)).toBe(1);
  });
});
