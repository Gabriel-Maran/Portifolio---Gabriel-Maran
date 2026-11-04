import { vi } from 'vitest';

/**
 * Cala o console.error durante o teste e devolve o espião, para conferir o que foi registrado.
 * O restoreMocks do vitest.config.ts devolve o console original antes do próximo teste.
 */
export const silenceConsoleError = () => vi.spyOn(console, 'error').mockImplementation(() => {});
