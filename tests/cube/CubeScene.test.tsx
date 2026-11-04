import { fireEvent } from '@testing-library/react';
import { expect, test } from 'vitest';
import { CubeScene } from '../../src/cube/CubeScene.tsx';
import { renderWithProviders } from '../support/renderWithProviders.tsx';

const sceneOf = (container: HTMLElement) => {
  const scene = container.querySelector<HTMLElement>('[aria-hidden="true"]');
  if (!scene) throw new Error('A cena do cubo deveria existir.');
  return scene;
};

const rootOf = (scene: HTMLElement) => {
  const root = scene.firstElementChild;
  if (!(root instanceof HTMLElement)) throw new Error('O cubo deveria existir.');
  return root;
};

test('monta as 26 peças com os 54 adesivos, escondida do leitor de tela', () => {
  const { container } = renderWithProviders(<CubeScene />);
  const scene = sceneOf(container);

  expect(scene.querySelectorAll('[data-side]').length).toBe(26 * 6);
  expect(scene.querySelectorAll('[data-face-color]').length).toBe(54);
});

test('sem os lados internos, desenha só os lados com adesivo', () => {
  const { container } = renderWithProviders(<CubeScene showInnerSides={false} />);

  expect(sceneOf(container).querySelectorAll('[data-side]').length).toBe(54);
});

test('começa na inclinação pedida', () => {
  const { container } = renderWithProviders(<CubeScene tilt={[-20, 30]} />);

  expect(rootOf(sceneOf(container)).style.transform).toBe('rotateX(-20deg) rotateY(30deg)');
});

test('arrastar gira a vista; soltar para de girar', () => {
  const { container } = renderWithProviders(<CubeScene draggable tilt={[0, 0]} />);
  const scene = sceneOf(container);
  const root = rootOf(scene);

  fireEvent.pointerDown(scene, { clientX: 100, clientY: 100, pointerId: 1 });
  fireEvent.pointerMove(scene, { clientX: 120, clientY: 100, pointerId: 1 });
  const afterDrag = root.style.transform;
  fireEvent.pointerUp(scene, { pointerId: 1 });
  fireEvent.pointerMove(scene, { clientX: 200, clientY: 100, pointerId: 1 });

  expect(afterDrag).toBe('rotateX(0deg) rotateY(9deg)');
  expect(root.style.transform).toBe(afterDrag);
});

test('sem draggable, o arraste não muda nada', () => {
  const { container } = renderWithProviders(<CubeScene tilt={[0, 0]} />);
  const scene = sceneOf(container);

  fireEvent.pointerDown(scene, { clientX: 100, clientY: 100, pointerId: 1 });
  fireEvent.pointerMove(scene, { clientX: 160, clientY: 100, pointerId: 1 });

  expect(rootOf(scene).style.transform).toBe('rotateX(0deg) rotateY(0deg)');
});
