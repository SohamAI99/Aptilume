import React from 'react';
import { Button } from './ui/Button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // In a real app, you would send this to an error reporting service
    // like Sentry, Bugsnag, etc.
  }

  handleRetry = () => {
    // Reset error state and try to re-render
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    // Redirect to home page
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-8 max-w-2xl w-full">
            <div className="text-center">
              <div className="bg-error/10 text-error w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
              <p className="text-muted-foreground mb-6">
                We're sorry, but something unexpected happened. Our team has been notified.
              </p>
              
              <div className="bg-muted/50 rounded-lg p-4 text-left mb-6">
                <details className="text-sm">
                  <summary className="font-medium cursor-pointer">Error details</summary>
                  <div className="mt-2 text-muted-foreground">
                    <div className="font-mono">{this.state.error?.toString()}</div>
                    {this.state.errorInfo?.componentStack && (
                      <pre className="mt-2 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={this.handleRetry} icon={<RefreshCw className="h-4 w-4" />}>
                  Try Again
                </Button>
                <Button variant="outline" onClick={this.handleGoHome} icon={<Home className="h-4 w-4" />}>
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;