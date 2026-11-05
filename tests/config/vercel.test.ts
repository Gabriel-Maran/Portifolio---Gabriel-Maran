import { describe, expect, test } from 'vitest';
import {
  isVercelBuild,
  readVercelConfig,
  readVercelHeadersForAllPaths,
} from '../../config/vercel.ts';

describe('headers do vercel.json', () => {
  const headers = readVercelHeadersForAllPaths();
  const csp = headers['Content-Security-Policy'] ?? '';
  const cspTokens = csp.split(/[\s;]+/);

  test('a CSP só aceita scripts do próprio site', () => {
    expect(csp).toMatch(/script-src 'self'(;|$)/);
  });

  // Guarda contra afrouxar a CSP sem querer: qualquer um destes reabre a porta para XSS.
  test.each(["'unsafe-inline'", "'unsafe-eval'", '*'])('a CSP não usa %s', (unsafe) => {
    expect(cspTokens).not.toContain(unsafe);
  });

  test('o site não pode ser aberto dentro de iframe de outro domínio', () => {
    expect(csp).toMatch(/frame-ancestors 'none'/);
    expect(headers['X-Frame-Options']).toBe('DENY');
  });

  test('o navegador não adivinha o tipo dos arquivos', () => {
    expect(headers['X-Content-Type-Options']).toBe('nosniff');
  });
});

describe('isVercelBuild', () => {
  test('reconhece o build da Vercel', () => {
    expect(isVercelBuild({ VERCEL: '1' })).toBe(true);
  });

  test.each([{}, { VERCEL: '' }, { VERCEL: '0' }, { CI: 'true' }])(
    'ignora builds locais e do CI: %o',
    (env) => {
      expect(isVercelBuild(env)).toBe(false);
    },
  );
});

describe('endereço de cada idioma no vercel.json', () => {
  const config = readVercelConfig();

  // Com cleanUrls, "/en" serve o en.html que o build gera (ver pageFileName em config/prerender.ts).
  test('/en serve o en.html, e /en/ redireciona para /en', () => {
    expect(config.cleanUrls).toBe(true);
    expect(config.trailingSlash).toBe(false);
  });

  // Regressão: uma reescrita por ?lang=en fez o cache da Vercel, que ignora a query, guardar o
  // inglês e servi-lo na raiz para todo mundo. O idioma tem que vir só do caminho.
  test('nenhuma reescrita escolhe a página', () => {
    expect(config.rewrites).toBeUndefined();
  });
});
