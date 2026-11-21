import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { 
  Building2, 
  Plus, 
  Search, 
  Coins, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Receipt, 
  FileSpreadsheet,
  RefreshCw,
  Download
} from 'lucide-react';

interface NavbarProps {
  onOpenQuickAction: (actionType: 'sale' | 'receipt' | 'payment' | 'voucher' | 'party') => void;
  onSearch: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuickAction, onSearch }) => {
  const { 
    activeCurrency, 
    setActiveCurrency, 
    resetToSampleData, 
    exportDatabaseJSON 
  } = useAccounting();

  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const currencies = ['PKR', 'USD', 'SAR', 'AED'];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Agency Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cream-900 to-cream-800 flex items-center justify-center text-gold-400 shadow-creamy border border-cream-700/30">
              <Building2 className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-cream-950 font-sans">
                  Travel<span className="text-gold-600">Ledger</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gold-100 text-gold-700 border border-gold-200 uppercase tracking-wider">
                  Office ERP
                </span>
              </div>
              <p className="text-[11px] text-cream-500 font-medium hidden sm:block">
                Double-Entry Accounting & Khata System for Travel Agencies
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => { setSearchVal(e.target.value); onSearch(e.target.value); }}
                placeholder="Search Client Khata, PNR, Ticket No, or Voucher #..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-white/80 border border-cream-200 rounded-lg text-cream-900 placeholder-cream-400 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 shadow-sm"
              />
            </div>
          </div>

          {/* Right Tools */}
          <div className="flex items-center gap-2.5">
            
            {/* Currency Selector */}
            <div className="flex items-center bg-white/80 border border-cream-200 rounded-lg p-0.5 shadow-sm">
              <div className="px-2 py-1 text-xs text-cream-500 flex items-center gap-1 font-medium">
                <Coins className="w-3.5 h-3.5 text-gold-600" />
                <span className="hidden sm:inline">Cur:</span>
              </div>
              <div className="flex gap-0.5">
                {currencies.map(c => (
                  <button
                    key={c}
                    onClick={() => setActiveCurrency(c)}
                    className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                      activeCurrency === c
                        ? 'bg-cream-900 text-gold-300 shadow-sm'
                        : 'text-cream-700 hover:bg-cream-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="relative">
              <button
                onClick={() => setShowQuickMenu(!showQuickMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-white text-xs font-bold shadow-creamy active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">New Entry</span>
              </button>

              {showQuickMenu && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-cream-200 shadow-creamy-lg p-1.5 z-50 animate-slide-up"
                  onClick={() => setShowQuickMenu(false)}
                >
                  <div className="px-2.5 py-1.5 text-[11px] font-bold text-cream-400 uppercase tracking-wider">
                    Fast Accounting Entries
                  </div>
                  
                  <button
                    onClick={() => onOpenQuickAction('sale')}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-cream-800 hover:bg-gold-50 hover:text-gold-900 transition-colors"
                  >
                    <Receipt className="w-4 h-4 text-sky-600" />
                    <span>New Sales Invoice (Ticket/Tour)</span>
                  </button>

                  <button
                    onClick={() => onOpenQuickAction('receipt')}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-cream-800 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                  >
                    <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                    <span>Receive Payment (RV)</span>
                  </button>

                  <button
                    onClick={() => onOpenQuickAction('payment')}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-cream-800 hover:bg-rose-50 hover:text-rose-900 transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4 text-rose-600" />
                    <span>Pay Supplier / Expense (PV)</span>
                  </button>

                  <button
                    onClick={() => onOpenQuickAction('party')}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-cream-800 hover:bg-cream-100 transition-colors"
                  >
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <span>Add New Client / Supplier</span>
                  </button>

                  <div className="my-1 border-t border-cream-100" />

                  <button
                    onClick={exportDatabaseJSON}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-cream-600 hover:bg-cream-100 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON Backup</span>
                  </button>

                  <button
                    onClick={resetToSampleData}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-cream-500 hover:bg-cream-100 hover:text-cream-800 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Sample Data</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
