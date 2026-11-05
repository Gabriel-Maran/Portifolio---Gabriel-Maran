import { describe, expect, test } from 'vitest';
import { LANGUAGES, OWNER_NAME, SECTION_IDS } from '../src/globals/constants.ts';
import { messages } from '../src/globals/messages/index.ts';
import { renderPage } from '../src/prerender.tsx';

describe.each(LANGUAGES)('página gerada em %s', (language) => {
  const { whatIDo, experience, projects, contact } = messages[language];
  const otherLanguage = LANGUAGES.find((candidate) => candidate !== language) ?? language;

  // Este teste roda no Node, sem window nem document, como o build que gera o HTML.
  test('sai inteira no Node, sem depender do navegador', () => {
    expect(typeof window).toBe('undefined');

    const html = renderPage(language);

    expect(html).toContain(`>${OWNER_NAME}</h1>`);
    for (const id of Object.values(SECTION_IDS)) expect(html).toContain(`id="${id}"`);
  });

  // A CSP não aceita estilo inline: um style="..." no HTML gerado seria bloqueado pelo navegador.
  test('não tem atributo de estilo', () => {
    expect(renderPage(language)).not.toMatch(/\sstyle="/);
  });

  test('traz os textos de cada seção no próprio idioma', () => {
    const html = renderPage(language);

    for (const title of [whatIDo.title, experience.title, projects.title, contact.title]) {
      expect(html).toContain(title);
    }
    expect(html).not.toContain(messages[otherLanguage].whatIDo.title);
  });
});
