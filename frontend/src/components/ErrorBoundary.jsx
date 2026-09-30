import React from 'react';
import { AlertCircle, RefreshCw, Home, ShieldCheck } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🛡️ WattHacks AI ErrorBoundary Caught Render Exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    try {
      sessionStorage.removeItem('watthacks_current_page');
      sessionStorage.removeItem('watthacks_extracted_data');
      sessionStorage.removeItem('watthacks_audit_data');
    } catch (e) {}
    window.location.hash = '#landing';
    window.location.reload();
  };

  handleSoftRecover = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.hash = '#landing';
  };

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'An unexpected rendering anomaly occurred.';

      return (
        <div className="min-h-screen bg-[#F8FAF8] text-slate-900 flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-white/95 border border-emerald-500/20 shadow-2xl backdrop-blur-xl relative overflow-hidden text-center">
            {/* Ambient Background Aura */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[11px] font-mono uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>WattHacks AI Fault Recovery</span>
            </div>

            <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              Workspace Restored to Safety
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-md mx-auto">
              A temporary interface exception was intercepted before unmounting the application. Your session data remains safe.
            </p>

            {/* Error Details */}
            <div className="p-3 mb-6 rounded-xl bg-slate-100/80 border border-slate-200/80 text-left font-mono text-[11px] text-slate-700 overflow-x-auto">
              <p className="text-rose-600 font-semibold mb-1">Diagnostic Log:</p>
              <p className="break-all">{errorMessage}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold font-mono transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reset & Reload App</span>
              </button>

              <button
                onClick={this.handleSoftRecover}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold font-mono transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-slate-600" />
                <span>Return to Landing</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
