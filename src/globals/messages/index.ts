import type { Language } from '../constants.ts';
import { en } from './en.ts';
import { pt, type Messages } from './pt.ts';

export type { Messages };

export const messages: Record<Language, Messages> = { pt, en };
