import type { ReactNode } from 'react';
import { cx } from '../../utils/classNames.ts';
import styles from './Disclosure.module.css';

interface DisclosureProps {
  /** Texto do controle que abre e fecha. Pode ter texto só para leitor de tela. */
  summary: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Conteúdo que abre e fecha. Usa `<details>` nativo: teclado, leitor de tela e a busca da
 * página funcionam sem JavaScript. Serve para a leitura ficar curta e o detalhe a um clique.
 */
export function Disclosure({ summary, children, className }: DisclosureProps) {
  return (
    <details className={cx(styles.disclosure, className)}>
      <summary className={styles.summary}>
        {summary}
        <span className={styles.chevron} aria-hidden="true">
          ↓
        </span>
      </summary>
      <div className={styles.content}>{children}</div>
    </details>
  );
}
