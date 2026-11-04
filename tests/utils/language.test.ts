import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import type { Language } from '../../src/globals/constants.ts';
import {
  parseLanguage,
  resolveInitialLanguage,
  withLanguageParam,
} from '../../src/utils/language.ts';

describe('parseLanguage', () => {
  const cases: Array<[input: string | null | undefined, expected: Language | null]> = [
    ['pt', 'pt'],
    ['en', 'en'],
    ['pt-BR', 'pt'],
    ['en-US', 'en'],
    ['en_US', 'en'],
    ['EN', 'en'],
    ['  en  ', 'en'],
    ['fr', null],
    ['english', null],
    ['-en', null],
    ['', null],
    ['   ', null],
    [null, null],
    [undefined, null],
  ];

  for (const [input, expected] of cases) {
    test(`${JSON.stringify(input) ?? 'undefined'} devolve ${expected}`, () => {
      assert.equal(parseLanguage(input), expected);
    });
  }
});

describe('resolveInitialLanguage', () => {
  test('sem URL nem escolha salva, abre em português', () => {
    assert.equal(resolveInitialLanguage({ search: '', stored: null }), 'pt');
  });

  test('a escolha salva vale quando a URL não pede idioma', () => {
    assert.equal(resolveInitialLanguage({ search: '?utm=linkedin', stored: 'en' }), 'en');
  });

  test('a URL vence a escolha salva', () => {
    assert.equal(resolveInitialLanguage({ search: '?lang=en', stored: 'pt' }), 'en');
    assert.equal(resolveInitialLanguage({ search: '?lang=pt', stored: 'en' }), 'pt');
  });

  test('aceita variações na URL', () => {
    assert.equal(resolveInitialLanguage({ search: '?lang=EN-us', stored: null }), 'en');
  });

  test('idioma inválido na URL cai para a escolha salva e depois para o padrão', () => {
    assert.equal(resolveInitialLanguage({ search: '?lang=fr', stored: 'en' }), 'en');
    assert.equal(resolveInitialLanguage({ search: '?lang=', stored: 'xx' }), 'pt');
    assert.equal(resolveInitialLanguage({ search: '?lang=<script>', stored: null }), 'pt');
  });

  test('com o parâmetro repetido, vale o primeiro', () => {
    assert.equal(resolveInitialLanguage({ search: '?lang=en&lang=pt', stored: null }), 'en');
  });
});

describe('withLanguageParam', () => {
  test('põe o idioma na URL', () => {
    assert.equal(
      withLanguageParam('https://gabriel-maran.vercel.app/', 'en'),
      'https://gabriel-maran.vercel.app/?lang=en',
    );
  });

  test('tira o parâmetro no idioma padrão e mantém a âncora', () => {
    assert.equal(
      withLanguageParam('https://gabriel-maran.vercel.app/?lang=en#projetos', 'pt'),
      'https://gabriel-maran.vercel.app/#projetos',
    );
  });

  test('mantém os outros parâmetros e troca o idioma existente', () => {
    assert.equal(
      withLanguageParam('https://gabriel-maran.vercel.app/?utm=linkedin&lang=pt', 'en'),
      'https://gabriel-maran.vercel.app/?utm=linkedin&lang=en',
    );
  });
});
