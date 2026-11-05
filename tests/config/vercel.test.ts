import { describe, expect, test } from 'vitest';
import { pageFileName } from '../../config/prerender.ts';
import {
  isVercelBuild,
  readVercelHeadersForAllPaths,
  readVercelRewrites,
  resolveRewrite,
  type VercelRewrite,
} from '../../config/vercel.ts';
import { DEFAULT_LANGUAGE, LANGUAGE_QUERY_PARAM, LANGUAGES } from '../../src/globals/constants.ts';

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

// A query de cada idioma: o padrão abre sem parâmetro, os outros com ?lang=.
const searchFor = (language: string) =>
  language === DEFAULT_LANGUAGE ? '' : `?${LANGUAGE_QUERY_PARAM}=${language}`;

describe('reescritas do vercel.json', () => {
  const rewrites = readVercelRewrites();

  // O arquivo de cada idioma sai do build com o nome de pageFileName: as duas pontas precisam bater.
  test.each(LANGUAGES)('a raiz em %s serve a página daquele idioma', (language) => {
    expect(resolveRewrite(rewrites, '/', searchFor(language))).toBe(`/${pageFileName(language)}`);
  });

  test('idioma desconhecido ou outros parâmetros caem no idioma padrão', () => {
    const fallback = `/${pageFileName(DEFAULT_LANGUAGE)}`;

    expect(resolveRewrite(rewrites, '/', '?lang=xx')).toBe(fallback);
    expect(resolveRewrite(rewrites, '/', '?utm_source=linkedin')).toBe(fallback);
  });

  test('o inglês vale mesmo com outros parâmetros na URL', () => {
    expect(resolveRewrite(rewrites, '/', '?utm_source=linkedin&lang=en')).toBe(
      `/${pageFileName('en')}`,
    );
  });

  test('caminhos sem regra não são reescritos', () => {
    expect(resolveRewrite(rewrites, '/assets/app.js', '')).toBeUndefined();
  });
});

describe('resolveRewrite', () => {
  const rules: VercelRewrite[] = [
    { source: '/', has: [{ type: 'header', key: 'x-teste', value: '1' }], destination: '/a' },
    { source: '/', has: [{ type: 'query', key: 'modo' }], destination: '/b' },
    { source: '/', destination: '/c' },
  ];

  test('condição que não é de query nunca casa', () => {
    expect(resolveRewrite(rules, '/', '')).toBe('/c');
  });

  test('condição de query sem valor casa com qualquer valor', () => {
    expect(resolveRewrite(rules, '/', '?modo=qualquer')).toBe('/b');
  });

  test('vale a primeira regra que casa, como na Vercel', () => {
    expect(resolveRewrite(rules, '/', '?modo=1')).toBe('/b');
  });
});
