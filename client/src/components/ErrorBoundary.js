'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: 0
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('❌ Error Boundary caught:', error, errorInfo);

        // Log to error tracking service
        this.logError(error, errorInfo);

        this.setState({ errorInfo });
    }

    logError(error, errorInfo) {
        // Send to your error tracking service (Sentry, LogRocket, etc.)
        if (process.env.NODE_ENV === 'production') {
            // Example: Sentry.captureException(error, { extra: errorInfo });
            console.error('📤 Error logged:', error.message);
        }
    }

    handleRetry = () => {
        this.setState((prev) => ({
            hasError: false,
            retryCount: prev.retryCount + 1
        }));
        this.props.onRetry?.();
    };

    handleGoHome = () => {
        if (this.props.router) {
            this.props.router.push('/');
        } else {
            window.location.href = '/';
        }
    };

    render() {
        const { hasError, error, retryCount } = this.state;
        const { fallback, children } = this.props;

        if (hasError) {
            // Custom fallback UI
            if (fallback) {
                return fallback({ error, retry: this.handleRetry });
            }

            return (
                <div className="error-boundary-container">
                    <div className="error-boundary-card">
                        <div className="error-icon">⚠️</div>
                        <h2>Something went wrong</h2>
                        <p className="error-message">
                            {error?.message || 'An unexpected error occurred'}
                        </p>
                        {process.env.NODE_ENV === 'development' && (
                            <details className="error-details">
                                <summary>Error Details</summary>
                                <pre>{this.state.errorInfo?.componentStack}</pre>
                            </details>
                        )}
                        <div className="error-actions">
                            <button
                                className="btn btn-primary"
                                onClick={this.handleRetry}
                                disabled={retryCount > 3}
                            >
                                {retryCount > 3 ? 'Too many attempts' : 'Try Again'}
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={this.handleGoHome}
                            >
                                Go Home
                            </button>
                        </div>
                        {retryCount > 3 && (
                            <p className="error-hint">
                                Please refresh the page or contact support if the issue persists.
                            </p>
                        )}
                    </div>
                </div>
            );
        }

        return children;
    }
}

// Higher-order component for wrapping components
export function withErrorBoundary(Component, fallback = null) {
    return function WrappedComponent(props) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const router = useRouter();
        return (
            <ErrorBoundary fallback={fallback} router={router}>
                <Component {...props} />
            </ErrorBoundary>
        );
    };
}

// Hook for using error boundary in functional components
export function useErrorBoundary() {
    const [error, setError] = useState(null);
    const [errorInfo, setErrorInfo] = useState(null);

    const handleError = (error, errorInfo) => {
        setError(error);
        setErrorInfo(errorInfo);
        console.error('Error caught:', error, errorInfo);
    };

    const resetError = () => {
        setError(null);
        setErrorInfo(null);
    };

    return { error, errorInfo, handleError, resetError };
}

export default ErrorBoundary;