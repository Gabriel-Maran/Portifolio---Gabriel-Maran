import { screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Projects } from '../../../src/features/projects/Projects.tsx';
import { EXTERNAL_URLS, LANGUAGES, PROJECT_LINK_KINDS } from '../../../src/globals/constants.ts';
import { messages } from '../../../src/globals/messages/index.ts';
import { hasKey } from '../../../src/utils/object.ts';
import { renderWithProviders } from '../../support/renderWithProviders.tsx';

// O card de um projeto, achado pelo título: h3 no entregue e h4 no que está em andamento.
function cardOf(name: string, level: 3 | 4 = 4) {
  const card = screen.getByRole('heading', { level, name }).closest('article');
  if (!card) throw new Error(`O card de ${name} deveria existir.`);
  return card;
}

const hrefsIn = (card: HTMLElement) =>
  within(card)
    .queryAllByRole('link')
    .map((link) => link.getAttribute('href'));

describe.each(LANGUAGES)('projetos em %s', (language) => {
  const { projects } = messages[language];
  const url = language === 'en' ? '/en' : '/';

  test('os pontos técnicos de cada card ficam num bloco fechado, com controle de nome único', () => {
    renderWithProviders(<Projects />, { url });

    for (const project of projects.inProgress) {
      const details = cardOf(project.name).querySelector('details');
      if (!details) throw new Error(`O card de ${project.name} deveria ter o bloco que abre.`);
      expect(details.open).toBe(false);
      expect(details.querySelector('summary')?.textContent).toContain(
        `${projects.highlightsToggle} · ${project.name}`,
      );
      expect(
        within(details)
          .getAllByRole('listitem')
          .map((item) => item.textContent),
      ).toHaveLength(project.highlights.length);
    }
  });

  test('os projetos em andamento ficam abaixo de um título próprio, um h4 para cada', () => {
    renderWithProviders(<Projects />, { url });

    expect(screen.getByRole('heading', { level: 3, name: projects.inProgressTitle })).toBeTruthy();
    expect(screen.getAllByRole('heading', { level: 4 }).map((title) => title.textContent)).toEqual(
      projects.inProgress.map((project) => project.name),
    );
  });

  test('cada projeto mostra o estado e os links que tem, na ordem combinada', () => {
    renderWithProviders(<Projects />, { url });

    for (const project of projects.inProgress) {
      const card = cardOf(project.name);
      expect(within(card).getByText(project.status)).toBeTruthy();
      const expected = PROJECT_LINK_KINDS.flatMap((kind) => {
        const urlKey = project.links[kind];
        return urlKey ? [EXTERNAL_URLS[urlKey]] : [];
      });
      expect(hrefsIn(card)).toEqual(expected);
    }
  });

  test('só o projeto sem código aberto avisa que o código é privado', () => {
    renderWithProviders(<Projects />, { url });

    for (const project of projects.inProgress) {
      const note = within(cardOf(project.name)).queryByText(projects.privateCode);
      expect(note !== null).toBe(!project.links.code);
    }
  });
});

describe.each(LANGUAGES)('projetos entregues em %s', (language) => {
  const { projects } = messages[language];
  const url = language === 'en' ? '/en' : '/';

  test('o PetShop Manager vem depois do Rinha, com os números, a imagem e a sua parte', () => {
    renderWithProviders(<Projects />, { url });
    const { petShop } = projects;
    const card = cardOf(petShop.name, 3);

    expect(screen.getAllByRole('heading', { level: 3 }).map((title) => title.textContent)).toEqual([
      projects.rinha.name,
      petShop.name,
      projects.inProgressTitle,
    ]);
    for (const [key, value] of Object.entries(petShop.stats)) {
      if (!hasKey(petShop.statLabels, key)) throw new Error(`Falta o rótulo de ${key}.`);
      const label = within(card).getByText(petShop.statLabels[key]);
      expect(label.nextElementSibling?.textContent).toBe(String(value));
    }
    expect(within(card).getByRole('img', { name: petShop.imageAlt })).toBeTruthy();
    expect(within(card).getByText(petShop.imageCaption)).toBeTruthy();
    expect(card.textContent).toContain(petShop.myPart.replaceAll('**', ''));
  });

  test('o PetShop Manager linka o código e o post, nesta ordem', () => {
    renderWithProviders(<Projects />, { url });
    const { linkLabels } = projects;
    const card = cardOf(projects.petShop.name, 3);

    expect(within(card).getByRole('link', { name: linkLabels.code }).getAttribute('href')).toBe(
      EXTERNAL_URLS.petShopCode,
    );
    expect(within(card).getByRole('link', { name: linkLabels.post }).getAttribute('href')).toBe(
      EXTERNAL_URLS.petShopPost,
    );
    expect(hrefsIn(card)).toEqual([EXTERNAL_URLS.petShopCode, EXTERNAL_URLS.petShopPost]);
  });

  test('o PetShop Manager saiu dos projetos em andamento', () => {
    renderWithProviders(<Projects />, { url });

    expect(projects.inProgress.map((project) => project.name)).not.toContain(projects.petShop.name);
    expect(screen.queryByRole('heading', { level: 4, name: projects.petShop.name })).toBeNull();
  });
});

test('o Mini React linka só o código', () => {
  renderWithProviders(<Projects />);

  expect(hrefsIn(cardOf('Mini React'))).toEqual([EXTERNAL_URLS.miniReactCode]);
});

test('todo link externo da seção abre em outra aba com rel seguro', () => {
  renderWithProviders(<Projects />);

  const external = screen
    .getAllByRole('link')
    .filter((link) => !link.getAttribute('href')?.startsWith('#'));
  expect(external.length).toBeGreaterThan(0);
  for (const link of external) {
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  }
});
