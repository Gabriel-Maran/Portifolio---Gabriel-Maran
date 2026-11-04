import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { CopyEmailButton } from '../../../src/components/copy-email-button/CopyEmailButton.tsx';
import { CONTACT_EMAIL } from '../../../src/globals/constants.ts';
import { messages } from '../../../src/globals/messages/index.ts';
import { renderWithProviders } from '../../support/renderWithProviders.tsx';

const { copyEmail } = messages.pt;

function stubClipboard(writeText: () => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
}

// Deixa a promessa da cópia terminar e o React aplicar o novo estado.
const flushCopy = () => act(async () => {});

afterEach(() => {
  Reflect.deleteProperty(navigator, 'clipboard');
  vi.useRealTimers();
});

test('copia o e-mail e avisa quem usa leitor de tela', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  stubClipboard(writeText);
  renderWithProviders(<CopyEmailButton />);

  fireEvent.click(screen.getByRole('button', { name: copyEmail.action }));
  await flushCopy();

  expect(writeText).toHaveBeenCalledWith(CONTACT_EMAIL);
  expect(screen.getByRole('button', { name: copyEmail.copied })).toBeTruthy();
  expect(screen.getByRole('status').textContent).toBe(copyEmail.copied);
});

test('depois de um tempo, o botão volta ao texto normal', async () => {
  vi.useFakeTimers();
  stubClipboard(vi.fn().mockResolvedValue(undefined));
  renderWithProviders(<CopyEmailButton />);

  fireEvent.click(screen.getByRole('button', { name: copyEmail.action }));
  await flushCopy();
  act(() => vi.advanceTimersByTime(2500));

  expect(screen.getByRole('button', { name: copyEmail.action })).toBeTruthy();
  expect(screen.getByRole('status').textContent).toBe('');
});

test('se o navegador recusar, mostra o e-mail selecionado para copiar na mão', async () => {
  stubClipboard(vi.fn().mockRejectedValue(new Error('NotAllowedError')));
  renderWithProviders(<CopyEmailButton />);

  fireEvent.click(screen.getByRole('button', { name: copyEmail.action }));
  await flushCopy();

  const field = screen.getByRole<HTMLInputElement>('textbox', {
    name: messages.pt.contact.emailLabel,
  });
  expect(field.value).toBe(CONTACT_EMAIL);
  expect(field.readOnly).toBe(true);
  expect([field.selectionStart, field.selectionEnd]).toEqual([0, CONTACT_EMAIL.length]);
  expect(screen.getByRole('status').textContent).toBe(copyEmail.selected);
});

test('sem a API de área de transferência, cai no mesmo campo selecionado', async () => {
  renderWithProviders(<CopyEmailButton />);

  fireEvent.click(screen.getByRole('button', { name: copyEmail.action }));
  await flushCopy();

  expect(screen.getByRole<HTMLInputElement>('textbox').value).toBe(CONTACT_EMAIL);
});
