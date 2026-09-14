import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback || (
                    <div className="p-8 text-center">
                        <h2 className="text-xl font-bold mb-2 text-destructive">
                            Etwas ist schiefgelaufen
                        </h2>
                        <p className="text-muted-foreground">
                            {this.state.error?.message || 'Ein unbekannter Fehler ist aufgetreten.'}
                        </p>
                        <button
                            onClick={() => this.setState({ hasError: false, error: undefined })}
                            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                        >
                            Erneut versuchen
                        </button>
                    </div>
                )
            );
        }
        return this.props.children;
    }
}
