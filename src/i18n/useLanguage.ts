import { use } from 'react';
import { AppError } from '../errors/AppError.ts';
import type { Messages } from '../globals/messages/index.ts';
import { LanguageContext, type LanguageContextValue } from './LanguageContext.ts';

export function useLanguage(): LanguageContextValue {
  const context = use(LanguageContext);
  if (!context) throw new AppError('LANGUAGE_PROVIDER_MISSING');
  return context;
}

export function useMessages(): Messages {
  return useLanguage().messages;
}
