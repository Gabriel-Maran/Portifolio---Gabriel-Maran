# Gabriel Maran · Portfólio

Site pessoal de Gabriel Maran, Desenvolvedor Full Stack Júnior: o que faço, experiência, projetos,
como resolvo problemas, stack e contato.

**No ar:** https://gabriel-maran.vercel.app · em inglês: https://gabriel-maran.vercel.app/?lang=en

A página tem um cubo mágico que abre embaralhado. Cada seção lida desfaz um movimento, e as seis
faces chegam resolvidas ao fechamento. A solução `U L R F B D` tem um movimento por seção, na ordem da página.

## Stack

- Vite, React 19 e TypeScript estrito
- CSS Modules com tokens de tema, sem biblioteca de estilo
- Vitest e Testing Library
- oxlint e Prettier
- GitHub Actions e Vercel

## Rodando

Precisa do Node 24.

```bash
npm ci
npm run dev
```

| Comando              | O que faz                                                  |
| -------------------- | ---------------------------------------------------------- |
| `npm run dev`        | servidor de desenvolvimento                                |
| `npm run check`      | lint, formatação, testes e build, como no CI               |
| `npm run test:watch` | testes observando os arquivos                              |
| `npm run build`      | build de produção, com typecheck antes                     |
| `npm run preview`    | serve o build com os mesmos headers de segurança da Vercel |

## Arquitetura

O código fica em camadas. Cada uma só importa das que vêm depois dela:

```
main → app → pages → features → cube → components → i18n → errors → utils → globals → theme
```

- **pages** compõem as features e guardam o que elas dividem, como a seção ativa e o cubo.
- **features** são os blocos da página (abertura, navegação, cada seção). Uma feature não importa outra.
- **cube** é o cubo, usado por várias features.
- **components** são peças de interface genéricas.
- **utils** e **globals** não dependem de nenhum pacote: funções puras, constantes e os textos.

Um teste lê todos os imports de `src/` e falha se alguma regra for quebrada, e o lint barra ciclos
de import.

## Decisões que valem uma olhada

- **Idiomas sem biblioteca.** Os textos ficam em dicionários tipados: o inglês não compila sem as
  mesmas chaves do português. Destaques usam uma marcação mínima (`**forte**`, `` `código` ``,
  `[link](chave)`) lida por um parser, nunca por `innerHTML`. O link aponta para uma chave de
  constante, então um texto não consegue criar link para uma URL qualquer.
- **Cubo sincronizado.** O cubo da abertura e o do rastreador giram juntos: um maestro sem React põe os movimentos em
  fila e espera todos terminarem. A animação roda direto no DOM, sem render do React a cada quadro.
  Fora da tela ou com movimento reduzido, o giro é instantâneo.
- **Erros num lugar só.** Todo erro vira um `AppError` com código, e um único módulo escreve no
  console. Se a página quebrar, a tela de falha mantém o e-mail e os links visíveis.
- **Tema em dois níveis.** Valores brutos e papéis de cor por tema. A faixa clara troca de tema só
  com `data-theme="light"`, e um teste confere o contraste WCAG de cada par de cor nos dois temas.
- **Segurança.** CSP estrita (só scripts do próprio site, nada inline), headers contra iframe e
  sniffing, e links externos com `rel="noopener noreferrer"`. Um teste impede afrouxar a CSP.
- **Métricas sem pacote.** Web Analytics e Speed Insights da Vercel entram por um plugin de build,
  só no deploy, sem mudar a CSP.

## Qualidade

- **Testes:** lógica pura no Node e componentes no jsdom. A página inteira é testada nos dois
  idiomas: ordem das seções, títulos sem salto de nível, âncoras que existem, links externos seguros
  e imagens com texto alternativo.
- **HTML pronto no build:** a página sai do build já escrita no `index.html`, e o React só a
  hidrata. Quem chega sem JavaScript, e os robôs, leem tudo. Um teste hidrata o HTML gerado e
  falha se o React apontar qualquer diferença.
- **CI:** o `npm run check` roda a cada push e pull request, com as actions fixadas por SHA.
- **Dependências:** o Dependabot abre PRs semanais para npm e actions, só com versões publicadas
  há mais de 7 dias.
- **Ambiente:** a versão do Node vem só do `engines` do `package.json`, e o `.npmrc` desliga
  scripts de instalação no CI e na Vercel.

## Publicação

A Vercel publica cada push no `master`, com a configuração no `vercel.json`. O endereço do site
fica em `config/site.ts`: trocar o domínio é mudar uma linha, e o `og:url`, o `robots.txt` e o
`sitemap.xml` acompanham. A imagem de compartilhamento sai de `scripts/og-image.html`.
