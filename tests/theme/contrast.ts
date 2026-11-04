import { readFileSync } from 'node:fs';

const readTheme = (file: string) =>
  readFileSync(new URL(`../../src/theme/${file}`, import.meta.url), 'utf8');

// Valores brutos, como "--gray-950: #0b0b0c;".
function readPalette(css: string): Map<string, string> {
  return new Map(
    [...css.matchAll(/--([\w-]+):\s*(#[0-9a-f]{3,8})\s*;/gi)].flatMap(([, name, value]) =>
      name && value ? [[name, value]] : [],
    ),
  );
}

// Papéis de um bloco do tema, como "--color-text: var(--sand-50);".
function readRoles(css: string, selector: string): Map<string, string> {
  const start = css.indexOf(selector);
  const body = css.slice(css.indexOf('{', start) + 1, css.indexOf('}', start));
  return new Map(
    [...body.matchAll(/--([\w-]+):\s*var\(--([\w-]+)\)/g)].flatMap(([, role, token]) =>
      role && token ? [[role, token]] : [],
    ),
  );
}

const channels = (hex: string) => {
  const digits = hex.slice(1);
  const full = digits.length === 3 ? [...digits].map((digit) => digit + digit).join('') : digits;
  return [0, 2, 4].map((offset) => Number.parseInt(full.slice(offset, offset + 2), 16) / 255);
};

/** Luminância relativa da WCAG 2.x. */
function luminance(hex: string): number {
  const [red = 0, green = 0, blue = 0] = channels(hex).map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

/** Razão de contraste da WCAG, de 1 a 21. */
export function contrastRatio(foreground: string, background: string): number {
  const [lighter, darker] = [luminance(foreground), luminance(background)].toSorted(
    (a, b) => b - a,
  );
  return ((lighter ?? 0) + 0.05) / ((darker ?? 0) + 0.05);
}

export type ThemeName = 'dark' | 'light';

/** Resolve os papéis de cor de cada tema até o hex, lendo os arquivos do tema de verdade. */
export function loadThemeColors(): Record<ThemeName, (role: string) => string> {
  const palette = readPalette(readTheme('tokens.css'));
  const themes = readTheme('themes.css');
  const dark = readRoles(themes, "[data-theme='dark']");
  // O tema claro só redefine parte dos papéis; o resto herda do escuro, como no CSS.
  const light = new Map([...dark, ...readRoles(themes, "[data-theme='light']")]);

  const resolver = (roles: Map<string, string>) => (role: string) => {
    const token = roles.get(role);
    const value = token ? palette.get(token) : undefined;
    if (!value) throw new Error(`Papel --${role} sem cor resolvida.`);
    return value;
  };

  return { dark: resolver(dark), light: resolver(light) };
}
