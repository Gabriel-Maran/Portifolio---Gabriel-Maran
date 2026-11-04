import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { parseRichText, type RichTextToken } from '../../src/utils/richText.ts';

const text = (value: string): RichTextToken => ({ type: 'text', text: value });

describe('parseRichText: marcação válida', () => {
  test('texto sem marcação vira um token só', () => {
    assert.deepEqual(parseRichText('texto simples'), [text('texto simples')]);
  });

  test('lê forte, ênfase e código', () => {
    assert.deepEqual(parseRichText('**Minha parte:** planejei'), [
      { type: 'strong', text: 'Minha parte:' },
      text(' planejei'),
    ]);
    assert.deepEqual(parseRichText('Júnior *no Grupo Ítalo*'), [
      text('Júnior '),
      { type: 'emphasis', text: 'no Grupo Ítalo' },
    ]);
    assert.deepEqual(parseRichText('como `+18%PASSEU`, e'), [
      text('como '),
      { type: 'code', text: '+18%PASSEU' },
      text(', e'),
    ]);
  });

  test('lê link pela chave', () => {
    assert.deepEqual(parseRichText('um [app acadêmico](academicApp).'), [
      text('um '),
      { type: 'link', text: 'app acadêmico', target: 'academicApp' },
      text('.'),
    ]);
  });

  test('lê marcadores seguidos e nas pontas', () => {
    assert.deepEqual(parseRichText('**a***b*`c`'), [
      { type: 'strong', text: 'a' },
      { type: 'emphasis', text: 'b' },
      { type: 'code', text: 'c' },
    ]);
  });

  test('o código guarda asteriscos como texto', () => {
    assert.deepEqual(parseRichText('`a*b*`'), [{ type: 'code', text: 'a*b*' }]);
  });
});

describe('parseRichText: entradas estranhas', () => {
  test('texto vazio não gera token', () => {
    assert.deepEqual(parseRichText(''), []);
  });

  const literals = [
    ['marcador sem par', '*sem fechar'],
    ['asteriscos soltos numa conta', '2 * 3 * 4'],
    ['marcadores sem conteúdo', '**** e `` e []()'],
    ['ênfase que começa com espaço', '* errado*'],
    ['link sem chave', '[texto]()'],
  ] as const;

  for (const [description, input] of literals) {
    test(`${description} fica como texto`, () => {
      assert.deepEqual(parseRichText(input), [text(input)]);
    });
  }

  // Segurança: o texto não consegue criar link para uma URL própria.
  const unsafeLinks = [
    '[clique](javascript:alert(1))',
    '[clique](https://exemplo.com)',
    '[clique](../segredo)',
    '[clique](data:text/html,oi)',
  ];

  for (const input of unsafeLinks) {
    test(`não cria link a partir de ${input}`, () => {
      assert.ok(parseRichText(input).every((token) => token.type !== 'link'));
    });
  }

  test('não aninha marcação: o de dentro vale, o de fora fica como texto', () => {
    assert.deepEqual(parseRichText('**a *b* c**'), [
      text('**a '),
      { type: 'emphasis', text: 'b' },
      text(' c**'),
    ]);
  });
});
