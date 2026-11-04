import { describe, expect, test } from 'vitest';
import {
  applyMove,
  createCubieShapes,
  FACES,
  faceOf,
  inverseOf,
  isFace,
  isSolved,
  scrambleFor,
  solvedState,
  type Move,
} from '../../src/cube/model.ts';

const shapes = createCubieShapes(true);
const solved = () => shapes.map(solvedState);
const play = (moves: readonly Move[]) => moves.reduce(applyMove, solved());

describe('peças', () => {
  test('são 26, sem a do centro, com 54 adesivos no total', () => {
    expect(shapes).toHaveLength(26);
    expect(shapes.flatMap((shape) => shape.stickers)).toHaveLength(54);
  });

  test('cada face tem 9 adesivos', () => {
    for (const face of FACES) {
      expect(shapes.filter((shape) => shape.stickers.includes(face))).toHaveLength(9);
    }
  });

  test('sem os lados internos, só desenha os que têm adesivo', () => {
    const outerOnly = createCubieShapes(false);
    expect(outerOnly.every((shape) => shape.sides.length === shape.stickers.length)).toBe(true);
    expect(shapes.every((shape) => shape.sides.length === 6)).toBe(true);
  });
});

describe('movimentos', () => {
  test('o embaralhamento é a solução invertida de trás para frente', () => {
    expect(scrambleFor(['U', 'L', 'R', 'F', 'B', 'D'])).toEqual([
      "D'",
      "B'",
      "F'",
      "R'",
      "L'",
      "U'",
    ]);
  });

  test('inverter duas vezes volta ao movimento original', () => {
    for (const face of FACES) {
      expect(inverseOf(inverseOf(face))).toBe(face);
    }
  });

  test('reconhece só as seis faces', () => {
    expect(FACES.every(isFace)).toBe(true);
    expect(['X', '', 'u', "U'"].some(isFace)).toBe(false);
    expect(faceOf("R'")).toBe('R');
  });

  test.each(FACES)('girar %s quatro vezes volta ao resolvido', (face) => {
    expect(isSolved(shapes, play([face, face, face, face]))).toBe(true);
  });

  test.each(FACES)('%s seguido do inverso volta ao resolvido', (face) => {
    expect(isSolved(shapes, play([face, inverseOf(face)]))).toBe(true);
  });

  test('o embaralhamento desfaz o cubo e a solução o resolve', () => {
    const solution: Move[] = ['U', 'L', 'R', 'F', 'B', 'D'];
    const scrambled = play(scrambleFor(solution));

    expect(isSolved(shapes, scrambled)).toBe(false);
    expect(isSolved(shapes, solution.reduce(applyMove, scrambled))).toBe(true);
  });

  test('qualquer ordem de seções gera um par embaralhamento e solução que fecha', () => {
    const solution: Move[] = ['F', 'D', 'U', 'B', 'R', 'L'];
    const afterAll = [...scrambleFor(solution), ...solution];

    expect(isSolved(shapes, play(afterAll))).toBe(true);
  });

  test('um giro só mexe nas nove peças da camada', () => {
    const before = solved();
    const after = applyMove(before, 'U');
    const moved = after.filter((state, index) => state !== before[index]);

    expect(moved).toHaveLength(9);
  });
});
