import React from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Loader2 } from 'lucide-react';

export const LoadingBar: React.FC = () => {
  const { isOperating, operationStatusText, operationProgress } = useAccounting();

  if (!isOperating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* Creamy Progress Line */}
      <div className="h-1.5 w-full bg-cream-200/60 overflow-hidden backdrop-blur-sm">
        <div
          className="h-full bg-gradient-to-r from-gold-400 via-amber-500 to-gold-600 transition-all duration-300 ease-out shadow-sm"
          style={{ width: `${Math.max(operationProgress, 12)}%` }}
        />
      </div>

      {/* Floating Creamy Status Badge */}
      <div className="flex justify-center pt-2">
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cream-900/90 text-gold-200 text-xs font-medium tracking-wide shadow-creamy-lg backdrop-blur-md border border-gold-500/30 animate-fade-in">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-gold-400" />
          <span>{operationStatusText || 'Processing financial transaction...'}</span>
          <span className="text-gold-400 font-mono text-[11px] font-semibold">{operationProgress}%</span>
        </div>
      </div>
    </div>
  );
};
