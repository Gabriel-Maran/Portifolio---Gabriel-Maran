import { render, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { App } from '../../../src/app/App.tsx';
import { LANGUAGES, OWNER_NAME, SECTION_IDS } from '../../../src/globals/constants.ts';
import { messages } from '../../../src/globals/messages/index.ts';
import { HOME_SECTION_KEYS } from '../../../src/pages/home/sections.ts';

function renderHome(url = '/') {
  window.history.replaceState(null, '', url);
  return render(<App />);
}

const headingLevel = (heading: Element) => Number(heading.tagName.slice(1));

describe.each(LANGUAGES)('página inicial em %s', (language) => {
  const text = messages[language];
  const url = language === 'en' ? '/?lang=en' : '/';

  test('tem um h1 com o nome e um h2 por seção, na ordem da navegação', () => {
    renderHome(url);

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(OWNER_NAME);
    const sectionTitles = HOME_SECTION_KEYS.map((key) => {
      const section = document.getElementById(SECTION_IDS[key]);
      if (!section) throw new Error(`Seção ${key} não está na página.`);
      return within(section).getByRole('heading', { level: 2 }).textContent;
    });
    expect(sectionTitles).toEqual([
      text.whatIDo.title,
      text.experience.title,
      text.projects.title,
      text.method.title,
      text.stack.title,
      text.contact.title,
    ]);
  });

  test('a navegação segue a mesma ordem das seções', () => {
    renderHome(url);

    const [wideLinks] = screen.getAllByRole('navigation', { name: text.navigation.sectionsLabel });
    if (!wideLinks) throw new Error('A navegação deveria existir.');
    expect(
      within(wideLinks)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual(HOME_SECTION_KEYS.map((key) => `#${SECTION_IDS[key]}`));
  });

  test('os títulos não pulam nível', () => {
    renderHome(url);

    const levels = screen.getAllByRole('heading').map(headingLevel);
    const skips = levels.filter(
      (level, index) => index > 0 && level > (levels[index - 1] ?? 0) + 1,
    );
    expect(skips).toEqual([]);
  });
});

describe('links e imagens', () => {
  test('toda âncora interna aponta para um elemento que existe', () => {
    renderHome();

    const broken = [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
      .map((link) => link.getAttribute('href')?.slice(1) ?? '')
      .filter((id) => !document.getElementById(id));
    expect(broken).toEqual([]);
  });

  test('todo link que abre outra aba usa rel seguro', () => {
    renderHome();

    const unsafe = [...document.querySelectorAll('a[target="_blank"]')].filter(
      (link) => link.getAttribute('rel') !== 'noopener noreferrer',
    );
    expect(unsafe).toEqual([]);
  });

  test('toda imagem tem texto alternativo e tamanho reservado', () => {
    renderHome();

    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
    for (const image of images) {
      expect(image.getAttribute('alt')).toBeTruthy();
      expect(image.getAttribute('width')).toBeTruthy();
      expect(image.getAttribute('height')).toBeTruthy();
    }
  });

  test('o diagrama de envio tem descrição por extenso e marcadores com id único', () => {
    renderHome();

    expect(screen.getByText(messages.pt.experience.uploadFlow.label)).toBeTruthy();
    const markerIds = [...document.querySelectorAll('marker')].map((marker) => marker.id);
    expect(markerIds).toHaveLength(2);
    expect(new Set(markerIds).size).toBe(markerIds.length);
  });

  test('só o emprego atual tem o selo "Atual"', () => {
    renderHome();

    expect(screen.getAllByText(messages.pt.experience.current)).toHaveLength(1);
  });
});
