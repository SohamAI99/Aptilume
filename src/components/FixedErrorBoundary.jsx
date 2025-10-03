import React from 'react';
import { Button } from './ui/Button';
import { AlertTriangle, RefreshCw, Home, Copy, Check } from 'lucide-react';

class FixedErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      copied: false
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('FixedErrorBoundary caught an error:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Also send to your error reporting service if you have one
  }

  handleRetry = () => {
    // Reset error state and try to re-render
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    // Redirect to home page
    window.location.href = '/';
  };

  copyErrorDetails = () => {
    const errorDetails = `
Error: ${this.state.error?.toString()}
Component Stack: ${this.state.errorInfo?.componentStack || 'No component stack available'}
Timestamp: ${new Date().toISOString()}
User Agent: ${navigator.userAgent}
    `.trim();
    
    navigator.clipboard.writeText(errorDetails).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    });
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI with detailed error information
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-8 max-w-4xl w-full">
            <div className="text-center mb-8">
              <div className="bg-error/10 text-error w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-10 w-10" />
              </div>
              
              <h1 className="text-3xl font-bold mb-4 text-foreground">Application Error</h1>
              <p className="text-muted-foreground mb-6 text-lg">
                Something went wrong while loading the application.
              </p>
            </div>
            
            <div className="bg-muted/50 rounded-xl p-6 mb-8 text-left">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-foreground">Error Details</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={this.copyErrorDetails}
                  icon={this.state.copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                >
                  {this.state.copied ? 'Copied!' : 'Copy Details'}
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Error Message:</h3>
                  <div className="bg-background p-3 rounded-lg border">
                    <code className="text-error break-words">{this.state.error?.toString()}</code>
                  </div>
                </div>
                
                {this.state.errorInfo?.componentStack && (
                  <div>
                    <h3 className="font-medium text-foreground mb-2">Component Stack:</h3>
                    <div className="bg-background p-3 rounded-lg border max-h-40 overflow-y-auto">
                      <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-background p-3 rounded-lg border">
                    <h4 className="font-medium text-foreground mb-1">Browser</h4>
                    <p className="text-sm text-muted-foreground">{navigator.userAgent}</p>
                  </div>
                  <div className="bg-background p-3 rounded-lg border">
                    <h4 className="font-medium text-foreground mb-1">Time</h4>
                    <p className="text-sm text-muted-foreground">{new Date().toString()}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={this.handleRetry} 
                icon={<RefreshCw className="h-5 w-5" />}
                size="lg"
                className="px-6"
              >
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={this.handleGoHome} 
                icon={<Home className="h-5 w-5" />}
                size="lg"
                className="px-6"
              >
                Go Home
              </Button>
            </div>
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>
                If this error persists, please contact support with the error details above.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default FixedErrorBoundary;