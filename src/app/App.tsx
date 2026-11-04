import { ErrorBoundary } from '../errors/ErrorBoundary.tsx';
import { HomePage } from '../pages/home/HomePage.tsx';

export function App() {
  return (
    <ErrorBoundary>
      <HomePage />
    </ErrorBoundary>
  );
}
