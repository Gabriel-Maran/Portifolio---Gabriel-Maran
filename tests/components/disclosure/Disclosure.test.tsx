import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { Disclosure } from '../../../src/components/disclosure/Disclosure.tsx';

function renderDisclosure() {
  const { container } = render(
    <Disclosure summary="Ver detalhes">
      <p>Conteúdo escondido</p>
    </Disclosure>,
  );
  const details = container.querySelector('details');
  if (!details) throw new Error('O <details> deveria existir.');
  return details;
}

test('começa fechado, com o controle visível e o conteúdo na página', () => {
  const details = renderDisclosure();

  expect(details.open).toBe(false);
  expect(screen.getByText('Ver detalhes').closest('summary')).toBeTruthy();
  // Fechado, o conteúdo continua no HTML: a busca da página e os robôs o encontram.
  expect(screen.getByText('Conteúdo escondido')).toBeTruthy();
});

test('abre e fecha pelo controle', () => {
  const details = renderDisclosure();
  const summary = screen.getByText('Ver detalhes');

  fireEvent.click(summary);
  expect(details.open).toBe(true);

  fireEvent.click(summary);
  expect(details.open).toBe(false);
});

test('a seta do controle é decorativa e fica fora do leitor de tela', () => {
  const details = renderDisclosure();

  expect(details.querySelector('summary [aria-hidden="true"]')?.textContent).toBe('↓');
});
