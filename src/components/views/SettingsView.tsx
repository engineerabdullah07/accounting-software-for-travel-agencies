import React from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { DollarSign, Shield, Building, RefreshCw, Download, Database, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { exchangeRates, activeCurrency, setActiveCurrency, resetToDefaults, showToast } = useAccounting();

  const handleBackup = () => {
    const data = {
      accounts: localStorage.getItem('vl_accounts'),
      tickets: localStorage.getItem('vl_tickets'),
      customers: localStorage.getItem('vl_customers'),
      vendors: localStorage.getItem('vl_vendors'),
      journals: localStorage.getItem('vl_journals'),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VoyageLedger_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Database Exported', 'Full financial ledger backup downloaded successfully.');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-cream-950 tracking-tight">
          System Setup & Multi-Currency Engine
        </h1>
        <p className="text-xs text-cream-500 mt-1">
          IATA agency accreditation parameters, foreign exchange conversion rates, and ledger backup.
        </p>
      </div>

      {/* Multi-Currency Matrix */}
      <div className="creamy-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-cream-200">
          <div>
            <h3 className="text-sm font-bold text-cream-950">Active Currency Rates (Base: USD $1.00)</h3>
            <p className="text-xs text-cream-500">Real-time conversion applied across all reports, PNRs and ledgers.</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Active: {activeCurrency}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {exchangeRates.map(rate => (
            <div 
              key={rate.code}
              onClick={() => setActiveCurrency(rate.code)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                activeCurrency === rate.code
                  ? 'bg-cream-900 text-gold-300 border-cream-800 shadow-creamy'
                  : 'bg-cream-50/50 border-cream-200 hover:bg-white text-cream-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span>{rate.code} ({rate.symbol})</span>
                <span className="text-[10px] font-mono opacity-70">{rate.name}</span>
              </div>
              <div className="text-lg font-mono font-extrabold mt-2">
                {rate.rateToBase.toFixed(2)}
              </div>
              <div className="text-[10px] opacity-60 mt-0.5">
                1 USD = {rate.rateToBase} {rate.code}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agency IATA Profile */}
      <div className="creamy-card p-6 space-y-4">
        <div className="pb-3 border-b border-cream-200">
          <h3 className="text-sm font-bold text-cream-950">Agency Accreditation & Tax Profile</h3>
          <p className="text-xs text-cream-500">Printed on customer tax invoices, e-ticket receipts, and BSP remittance.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-cream-500 font-semibold block mb-1">Agency Trading Name</label>
            <input
              type="text"
              readOnly
              value="SkyHorizon Travels & Tourism LLC"
              className="w-full px-3 py-2 bg-cream-50/60 border border-cream-200 rounded-lg text-cream-900 font-bold"
            />
          </div>
          <div>
            <label className="text-cream-500 font-semibold block mb-1">IATA Numeric Code</label>
            <input
              type="text"
              readOnly
              value="27-2-8910 (Approved Agent)"
              className="w-full px-3 py-2 bg-cream-50/60 border border-cream-200 rounded-lg text-cream-900 font-mono font-bold"
            />
          </div>
          <div>
            <label className="text-cream-500 font-semibold block mb-1">Head Office Address</label>
            <input
              type="text"
              readOnly
              value="Suite 401, Al-Saad Aviation Tower, Mall Road, Lahore"
              className="w-full px-3 py-2 bg-cream-50/60 border border-cream-200 rounded-lg text-cream-900 font-medium"
            />
          </div>
          <div>
            <label className="text-cream-500 font-semibold block mb-1">National Tax Number / VAT</label>
            <input
              type="text"
              readOnly
              value="NTN # 4920194-8 • STRN # 32-00-4920"
              className="w-full px-3 py-2 bg-cream-50/60 border border-cream-200 rounded-lg text-cream-900 font-mono font-bold"
            />
          </div>
        </div>
      </div>

      {/* Database Maintenance & Open Source Actions */}
      <div className="creamy-card p-6 space-y-4">
        <div className="pb-3 border-b border-cream-200">
          <h3 className="text-sm font-bold text-cream-950">Database Operations & State Management</h3>
          <p className="text-xs text-cream-500">Export financial records or restore fresh travel agency sample data.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleBackup}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cream-900 text-gold-300 font-bold text-xs hover:bg-cream-800 shadow-creamy active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Full JSON Ledger Backup</span>
          </button>

          <button
            onClick={resetToDefaults}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-cream-300 text-cream-700 font-semibold text-xs hover:bg-cream-100 active:scale-95 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset to Default Realistic Travel Agency Dataset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
