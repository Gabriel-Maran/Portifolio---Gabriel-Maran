import { useCallback, useEffect, useMemo, useState } from 'react';
import { CubeConductor } from './conductor.ts';
import type { Face } from './model.ts';

interface Progress {
  /** Cada clique em "Embaralhar" abre uma rodada nova. */
  round: number;
  /** Faces das seções já visitadas, na ordem da visita. */
  visited: readonly Face[];
}

export interface CubeState {
  conductor: CubeConductor;
  solution: readonly Face[];
  visited: ReadonlySet<Face>;
  movesDone: number;
  isSolved: boolean;
  visit: (face: Face) => void;
  scramble: () => void;
  solveAll: () => void;
}

/**
 * Estado do cubo da página. Cada seção visitada desfaz um movimento do embaralhamento,
 * sempre na ordem da solução, então o cubo chega resolvido quando todas foram vistas.
 * A solução precisa ser estável (uma constante), porque o maestro é criado uma vez só.
 */
export function useCubeState(solution: readonly Face[]): CubeState {
  const [conductor] = useState(() => new CubeConductor(solution));
  const [progress, setProgress] = useState<Progress>({ round: 0, visited: [] });

  useEffect(() => {
    conductor.sync(progress.round, progress.visited.length);
  }, [conductor, progress]);

  const visit = useCallback((face: Face) => {
    setProgress((current) =>
      current.visited.includes(face)
        ? current
        : { ...current, visited: [...current.visited, face] },
    );
  }, []);

  const scramble = useCallback(() => {
    setProgress((current) => ({ round: current.round + 1, visited: [] }));
  }, []);

  const solveAll = useCallback(() => {
    setProgress((current) => ({
      ...current,
      visited: [...current.visited, ...solution.filter((face) => !current.visited.includes(face))],
    }));
  }, [solution]);

  return useMemo(
    () => ({
      conductor,
      solution,
      visited: new Set(progress.visited),
      movesDone: progress.visited.length,
      isSolved: progress.visited.length === solution.length,
      visit,
      scramble,
      solveAll,
    }),
    [conductor, solution, progress, visit, scramble, solveAll],
  );
}
