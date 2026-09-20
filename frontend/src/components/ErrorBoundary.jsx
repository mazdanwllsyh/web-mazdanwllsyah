import React from "react";
import { Icon } from "@iconify/react";

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
                <div className="h-screen w-full flex flex-col items-center justify-center bg-base-100 text-base-content relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-base-100 to-base-100 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center max-w-md text-center px-6">
                        <div className="relative flex items-center justify-center mb-10">
                            <div className="absolute w-28 h-28 bg-primary/20 rounded-full animate-ping opacity-60"></div>
                            <div className="mask mask-hexagon w-20 h-20 bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-2xl">
                                <Icon icon="mdi:refresh-auto" className="w-10 h-10 text-primary-content animate-spin" style={{ animationDuration: '3s' }} />
                            </div>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight mb-3">
                            Sinkronisasi Sistem
                        </h1>
                        <p className="text-sm md:text-base font-medium text-base-content/70 mb-8 leading-relaxed">
                            Mendeteksi pembaruan arsitektur atau koneksi yang terputus. Sistem sedang berusaha menyeimbangkan ulang data portofolio.
                        </p>

                        <button
                            onClick={() => {
                                sessionStorage.removeItem('reloaded_chunk_error');
                                window.location.reload();
                            }}
                            className="btn btn-primary btn-md rounded-2xl shadow-lg shadow-primary/30 font-bold tracking-wide transition-all hover:scale-105 hover:-translate-y-1 outline-none"
                        >
                            <Icon icon="mdi:reload" className="w-5 h-5 mr-1" /> Muat Ulang Sekarang
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;