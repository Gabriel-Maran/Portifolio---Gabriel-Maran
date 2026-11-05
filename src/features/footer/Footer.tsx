import { Container } from '../../components/container/Container.tsx';
import { OWNER_NAME } from '../../globals/constants.ts';
import styles from './Footer.module.css';

// Lido uma vez ao carregar, para a renderização continuar pura.
const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        {/*
         * O HTML do build traz o ano do build. Depois da virada, o navegador mostra o ano novo, e
         * essa diferença esperada não deve contar como erro de hidratação.
         */}
        © <span suppressHydrationWarning>{CURRENT_YEAR}</span> {OWNER_NAME}
      </Container>
    </footer>
  );
}
