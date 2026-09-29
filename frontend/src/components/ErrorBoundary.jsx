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
                <div className="min-h-screen w-full flex flex-col items-center justify-center bg-base-200/50 text-base-content relative overflow-hidden font-sans">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-base-100 to-base-100 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center w-[90%] max-w-lg p-10 rounded-3xl bg-base-100/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] text-center">
                        <div className="relative flex items-center justify-center mb-8">
                            <div className="absolute w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                            <div className="w-16 h-16 bg-gradient-to-br from-base-200 to-base-300 rounded-2xl flex items-center justify-center shadow-inner border border-base-content/5 z-10">
                                <Icon icon="solar:server-square-update-broken" className="w-8 h-8 text-primary" />
                            </div>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-3">
                            Sinkronisasi Sistem Terputus
                        </h1>
                        <p className="text-sm md:text-base font-medium text-base-content/60 mb-8 leading-relaxed">
                            Kami mendeteksi pembaruan arsitektur atau koneksi yang tidak stabil. Silakan muat ulang halaman untuk memulihkan sesi Anda.
                        </p>

                        <button
                            onClick={() => {
                                sessionStorage.removeItem('reloaded_chunk_error');
                                window.location.reload();
                            }}
                            className="btn btn-primary rounded-xl px-8 shadow-lg shadow-primary/20 font-semibold tracking-wide transition-all hover:scale-[1.02] active:scale-95 outline-none border-none"
                        >
                            <Icon icon="solar:restart-bold" className="w-5 h-5 mr-2" /> Muat Ulang
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;