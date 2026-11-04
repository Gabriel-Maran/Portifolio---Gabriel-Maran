import { describe, expect, test } from 'vitest';
import type { Language } from '../../src/globals/constants.ts';
import {
  parseLanguage,
  resolveInitialLanguage,
  withLanguageParam,
} from '../../src/utils/language.ts';

describe('parseLanguage', () => {
  test.each<[input: string | null | undefined, expected: Language | null]>([
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
  ])('%j devolve %s', (input, expected) => {
    expect(parseLanguage(input)).toBe(expected);
  });
});

describe('resolveInitialLanguage', () => {
  test('sem URL nem escolha salva, abre em português', () => {
    expect(resolveInitialLanguage({ search: '', stored: null })).toBe('pt');
  });

  test('a escolha salva vale quando a URL não pede idioma', () => {
    expect(resolveInitialLanguage({ search: '?utm=linkedin', stored: 'en' })).toBe('en');
  });

  test('a URL vence a escolha salva', () => {
    expect(resolveInitialLanguage({ search: '?lang=en', stored: 'pt' })).toBe('en');
    expect(resolveInitialLanguage({ search: '?lang=pt', stored: 'en' })).toBe('pt');
  });

  test('aceita variações na URL', () => {
    expect(resolveInitialLanguage({ search: '?lang=EN-us', stored: null })).toBe('en');
  });

  test('idioma inválido na URL cai para a escolha salva e depois para o padrão', () => {
    expect(resolveInitialLanguage({ search: '?lang=fr', stored: 'en' })).toBe('en');
    expect(resolveInitialLanguage({ search: '?lang=', stored: 'xx' })).toBe('pt');
    expect(resolveInitialLanguage({ search: '?lang=<script>', stored: null })).toBe('pt');
  });

  test('com o parâmetro repetido, vale o primeiro', () => {
    expect(resolveInitialLanguage({ search: '?lang=en&lang=pt', stored: null })).toBe('en');
  });
});

describe('withLanguageParam', () => {
  test('põe o idioma na URL', () => {
    expect(withLanguageParam('https://gabriel-maran.vercel.app/', 'en')).toBe(
      'https://gabriel-maran.vercel.app/?lang=en',
    );
  });

  test('tira o parâmetro no idioma padrão e mantém a âncora', () => {
    expect(withLanguageParam('https://gabriel-maran.vercel.app/?lang=en#projetos', 'pt')).toBe(
      'https://gabriel-maran.vercel.app/#projetos',
    );
  });

  test('mantém os outros parâmetros e troca o idioma existente', () => {
    expect(withLanguageParam('https://gabriel-maran.vercel.app/?utm=linkedin&lang=pt', 'en')).toBe(
      'https://gabriel-maran.vercel.app/?utm=linkedin&lang=en',
    );
  });
});
