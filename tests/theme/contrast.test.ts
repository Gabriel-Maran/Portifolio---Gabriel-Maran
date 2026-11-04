import { describe, expect, test } from 'vitest';
import { contrastRatio, loadThemeColors, type ThemeName } from './contrast.ts';

// WCAG 2.1 AA: 4,5:1 para texto (1.4.3) e 3:1 para bordas e foco de componentes (1.4.11).
const TEXT_MINIMUM = 4.5;
const UI_MINIMUM = 3;

const TEXT_ROLES = ['color-text', 'color-text-soft', 'color-text-muted', 'color-accent-text'];
const SURFACES = ['color-surface', 'color-surface-raised'];
const THEMES: ThemeName[] = ['dark', 'light'];

const colors = loadThemeColors();
const ratio = (theme: ThemeName, foreground: string, background: string) =>
  contrastRatio(colors[theme](foreground), colors[theme](background));

describe.each(THEMES)('tema %s', (theme) => {
  test.each(TEXT_ROLES.flatMap((text) => SURFACES.map((surface) => [text, surface])))(
    '--%s sobre --%s tem contraste de texto',
    (text, surface) => {
      expect(ratio(theme, text, surface)).toBeGreaterThanOrEqual(TEXT_MINIMUM);
    },
  );

  test('o texto do botão principal é legível sobre o amarelo', () => {
    expect(ratio(theme, 'color-on-accent', 'color-accent')).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });

  test('bordas fortes e o contorno de foco aparecem sobre o fundo', () => {
    expect(ratio(theme, 'color-border-strong', 'color-surface')).toBeGreaterThanOrEqual(UI_MINIMUM);
    expect(ratio(theme, 'color-focus', 'color-surface')).toBeGreaterThanOrEqual(UI_MINIMUM);
  });
});

describe('cálculo de contraste', () => {
  test('preto sobre branco dá 21:1 e uma cor sobre ela mesma dá 1:1', () => {
    expect(contrastRatio('#000', '#fff')).toBeCloseTo(21);
    expect(contrastRatio('#ffd500', '#ffd500')).toBeCloseTo(1);
  });

  // O motivo do --color-accent-text: o amarelo puro some sobre o papel da faixa clara.
  test('o amarelo de preenchimento não serve como texto no tema claro', () => {
    expect(ratio('light', 'color-accent', 'color-surface')).toBeLessThan(TEXT_MINIMUM);
  });
});
