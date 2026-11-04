import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import {
  checkImport,
  checkLocation,
  checkPackageImport,
  extractImports,
  findViolations,
} from './layers.ts';

const SRC_DIR = fileURLToPath(new URL('../../src', import.meta.url));

test('o código em src respeita as camadas', () => {
  expect(findViolations(SRC_DIR)).toEqual([]);
});

// Garante que a regra acusa os erros de verdade, para o teste acima não passar por omissão.
describe('regra de camadas', () => {
  test('aceita import para uma camada de baixo', () => {
    expect(checkImport('pages/home/HomePage.tsx', 'globals/constants.ts')).toBeUndefined();
    expect(checkImport('main.tsx', 'theme/index.css')).toBeUndefined();
  });

  test('aceita import dentro da mesma fatia', () => {
    expect(checkImport('features/hero/Hero.tsx', 'features/hero/useHero.ts')).toBeUndefined();
  });

  test('barra import para uma camada de cima', () => {
    expect(checkImport('components/Button.tsx', 'features/hero/Hero.tsx')).toMatch(/não pode/);
    expect(checkImport('globals/constants.ts', 'utils/language.ts')).toMatch(/não pode/);
  });

  // O fallback de erro não pode depender do contexto de idioma, que pode ser a causa da falha.
  test('errors não depende de i18n, e i18n pode usar errors', () => {
    expect(checkImport('errors/ErrorFallback.tsx', 'i18n/useLanguage.ts')).toMatch(
      /não pode depender de i18n/,
    );
    expect(checkImport('i18n/useLanguage.ts', 'errors/AppError.ts')).toBeUndefined();
  });

  test('barra import entre features e entre pages', () => {
    expect(checkImport('features/hero/Hero.tsx', 'features/stack/Stack.tsx')).toMatch(/fatias/);
    expect(checkImport('pages/home/Home.tsx', 'pages/project/Project.tsx')).toMatch(/fatias/);
  });

  test('barra pasta fora das camadas e import que sai de src', () => {
    expect(checkLocation('hooks/useScroll.ts')).toMatch(/fora das camadas/);
    expect(checkLocation('main/index.ts')).toMatch(/fora das camadas/);
    expect(checkImport('utils/language.ts', '../package.json')).toMatch(/fora das camadas/);
  });

  test('barra pacotes só em utils e globals', () => {
    expect(checkPackageImport('utils/language.ts', 'react')).toMatch(/não depende de pacotes/);
    expect(checkPackageImport('components/Button.tsx', 'react')).toBeUndefined();
  });
});

describe('leitura de imports', () => {
  test('encontra todas as formas de import e export', () => {
    const code = [
      "import { a } from './a.ts';",
      "import type { B } from '../b.ts';",
      'import {',
      '  c,',
      "} from './c.ts';",
      "import './d.css';",
      "export { e } from './e.ts';",
      "const f = await import('./f.ts');",
    ].join('\n');

    expect(extractImports(code)).toEqual([
      './a.ts',
      '../b.ts',
      './c.ts',
      './d.css',
      './e.ts',
      './f.ts',
    ]);
  });

  test('não encontra nada em código sem import', () => {
    expect(extractImports('')).toEqual([]);
    expect(extractImports('const from = 1;')).toEqual([]);
  });
});
