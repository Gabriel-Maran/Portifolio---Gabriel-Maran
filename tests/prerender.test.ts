import { expect, test } from 'vitest';
import { OWNER_NAME, SECTION_IDS } from '../src/globals/constants.ts';
import { messages } from '../src/globals/messages/index.ts';
import { renderPage } from '../src/prerender.tsx';

// Este teste roda no Node, sem window nem document, como o build que gera o HTML.
test('gera a página inteira no Node, sem depender do navegador', () => {
  expect(typeof window).toBe('undefined');

  const html = renderPage();

  expect(html).toContain(`>${OWNER_NAME}</h1>`);
  for (const id of Object.values(SECTION_IDS)) expect(html).toContain(`id="${id}"`);
});

// A CSP não aceita estilo inline: um style="..." no HTML gerado seria bloqueado pelo navegador.
test('o HTML gerado não tem atributo de estilo', () => {
  expect(renderPage()).not.toMatch(/\sstyle="/);
});

test('a página gerada sai em português, com os textos de cada seção', () => {
  const html = renderPage();
  const { whatIDo, experience, projects, contact } = messages.pt;

  for (const title of [whatIDo.title, experience.title, projects.title, contact.title]) {
    expect(html).toContain(title);
  }
  expect(html).not.toContain(messages.en.whatIDo.title);
});
