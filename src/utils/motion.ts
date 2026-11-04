/** Respeita quem pediu menos movimento no sistema. Sem matchMedia (como nos testes), anima. */
export function prefersReducedMotion(): boolean {
  return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
