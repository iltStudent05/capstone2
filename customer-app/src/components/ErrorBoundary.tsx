import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
  errorMessage: string
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    errorMessage: '',
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application error boundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' })
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="error-boundary" role="alert">
          <h2>Something went wrong.</h2>
          <p>
            Error details:{' '}
            {this.state.errorMessage || 'An unexpected error occurred.'}
          </p>
          <button
            type="button"
            className="button button-primary"
            onClick={this.handleReset}
          >
            Try Again
          </button>
        </section>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
