import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { App } from '../../../src/app/App.tsx';
import { SECTION_IDS } from '../../../src/globals/constants.ts';
import { messages } from '../../../src/globals/messages/index.ts';
import { HOME_SOLUTION } from '../../../src/pages/home/sections.ts';

const { cube, tracker } = messages.pt;
const TOTAL = HOME_SOLUTION.length;
// O Contato não tem miniatura no título: no lugar dela fica a fileira com as seis faces.
const TITLE_GLYPHS = TOTAL - 1;

// Observer falso: deixa o teste dizer qual seção chegou ao meio da tela.
class SectionObserver implements IntersectionObserver {
  static instances: SectionObserver[] = [];
  readonly root = null;
  readonly rootMargin = '';
  readonly scrollMargin = '';
  readonly thresholds = [];
  readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    SectionObserver.instances.push(this);
  }

  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }

  static enter(id: string) {
    const target = document.getElementById(id);
    if (!target) throw new Error(`Seção ${id} não está na página.`);
    const rect = target.getBoundingClientRect();
    const entry: IntersectionObserverEntry = {
      target,
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: rect,
      intersectionRect: rect,
      rootBounds: null,
      time: 0,
    };
    act(() => {
      for (const observer of SectionObserver.instances) observer.callback([entry], observer);
    });
  }
}

function renderHome() {
  SectionObserver.instances = [];
  vi.stubGlobal('IntersectionObserver', SectionObserver);
  return render(<App />);
}

const hasText = (text: string) => screen.queryByText(text) !== null;

/*
 * Miniaturas resolvidas nos títulos das seções e na fileira do fechamento: as nove casas
 * na mesma cor. As dos passos de "Como resolvo" ficam de fora, porque ilustram o método.
 */
const solvedGlyphs = () =>
  [...document.querySelectorAll('section header [aria-hidden="true"]')].filter((glyph) => {
    const colors = [...glyph.children].map((cell) => cell.getAttribute('data-face-color'));
    return colors.length === 9 && colors.every((color) => color === colors[0]);
  }).length;

describe('cubo da página', () => {
  test('abre embaralhado, com a solução escrita no fechamento', () => {
    renderHome();

    expect(hasText(cube.movesLeft(TOTAL))).toBe(true);
    expect(hasText(tracker.progress(0, TOTAL))).toBe(true);
    expect(hasText(cube.algorithm(HOME_SOLUTION.join(' ')))).toBe(true);
    expect(solvedGlyphs()).toBe(0);
  });

  test('cada seção visitada desfaz um movimento e resolve a miniatura dela', () => {
    renderHome();

    SectionObserver.enter(SECTION_IDS.projects);

    expect(hasText(cube.movesLeft(TOTAL - 1))).toBe(true);
    expect(hasText(tracker.progress(1, TOTAL))).toBe(true);
    // A de "Projetos" no título e a mesma face na fileira do fechamento.
    expect(solvedGlyphs()).toBe(2);
  });

  test('visitar a mesma seção de novo não conta duas vezes', () => {
    renderHome();

    SectionObserver.enter(SECTION_IDS.stack);
    SectionObserver.enter(SECTION_IDS.stack);

    expect(hasText(cube.movesLeft(TOTAL - 1))).toBe(true);
  });

  test('"Resolver" conclui todas as seções de uma vez', () => {
    renderHome();

    fireEvent.click(screen.getByRole('button', { name: cube.solve }));

    expect(hasText(cube.solvedIn(TOTAL))).toBe(true);
    expect(hasText(tracker.progress(TOTAL, TOTAL))).toBe(true);
    expect(solvedGlyphs()).toBe(TITLE_GLYPHS + TOTAL);
  });

  test('"Embaralhar" recomeça do zero', () => {
    renderHome();
    fireEvent.click(screen.getByRole('button', { name: cube.solve }));

    fireEvent.click(screen.getByRole('button', { name: cube.scramble }));

    expect(hasText(cube.movesLeft(TOTAL))).toBe(true);
    expect(hasText(tracker.progress(0, TOTAL))).toBe(true);
    expect(solvedGlyphs()).toBe(0);
  });
});
