import { useCallback, useMemo } from 'react';
import { SkipLink } from '../../components/skip-link/SkipLink.tsx';
import { CubeProvider } from '../../cube/CubeProvider.tsx';
import { useCubeState } from '../../cube/useCubeState.ts';
import { Footer } from '../../features/footer/Footer.tsx';
import { Hero } from '../../features/hero/Hero.tsx';
import { Navigation } from '../../features/navigation/Navigation.tsx';
import { MAIN_CONTENT_ID } from '../../globals/constants.ts';
import { useMessages } from '../../i18n/useLanguage.ts';
import {
  FACE_BY_SECTION,
  faceOfSectionId,
  HOME_SECTION_IDS,
  HOME_SECTION_KEYS,
  HOME_SECTIONS,
  HOME_SOLUTION,
} from './sections.ts';
import { useActiveSection } from './useActiveSection.ts';

// A página só compõe as features e guarda o que elas dividem: a seção ativa e o cubo.
export function HomePage() {
  const { navigation } = useMessages();
  const cube = useCubeState(HOME_SOLUTION);
  const { visit, scramble } = cube;

  const visitSection = useCallback(
    (id: string) => {
      const face = faceOfSectionId(id);
      if (face) visit(face);
    },
    [visit],
  );

  // Cada seção que chega ao meio da tela conta como visitada e desfaz um movimento do cubo.
  const activeSection = useActiveSection(HOME_SECTION_IDS, visitSection);

  // A rodada nova já conta a seção que está no meio da tela, sem esperar outra rolagem.
  const scrambleAndRecount = useCallback(() => {
    scramble();
    if (activeSection) visitSection(activeSection);
  }, [scramble, activeSection, visitSection]);

  const pageCube = useMemo(
    () => ({ ...cube, scramble: scrambleAndRecount }),
    [cube, scrambleAndRecount],
  );

  return (
    <CubeProvider state={pageCube} faceBySection={FACE_BY_SECTION}>
      <SkipLink href={`#${MAIN_CONTENT_ID}`}>{navigation.skipToContent}</SkipLink>
      <Navigation sections={HOME_SECTION_KEYS} activeSection={activeSection} />
      <main id={MAIN_CONTENT_ID}>
        <Hero />
        {HOME_SECTIONS.map(({ key, Component }) => (
          <Component key={key} />
        ))}
      </main>
      <Footer />
    </CubeProvider>
  );
}
