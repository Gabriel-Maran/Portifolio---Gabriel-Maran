import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import { App } from '../../../src/app/App.tsx';
import { OWNER_NAME, SECTION_IDS } from '../../../src/globals/constants.ts';
import { messages } from '../../../src/globals/messages/index.ts';
import { HOME_SOLUTION } from '../../../src/pages/home/sections.ts';

// Cada cubo 3D desenha 54 adesivos dentro dos lados das peças; as miniaturas não têm lados.
const STICKERS_PER_CUBE = 54;
const cubesIn = (root: ParentNode) =>
  root.querySelectorAll('[data-side] [data-face-color]').length / STICKERS_PER_CUBE;

function renderHome() {
  window.history.replaceState(null, '', '/');
  return render(<App />);
}

const sectionOf = (id: string) => {
  const section = document.getElementById(id);
  if (!section) throw new Error(`A seção ${id} deveria existir.`);
  return section;
};

test('a página tem só dois cubos 3D: o da abertura e o do rastreador', () => {
  renderHome();

  expect(cubesIn(document)).toBe(2);
  expect(cubesIn(sectionOf(SECTION_IDS.approach))).toBe(0);
  expect(cubesIn(sectionOf(SECTION_IDS.contact))).toBe(0);
});

test('o fechamento mantém uma miniatura por face e a contagem de movimentos', () => {
  renderHome();
  const contact = sectionOf(SECTION_IDS.contact);

  const header = contact.querySelector('header');
  if (!header) throw new Error('O fechamento deveria ter um cabeçalho.');
  const glyphs = [...header.querySelectorAll('[aria-hidden="true"]')].filter(
    (glyph) => glyph.children.length === 9,
  );
  expect(glyphs).toHaveLength(HOME_SOLUTION.length);
  expect(within(contact).getByText(messages.pt.cube.movesLeft(HOME_SOLUTION.length))).toBeTruthy();
});

test('na abertura, o nome vem antes do cubo e dos botões dele no HTML', () => {
  renderHome();

  const name = screen.getByRole('heading', { level: 1, name: OWNER_NAME });
  const scramble = screen.getByRole('button', { name: messages.pt.cube.scramble });
  expect(name.compareDocumentPosition(scramble) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});
