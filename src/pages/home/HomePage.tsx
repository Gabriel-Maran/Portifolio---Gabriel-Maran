import { SkipLink } from '../../components/skip-link/SkipLink.tsx';
import { Footer } from '../../features/footer/Footer.tsx';
import { Hero } from '../../features/hero/Hero.tsx';
import { Navigation } from '../../features/navigation/Navigation.tsx';
import { MAIN_CONTENT_ID } from '../../globals/constants.ts';
import { useMessages } from '../../i18n/useLanguage.ts';
import { HOME_SECTION_IDS, HOME_SECTION_KEYS, HOME_SECTIONS } from './sections.ts';
import { useActiveSection } from './useActiveSection.ts';

// A página só compõe as features e guarda o que elas dividem, como a seção ativa.
export function HomePage() {
  const { navigation } = useMessages();
  const activeSection = useActiveSection(HOME_SECTION_IDS);

  return (
    <>
      <SkipLink href={`#${MAIN_CONTENT_ID}`}>{navigation.skipToContent}</SkipLink>
      <Navigation sections={HOME_SECTION_KEYS} activeSection={activeSection} />
      <main id={MAIN_CONTENT_ID}>
        <Hero />
        {HOME_SECTIONS.map(({ key, Component }) => (
          <Component key={key} />
        ))}
      </main>
      <Footer />
    </>
  );
}
