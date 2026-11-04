import {
  apply,
  dot,
  multiply,
  rotation,
  toRadians,
  type Matrix3,
  type Vector3,
} from '../utils/matrix3.ts';
import { FACE_NORMALS, type CubieState, type Face } from './model.ts';

// Luz vinda do alto, à esquerda e da frente. Lados voltados para ela ficam mais claros.
const LIGHT: Vector3 = [-0.36, -0.74, 0.57];
const MAX_SHADE = 0.22;

/** Como a câmera vê o cubo, a partir da inclinação em graus. */
export const viewMatrix = (tiltX: number, tiltY: number): Matrix3 =>
  multiply(rotation(0, toRadians(tiltX)), rotation(1, toRadians(tiltY)));

/** O transform CSS da peça. A tela tem y para baixo, por isso os sinais trocados. */
export function cubieTransform({ position: p, turn: r }: CubieState, unit: number): string {
  return `matrix3d(${[
    [r[0][0], -r[1][0], r[2][0], 0],
    [-r[0][1], r[1][1], -r[2][1], 0],
    [r[0][2], -r[1][2], r[2][2], 0],
    [p[0] * unit, -p[1] * unit, p[2] * unit, 1],
  ]
    .flat()
    .join(',')})`;
}

/** Quanto escurecer um adesivo, de 0 a MAX_SHADE, conforme ele encara a luz. */
export function stickerShade(face: Face, turn: Matrix3, view: Matrix3): number {
  const normal = apply(turn, FACE_NORMALS[face]);
  const onScreen = apply(view, [normal[0], -normal[1], normal[2]]);
  const facing = Math.max(0, dot(onScreen, LIGHT));
  return (1 - facing) * MAX_SHADE;
}

/** Começa e termina devagar, como um giro feito à mão. */
export const easeInOut = (progress: number) =>
  progress < 0.5 ? 2 * progress * progress : 1 - (-2 * progress + 2) ** 2 / 2;
