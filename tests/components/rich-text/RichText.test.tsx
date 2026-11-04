import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { RichText } from '../../../src/components/rich-text/RichText.tsx';
import { EXTERNAL_URLS } from '../../../src/globals/constants.ts';

test('mostra forte, ênfase e código como elementos', () => {
  const { container } = render(<RichText text="**forte** e *ênfase* e `código`" />);

  expect(container.querySelector('strong')?.textContent).toBe('forte');
  expect(container.querySelector('em')?.textContent).toBe('ênfase');
  expect(container.querySelector('code')?.textContent).toBe('código');
  expect(container.textContent).toBe('forte e ênfase e código');
});

test('link por chave abre em outra aba, sem dar acesso à página de origem', () => {
  render(<RichText text="um [app acadêmico](academicApp)" />);

  const link = screen.getByRole('link', { name: 'app acadêmico' });
  expect(link.getAttribute('href')).toBe(EXTERNAL_URLS.academicApp);
  expect(link.getAttribute('target')).toBe('_blank');
  expect(link.getAttribute('rel')).toBe('noopener noreferrer');
});

test('chave desconhecida vira texto comum, sem link', () => {
  const { container } = render(<RichText text="um [link](naoExiste)" />);

  expect(screen.queryByRole('link')).toBeNull();
  expect(container.textContent).toBe('um link');
});

// Segurança: HTML dentro do texto aparece como texto e nunca vira elemento.
test('HTML no texto não é interpretado', () => {
  const malicious = '<img src=x onerror="alert(1)"><script>alert(2)</script>';
  const { container } = render(<RichText text={malicious} />);

  expect(container.querySelector('img')).toBeNull();
  expect(container.querySelector('script')).toBeNull();
  expect(container.textContent).toBe(malicious);
});

test('texto vazio não mostra nada', () => {
  const { container } = render(<RichText text="" />);

  expect(container.textContent).toBe('');
});
