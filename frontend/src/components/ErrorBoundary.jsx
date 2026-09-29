import React from "react";
import { Icon } from "@iconify/react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            copied: false,
            aiPrompted: false
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });

        if (error.name === 'ChunkLoadError' || String(error).includes('dynamically imported module')) {
            if (!sessionStorage.getItem('reloaded_chunk_error')) {
                sessionStorage.setItem('reloaded_chunk_error', 'true');
                window.location.reload();
            }
        }
    }

    getFormattedLog = () => {
        const { error, errorInfo } = this.state;
        return `Error: ${error?.toString() || "Unknown Error"}\n\nStack Trace:\n${errorInfo?.componentStack || error?.stack || "No stack trace available"}`;
    };

    handleCopyError = () => {
        const log = this.getFormattedLog();
        navigator.clipboard.writeText(log).then(() => {
            this.setState({ copied: true });
            setTimeout(() => this.setState({ copied: false }), 2000);
        });
    };

    handleAskAI = () => {
        const log = this.getFormattedLog();
        const prompt = `Halo AI, tolong bantu analisa dan berikan solusi perbaikan untuk error React di aplikasiku ini:\n\n\`\`\`\n${log}\n\`\`\``;

        navigator.clipboard.writeText(prompt).then(() => {
            this.setState({ aiPrompted: true });
            setTimeout(() => this.setState({ aiPrompted: false }), 2500);
            window.open("https://gemini.google.com/app", "_blank", "noopener,noreferrer");
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen w-full flex flex-col items-center justify-center bg-base-200/50 text-base-content relative overflow-hidden font-sans p-4">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-error/15 via-base-100 to-base-100 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center w-full max-w-4xl p-6 md:p-8 rounded-3xl bg-base-100/85 backdrop-blur-xl border border-error/20 shadow-2xl text-center">
                        <div className="relative flex items-center justify-center mb-5">
                            <div className="absolute w-20 h-20 bg-error/20 rounded-full blur-xl animate-pulse"></div>
                            <div className="w-14 h-14 bg-gradient-to-br from-base-200 to-base-300 rounded-2xl flex items-center justify-center shadow-inner border border-error/20 z-10">
                                <Icon icon="solar:danger-triangle-bold-duotone" className="w-7 h-7 text-error" />
                            </div>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-2 text-error">
                            Sistem Mengalami Crash
                        </h1>
                        <p className="text-xs font-medium text-base-content/70 mb-5 leading-relaxed">
                            Lihat informasi galat di bawah atau gunakan bantuan AI untuk debug secara instan.
                        </p>

                        {this.state.error && (
                            <div className="w-full bg-base-300/40 rounded-2xl border border-base-content/10 overflow-hidden mb-6 text-left">
                                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-base-300/70 border-b border-base-content/10">
                                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-1.5">
                                        <Icon icon="solar:code-file-bold-duotone" className="w-4 h-4 text-error" />
                                        Stack Trace
                                    </span>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={this.handleCopyError}
                                            className="btn btn-xs rounded-lg font-bold bg-base-100/80 hover:bg-base-100 border-base-content/15 flex items-center gap-1 text-base-content"
                                        >
                                            <Icon
                                                icon={this.state.copied ? "solar:check-read-bold-duotone" : "solar:copy-bold-duotone"}
                                                className={`w-3.5 h-3.5 ${this.state.copied ? "text-success" : ""}`}
                                            />
                                            {this.state.copied ? "Tersalin!" : "Salin Error"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={this.handleAskAI}
                                            className="btn btn-xs rounded-lg font-bold btn-primary text-primary-content flex items-center gap-1 shadow-sm"
                                        >
                                            <Icon
                                                icon={this.state.aiPrompted ? "solar:check-circle-bold" : "solar:magic-stick-3-bold-duotone"}
                                                className="w-3.5 h-3.5"
                                            />
                                            {this.state.aiPrompted ? "Prompt Siap!" : "Tanya AI"}
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 max-h-52 overflow-auto custom-scrollbar">
                                    <p className="text-error font-mono text-xs md:text-sm font-bold mb-2 break-all">
                                        {this.state.error.toString()}
                                    </p>
                                    <pre className="text-base-content/60 font-mono text-[10px] md:text-xs whitespace-pre-wrap break-all">
                                        {this.state.errorInfo?.componentStack || this.state.error.stack}
                                    </pre>
                                </div>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => {
                                sessionStorage.removeItem('reloaded_chunk_error');
                                window.location.href = "/";
                            }}
                            className="btn btn-error text-error-content rounded-xl px-8 shadow-lg shadow-error/20 font-semibold tracking-wide transition-all hover:scale-[1.02] active:scale-95 outline-none border-none h-11"
                        >
                            <Icon icon="solar:restart-bold" className="w-4 h-4 mr-2" />
                            Muat Ulang Aplikasi
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;