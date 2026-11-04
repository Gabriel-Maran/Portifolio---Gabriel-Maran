import { act, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { useActiveSection } from '../../../src/pages/home/useActiveSection.ts';

const IDS = ['primeira', 'segunda'] as const;

// O jsdom não tem IntersectionObserver. Este falso guarda o callback para o teste disparar.
class FakeIntersectionObserver implements IntersectionObserver {
  static latest: FakeIntersectionObserver | undefined;
  readonly root = null;
  readonly rootMargin = '';
  readonly scrollMargin = '';
  readonly thresholds = [];
  readonly observed: Element[] = [];
  readonly disconnect = vi.fn();
  readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    FakeIntersectionObserver.latest = this;
  }

  observe(element: Element) {
    this.observed.push(element);
  }

  unobserve() {}

  takeRecords() {
    return [];
  }

  enter(id: string, isIntersecting = true) {
    const target = document.getElementById(id);
    if (!target) throw new Error(`Seção ${id} não está na página.`);
    const rect = target.getBoundingClientRect();
    const entry: IntersectionObserverEntry = {
      target,
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
      boundingClientRect: rect,
      intersectionRect: rect,
      rootBounds: null,
      time: 0,
    };
    act(() => this.callback([entry], this));
  }
}

function Page() {
  const active = useActiveSection(IDS);
  return (
    <>
      <p data-testid="active">{active ?? 'nenhuma'}</p>
      {IDS.map((id) => (
        <section key={id} id={id} />
      ))}
    </>
  );
}

const active = () => screen.getByTestId('active').textContent;

test('começa sem seção ativa e observa todas as seções', () => {
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);

  render(<Page />);

  expect(active()).toBe('nenhuma');
  expect(FakeIntersectionObserver.latest?.observed.map((element) => element.id)).toEqual([...IDS]);
});

test('marca a seção que entra no meio da tela', () => {
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
  render(<Page />);

  FakeIntersectionObserver.latest?.enter('segunda');
  expect(active()).toBe('segunda');

  FakeIntersectionObserver.latest?.enter('primeira');
  expect(active()).toBe('primeira');
});

test('uma seção que sai da faixa não muda a seção ativa', () => {
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
  render(<Page />);

  FakeIntersectionObserver.latest?.enter('primeira');
  FakeIntersectionObserver.latest?.enter('segunda', false);

  expect(active()).toBe('primeira');
});

test('avisa cada seção que entra, para a página registrar a visita', () => {
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
  const entered: string[] = [];
  function PageWithVisits() {
    useActiveSection(IDS, (id) => entered.push(id));
    return (
      <>
        {IDS.map((id) => (
          <section key={id} id={id} />
        ))}
      </>
    );
  }
  render(<PageWithVisits />);

  FakeIntersectionObserver.latest?.enter('segunda');
  FakeIntersectionObserver.latest?.enter('primeira', false);
  FakeIntersectionObserver.latest?.enter('primeira');

  expect(entered).toEqual(['segunda', 'primeira']);
});

test('desliga o observer quando a página sai da tela', () => {
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
  const { unmount } = render(<Page />);
  const observer = FakeIntersectionObserver.latest;

  unmount();

  expect(observer?.disconnect).toHaveBeenCalledOnce();
});

test('sem IntersectionObserver, a página funciona sem marcar seção', () => {
  expect('IntersectionObserver' in window).toBe(false);

  render(<Page />);

  expect(active()).toBe('nenhuma');
});
