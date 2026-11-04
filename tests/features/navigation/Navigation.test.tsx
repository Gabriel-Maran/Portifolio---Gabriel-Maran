import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Navigation } from '../../../src/features/navigation/Navigation.tsx';
import { SECTION_IDS, type SectionKey } from '../../../src/globals/constants.ts';
import { messages } from '../../../src/globals/messages/index.ts';
import { renderWithProviders } from '../../support/renderWithProviders.tsx';

const SECTIONS: SectionKey[] = ['whatIDo', 'projects', 'contact'];
const { navigation } = messages.pt;

function renderNavigation(activeSection: string | null = null) {
  renderWithProviders(<Navigation sections={SECTIONS} activeSection={activeSection} />);
  // A lista larga vem primeiro; a do menu compacto vem depois, dentro do <details>.
  const [wideLinks, menuLinks] = screen.getAllByRole('navigation', {
    name: navigation.sectionsLabel,
  });
  if (!wideLinks || !menuLinks) throw new Error('As duas listas de links deveriam existir.');
  const menu = document.querySelector('details');
  if (!menu) throw new Error('O menu compacto deveria existir.');
  return { wideLinks, menuLinks, menu };
}

function openMenu(menu: HTMLDetailsElement) {
  menu.open = true;
  fireEvent(menu, new Event('toggle'));
}

describe('links das seções', () => {
  test('seguem a ordem recebida e apontam para as âncoras', () => {
    const { wideLinks } = renderNavigation();

    const links = within(wideLinks).getAllByRole('link');
    expect(links.map((link) => link.textContent)).toEqual(
      SECTIONS.map((key) => navigation.links[key]),
    );
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      SECTIONS.map((key) => `#${SECTION_IDS[key]}`),
    );
  });

  test('marcam só a seção ativa, nas duas listas', () => {
    const { wideLinks, menuLinks } = renderNavigation(SECTION_IDS.projects);

    for (const list of [wideLinks, menuLinks]) {
      const current = within(list)
        .getAllByRole('link')
        .filter((link) => link.getAttribute('aria-current') === 'true');
      expect(current.map((link) => link.textContent)).toEqual([navigation.links.projects]);
    }
  });

  test('a marca do nome leva ao topo do conteúdo', () => {
    renderNavigation();

    expect(screen.getByRole('link', { name: 'Gabriel Maran' }).getAttribute('href')).toBe('#topo');
  });
});

describe('menu compacto', () => {
  test('fecha ao escolher uma seção', () => {
    const { menu, menuLinks } = renderNavigation();
    openMenu(menu);

    fireEvent.click(within(menuLinks).getByRole('link', { name: navigation.links.contact }));

    expect(menu.open).toBe(false);
  });

  test('fecha com Esc e devolve o foco ao botão do menu', () => {
    const { menu } = renderNavigation();
    openMenu(menu);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(menu.open).toBe(false);
    expect(document.activeElement?.textContent).toBe(navigation.menu);
  });

  test('fecha ao clicar fora, mas não ao clicar dentro', () => {
    const { menu, menuLinks } = renderNavigation();
    openMenu(menu);

    fireEvent.pointerDown(menuLinks);
    expect(menu.open).toBe(true);

    fireEvent.pointerDown(document.body);
    expect(menu.open).toBe(false);
  });

  test('fechado, não reage ao Esc', () => {
    const { menu } = renderNavigation();
    const focusedBefore = document.activeElement;

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(menu.open).toBe(false);
    expect(document.activeElement).toBe(focusedBefore);
  });
});
