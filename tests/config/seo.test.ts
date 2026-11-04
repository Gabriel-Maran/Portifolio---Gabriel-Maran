import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { fillSiteUrl, languageAlternates, robotsTxt, sitemapXml } from '../../config/seo.ts';
import { SITE_URL, SITE_URL_PLACEHOLDER } from '../../config/site.ts';

const SITE = 'https://exemplo.dev';
const indexHtml = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');

describe('endereço do site', () => {
  test('é https e não termina com barra', () => {
    expect(SITE_URL).toMatch(/^https:\/\/[^/]+$/);
  });

  test('o index.html usa o marcador, nunca o endereço escrito à mão', () => {
    expect(indexHtml).toContain(SITE_URL_PLACEHOLDER);
    expect(indexHtml).not.toContain(SITE_URL);
  });

  test('o marcador some depois da troca', () => {
    const filled = fillSiteUrl(indexHtml, SITE);

    expect(filled).not.toContain(SITE_URL_PLACEHOLDER);
    expect(filled).toContain(`content="${SITE}/og-image.png"`);
    expect(filled).toContain(`content="${SITE}/"`);
  });
});

describe('idiomas', () => {
  test('uma URL por idioma, mais o x-default em português', () => {
    expect(languageAlternates(SITE)).toEqual([
      { hreflang: 'pt-BR', href: `${SITE}/` },
      { hreflang: 'en', href: `${SITE}/?lang=en` },
      { hreflang: 'x-default', href: `${SITE}/` },
    ]);
  });
});

describe('robots.txt e sitemap.xml', () => {
  test('o robots libera tudo e aponta para o sitemap', () => {
    expect(robotsTxt(SITE)).toBe(`User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
  });

  test('o sitemap tem as duas versões, cada uma com as alternativas de idioma', () => {
    const xml = sitemapXml(SITE);

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml.match(/<loc>/g)).toHaveLength(2);
    expect(xml).toContain(`<loc>${SITE}/?lang=en</loc>`);
    expect(xml.match(/hreflang="x-default"/g)).toHaveLength(2);
  });

  test('escapa caracteres especiais de XML na URL', () => {
    expect(sitemapXml('https://exemplo.dev/a&b')).toContain('https://exemplo.dev/a&amp;b/');
  });
});
