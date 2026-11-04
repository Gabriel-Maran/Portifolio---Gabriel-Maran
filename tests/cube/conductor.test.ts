import { describe, expect, test } from 'vitest';
import {
  CubeConductor,
  SCRAMBLE_MOVE_MS,
  SOLVE_MOVE_MS,
  type CubeSceneHandle,
} from '../../src/cube/conductor.ts';
import type { Face, Move } from '../../src/cube/model.ts';

const SOLUTION: Face[] = ['U', 'L', 'R', 'F', 'B', 'D'];
const SCRAMBLE: Move[] = ["D'", "B'", "F'", "R'", "L'", "U'"];

/** Cubo falso: anota tudo e só termina o giro quando o teste manda. */
function fakeScene() {
  const calls: string[] = [];
  const pending: Array<() => void> = [];
  const scene: CubeSceneHandle = {
    reset: () => void calls.push('reset'),
    turn: (move, durationMs) => {
      calls.push(`${move}@${durationMs}`);
      if (durationMs === 0) return Promise.resolve();
      return new Promise((resolve) => pending.push(resolve));
    },
  };
  return { scene, calls, pending };
}

// Uma macrotarefa: até ela rodar, o maestro já processou tudo o que dependia de promessas.
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

// Termina os giros em andamento, um de cada vez, até a fila acabar.
async function finishAll(...scenes: Array<ReturnType<typeof fakeScene>>) {
  for (let guard = 0; guard < 100; guard += 1) {
    await tick();
    const waiting = scenes.flatMap((fake) => fake.pending.splice(0));
    if (waiting.length === 0) return;
    for (const resolve of waiting) resolve();
  }
  throw new Error('A fila do maestro não terminou.');
}

const turnsOf = (calls: string[]) => calls.filter((call) => call !== 'reset');

describe('CubeConductor', () => {
  test('na primeira rodada, volta ao resolvido e embaralha rápido', async () => {
    const conductor = new CubeConductor(SOLUTION);
    const fake = fakeScene();
    conductor.register(fake.scene);

    conductor.sync(0, 0);
    await finishAll(fake);

    expect(fake.calls).toEqual([
      'reset',
      'reset',
      ...SCRAMBLE.map((move) => `${move}@${SCRAMBLE_MOVE_MS}`),
    ]);
  });

  test('cada visita aplica o próximo movimento da solução, mais devagar', async () => {
    const conductor = new CubeConductor(SOLUTION);
    const fake = fakeScene();
    conductor.register(fake.scene);

    conductor.sync(0, 0);
    conductor.sync(0, 2);
    await finishAll(fake);

    expect(turnsOf(fake.calls).slice(-2)).toEqual([`U@${SOLVE_MOVE_MS}`, `L@${SOLVE_MOVE_MS}`]);
  });

  test('repetir o mesmo estado não enfileira nada de novo', async () => {
    const conductor = new CubeConductor(SOLUTION);
    const fake = fakeScene();
    conductor.register(fake.scene);

    conductor.sync(0, 1);
    conductor.sync(0, 1);
    conductor.sync(0, 1);
    await finishAll(fake);

    expect(turnsOf(fake.calls)).toHaveLength(SCRAMBLE.length + 1);
  });

  test('nunca passa do tamanho da solução', async () => {
    const conductor = new CubeConductor(SOLUTION);
    const fake = fakeScene();
    conductor.register(fake.scene);

    conductor.sync(0, 99);
    await finishAll(fake);

    expect(turnsOf(fake.calls)).toHaveLength(SCRAMBLE.length + SOLUTION.length);
  });

  test('uma rodada nova descarta o que faltava e recomeça do resolvido', async () => {
    const conductor = new CubeConductor(SOLUTION);
    const fake = fakeScene();
    conductor.register(fake.scene);

    conductor.sync(0, 6);
    conductor.sync(1, 0);
    await finishAll(fake);

    const lastReset = fake.calls.lastIndexOf('reset');
    expect(fake.calls.slice(lastReset + 1)).toEqual(
      SCRAMBLE.map((move) => `${move}@${SCRAMBLE_MOVE_MS}`),
    );
  });

  test('todos os cubos giram juntos: o próximo giro espera o mais lento', async () => {
    const conductor = new CubeConductor(SOLUTION);
    const fast = fakeScene();
    const slow = fakeScene();
    conductor.register(fast.scene);
    conductor.register(slow.scene);

    conductor.sync(0, 0);
    await tick();
    expect(turnsOf(fast.calls)).toHaveLength(1);

    fast.pending.splice(0).forEach((resolve) => resolve());
    await tick();

    // O rápido terminou o primeiro giro, mas o segundo só começa quando o lento terminar.
    expect(turnsOf(fast.calls)).toHaveLength(1);
    await finishAll(fast, slow);
    expect(turnsOf(fast.calls)).toEqual(turnsOf(slow.calls));
  });

  test('um cubo que entra depois alcança os outros sem animar', async () => {
    const conductor = new CubeConductor(SOLUTION);
    const first = fakeScene();
    conductor.register(first.scene);
    conductor.sync(0, 2);
    await finishAll(first);

    const late = fakeScene();
    conductor.register(late.scene);

    expect(late.calls).toEqual(['reset', ...SCRAMBLE.map((move) => `${move}@0`), 'U@0', 'L@0']);
  });

  test('um cubo removido para de receber giros', async () => {
    const conductor = new CubeConductor(SOLUTION);
    const fake = fakeScene();
    const unregister = conductor.register(fake.scene);
    unregister();

    conductor.sync(0, 6);
    await finishAll(fake);

    expect(fake.calls).toEqual(['reset']);
  });
});
