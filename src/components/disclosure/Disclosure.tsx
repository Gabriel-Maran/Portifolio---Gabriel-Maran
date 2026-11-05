import type { ReactNode } from 'react';
import { cx } from '../../utils/classNames.ts';
import { VisuallyHidden } from '../visually-hidden/VisuallyHidden.tsx';
import styles from './Disclosure.module.css';

interface DisclosureProps {
  /** Texto do controle que abre e fecha. */
  summary: string;
  /**
   * De quem é o conteúdo, só para o leitor de tela. Com vários controles de mesmo texto na
   * página, como um por emprego ou por projeto, cada um precisa de um nome único.
   */
  hiddenContext?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Conteúdo que abre e fecha. Usa `<details>` nativo: teclado, leitor de tela e a busca da
 * página funcionam sem JavaScript. Serve para a leitura ficar curta e o detalhe a um clique.
 */
export function Disclosure({ summary, hiddenContext, children, className }: DisclosureProps) {
  return (
    <details className={cx(styles.disclosure, className)}>
      <summary className={styles.summary}>
        {summary}
        {hiddenContext ? <VisuallyHidden>{` · ${hiddenContext}`}</VisuallyHidden> : null}
        <span className={styles.chevron} aria-hidden="true">
          ↓
        </span>
      </summary>
      <div className={styles.content}>{children}</div>
    </details>
  );
}
