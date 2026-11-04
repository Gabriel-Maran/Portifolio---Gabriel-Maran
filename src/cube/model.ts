import {
  apply,
  IDENTITY,
  multiply,
  rotation,
  roundMatrix,
  roundVector,
  type Axis,
  type Matrix3,
  type Vector3,
} from '../utils/matrix3.ts';

// As seis faces, na ordem usada para misturar as cores das miniaturas.
export const FACES = ['U', 'R', 'F', 'L', 'B', 'D'] as const;
export type Face = (typeof FACES)[number];

/** Notação de cubo: "U" gira a face de cima no sentido horário e "U'" no anti-horário. */
export type Move = Face | `${Face}'`;

// Coordenadas: x para a direita, y para cima e z na direção de quem olha.
export const FACE_NORMALS: Record<Face, Vector3> = {
  U: [0, 1, 0],
  D: [0, -1, 0],
  R: [1, 0, 0],
  L: [-1, 0, 0],
  F: [0, 0, 1],
  B: [0, 0, -1],
};

// Qual camada cada face gira e para que lado o sentido horário dela aponta nesse eixo.
const TURNS: Record<Face, { axis: Axis; layer: 1 | -1; sign: 1 | -1 }> = {
  U: { axis: 1, layer: 1, sign: -1 },
  D: { axis: 1, layer: -1, sign: 1 },
  R: { axis: 0, layer: 1, sign: -1 },
  L: { axis: 0, layer: -1, sign: 1 },
  F: { axis: 2, layer: 1, sign: -1 },
  B: { axis: 2, layer: -1, sign: 1 },
};

export function isFace(value: string): value is Face {
  return FACES.some((face) => face === value);
}

export function faceOf(move: Move): Face {
  const face = move.charAt(0);
  if (!isFace(face)) throw new Error(`Movimento inválido: ${move}`);
  return face;
}

const isCounterClockwise = (move: Move) => move.endsWith("'");

export function inverseOf(move: Move): Move {
  const face = faceOf(move);
  return isCounterClockwise(move) ? face : `${face}'`;
}

/** O embaralhamento é a solução de trás para frente, com cada giro invertido. */
export function scrambleFor(solution: readonly Move[]): Move[] {
  return solution.toReversed().map(inverseOf);
}

export function turnOf(move: Move): { axis: Axis; layer: 1 | -1; angle: number } {
  const { axis, layer, sign } = TURNS[faceOf(move)];
  const direction = isCounterClockwise(move) ? -sign : sign;
  return { axis, layer, angle: (direction * Math.PI) / 2 };
}

/** O que não muda numa peça: onde ela nasce e quais lados ela tem. */
export interface CubieShape {
  start: Vector3;
  /** Lados que mostram cor: só os que ficam na casca do cubo. */
  stickers: readonly Face[];
  /** Lados desenhados. Com os internos, o cubo não mostra buracos ao girar. */
  sides: readonly Face[];
}

/** Onde a peça está e como ela foi girada desde o início. */
export interface CubieState {
  position: Vector3;
  turn: Matrix3;
}

const isOuterSide = (face: Face, start: Vector3) =>
  FACE_NORMALS[face].some((normal, axis) => normal !== 0 && normal === start[axis]);

/** As 26 peças visíveis, sem a do centro. */
export function createCubieShapes(includeInnerSides: boolean): CubieShape[] {
  const shapes: CubieShape[] = [];
  for (const x of [-1, 0, 1]) {
    for (const y of [-1, 0, 1]) {
      for (const z of [-1, 0, 1]) {
        if (x === 0 && y === 0 && z === 0) continue;
        const start: Vector3 = [x, y, z];
        const stickers = FACES.filter((face) => isOuterSide(face, start));
        shapes.push({ start, stickers, sides: includeInnerSides ? FACES : stickers });
      }
    }
  }
  return shapes;
}

export const solvedState = (shape: CubieShape): CubieState => ({
  position: shape.start,
  turn: IDENTITY,
});

export function isInTurningLayer(state: CubieState, move: Move): boolean {
  const { axis, layer } = turnOf(move);
  return Math.round(state.position[axis]) === layer;
}

/** A peça girada por uma rotação, sem arredondar: serve para os quadros da animação. */
export const spunState = (state: CubieState, spin: Matrix3): CubieState => ({
  position: apply(spin, state.position),
  turn: multiply(spin, state.turn),
});

/** A peça no fim do giro, já arredondada para não acumular erro. */
export function settledState(state: CubieState, move: Move): CubieState {
  const { axis, angle } = turnOf(move);
  const spun = spunState(state, rotation(axis, angle));
  return { position: roundVector(spun.position), turn: roundMatrix(spun.turn) };
}

export function applyMove(states: readonly CubieState[], move: Move): CubieState[] {
  return states.map((state) => (isInTurningLayer(state, move) ? settledState(state, move) : state));
}

const sameVector = (a: Vector3, b: Vector3) => a.every((value, index) => value === b[index]);

export function isSolved(shapes: readonly CubieShape[], states: readonly CubieState[]): boolean {
  return states.every((state, index) => {
    const shape = shapes[index];
    return (
      shape !== undefined &&
      sameVector(state.position, shape.start) &&
      state.turn.every((row, rowIndex) => sameVector(row, IDENTITY[rowIndex] ?? [0, 0, 0]))
    );
  });
}
