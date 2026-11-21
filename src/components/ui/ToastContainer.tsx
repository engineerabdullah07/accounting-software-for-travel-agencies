import React from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useAccounting();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          error: <XCircle className="w-5 h-5 text-rose-600 shrink-0" />,
          warning: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-600 shrink-0" />
        };

        const borders = {
          success: 'border-emerald-200 bg-white/95 text-emerald-950',
          error: 'border-rose-200 bg-white/95 text-rose-950',
          warning: 'border-amber-200 bg-white/95 text-amber-950',
          info: 'border-blue-200 bg-white/95 text-blue-950'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-creamy-lg backdrop-blur-md transition-all duration-300 animate-slide-up ${borders[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold tracking-tight">{toast.title}</h4>
              <p className="text-xs text-cream-700 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-cream-400 hover:text-cream-700 p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
