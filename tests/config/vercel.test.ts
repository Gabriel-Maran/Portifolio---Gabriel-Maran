import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { isVercelBuild, readVercelHeadersForAllPaths } from '../../config/vercel.ts';

describe('headers do vercel.json', () => {
  const headers = readVercelHeadersForAllPaths();
  const csp = headers['Content-Security-Policy'] ?? '';
  const cspTokens = csp.split(/[\s;]+/);

  test('a CSP só aceita scripts do próprio site', () => {
    assert.match(csp, /script-src 'self'(;|$)/);
  });

  // Guarda contra afrouxar a CSP sem querer: qualquer um destes reabre a porta para XSS.
  for (const unsafe of ["'unsafe-inline'", "'unsafe-eval'", '*']) {
    test(`a CSP não usa ${unsafe}`, () => {
      assert.ok(!cspTokens.includes(unsafe), `a CSP contém ${unsafe}`);
    });
  }

  test('o site não pode ser aberto dentro de iframe de outro domínio', () => {
    assert.match(csp, /frame-ancestors 'none'/);
    assert.equal(headers['X-Frame-Options'], 'DENY');
  });

  test('o navegador não adivinha o tipo dos arquivos', () => {
    assert.equal(headers['X-Content-Type-Options'], 'nosniff');
  });
});

describe('isVercelBuild', () => {
  test('reconhece o build da Vercel', () => {
    assert.equal(isVercelBuild({ VERCEL: '1' }), true);
  });

  test('ignora builds locais e do CI', () => {
    assert.equal(isVercelBuild({}), false);
    assert.equal(isVercelBuild({ VERCEL: '' }), false);
    assert.equal(isVercelBuild({ VERCEL: '0' }), false);
    assert.equal(isVercelBuild({ CI: 'true' }), false);
  });
});
