import { useCallback, useEffect, useRef, useState } from 'react';
import type { SectionKey } from '../../globals/constants.ts';
import { useMessages } from '../../i18n/useLanguage.ts';
import styles from './Navigation.module.css';
import { SectionLinks } from './SectionLinks.tsx';

interface CompactMenuProps {
  sections: readonly SectionKey[];
  activeSection: string | null;
}

/**
 * Menu de telas estreitas. Fecha ao escolher uma seção, ao clicar fora ou com Esc;
 * no Esc, o foco volta para o botão do menu.
 */
export function CompactMenu({ sections, activeSection }: CompactMenuProps) {
  const { navigation } = useMessages();
  const menuRef = useRef<HTMLDetailsElement>(null);
  const toggleRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => {
    if (menuRef.current) menuRef.current.open = false;
  }, []);

  // Só escuta o documento enquanto o menu está aberto, e para de escutar ao fechar.
  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      close();
      toggleRef.current?.focus();
    };
    const closeOnOutsideClick = (event: PointerEvent) => {
      const clickedInside = event.target instanceof Node && menuRef.current?.contains(event.target);
      if (!clickedInside) close();
    };

    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutsideClick);
    };
  }, [isOpen, close]);

  return (
    <details
      ref={menuRef}
      className={styles.menu}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary ref={toggleRef} className={styles.menuToggle}>
        {navigation.menu}
      </summary>
      <SectionLinks
        className={styles.menuLinks}
        sections={sections}
        activeSection={activeSection}
        onNavigate={close}
      />
    </details>
  );
}
