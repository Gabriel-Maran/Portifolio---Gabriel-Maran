import { Container } from '../../components/container/Container.tsx';
import { OWNER_NAME } from '../../globals/constants.ts';
import styles from './Footer.module.css';

// Lido uma vez ao carregar, para a renderização continuar pura.
const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        © {CURRENT_YEAR} {OWNER_NAME}
      </Container>
    </footer>
  );
}
