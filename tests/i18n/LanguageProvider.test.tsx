import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { silenceConsoleError } from '../support/silenceConsoleError.ts';
import { LanguageSwitcher } from '../../src/components/language-switcher/LanguageSwitcher.tsx';
import { LANGUAGE_STORAGE_KEY } from '../../src/globals/constants.ts';
import { messages } from '../../src/globals/messages/index.ts';
import { LanguageProvider } from '../../src/i18n/LanguageProvider.tsx';
import { useLanguage, useMessages } from '../../src/i18n/useLanguage.ts';

function CurrentLanguage() {
  const { language } = useLanguage();
  const { hero } = useMessages();
  return (
    <p data-testid="current">
      {language}: {hero.seeProjects}
    </p>
  );
}

function renderPage(url = '/') {
  window.history.replaceState(null, '', url);
  const description = document.createElement('meta');
  description.name = 'description';
  document.head.append(description);

  render(
    <LanguageProvider>
      <CurrentLanguage />
      <LanguageSwitcher />
    </LanguageProvider>,
  );
  return { description };
}

const current = () => screen.getByTestId('current').textContent;
const clickLanguage = (name: string) => fireEvent.click(screen.getByRole('button', { name }));

describe('idioma da visita', () => {
  test('sem URL nem escolha salva, abre em português', () => {
    renderPage();

    expect(current()).toBe(`pt: ${messages.pt.hero.seeProjects}`);
    expect(document.documentElement.lang).toBe('pt-BR');
    expect(document.title).toBe(messages.pt.meta.title);
  });

  test('/en abre em inglês', () => {
    renderPage('/en');

    expect(current()).toBe(`en: ${messages.en.hero.seeProjects}`);
    expect(document.documentElement.lang).toBe('en');
  });

  test('links antigos com ?lang=en ainda abrem em inglês', () => {
    renderPage('/?lang=en');

    expect(current()).toMatch(/^en:/);
  });

  test('usa a escolha salva na visita anterior', () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');

    renderPage();

    expect(current()).toMatch(/^en:/);
  });

  // O build gera o HTML sem navegador: o idioma passado direto não depende da URL nem do storage.
  test('o idioma inicial passado direto vence a URL e a escolha salva', () => {
    window.history.replaceState(null, '', '/en');
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');

    render(
      <LanguageProvider initialLanguage="pt">
        <CurrentLanguage />
      </LanguageProvider>,
    );

    expect(current()).toMatch(/^pt:/);
  });

  test('a URL vence a escolha salva, sem sobrescrever a escolha', () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'pt');

    renderPage('/en');

    expect(current()).toMatch(/^en:/);
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('pt');
  });

  test('idioma inválido na URL é ignorado', () => {
    renderPage('/?lang=<script>alert(1)</script>');

    expect(current()).toMatch(/^pt:/);
  });
});

describe('troca de idioma', () => {
  test('salva a escolha e atualiza URL, título e descrição', () => {
    const { description } = renderPage();

    clickLanguage('EN English');

    expect(current()).toBe(`en: ${messages.en.hero.seeProjects}`);
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');
    expect(window.location.pathname).toBe('/en');
    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toBe(messages.en.meta.title);
    expect(description.content).toBe(messages.en.meta.description);
  });

  test('voltar ao português leva à raiz e mantém a âncora e os outros parâmetros', () => {
    renderPage('/en?utm=linkedin#projetos');

    clickLanguage('PT Português');

    expect(window.location.pathname).toBe('/');
    expect(window.location.search).toBe('?utm=linkedin');
    expect(window.location.hash).toBe('#projetos');
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('pt');
  });

  test('a troca tira o ?lang de um link antigo', () => {
    renderPage('/?utm=linkedin&lang=en');

    clickLanguage('EN English');

    expect(window.location.pathname).toBe('/en');
    expect(window.location.search).toBe('?utm=linkedin');
  });

  test('com o armazenamento bloqueado, o idioma ainda troca', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });

    renderPage();
    clickLanguage('EN English');

    expect(current()).toMatch(/^en:/);
    expect(window.location.pathname).toBe('/en');
  });
});

test('useLanguage fora do LanguageProvider lança um erro com código', () => {
  // O React registra no console o erro de renderização; aqui ele é esperado.
  silenceConsoleError();

  expect(() => renderHook(() => useLanguage())).toThrow(
    expect.objectContaining({ code: 'LANGUAGE_PROVIDER_MISSING' }),
  );
});
