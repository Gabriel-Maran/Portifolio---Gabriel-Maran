import { rotation, type Matrix3 } from '../utils/matrix3.ts';
import { clamp, prefersReducedMotion } from '../utils/motion.ts';
import type { CubeSceneHandle } from './conductor.ts';
import {
  applyMove,
  isInTurningLayer,
  solvedState,
  spunState,
  turnOf,
  type CubieShape,
  type CubieState,
  type Face,
  type Move,
} from './model.ts';
import { cubieTransform, easeInOut, stickerShade, viewMatrix } from './render.ts';

export interface SceneElements {
  host: HTMLElement;
  root: HTMLElement;
  cubies: readonly HTMLElement[];
  stickers: ReadonlyArray<ReadonlyArray<{ face: Face; element: HTMLElement }>>;
}

export type Tilt = readonly [x: number, y: number];

// Quanto o cubo se afasta do tamanho da caixa: 1.86 deixa folga para os cantos ao girar.
export const DEFAULT_SPREAD = 1.86;
export const DEFAULT_TILT: Tilt = [-27, -37];
const MAX_TILT_X = 80;
const PERSPECTIVE_FACTOR = 3.2;

/**
 * Desenha um cubo no DOM e anima os giros direto nos estilos, sem passar pelo React a cada quadro.
 * O React monta as peças uma vez; este controlador só atualiza os transforms.
 */
export class CubeSceneController implements CubeSceneHandle {
  private readonly shapes: readonly CubieShape[];
  private readonly elements: SceneElements;
  private readonly spread: number;
  private states: CubieState[];
  private unit = 0;
  private view: Matrix3;
  private tiltX: number;
  private tiltY: number;
  private frame = 0;
  private finishTurn: (() => void) | null = null;
  /** Fora da tela, os giros acontecem na hora, para não gastar quadros à toa. */
  isVisible = true;

  constructor(shapes: readonly CubieShape[], elements: SceneElements, spread: number, tilt: Tilt) {
    this.shapes = shapes;
    this.elements = elements;
    this.spread = spread;
    this.states = shapes.map(solvedState);
    [this.tiltX, this.tiltY] = tilt;
    this.view = viewMatrix(this.tiltX, this.tiltY);
  }

  get tilt(): Tilt {
    return [this.tiltX, this.tiltY];
  }

  /** Ajusta o tamanho das peças à caixa. Chame ao montar e sempre que a caixa mudar. */
  measure(): void {
    const { host } = this.elements;
    this.unit = host.clientWidth / this.spread / 3;
    host.style.setProperty('--u', `${this.unit}px`);
    host.style.perspective = `${host.clientWidth * PERSPECTIVE_FACTOR}px`;
    this.paintAll();
  }

  setTilt(x: number, y: number): void {
    this.tiltX = clamp(x, -MAX_TILT_X, MAX_TILT_X);
    this.tiltY = y;
    this.elements.root.style.transform = `rotateX(${this.tiltX}deg) rotateY(${this.tiltY}deg)`;
    this.view = viewMatrix(this.tiltX, this.tiltY);
    this.paintAll();
  }

  reset(): void {
    this.completeTurn();
    this.states = this.shapes.map(solvedState);
    this.paintAll();
  }

  turn(move: Move, durationMs: number): Promise<void> {
    this.completeTurn();
    const from = this.states;
    const to = applyMove(from, move);

    if (durationMs <= 0 || !this.shouldAnimate()) {
      this.states = to;
      this.paintAll();
      return Promise.resolve();
    }

    const { axis, angle } = turnOf(move);
    const moving = from.flatMap((state, index) => (isInTurningLayer(state, move) ? [index] : []));

    return new Promise((resolve) => {
      const begin = performance.now();
      this.finishTurn = () => {
        this.states = to;
        this.paintAll();
        resolve();
      };
      const step = (now: number) => {
        const progress = Math.min(1, (now - begin) / durationMs);
        if (progress === 1) {
          this.completeTurn();
          return;
        }
        const spin = rotation(axis, angle * easeInOut(progress));
        for (const index of moving) {
          const state = from[index];
          if (state) this.paint(index, spunState(state, spin));
        }
        this.frame = requestAnimationFrame(step);
      };
      this.frame = requestAnimationFrame(step);
    });
  }

  /** Termina o giro em andamento na posição final. Usado ao desmontar, para o maestro não travar. */
  completeTurn(): void {
    cancelAnimationFrame(this.frame);
    const finish = this.finishTurn;
    this.finishTurn = null;
    finish?.();
  }

  private shouldAnimate(): boolean {
    return this.isVisible && document.visibilityState === 'visible' && !prefersReducedMotion();
  }

  private paint(index: number, state: CubieState): void {
    const cubie = this.elements.cubies[index];
    if (cubie) cubie.style.transform = cubieTransform(state, this.unit);
    for (const { face, element } of this.elements.stickers[index] ?? []) {
      element.style.setProperty('--shade', stickerShade(face, state.turn, this.view).toFixed(3));
    }
  }

  private paintAll(): void {
    this.states.forEach((state, index) => this.paint(index, state));
  }
}
