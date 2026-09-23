import { Component } from 'react'
import type { ReactNode, ErrorInfo, ComponentType } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[300px] flex items-center justify-center p-8">
          <div className="glass rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-7 h-7 text-primary" />
            </div>

            <h2 className="text-xl font-semibold text-neutral-dark mb-2">
              Quelque chose s&apos;est mal pass&eacute;
            </h2>

            <p className="text-neutral-medium text-sm mb-6">
              Une erreur inattendue s&apos;est produite. Veuillez r&eacute;essayer.
            </p>

            {this.state.error && (
              <pre className="text-xs text-left bg-neutral-light rounded-lg p-3 mb-6 overflow-auto max-h-32 text-neutral-medium">
                {this.state.error.message}
              </pre>
            )}

            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-full text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              R&eacute;essayer
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  fallback?: ReactNode,
): ComponentType<P> {
  function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    )
  }

  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'
  WithErrorBoundaryWrapper.displayName = `withErrorBoundary(${displayName})`

  return WithErrorBoundaryWrapper
}
