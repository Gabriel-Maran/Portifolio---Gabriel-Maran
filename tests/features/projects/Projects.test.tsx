import { screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Projects } from '../../../src/features/projects/Projects.tsx';
import { EXTERNAL_URLS, LANGUAGES } from '../../../src/globals/constants.ts';
import { messages } from '../../../src/globals/messages/index.ts';
import { renderWithProviders } from '../../support/renderWithProviders.tsx';

describe.each(LANGUAGES)('projetos em %s', (language) => {
  const { projects } = messages[language];
  const url = language === 'en' ? '/?lang=en' : '/';

  test('os projetos em construção ficam abaixo de um título próprio, um h4 para cada', () => {
    renderWithProviders(<Projects />, { url });

    expect(screen.getByRole('heading', { level: 3, name: projects.inProgressTitle })).toBeTruthy();
    expect(screen.getAllByRole('heading', { level: 4 }).map((title) => title.textContent)).toEqual(
      projects.inProgress.map((project) => project.name),
    );
  });

  test('cada projeto em construção mostra o estado e avisa que o código é privado', () => {
    renderWithProviders(<Projects />, { url });

    for (const project of projects.inProgress) {
      const card = screen.getByRole('heading', { level: 4, name: project.name }).closest('article');
      if (!card) throw new Error(`O card de ${project.name} deveria existir.`);
      expect(within(card).getByText(project.status)).toBeTruthy();
      expect(within(card).getByText(projects.privateCode)).toBeTruthy();
      expect(within(card).queryAllByRole('link')).toEqual([]);
    }
  });
});

test('só o projeto entregue tem links externos, para o vídeo e o código', () => {
  renderWithProviders(<Projects />);

  const externalLinks = screen
    .getAllByRole('link')
    .map((link) => link.getAttribute('href'))
    .filter((href) => !href?.startsWith('#'));
  expect(externalLinks).toEqual([EXTERNAL_URLS.rinhaVideo, EXTERNAL_URLS.rinhaCode]);
});
