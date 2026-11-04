import { describe, expect, test } from 'vitest';
import { parseRichText, type RichTextToken } from '../../src/utils/richText.ts';

const text = (value: string): RichTextToken => ({ type: 'text', text: value });

describe('parseRichText: marcação válida', () => {
  test('texto sem marcação vira um token só', () => {
    expect(parseRichText('texto simples')).toEqual([text('texto simples')]);
  });

  test('lê forte, ênfase e código', () => {
    expect(parseRichText('**Minha parte:** planejei')).toEqual([
      { type: 'strong', text: 'Minha parte:' },
      text(' planejei'),
    ]);
    expect(parseRichText('Júnior *no Grupo Ítalo*')).toEqual([
      text('Júnior '),
      { type: 'emphasis', text: 'no Grupo Ítalo' },
    ]);
    expect(parseRichText('como `+18%PASSEU`, e')).toEqual([
      text('como '),
      { type: 'code', text: '+18%PASSEU' },
      text(', e'),
    ]);
  });

  test('lê link pela chave', () => {
    expect(parseRichText('um [app acadêmico](academicApp).')).toEqual([
      text('um '),
      { type: 'link', text: 'app acadêmico', target: 'academicApp' },
      text('.'),
    ]);
  });

  test('lê marcadores seguidos e nas pontas', () => {
    expect(parseRichText('**a***b*`c`')).toEqual([
      { type: 'strong', text: 'a' },
      { type: 'emphasis', text: 'b' },
      { type: 'code', text: 'c' },
    ]);
  });

  test('o código guarda asteriscos como texto', () => {
    expect(parseRichText('`a*b*`')).toEqual([{ type: 'code', text: 'a*b*' }]);
  });
});

describe('parseRichText: entradas estranhas', () => {
  test('texto vazio não gera token', () => {
    expect(parseRichText('')).toEqual([]);
  });

  test.each([
    ['marcador sem par', '*sem fechar'],
    ['asteriscos soltos numa conta', '2 * 3 * 4'],
    ['marcadores sem conteúdo', '**** e `` e []()'],
    ['ênfase que começa com espaço', '* errado*'],
    ['link sem chave', '[texto]()'],
  ])('%s fica como texto', (_description, input) => {
    expect(parseRichText(input)).toEqual([text(input)]);
  });

  // Segurança: o texto não consegue criar link para uma URL própria.
  test.each([
    '[clique](javascript:alert(1))',
    '[clique](https://exemplo.com)',
    '[clique](../segredo)',
    '[clique](data:text/html,oi)',
  ])('não cria link a partir de %s', (input) => {
    expect(parseRichText(input).map((token) => token.type)).not.toContain('link');
  });

  test('não aninha marcação: o de dentro vale, o de fora fica como texto', () => {
    expect(parseRichText('**a *b* c**')).toEqual([
      text('**a '),
      { type: 'emphasis', text: 'b' },
      text(' c**'),
    ]);
  });
});
