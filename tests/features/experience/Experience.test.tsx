import { screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Experience } from '../../../src/features/experience/Experience.tsx';
import { LANGUAGES } from '../../../src/globals/constants.ts';
import { messages } from '../../../src/globals/messages/index.ts';
import { renderWithProviders } from '../../support/renderWithProviders.tsx';

// O bloco de um emprego, achado pelo cargo.
function entryOf(role: string) {
  const entry = screen.getByRole('heading', { level: 3, name: role }).closest('article');
  if (!entry) throw new Error(`O emprego ${role} deveria existir.`);
  return entry;
}

const detailsIn = (entry: HTMLElement) => {
  const details = entry.querySelector('details');
  if (!details) throw new Error('Os detalhes do emprego deveriam existir.');
  return details;
};

describe.each(LANGUAGES)('experiência em %s', (language) => {
  const { experience } = messages[language];
  const url = language === 'en' ? '/?lang=en' : '/';

  test('cada emprego mostra o resumo fora dos detalhes, que começam fechados', () => {
    renderWithProviders(<Experience />, { url });

    for (const job of experience.jobs) {
      const entry = entryOf(job.role);
      const summary = within(entry).getByText(job.summary);
      expect(summary.closest('details')).toBeNull();
      expect(detailsIn(entry).open).toBe(false);
    }
  });

  test('os detalhes trazem as entregas e os aprendizados, cada bloco com o seu título', () => {
    renderWithProviders(<Experience />, { url });

    for (const job of experience.jobs) {
      const details = detailsIn(entryOf(job.role));
      const titles = within(details)
        .getAllByRole('heading', { level: 4 })
        .map((title) => title.textContent);
      expect(titles).toEqual([
        job.isCurrent ? experience.highlightsTitle.current : experience.highlightsTitle.past,
        experience.learnedTitle,
      ]);
      const items = within(details)
        .getAllByRole('listitem')
        .map((item) => item.textContent);
      expect(items).toHaveLength(job.highlights.length + job.learned.length);
    }
  });

  test('o controle de cada emprego tem um nome único para o leitor de tela', () => {
    renderWithProviders(<Experience />, { url });

    const names = experience.jobs.map(
      (job) => detailsIn(entryOf(job.role)).querySelector('summary')?.textContent,
    );
    expect(new Set(names).size).toBe(experience.jobs.length);
    for (const name of names) expect(name).toContain(experience.detailsToggle);
  });
});

test('o diagrama de envio fica nos detalhes do emprego que o mostra', () => {
  renderWithProviders(<Experience />);
  const { experience } = messages.pt;

  for (const job of experience.jobs) {
    const diagram = within(detailsIn(entryOf(job.role))).queryByText(experience.uploadFlow.label);
    expect(diagram !== null).toBe(job.showsUploadFlow);
  }
});
