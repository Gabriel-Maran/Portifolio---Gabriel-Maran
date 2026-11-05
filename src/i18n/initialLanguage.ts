import { LANGUAGE_STORAGE_KEY, type Language } from '../globals/constants.ts';
import { resolveInitialLanguage } from '../utils/language.ts';
import { getLocalStorage, readStorage } from '../utils/storage.ts';

/** O idioma desta visita no navegador: o da URL, depois a escolha salva, depois o padrão. */
export function readInitialLanguage(): Language {
  return resolveInitialLanguage({
    pathname: window.location.pathname,
    search: window.location.search,
    stored: readStorage(getLocalStorage(), LANGUAGE_STORAGE_KEY),
  });
}
