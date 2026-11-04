import { expect, test, vi } from 'vitest';
import { copyToClipboard } from '../../src/utils/clipboard.ts';

test('copia e devolve true', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);

  await expect(copyToClipboard('texto', { writeText })).resolves.toBe(true);
  expect(writeText).toHaveBeenCalledWith('texto');
});

test('devolve false quando o navegador recusa', async () => {
  const writeText = vi.fn().mockRejectedValue(new Error('NotAllowedError'));

  await expect(copyToClipboard('texto', { writeText })).resolves.toBe(false);
});

test('devolve false sem a API de área de transferência', async () => {
  await expect(copyToClipboard('texto', undefined)).resolves.toBe(false);
});
