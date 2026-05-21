import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        if (error.name === 'ChunkLoadError' || String(error).includes('dynamically imported module')) {
            if (!sessionStorage.getItem('reloaded_chunk_error')) {
                sessionStorage.setItem('reloaded_chunk_error', 'true');
                window.location.reload(); 
            }
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="h-screen w-full flex flex-col items-center justify-center bg-base-100 text-base-content">
                    <span className="loading loading-ring loading-lg text-primary mb-4"></span>
                    <p className="font-bold font-display uppercase tracking-widest text-sm opacity-60">Memuat versi terbaru...</p>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;