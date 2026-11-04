import { VisuallyHidden } from '../components/visually-hidden/VisuallyHidden.tsx';
import { useMessages } from '../i18n/useLanguage.ts';
import { CubeScene } from './CubeScene.tsx';
import styles from './CubeTracker.module.css';
import { useCube } from './useCube.ts';

// O cubo pequeno não mostra os lados internos e fica um pouco mais justo na caixa.
const TRACKER_SPREAD = 1.78;

/** Rastreador da navegação: cubo pequeno e um ponto aceso por seção visitada. */
export function CubeTracker() {
  const { solution, visited } = useCube();
  const { tracker } = useMessages();

  return (
    <div className={styles.tracker} title={tracker.title}>
      <CubeScene className={styles.cube} showInnerSides={false} spread={TRACKER_SPREAD} />
      <span className={styles.pips} aria-hidden="true">
        {solution.map((face) => (
          <span
            key={face}
            className={styles.pip}
            data-face-color={visited.has(face) ? face : undefined}
          />
        ))}
      </span>
      <VisuallyHidden>{tracker.progress(visited.size, solution.length)}</VisuallyHidden>
    </div>
  );
}
