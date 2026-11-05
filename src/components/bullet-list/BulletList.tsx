import { cx } from '../../utils/classNames.ts';
import { RichText } from '../rich-text/RichText.tsx';
import styles from './BulletList.module.css';

interface BulletListProps {
  /** Cada item aceita a marcação de destaque, como `código`. */
  items: readonly string[];
  className?: string;
}

/** Lista de tópicos com marcador quadrado, como as entregas de um emprego ou de um projeto. */
export function BulletList({ items, className }: BulletListProps) {
  return (
    <ul className={cx(styles.list, className)}>
      {items.map((item) => (
        <li key={item} className={styles.item}>
          <RichText text={item} />
        </li>
      ))}
    </ul>
  );
}
