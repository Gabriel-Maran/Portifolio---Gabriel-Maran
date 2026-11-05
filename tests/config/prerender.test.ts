import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import {
  injectAppHtml,
  localizeHead,
  pageFileName,
  pageHead,
  ROOT_PLACEHOLDER,
} from '../../config/prerender.ts';
import { fillSiteUrl } from '../../config/seo.ts';
import { SITE_URL } from '../../config/site.ts';
import { DEFAULT_LANGUAGE, LANGUAGES } from '../../src/globals/constants.ts';

// O index.html de verdade, com o endereço já preenchido como no build.
const indexHtml = fillSiteUrl(
  readFileSync(new URL('../../index.html', import.meta.url), 'utf8'),
  SITE_URL,
);

const INDEX = `<html><head><title>Site</title></head><body>${ROOT_PLACEHOLDER}<script src="/app.js"></script></body></html>`;

describe('injectAppHtml', () => {
  test('põe o HTML da página dentro do ponto de montagem e mantém o resto', () => {
    const html = injectAppHtml(INDEX, '<main>Olá</main>');

    expect(html).toBe(
      '<html><head><title>Site</title></head><body><div id="root"><main>Olá</main></div><script src="/app.js"></script></body></html>',
    );
  });

  test('um "$&" no HTML gerado entra como texto, sem virar padrão de substituição', () => {
    const html = injectAppHtml(INDEX, '<p>R$&amp; $& $1</p>');

    expect(html).toContain('<div id="root"><p>R$&amp; $& $1</p></div>');
  });

  test('falha se o index.html não tiver o ponto de montagem', () => {
    expect(() => injectAppHtml('<body></body>', '<main></main>')).toThrow(/uma vez, e tem 0/);
  });

  test('falha se o ponto de montagem aparecer mais de uma vez', () => {
    expect(() => injectAppHtml(`${ROOT_PLACEHOLDER}${ROOT_PLACEHOLDER}`, '<main></main>')).toThrow(
      /uma vez, e tem 2/,
    );
  });
});

describe('uma página por idioma', () => {
  test('cada idioma tem o próprio arquivo', () => {
    expect(new Set(LANGUAGES.map(pageFileName)).size).toBe(LANGUAGES.length);
  });

  // A Vercel (com cleanUrls) e o vite preview servem "/" com o index.html e "/en" com o en.html.
  test('o português sai no index.html, e o inglês no en.html', () => {
    expect(pageFileName(DEFAULT_LANGUAGE)).toBe('index.html');
    expect(pageFileName('en')).toBe('en.html');
  });

  // Se o index.html mudar e perder um desses valores, o build falharia: o teste avisa antes.
  test('o index.html traz o <head> do idioma padrão, que o build traduz', () => {
    expect(() =>
      localizeHead(indexHtml, pageHead(DEFAULT_LANGUAGE), pageHead(DEFAULT_LANGUAGE)),
    ).not.toThrow();
  });

  test.each(LANGUAGES)(
    'o <head> em %s sai com lang, título, descrição e prévia de link',
    (language) => {
      const head = pageHead(language);
      const html = localizeHead(indexHtml, pageHead(DEFAULT_LANGUAGE), head);

      expect(html).toContain(`<html lang="${head.htmlLang}">`);
      expect(html).toContain(`<title>${head.title}</title>`);
      expect(html).toContain(`property="og:title" content="${head.title}"`);
      expect(html.split(`content="${head.description}"`)).toHaveLength(3);
      expect(html).toContain(`property="og:url" content="${head.url}"`);
      expect(html).toContain(`property="og:locale" content="${head.locale}"`);
      expect(html).toContain(`property="og:locale:alternate" content="${head.localeAlternate}"`);
    },
  );

  test('o link em inglês aponta para /en, e o alternativo é o português', () => {
    const head = pageHead('en', 'https://exemplo.dev');

    expect(head.url).toBe('https://exemplo.dev/en');
    expect([head.locale, head.localeAlternate]).toEqual(['en_US', 'pt_BR']);
  });

  // No build, o plugin seo() põe os links de hreflang, que também contêm lang="pt-BR".
  test('não confunde o hreflang dos links com o lang do <html>', () => {
    const withAlternates = indexHtml.replace(
      '</head>',
      '<link rel="alternate" hreflang="pt-BR" href="/"><link rel="alternate" hreflang="en" href="/en"></head>',
    );

    const html = localizeHead(withAlternates, pageHead(DEFAULT_LANGUAGE), pageHead('en'));

    expect(html).toContain('<html lang="en"');
    expect(html).toContain('hreflang="pt-BR"');
    expect(html).toContain('hreflang="en"');
  });

  test('valores com aspas ou < entram escapados no atributo', () => {
    const from = pageHead(DEFAULT_LANGUAGE);
    const to = { ...from, title: 'Título "com aspas" <e tag>' };

    const html = localizeHead(indexHtml, from, to);

    expect(html).toContain('content="Título &quot;com aspas&quot; &lt;e tag&gt;"');
  });

  test('falha se um valor do <head> não estiver no index.html', () => {
    const from = { ...pageHead(DEFAULT_LANGUAGE), title: 'Título que não existe' };

    expect(() => localizeHead(indexHtml, from, pageHead('en'))).toThrow(/Título que não existe/);
  });
});
