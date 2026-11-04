import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { describe, test } from 'node:test';
import {
  checkImport,
  checkLocation,
  checkPackageImport,
  extractImports,
  findViolations,
} from './layers.ts';

const SRC_DIR = resolve(import.meta.dirname, '../../src');

test('o código em src respeita as camadas', () => {
  assert.deepEqual(findViolations(SRC_DIR), []);
});

// Garante que a regra acusa os erros de verdade, para o teste acima não passar por omissão.
describe('regra de camadas', () => {
  test('aceita import para uma camada de baixo', () => {
    assert.equal(checkImport('pages/home/HomePage.tsx', 'globals/constants.ts'), undefined);
    assert.equal(checkImport('main.tsx', 'theme/index.css'), undefined);
  });

  test('aceita import dentro da mesma fatia', () => {
    assert.equal(checkImport('features/hero/Hero.tsx', 'features/hero/useHero.ts'), undefined);
  });

  test('barra import para uma camada de cima', () => {
    assert.match(checkImport('components/Button.tsx', 'features/hero/Hero.tsx') ?? '', /não pode/);
    assert.match(checkImport('globals/constants.ts', 'utils/language.ts') ?? '', /não pode/);
  });

  test('barra import entre features e entre pages', () => {
    assert.match(checkImport('features/hero/Hero.tsx', 'features/stack/Stack.tsx') ?? '', /fatias/);
    assert.match(checkImport('pages/home/Home.tsx', 'pages/project/Project.tsx') ?? '', /fatias/);
  });

  test('barra pasta fora das camadas e import que sai de src', () => {
    assert.match(checkLocation('hooks/useScroll.ts') ?? '', /fora das camadas/);
    assert.match(checkLocation('main/index.ts') ?? '', /fora das camadas/);
    assert.match(checkImport('utils/language.ts', '../package.json') ?? '', /fora das camadas/);
  });

  test('barra pacotes só em utils e globals', () => {
    assert.match(checkPackageImport('utils/language.ts', 'react') ?? '', /não depende de pacotes/);
    assert.equal(checkPackageImport('components/Button.tsx', 'react'), undefined);
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

    assert.deepEqual(extractImports(code), [
      './a.ts',
      '../b.ts',
      './c.ts',
      './d.css',
      './e.ts',
      './f.ts',
    ]);
  });

  test('não encontra nada em código sem import', () => {
    assert.deepEqual(extractImports(''), []);
    assert.deepEqual(extractImports('const from = 1;'), []);
  });
});
