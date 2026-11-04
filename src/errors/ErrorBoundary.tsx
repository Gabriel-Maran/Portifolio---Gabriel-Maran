import { Component, type ReactNode } from 'react';
import { ErrorFallback } from './ErrorFallback.tsx';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Só troca a tela pelo fallback. O registro do erro fica em rootErrorHandlers.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override render() {
    return this.state.hasError ? <ErrorFallback /> : this.props.children;
  }
}
