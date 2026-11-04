import { useId, type ReactNode } from 'react';
import { cx } from '../../utils/classNames.ts';
import { Container } from '../container/Container.tsx';
import styles from './Section.module.css';

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  /** O que vem antes do título, como a miniatura de face do cubo. */
  adornment?: ReactNode;
  /** "light" vira a faixa clara: o tema troca sozinho pelos papéis de cor. */
  theme?: 'light';
  children: ReactNode;
}

export function Section({ id, title, subtitle, adornment, theme, children }: SectionProps) {
  const titleId = useId();

  return (
    <section
      id={id}
      className={cx(styles.section, theme && styles.band)}
      data-theme={theme}
      aria-labelledby={titleId}
    >
      <Container>
        <header className={styles.header}>
          {adornment}
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </header>
        {children}
      </Container>
    </section>
  );
}
