import { expect, test } from 'vitest';
import { messages } from '../../src/globals/messages/index.ts';
import {
  applyDocumentLanguage,
  type DocumentLanguageTarget,
} from '../../src/i18n/documentLanguage.ts';

function fakeDocument(withDescription = true) {
  const description = { content: '' };
  const target: DocumentLanguageTarget = {
    documentElement: { lang: 'pt-BR' },
    title: '',
    querySelector: (selectors) =>
      withDescription && selectors === 'meta[name="description"]'
        ? { setAttribute: (_name, value) => void (description.content = value) }
        : null,
  };
  return { target, description };
}

test('troca lang, título e descrição para o inglês', () => {
  const { target, description } = fakeDocument();

  applyDocumentLanguage(target, 'en');

  expect(target.documentElement.lang).toBe('en');
  expect(target.title).toBe(messages.en.meta.title);
  expect(description.content).toBe(messages.en.meta.description);
});

test('volta para o português com a tag pt-BR', () => {
  const { target } = fakeDocument();

  applyDocumentLanguage(target, 'en');
  applyDocumentLanguage(target, 'pt');

  expect(target.documentElement.lang).toBe('pt-BR');
  expect(target.title).toBe(messages.pt.meta.title);
});

test('não quebra se a página não tiver meta description', () => {
  const { target } = fakeDocument(false);

  expect(() => applyDocumentLanguage(target, 'en')).not.toThrow();
  expect(target.title).toBe(messages.en.meta.title);
});
