import styles from './App.module.css';

// Tela provisória da Parte 1: só confirma tokens, fontes e CSS Modules. A página entra na Parte 3.
export function App() {
  return (
    <main className={styles.shell}>
      <h1 className={styles.name}>Gabriel Maran</h1>
      <p className={styles.note}>Parte 1 · base do projeto</p>
    </main>
  );
}
