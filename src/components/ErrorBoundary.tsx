import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[160px] flex flex-col items-center justify-center p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md text-center text-white" id="error-boundary-fallback">
          <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-base font-bold mb-1">
            {this.props.fallbackTitle || 'Affichage temporairement indisponible'}
          </h3>
          <p className="text-xs text-white/60 max-w-sm mb-4">
            {this.props.fallbackMessage || 'Une erreur mineure de rendu a été interceptée.'}
          </p>
          <button
            onClick={this.handleReset}
            className="px-4 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Réessayer</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
