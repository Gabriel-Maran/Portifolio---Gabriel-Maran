import { useLayoutEffect, useRef, useState } from 'react';
import { cx } from '../utils/classNames.ts';
import { clamp, prefersReducedMotion } from '../utils/motion.ts';
import { createCubieShapes, type Face } from './model.ts';
import styles from './CubeScene.module.css';
import {
  CubeSceneController,
  DEFAULT_SPREAD,
  DEFAULT_TILT,
  type SceneElements,
  type Tilt,
} from './sceneController.ts';
import { useCube } from './useCube.ts';

interface CubeSceneProps {
  className?: string;
  /** Desenha os lados internos das peças. No cubo pequeno não aparecem, então podem sair. */
  showInnerSides?: boolean;
  spread?: number;
  tilt?: Tilt;
  /** Arrastar com o mouse ou o dedo gira a vista. */
  draggable?: boolean;
  /** A vista gira conforme a seção em volta passa pela tela, até a pessoa arrastar. */
  orbitOnScroll?: boolean;
}

// Graus de giro da vista por pixel arrastado, e quanto a órbita gira do começo ao fim da seção.
const DRAG_DEGREES_PER_PIXEL = 0.45;
const ORBIT_RANGE_DEGREES = 80;

/** Um cubo 3D que segue os giros da página. É decorativo: o leitor de tela não o vê. */
export function CubeScene({
  className,
  showInnerSides = true,
  spread = DEFAULT_SPREAD,
  tilt = DEFAULT_TILT,
  draggable = false,
  orbitOnScroll = false,
}: CubeSceneProps) {
  const { conductor } = useCube();
  const [shapes] = useState(() => createCubieShapes(showInnerSides));
  const [initialTilt] = useState(tilt);
  const hostRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const cubieRefs = useRef<HTMLElement[]>([]);
  const stickerRefs = useRef<Array<Array<{ face: Face; element: HTMLElement }>>>([]);

  useLayoutEffect(() => {
    const host = hostRef.current;
    const root = rootRef.current;
    if (!host || !root) return;

    const elements: SceneElements = {
      host,
      root,
      cubies: cubieRefs.current,
      stickers: stickerRefs.current,
    };
    const controller = new CubeSceneController(shapes, elements, spread, initialTilt);
    controller.setTilt(...initialTilt);
    controller.measure();
    const unregister = conductor.register(controller);
    const cleanups: Array<() => void> = [unregister, () => controller.completeTurn()];

    if ('ResizeObserver' in window) {
      const resize = new ResizeObserver(() => controller.measure());
      resize.observe(host);
      cleanups.push(() => resize.disconnect());
    }

    if ('IntersectionObserver' in window) {
      const visibility = new IntersectionObserver(([entry]) => {
        controller.isVisible = entry?.isIntersecting ?? true;
      });
      visibility.observe(host);
      cleanups.push(() => visibility.disconnect());
    }

    let userMoved = false;

    if (draggable) {
      let last: { x: number; y: number } | null = null;
      // classList.add('') lança erro; nos testes, sem CSS processado, a classe pode vir vazia.
      const setDragging = (isDragging: boolean) => {
        if (styles.dragging) host.classList.toggle(styles.dragging, isDragging);
      };
      const press = (event: PointerEvent) => {
        last = { x: event.clientX, y: event.clientY };
        userMoved = true;
        // Segue o arraste mesmo se o ponteiro sair do cubo. O jsdom não tem esse método.
        host.setPointerCapture?.(event.pointerId);
        setDragging(true);
      };
      const drag = (event: PointerEvent) => {
        if (!last) return;
        const [x, y] = controller.tilt;
        controller.setTilt(
          x + (last.y - event.clientY) * DRAG_DEGREES_PER_PIXEL,
          y + (event.clientX - last.x) * DRAG_DEGREES_PER_PIXEL,
        );
        last = { x: event.clientX, y: event.clientY };
      };
      const release = () => {
        last = null;
        setDragging(false);
      };
      host.addEventListener('pointerdown', press);
      host.addEventListener('pointermove', drag);
      host.addEventListener('pointerup', release);
      host.addEventListener('pointercancel', release);
      cleanups.push(() => {
        host.removeEventListener('pointerdown', press);
        host.removeEventListener('pointermove', drag);
        host.removeEventListener('pointerup', release);
        host.removeEventListener('pointercancel', release);
      });
    }

    const section = host.closest('section');
    if (orbitOnScroll && section && !prefersReducedMotion()) {
      let scheduled = 0;
      const orbit = () => {
        scheduled = 0;
        if (userMoved) return;
        const box = section.getBoundingClientRect();
        const passed = clamp(
          (window.innerHeight - box.top) / (box.height + window.innerHeight),
          0,
          1,
        );
        controller.setTilt(initialTilt[0], initialTilt[1] + (passed - 0.5) * ORBIT_RANGE_DEGREES);
      };
      const onScroll = () => {
        if (!scheduled) scheduled = requestAnimationFrame(orbit);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      cleanups.push(() => {
        window.removeEventListener('scroll', onScroll);
        cancelAnimationFrame(scheduled);
      });
    }

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, [conductor, shapes, spread, initialTilt, draggable, orbitOnScroll]);

  return (
    <div
      ref={hostRef}
      className={cx(styles.scene, draggable && styles.draggable, className)}
      aria-hidden="true"
    >
      <div ref={rootRef} className={styles.cube}>
        {shapes.map((shape, index) => (
          <div
            key={shape.start.join()}
            ref={(element) => {
              if (element) cubieRefs.current[index] = element;
            }}
            className={styles.cubie}
          >
            {shape.sides.map((side) => (
              <div key={side} className={styles.side} data-side={side}>
                {shape.stickers.includes(side) ? (
                  <div
                    className={styles.sticker}
                    data-face-color={side}
                    ref={(element) => {
                      if (!element) return;
                      const stickers = (stickerRefs.current[index] ??= []);
                      if (!stickers.some((sticker) => sticker.element === element)) {
                        stickers.push({ face: side, element });
                      }
                    }}
                  />
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
