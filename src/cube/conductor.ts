import { scrambleFor, type Move } from './model.ts';

/** O que o maestro precisa de cada cubo desenhado na tela. */
export interface CubeSceneHandle {
  /** Gira uma camada. Com 0 ms, ou fora da tela, aplica na hora. */
  turn(move: Move, durationMs: number): Promise<void>;
  /** Volta ao cubo resolvido, sem animar. */
  reset(): void;
}

type Step = { kind: 'reset' } | { kind: 'turn'; move: Move; durationMs: number };

// O embaralhamento é rápido, quase uma abertura; cada passo da solução é mais lento, para ser visto.
export const SCRAMBLE_MOVE_MS = 170;
export const SOLVE_MOVE_MS = 340;

/**
 * Faz todos os cubos da página girarem juntos, um movimento por vez, na mesma ordem.
 * O React diz onde a página está (rodada e quantos movimentos da solução valem) com sync();
 * o maestro enfileira o que falta e espera todos os cubos terminarem antes do próximo giro.
 */
export class CubeConductor {
  private readonly solution: readonly Move[];
  private readonly scramble: readonly Move[];
  private readonly scenes = new Set<CubeSceneHandle>();
  private readonly queue: Step[] = [];
  /** Movimentos desde o último reset, para um cubo que entra depois alcançar os outros. */
  private history: Move[] = [];
  private round = -1;
  private queuedSolutionMoves = 0;
  private running = false;

  constructor(solution: readonly Move[]) {
    this.solution = solution;
    this.scramble = scrambleFor(solution);
  }

  /** Registra um cubo e já o coloca no estado atual. Devolve a função que o remove. */
  register(scene: CubeSceneHandle): () => void {
    scene.reset();
    for (const move of this.history) void scene.turn(move, 0);
    this.scenes.add(scene);
    return () => {
      this.scenes.delete(scene);
    };
  }

  /**
   * Leva os cubos para a rodada pedida, com os primeiros `solvedMoves` da solução aplicados.
   * Uma rodada nova recomeça: volta ao resolvido e embaralha. Chamar de novo com os mesmos
   * valores não faz nada, então pode rodar em todo efeito do React.
   */
  sync(round: number, solvedMoves: number): void {
    if (round !== this.round) {
      this.round = round;
      this.queuedSolutionMoves = 0;
      this.queue.length = 0;
      this.queue.push(
        { kind: 'reset' },
        ...this.scramble.map((move): Step => ({
          kind: 'turn',
          move,
          durationMs: SCRAMBLE_MOVE_MS,
        })),
      );
    }

    const target = Math.min(solvedMoves, this.solution.length);
    for (; this.queuedSolutionMoves < target; this.queuedSolutionMoves += 1) {
      const move = this.solution[this.queuedSolutionMoves];
      if (move) this.queue.push({ kind: 'turn', move, durationMs: SOLVE_MOVE_MS });
    }

    void this.run();
  }

  private async run(): Promise<void> {
    if (this.running) return;
    this.running = true;
    try {
      for (let step = this.queue.shift(); step; step = this.queue.shift()) {
        await this.perform(step);
      }
    } finally {
      this.running = false;
    }
  }

  private async perform(step: Step): Promise<void> {
    if (step.kind === 'reset') {
      this.history = [];
      for (const scene of this.scenes) scene.reset();
      return;
    }
    this.history.push(step.move);
    await Promise.all([...this.scenes].map((scene) => scene.turn(step.move, step.durationMs)));
  }
}
