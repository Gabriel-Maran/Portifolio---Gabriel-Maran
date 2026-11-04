export type RichTextToken =
  | { type: 'text' | 'strong' | 'emphasis' | 'code'; text: string }
  | { type: 'link'; text: string; target: string };

/*
 * Marcação aceita, sem aninhamento:
 *   **forte**  *ênfase*  `código`  [texto](chave)
 * Ênfase e forte não começam nem terminam com espaço, então "2 * 3 * 4" continua texto.
 * A chave do link só tem letras, números e hífen: uma URL escrita no texto nunca vira link.
 * Marcador sem par fica como texto comum.
 */
const MARKUP =
  /\*\*([^\s*](?:[^*]*?[^\s*])?)\*\*|\*([^\s*](?:[^*]*?[^\s*])?)\*|`([^`]+)`|\[([^\]]+)\]\(([A-Za-z][\w-]*)\)/g;

function toToken(match: RegExpMatchArray): RichTextToken {
  const [raw, strong, emphasis, code, linkText, linkTarget] = match;
  if (strong !== undefined) return { type: 'strong', text: strong };
  if (emphasis !== undefined) return { type: 'emphasis', text: emphasis };
  if (code !== undefined) return { type: 'code', text: code };
  if (linkText !== undefined && linkTarget !== undefined) {
    return { type: 'link', text: linkText, target: linkTarget };
  }
  return { type: 'text', text: raw };
}

export function parseRichText(source: string): RichTextToken[] {
  const tokens: RichTextToken[] = [];
  let cursor = 0;

  for (const match of source.matchAll(MARKUP)) {
    if (match.index > cursor)
      tokens.push({ type: 'text', text: source.slice(cursor, match.index) });
    tokens.push(toToken(match));
    cursor = match.index + match[0].length;
  }

  if (cursor < source.length) tokens.push({ type: 'text', text: source.slice(cursor) });
  return tokens;
}
