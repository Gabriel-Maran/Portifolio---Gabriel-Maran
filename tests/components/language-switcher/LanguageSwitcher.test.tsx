import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { LanguageSwitcher } from '../../../src/components/language-switcher/LanguageSwitcher.tsx';
import { messages } from '../../../src/globals/messages/index.ts';
import { LanguageProvider } from '../../../src/i18n/LanguageProvider.tsx';

const renderSwitcher = () =>
  render(
    <LanguageProvider>
      <LanguageSwitcher />
    </LanguageProvider>,
  );

const isPressed = (name: string) =>
  screen.getByRole('button', { name }).getAttribute('aria-pressed');

test('é um grupo com nome, e cada botão começa pela sigla visível', () => {
  renderSwitcher();

  expect(screen.getByRole('group', { name: messages.pt.language.label })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'PT Português' }).getAttribute('lang')).toBe('pt-BR');
  expect(screen.getByRole('button', { name: 'EN English' }).getAttribute('lang')).toBe('en');
});

test('marca só o idioma atual', () => {
  renderSwitcher();

  expect(isPressed('PT Português')).toBe('true');
  expect(isPressed('EN English')).toBe('false');
});

test('o clique troca o idioma marcado e o nome do grupo', () => {
  renderSwitcher();

  fireEvent.click(screen.getByRole('button', { name: 'EN English' }));

  expect(isPressed('EN English')).toBe('true');
  expect(isPressed('PT Português')).toBe('false');
  expect(screen.getByRole('group', { name: messages.en.language.label })).toBeTruthy();
});
