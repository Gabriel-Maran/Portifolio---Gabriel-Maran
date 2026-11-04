import { SECTION_IDS, type SectionKey } from '../../globals/constants.ts';
import { useMessages } from '../../i18n/useLanguage.ts';
import { cx } from '../../utils/classNames.ts';
import styles from './Navigation.module.css';

interface SectionLinksProps {
  sections: readonly SectionKey[];
  /** Id da seção na tela. O link dela fica marcado. */
  activeSection: string | null;
  className?: string;
  onNavigate?: () => void;
}

export function SectionLinks({
  sections,
  activeSection,
  className,
  onNavigate,
}: SectionLinksProps) {
  const { navigation } = useMessages();

  return (
    <nav className={cx(styles.links, className)} aria-label={navigation.sectionsLabel}>
      {sections.map((key) => {
        const id = SECTION_IDS[key];
        return (
          <a
            key={key}
            className={styles.link}
            href={`#${id}`}
            aria-current={id === activeSection ? 'true' : undefined}
            onClick={onNavigate}
          >
            {navigation.links[key]}
          </a>
        );
      })}
    </nav>
  );
}
