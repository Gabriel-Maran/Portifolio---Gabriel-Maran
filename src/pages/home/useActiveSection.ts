import { useEffect, useEffectEvent, useState } from 'react';

// A seção conta como ativa quando cruza a faixa do meio da tela, e não só quando aparece na borda.
const MIDDLE_BAND: IntersectionObserverInit = { rootMargin: '-35% 0px -35% 0px' };

/**
 * Id da seção que está no meio da tela, ou null quando nenhuma está, como na abertura.
 * Se duas dividem a faixa, vale a última que entrou.
 * `onEnter` é avisado a cada seção que entra na faixa, como na visita que gira o cubo.
 * Os ids precisam ser estáveis (uma constante), porque trocar a lista recria o observer.
 */
export function useActiveSection(
  ids: readonly string[],
  onEnter?: (id: string) => void,
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const notifyEnter = useEffectEvent((id: string) => onEnter?.(id));

  useEffect(() => {
    // Sem IntersectionObserver, a navegação funciona, só não marca a seção atual.
    if (!('IntersectionObserver' in window)) return;

    // Seções que estão na faixa agora, na ordem em que entraram.
    const inBand = new Set<string>();

    const observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        // Sai e entra de novo no Set para a seção que acabou de chegar ficar por último.
        inBand.delete(target.id);
        if (isIntersecting) {
          inBand.add(target.id);
          notifyEnter(target.id);
        }
      }
      setActiveId([...inBand].at(-1) ?? null);
    }, MIDDLE_BAND);

    for (const id of ids) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }

    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
