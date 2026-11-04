import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { silenceConsoleError } from '../support/silenceConsoleError.ts';
import { ErrorBoundary } from '../../src/errors/ErrorBoundary.tsx';
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  EXTERNAL_URLS,
  SOCIAL_LINKS,
} from '../../src/globals/constants.ts';
import { messages } from '../../src/globals/messages/index.ts';

function Broken(): never {
  throw new Error('falha de teste');
}

function renderBroken() {
  // O React registra no console o erro que o ErrorBoundary pegou; aqui ele é esperado.
  silenceConsoleError();
  render(
    <ErrorBoundary>
      <Broken />
    </ErrorBoundary>,
  );
}

test('sem erro, mostra o conteúdo normal', () => {
  render(
    <ErrorBoundary>
      <p>conteúdo</p>
    </ErrorBoundary>,
  );

  expect(screen.getByText('conteúdo')).toBeTruthy();
});

test('quando um filho quebra, mostra o fallback com recarregar', () => {
  renderBroken();

  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(messages.pt.errors.title);
  expect(screen.getByRole('button', { name: messages.pt.errors.reload })).toBeTruthy();
});

test('o fallback mantém o e-mail e as redes visíveis', () => {
  renderBroken();

  expect(screen.getByRole('link', { name: CONTACT_EMAIL }).getAttribute('href')).toBe(
    CONTACT_MAILTO,
  );
  for (const { label, href } of SOCIAL_LINKS) {
    const link = screen.getByRole('link', { name: label });
    expect(link.getAttribute('href')).toBe(href);
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  }
  expect(SOCIAL_LINKS.map(({ href }) => href)).toEqual([
    EXTERNAL_URLS.linkedin,
    EXTERNAL_URLS.github,
  ]);
});

test('o fallback segue o idioma do documento, sem depender do provider', () => {
  document.documentElement.lang = 'en';

  renderBroken();

  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(messages.en.errors.title);
});
