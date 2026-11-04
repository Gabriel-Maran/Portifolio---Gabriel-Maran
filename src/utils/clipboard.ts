/**
 * Copia o texto para a área de transferência.
 * Devolve false quando o navegador não deixa: sem HTTPS, sem permissão ou sem a API.
 */
export async function copyToClipboard(
  text: string,
  clipboard: Pick<Clipboard, 'writeText'> | undefined = globalThis.navigator?.clipboard,
): Promise<boolean> {
  if (!clipboard) return false;
  try {
    await clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
