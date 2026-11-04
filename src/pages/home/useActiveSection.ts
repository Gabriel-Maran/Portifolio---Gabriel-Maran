import { useEffect, useEffectEvent, useState } from 'react';

// A seção conta como ativa quando cruza a faixa do meio da tela, e não só quando aparece na borda.
const MIDDLE_BAND: IntersectionObserverInit = { rootMargin: '-35% 0px -35% 0px' };

/**
 * Id da seção que está no meio da tela, ou null antes de a pessoa chegar a alguma.
 * `onEnter` é avisado a cada seção que entra na faixa, como na visita que gira o cubo.
 * Os ids precisam ser estáveis (uma constante), porque trocar a lista recria o observer.
 */
export function useActiveSection(
  ids: readonly string[],
  onEnter?: (id: string) => void,
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const handleEnter = useEffectEvent((id: string) => {
    setActiveId(id);
    onEnter?.(id);
  });

  useEffect(() => {
    // Sem IntersectionObserver, a navegação funciona, só não marca a seção atual.
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) handleEnter(entry.target.id);
      }
    }, MIDDLE_BAND);

    for (const id of ids) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }

    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
