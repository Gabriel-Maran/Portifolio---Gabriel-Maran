import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { DEFAULT_LANGUAGE, EXTERNAL_URLS, LANGUAGES } from '../../src/globals/constants.ts';
import { messages } from '../../src/globals/messages/index.ts';
import { hasKey } from '../../src/utils/object.ts';
import { parseRichText } from '../../src/utils/richText.ts';

type Leaf = [path: string, value: unknown];

// Achata o dicionário em pares "hero.facts.0" → valor, para comparar idiomas chave a chave.
function flatten(value: unknown, path = ''): Leaf[] {
  if (typeof value !== 'object' || value === null) return [[path, value]];
  return Object.entries(value).flatMap(([key, child]) =>
    flatten(child, path ? `${path}.${key}` : key),
  );
}

// Funções de texto recebem números ou a sequência do cubo. Estes exemplos cobrem singular e plural.
const SAMPLE_ARGUMENTS: unknown[][] = [[1, 6], [6, 6], ['U L R F B D']];

function renderedTexts([path, value]: Leaf): Leaf[] {
  if (typeof value === 'string') return [[path, value]];
  if (typeof value !== 'function') return [];
  return SAMPLE_ARGUMENTS.map((args): Leaf => [`${path}(${args.join(', ')})`, value(...args)]);
}

const keysOf = (dictionary: unknown) => flatten(dictionary).map(([path]) => path);

for (const language of LANGUAGES) {
  describe(`mensagens em ${language}`, () => {
    const leaves = flatten(messages[language]);
    const texts = leaves.flatMap(renderedTexts);

    test('tem as mesmas chaves do idioma padrão', () => {
      assert.deepEqual(keysOf(messages[language]), keysOf(messages[DEFAULT_LANGUAGE]));
    });

    test('só tem texto, número, booleano ou função de texto', () => {
      const invalid = leaves.filter(
        ([, value]) => !['string', 'number', 'boolean', 'function'].includes(typeof value),
      );
      assert.deepEqual(invalid, []);
    });

    test('nenhum texto está vazio, nem o gerado por função', () => {
      const empty = texts.filter(([, text]) => typeof text !== 'string' || text.trim() === '');
      assert.deepEqual(empty, []);
    });

    // Os textos não têm asterisco nem crase de verdade: um que sobra é marcação mal fechada.
    test('a marcação de destaque está bem fechada', () => {
      const leftovers = texts.filter(([, text]) =>
        parseRichText(String(text)).some(
          (token) => token.type === 'text' && /[*`]|\]\(/.test(token.text),
        ),
      );
      assert.deepEqual(leftovers, []);
    });

    test('todo link aponta para uma chave de EXTERNAL_URLS', () => {
      const unknown = texts.flatMap(([path, text]) =>
        parseRichText(String(text)).flatMap((token) =>
          token.type === 'link' && !hasKey(EXTERNAL_URLS, token.target)
            ? [`${path}: ${token.target}`]
            : [],
        ),
      );
      assert.deepEqual(unknown, []);
    });
  });
}
