import { LANGUAGE_OPTIONS, LANGUAGES } from '../../globals/constants.ts';
import { useLanguage } from '../../i18n/useLanguage.ts';
import { VisuallyHidden } from '../visually-hidden/VisuallyHidden.tsx';
import styles from './LanguageSwitcher.module.css';

export function LanguageSwitcher() {
  const { language, messages, setLanguage } = useLanguage();

  return (
    <fieldset className={styles.switcher}>
      <VisuallyHidden as="legend">{messages.language.label}</VisuallyHidden>
      {LANGUAGES.map((option) => {
        const { short, name, tag } = LANGUAGE_OPTIONS[option];
        return (
          <button
            key={option}
            className={styles.option}
            type="button"
            lang={tag}
            aria-pressed={option === language}
            onClick={() => setLanguage(option)}
          >
            {/* O nome acessível começa pela sigla visível, como pede o WCAG 2.5.3. */}
            {short}
            <VisuallyHidden> {name}</VisuallyHidden>
          </button>
        );
      })}
    </fieldset>
  );
}
