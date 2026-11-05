import { describe, expect, test } from 'vitest';
import { injectAppHtml, ROOT_PLACEHOLDER } from '../../config/prerender.ts';

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
