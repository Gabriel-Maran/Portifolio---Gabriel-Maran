import { describe, expect, test } from 'vitest';
import type { Language } from '../../src/globals/constants.ts';
import {
  languageFromPath,
  parseLanguage,
  resolveInitialLanguage,
  withLanguagePath,
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

describe('languageFromPath', () => {
  test.each<[pathname: string, expected: Language | null]>([
    ['/en', 'en'],
    ['/en/', 'en'],
    // A raiz é do português, mas não pede idioma: quem volta com o inglês salvo continua nele.
    ['/', null],
    ['', null],
    ['/pt', null],
    ['/EN', null],
    ['/en/projetos', null],
    ['/english', null],
    ['/<script>', null],
  ])('%j devolve %s', (pathname, expected) => {
    expect(languageFromPath(pathname)).toBe(expected);
  });
});

describe('resolveInitialLanguage', () => {
  const ROOT = { pathname: '/', search: '' };

  test('sem URL nem escolha salva, abre em português', () => {
    expect(resolveInitialLanguage({ ...ROOT, stored: null })).toBe('pt');
  });

  test('a escolha salva vale quando a URL não pede idioma', () => {
    expect(resolveInitialLanguage({ ...ROOT, search: '?utm=linkedin', stored: 'en' })).toBe('en');
  });

  test('o caminho vence a escolha salva', () => {
    expect(resolveInitialLanguage({ pathname: '/en', search: '', stored: 'pt' })).toBe('en');
  });

  test('o caminho vence o ?lang de um link antigo', () => {
    expect(resolveInitialLanguage({ pathname: '/en', search: '?lang=pt', stored: null })).toBe(
      'en',
    );
  });

  test('na raiz, o ?lang dos links antigos ainda vence a escolha salva', () => {
    expect(resolveInitialLanguage({ ...ROOT, search: '?lang=en', stored: 'pt' })).toBe('en');
    expect(resolveInitialLanguage({ ...ROOT, search: '?lang=pt', stored: 'en' })).toBe('pt');
  });

  test('aceita variações no ?lang', () => {
    expect(resolveInitialLanguage({ ...ROOT, search: '?lang=EN-us', stored: null })).toBe('en');
  });

  test('idioma inválido na URL cai para a escolha salva e depois para o padrão', () => {
    expect(resolveInitialLanguage({ ...ROOT, search: '?lang=fr', stored: 'en' })).toBe('en');
    expect(resolveInitialLanguage({ ...ROOT, search: '?lang=', stored: 'xx' })).toBe('pt');
    expect(resolveInitialLanguage({ ...ROOT, search: '?lang=<script>', stored: null })).toBe('pt');
    expect(resolveInitialLanguage({ pathname: '/fr', search: '', stored: null })).toBe('pt');
  });

  test('com o parâmetro repetido, vale o primeiro', () => {
    expect(resolveInitialLanguage({ ...ROOT, search: '?lang=en&lang=pt', stored: null })).toBe(
      'en',
    );
  });
});

describe('withLanguagePath', () => {
  const SITE = 'https://gabriel-maran.vercel.app';

  test('leva ao caminho do idioma', () => {
    expect(withLanguagePath(`${SITE}/`, 'en')).toBe(`${SITE}/en`);
  });

  test('volta à raiz no idioma padrão e mantém a âncora e os outros parâmetros', () => {
    expect(withLanguagePath(`${SITE}/en?utm=linkedin#projetos`, 'pt')).toBe(
      `${SITE}/?utm=linkedin#projetos`,
    );
  });

  test('tira o ?lang de um link antigo, para ele não contradizer o caminho', () => {
    expect(withLanguagePath(`${SITE}/?utm=linkedin&lang=en`, 'en')).toBe(`${SITE}/en?utm=linkedin`);
    expect(withLanguagePath(`${SITE}/?lang=en`, 'pt')).toBe(`${SITE}/`);
  });
});
