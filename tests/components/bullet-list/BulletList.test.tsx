import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { BulletList } from '../../../src/components/bullet-list/BulletList.tsx';

test('mostra um item da lista para cada texto, na ordem', () => {
  render(<BulletList items={['primeiro', 'segundo']} />);

  expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
    'primeiro',
    'segundo',
  ]);
});

test('aplica a marcação de destaque em cada item', () => {
  const { container } = render(<BulletList items={['usa `render` por dentro']} />);

  expect(container.querySelector('li code')?.textContent).toBe('render');
});

test('HTML num item aparece como texto e nunca vira elemento', () => {
  const malicious = '<img src=x onerror="alert(1)">';
  const { container } = render(<BulletList items={[malicious]} />);

  expect(container.querySelector('img')).toBeNull();
  expect(screen.getByRole('listitem').textContent).toBe(malicious);
});

test('lista vazia não mostra item', () => {
  render(<BulletList items={[]} />);

  expect(screen.queryAllByRole('listitem')).toEqual([]);
});
