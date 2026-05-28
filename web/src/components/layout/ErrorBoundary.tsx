import { Component, type ErrorInfo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Warning, ArrowClockwise, House, Bug } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (props: {
    error: Error;
    reset: () => void;
  }) => ReactNode;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, errorInfo);
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          reset: this.reset,
        });
      }
      return (
        <DefaultErrorScreen
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          reset={this.reset}
        />
      );
    }
    return this.props.children;
  }
}

function DefaultErrorScreen({
  error,
  errorInfo,
  reset,
}: {
  error: Error;
  errorInfo: ErrorInfo | null;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-7 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white border-[1.5px] border-border-strong shadow-brutal-lg p-9 brackets-lime relative">
          <div className="w-16 h-16 bg-navy text-lime flex items-center justify-center mb-6">
            <Warning weight="fill" size={32} />
          </div>
          <div className="inline-flex items-center gap-2 bg-[#F5B700] text-navy px-3 py-1 font-display italic font-black text-[11px] uppercase tracking-[0.12em] mb-4">
            <Bug weight="fill" size={11} />
            Erro inesperado
          </div>
          <h1 className="font-display italic font-black uppercase text-[56px] leading-[0.9] text-navy tracking-[-0.025em] mb-3">
            Algo
            <br />
            <span className="text-blue">não deu certo</span>
          </h1>
          <p className="text-[14px] text-fg-soft leading-relaxed mb-6">
            A página encontrou um problema inesperado. Você pode tentar recarregar
            o componente — se persistir, volte à home.
          </p>

          {import.meta.env.DEV && (
            <details className="mb-7 bg-surface-3 border border-border p-4 text-[12px]">
              <summary className="font-display italic font-extrabold uppercase text-navy text-[12px] cursor-pointer">
                Detalhes do erro (dev)
              </summary>
              <div className="mt-3 space-y-2">
                <div>
                  <span className="text-fg-mute font-extrabold uppercase text-[10px]">
                    Mensagem
                  </span>
                  <div className="font-mono text-red-600 break-words">
                    {error.message}
                  </div>
                </div>
                {error.stack && (
                  <div>
                    <span className="text-fg-mute font-extrabold uppercase text-[10px]">
                      Stack
                    </span>
                    <pre className="font-mono text-[11px] text-fg-soft whitespace-pre-wrap overflow-auto max-h-60 mt-1">
                      {error.stack}
                    </pre>
                  </div>
                )}
                {errorInfo?.componentStack && (
                  <div>
                    <span className="text-fg-mute font-extrabold uppercase text-[10px]">
                      Component Stack
                    </span>
                    <pre className="font-mono text-[11px] text-fg-soft whitespace-pre-wrap overflow-auto max-h-60 mt-1">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          <div className="flex gap-3">
            <Button onClick={reset}>
              <ArrowClockwise weight="bold" size={14} />
              Tentar novamente
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              <House weight="bold" size={14} />
              Voltar à home
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
