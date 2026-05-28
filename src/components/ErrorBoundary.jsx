import { Component } from 'react'
import { AlertOctagon, RotateCcw, Home } from 'lucide-react'

class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  reset = () => this.setState({ error: null })

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
            <AlertOctagon size={20} className="text-red-400" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">
            Something went wrong
          </h1>
          <p className="text-sm text-muted mt-2">
            An unexpected error occurred while rendering this page.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 bg-white text-black text-sm font-medium px-4 py-2.5 rounded-sm hover:bg-white/90 transition-all"
            >
              <RotateCcw size={14} />
              Reload
            </button>
            <a
              href="/"
              onClick={this.reset}
              className="flex items-center gap-2 bg-surface border border-edge text-foreground text-sm font-medium px-4 py-2.5 rounded-sm hover:border-edge-hover transition-all"
            >
              <Home size={14} />
              Go home
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary
