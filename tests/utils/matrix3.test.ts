import { describe, expect, test } from 'vitest';
import {
  apply,
  IDENTITY,
  multiply,
  rotation,
  roundMatrix,
  roundVector,
  toRadians,
} from '../../src/utils/matrix3.ts';

const quarterTurn = Math.PI / 2;

describe('matrix3', () => {
  test('a identidade não muda vetor nem matriz', () => {
    expect(apply(IDENTITY, [1, 2, 3])).toEqual([1, 2, 3]);
    expect(multiply(IDENTITY, rotation(1, 0.3))).toEqual(rotation(1, 0.3));
  });

  test('um quarto de volta em z leva x para y', () => {
    expect(roundVector(apply(rotation(2, quarterTurn), [1, 0, 0]))).toEqual([0, 1, 0]);
  });

  test.each([0, 1, 2] as const)('quatro quartos de volta no eixo %i voltam ao começo', (axis) => {
    const quarter = rotation(axis, quarterTurn);
    const full = multiply(multiply(quarter, quarter), multiply(quarter, quarter));
    expect(roundMatrix(full)).toEqual(IDENTITY);
  });

  test('arredondar troca -0 por 0', () => {
    expect(Object.is(roundVector([-0.0001, 0, 0])[0], 0)).toBe(true);
  });

  test('converte graus para radianos', () => {
    expect(toRadians(180)).toBeCloseTo(Math.PI);
  });
});
