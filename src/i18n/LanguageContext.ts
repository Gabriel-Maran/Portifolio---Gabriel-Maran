import { createContext } from 'react';
import type { Language } from '../globals/constants.ts';
import type { Messages } from '../globals/messages/index.ts';

export interface LanguageContextValue {
  language: Language;
  messages: Messages;
  setLanguage: (language: Language) => void;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
