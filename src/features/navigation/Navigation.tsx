import { Container } from '../../components/container/Container.tsx';
import { LanguageSwitcher } from '../../components/language-switcher/LanguageSwitcher.tsx';
import { CubeTracker } from '../../cube/CubeTracker.tsx';
import { MAIN_CONTENT_ID, OWNER_NAME, type SectionKey } from '../../globals/constants.ts';
import { CompactMenu } from './CompactMenu.tsx';
import styles from './Navigation.module.css';
import { SectionLinks } from './SectionLinks.tsx';

interface NavigationProps {
  sections: readonly SectionKey[];
  activeSection: string | null;
}

export function Navigation({ sections, activeSection }: NavigationProps) {
  return (
    <header className={styles.bar}>
      <Container className={styles.inner}>
        <a className={styles.brand} href={`#${MAIN_CONTENT_ID}`}>
          {OWNER_NAME}
        </a>
        <SectionLinks
          className={styles.wideLinks}
          sections={sections}
          activeSection={activeSection}
        />
        <div className={styles.end}>
          <CubeTracker />
          <LanguageSwitcher />
          <CompactMenu sections={sections} activeSection={activeSection} />
        </div>
      </Container>
    </header>
  );
}
