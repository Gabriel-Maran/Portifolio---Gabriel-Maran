export type Vector3 = readonly [number, number, number];
export type Matrix3 = readonly [Vector3, Vector3, Vector3];
export type Axis = 0 | 1 | 2;

export const IDENTITY: Matrix3 = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

/** Rotação em torno de um eixo (0 = x, 1 = y, 2 = z), com o ângulo em radianos. */
export function rotation(axis: Axis, angle: number): Matrix3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  if (axis === 0) {
    return [
      [1, 0, 0],
      [0, c, -s],
      [0, s, c],
    ];
  }
  if (axis === 1) {
    return [
      [c, 0, s],
      [0, 1, 0],
      [-s, 0, c],
    ];
  }
  return [
    [c, -s, 0],
    [s, c, 0],
    [0, 0, 1],
  ];
}

export const dot = (a: Vector3, b: Vector3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

const column = (matrix: Matrix3, index: Axis): Vector3 => [
  matrix[0][index],
  matrix[1][index],
  matrix[2][index],
];

export function multiply(a: Matrix3, b: Matrix3): Matrix3 {
  const columns = [column(b, 0), column(b, 1), column(b, 2)] as const;
  const row = (values: Vector3): Vector3 => [
    dot(values, columns[0]),
    dot(values, columns[1]),
    dot(values, columns[2]),
  ];
  return [row(a[0]), row(a[1]), row(a[2])];
}

export const apply = (matrix: Matrix3, vector: Vector3): Vector3 => [
  dot(matrix[0], vector),
  dot(matrix[1], vector),
  dot(matrix[2], vector),
];

// O "|| 0" troca -0 por 0, para comparações e testes não tratarem os dois como diferentes.
const roundNumber = (value: number) => Math.round(value) || 0;

/** Remove o erro de ponto flutuante depois de um giro de 90°, que sempre cai em inteiros. */
export const roundVector = (vector: Vector3): Vector3 => [
  roundNumber(vector[0]),
  roundNumber(vector[1]),
  roundNumber(vector[2]),
];

export const roundMatrix = (matrix: Matrix3): Matrix3 => [
  roundVector(matrix[0]),
  roundVector(matrix[1]),
  roundVector(matrix[2]),
];

export const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
