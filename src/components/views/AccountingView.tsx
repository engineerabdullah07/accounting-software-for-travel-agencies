import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Account, JournalEntry } from '../../types';
import { 
  BookOpen, 
  Plus, 
  FileSpreadsheet, 
  Scale, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  FileText,
  Printer
} from 'lucide-react';

interface AccountingViewProps {
  onOpenManualJournal: () => void;
}

export const AccountingView: React.FC<AccountingViewProps> = ({ onOpenManualJournal }) => {
  const { accounts, journalEntries, formatCurrency } = useAccounting();
  const [subTab, setSubTab] = useState<'coa' | 'journal' | 'trial' | 'pl' | 'balanceSheet'>('coa');

  // Chart of Accounts grouped by category
  const categories: Array<'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE'> = [
    'ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'
  ];

  // Financial Calculations for P&L
  const revenues = accounts.filter(a => a.category === 'REVENUE');
  const expenses = accounts.filter(a => a.category === 'EXPENSE');

  const totalRevenue = revenues.reduce((acc, a) => acc + a.balance, 0);
  const totalOperatingCosts = expenses.reduce((acc, a) => acc + a.balance, 0);
  const netIncome = totalRevenue - totalOperatingCosts;

  // Trial balance calculations
  const trialBalanceRows = accounts.map(acc => {
    let debit = 0;
    let credit = 0;
    if (acc.category === 'ASSET' || acc.category === 'EXPENSE') {
      debit = acc.balance;
    } else {
      credit = acc.balance;
    }
    return { ...acc, debit, credit };
  });

  const totalTBDebit = trialBalanceRows.reduce((acc, r) => acc + r.debit, 0);
  const totalTBCredit = trialBalanceRows.reduce((acc, r) => acc + r.credit, 0);
  const isTBBalanced = Math.abs(totalTBDebit - totalTBCredit) < 1;

  // Balance Sheet calculations
  const assets = accounts.filter(a => a.category === 'ASSET');
  const liabilities = accounts.filter(a => a.category === 'LIABILITY');
  const equities = accounts.filter(a => a.category === 'EQUITY');

  const totalAssets = assets.reduce((acc, a) => acc + a.balance, 0);
  const totalLiabilities = liabilities.reduce((acc, a) => acc + a.balance, 0);
  const totalEquity = equities.reduce((acc, a) => acc + a.balance, 0) + netIncome;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cream-950 tracking-tight">
            Double-Entry General Ledger & Financial Audit Reports
          </h1>
          <p className="text-xs text-cream-500 mt-1">
            Compliant IFRS / GAAP Chart of Accounts, automatic journal postings, trial balance, and P&L.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-cream-200 text-cream-700 text-xs font-semibold hover:bg-cream-100 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={onOpenManualJournal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white text-xs font-bold shadow-creamy active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Post Manual Journal (JV)</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-cream-200 pb-2">
        <button
          onClick={() => setSubTab('coa')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            subTab === 'coa'
              ? 'bg-cream-900 text-gold-300 shadow-creamy'
              : 'text-cream-600 hover:bg-cream-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Chart of Accounts ({accounts.length})</span>
        </button>

        <button
          onClick={() => setSubTab('journal')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            subTab === 'journal'
              ? 'bg-cream-900 text-gold-300 shadow-creamy'
              : 'text-cream-600 hover:bg-cream-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>General Journal ({journalEntries.length})</span>
        </button>

        <button
          onClick={() => setSubTab('trial')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            subTab === 'trial'
              ? 'bg-cream-900 text-gold-300 shadow-creamy'
              : 'text-cream-600 hover:bg-cream-100'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Trial Balance</span>
        </button>

        <button
          onClick={() => setSubTab('pl')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            subTab === 'pl'
              ? 'bg-cream-900 text-gold-300 shadow-creamy'
              : 'text-cream-600 hover:bg-cream-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Profit & Loss (P&L)</span>
        </button>

        <button
          onClick={() => setSubTab('balanceSheet')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            subTab === 'balanceSheet'
              ? 'bg-cream-900 text-gold-300 shadow-creamy'
              : 'text-cream-600 hover:bg-cream-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Balance Sheet</span>
        </button>
      </div>

      {/* 1. Chart of Accounts */}
      {subTab === 'coa' && (
        <div className="space-y-6">
          {categories.map(cat => {
            const catAccounts = accounts.filter(a => a.category === cat);
            const catTotal = catAccounts.reduce((acc, a) => acc + a.balance, 0);

            return (
              <div key={cat} className="creamy-card overflow-hidden">
                <div className="bg-cream-100/80 px-4 py-3 border-b border-cream-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-cream-950 uppercase tracking-wider">
                      {cat} ACCOUNTS
                    </span>
                    <span className="text-xs text-cream-500 font-medium">({catAccounts.length} accounts)</span>
                  </div>
                  <div className="text-xs font-bold font-mono text-cream-900">
                    Category Total: {formatCurrency(catTotal)}
                  </div>
                </div>

                <table className="w-full text-left text-xs">
                  <thead className="border-b border-cream-100 text-cream-500 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-4 w-28">GL Code</th>
                      <th className="py-2.5 px-3">Account Title</th>
                      <th className="py-2.5 px-3">Sub-Classification</th>
                      <th className="py-2.5 px-4 text-right">Account Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-100">
                    {catAccounts.map(acc => (
                      <tr key={acc.id} className="hover:bg-cream-50/70 transition-colors">
                        <td className="py-2.5 px-4 font-mono font-bold text-cream-900">{acc.code}</td>
                        <td className="py-2.5 px-3 font-semibold text-cream-950">{acc.name}</td>
                        <td className="py-2.5 px-3 text-cream-500">{acc.subCategory}</td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-cream-950">
                          {formatCurrency(acc.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. General Journal */}
      {subTab === 'journal' && (
        <div className="space-y-4">
          {journalEntries.map(entry => (
            <div key={entry.id} className="creamy-card p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cream-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-sm text-cream-950">{entry.entryNumber}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gold-100 text-gold-800 border border-gold-200">
                    {entry.voucherType}
                  </span>
                  <span className="text-xs text-cream-500 font-mono">Ref: {entry.referenceNo}</span>
                </div>
                <div className="text-xs text-cream-400 font-mono">
                  {entry.date}
                </div>
              </div>

              <p className="text-xs text-cream-700 font-medium leading-relaxed">
                {entry.description}
              </p>

              <table className="w-full text-left text-xs bg-cream-50/60 rounded-xl overflow-hidden">
                <thead className="bg-cream-100/70 border-b border-cream-200 text-cream-500 text-[10px] uppercase font-semibold">
                  <tr>
                    <th className="py-2 px-3 w-24">GL Code</th>
                    <th className="py-2 px-3">Account Name</th>
                    <th className="py-2 px-3">Narration Line</th>
                    <th className="py-2 px-3 text-right">Debit ($)</th>
                    <th className="py-2 px-3 text-right">Credit ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100 font-mono">
                  {entry.lines.map((line, idx) => (
                    <tr key={idx} className="hover:bg-cream-100/40">
                      <td className="py-2 px-3 font-bold text-cream-900">{line.accountCode}</td>
                      <td className="py-2 px-3 font-sans font-medium text-cream-900">{line.accountName}</td>
                      <td className="py-2 px-3 font-sans text-cream-500 text-[11px]">{line.description || '-'}</td>
                      <td className="py-2 px-3 text-right text-emerald-800 font-bold">
                        {line.debit > 0 ? formatCurrency(line.debit) : '-'}
                      </td>
                      <td className="py-2 px-3 text-right text-sky-800 font-bold">
                        {line.credit > 0 ? formatCurrency(line.credit) : '-'}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-cream-100 font-bold text-cream-950">
                    <td colSpan={3} className="py-2 px-3 text-right uppercase text-[10px] tracking-wider">
                      Entry Totals:
                    </td>
                    <td className="py-2 px-3 text-right text-emerald-900">
                      {formatCurrency(entry.totalDebit)}
                    </td>
                    <td className="py-2 px-3 text-right text-sky-900">
                      {formatCurrency(entry.totalCredit)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* 3. Trial Balance */}
      {subTab === 'trial' && (
        <div className="creamy-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200">
            <div>
              <h3 className="text-lg font-bold text-cream-950">Trial Balance Audit Verification</h3>
              <p className="text-xs text-cream-500">Every active ledger balance verified as of today</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${
              isTBBalanced 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {isTBBalanced ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
              <span>{isTBBalanced ? 'Audit Passed: Trial Balance in Perfect Equilibrium' : 'Imbalance Detected'}</span>
            </div>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-cream-200 text-cream-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 w-28">GL Code</th>
                <th className="py-3 px-3">Account Title</th>
                <th className="py-3 px-3">Classification</th>
                <th className="py-3 px-4 text-right">Debit ($)</th>
                <th className="py-3 px-4 text-right">Credit ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100 font-mono">
              {trialBalanceRows.map(row => (
                <tr key={row.id} className="hover:bg-cream-50/70">
                  <td className="py-2.5 px-4 font-bold text-cream-900">{row.code}</td>
                  <td className="py-2.5 px-3 font-sans font-semibold text-cream-950">{row.name}</td>
                  <td className="py-2.5 px-3 font-sans text-cream-500">{row.category}</td>
                  <td className="py-2.5 px-4 text-right text-cream-900">
                    {row.debit > 0 ? formatCurrency(row.debit) : '-'}
                  </td>
                  <td className="py-2.5 px-4 text-right text-cream-900">
                    {row.credit > 0 ? formatCurrency(row.credit) : '-'}
                  </td>
                </tr>
              ))}
              <tr className="bg-cream-200/60 font-extrabold text-sm text-cream-950">
                <td colSpan={3} className="py-3 px-4 font-sans text-right uppercase text-xs tracking-wider">
                  Total Trial Balance Equilibrium:
                </td>
                <td className="py-3 px-4 text-right text-emerald-900 font-mono">
                  {formatCurrency(totalTBDebit)}
                </td>
                <td className="py-3 px-4 text-right text-emerald-900 font-mono">
                  {formatCurrency(totalTBCredit)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Profit & Loss (Income Statement) */}
      {subTab === 'pl' && (
        <div className="creamy-card p-6 space-y-6 max-w-4xl mx-auto">
          <div className="text-center pb-4 border-b border-cream-200">
            <h2 className="text-xl font-extrabold text-cream-950">SkyHorizon Travels & Tourism LLC</h2>
            <h3 className="text-sm font-bold text-gold-700 mt-0.5">STATEMENT OF PROFIT OR LOSS</h3>
            <p className="text-xs text-cream-400 mt-1">For the Financial Year Ending 2026 (Real-time)</p>
          </div>

          {/* Operating Revenue */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-cream-900 uppercase tracking-wider pb-1 border-b border-cream-200">
              1. Travel Agency Operating Revenues
            </h4>
            <div className="space-y-1.5 text-xs">
              {revenues.map(rev => (
                <div key={rev.id} className="flex justify-between py-1">
                  <span className="text-cream-700">{rev.code} - {rev.name}</span>
                  <span className="font-mono font-bold text-cream-950">{formatCurrency(rev.balance)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-t border-cream-200 font-bold text-sm text-emerald-900">
                <span>Total Gross Operating Income:</span>
                <span className="font-mono">{formatCurrency(totalRevenue)}</span>
              </div>
            </div>
          </div>

          {/* Operating Costs & Expenses */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-cream-900 uppercase tracking-wider pb-1 border-b border-cream-200">
              2. Operating & Administrative Expenses
            </h4>
            <div className="space-y-1.5 text-xs">
              {expenses.map(exp => (
                <div key={exp.id} className="flex justify-between py-1">
                  <span className="text-cream-700">{exp.code} - {exp.name}</span>
                  <span className="font-mono font-semibold text-rose-800">{formatCurrency(exp.balance)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-t border-cream-200 font-bold text-sm text-rose-900">
                <span>Total Operating Expenses:</span>
                <span className="font-mono">({formatCurrency(totalOperatingCosts)})</span>
              </div>
            </div>
          </div>

          {/* Net Profit */}
          <div className="p-4 rounded-xl bg-gold-50/80 border border-gold-300 flex items-center justify-between text-base font-extrabold text-cream-950">
            <div>
              <div>NET OPERATING PROFIT / (LOSS)</div>
              <p className="text-[11px] text-cream-500 font-normal">Available for partner distribution or retained earnings</p>
            </div>
            <div className="text-2xl font-mono text-emerald-900">
              {formatCurrency(netIncome)}
            </div>
          </div>
        </div>
      )}

      {/* 5. Balance Sheet */}
      {subTab === 'balanceSheet' && (
        <div className="creamy-card p-6 space-y-6 max-w-4xl mx-auto">
          <div className="text-center pb-4 border-b border-cream-200">
            <h2 className="text-xl font-extrabold text-cream-950">SkyHorizon Travels & Tourism LLC</h2>
            <h3 className="text-sm font-bold text-gold-700 mt-0.5">STATEMENT OF FINANCIAL POSITION (BALANCE SHEET)</h3>
            <p className="text-xs text-cream-400 mt-1">As of Today (Audited Double-Entry Engine)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* ASSETS */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-cream-950 uppercase tracking-wider pb-1 border-b-2 border-cream-900">
                ASSETS
              </h4>
              <div className="space-y-1.5 text-xs">
                {assets.map(a => (
                  <div key={a.id} className="flex justify-between py-1 border-b border-cream-100">
                    <span className="text-cream-700">{a.code} - {a.name}</span>
                    <span className="font-mono font-semibold text-cream-950">{formatCurrency(a.balance)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 flex justify-between font-extrabold text-sm text-cream-950 border-t-2 border-cream-900">
                <span>TOTAL ASSETS:</span>
                <span className="font-mono text-emerald-900">{formatCurrency(totalAssets)}</span>
              </div>
            </div>

            {/* LIABILITIES & EQUITY */}
            <div className="space-y-6">
              
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-cream-950 uppercase tracking-wider pb-1 border-b-2 border-cream-900">
                  LIABILITIES
                </h4>
                <div className="space-y-1.5 text-xs">
                  {liabilities.map(l => (
                    <div key={l.id} className="flex justify-between py-1 border-b border-cream-100">
                      <span className="text-cream-700">{l.code} - {l.name}</span>
                      <span className="font-mono font-semibold text-cream-950">{formatCurrency(l.balance)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 flex justify-between font-bold text-xs text-cream-950 border-t border-cream-200">
                  <span>Total Liabilities:</span>
                  <span className="font-mono">{formatCurrency(totalLiabilities)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-cream-950 uppercase tracking-wider pb-1 border-b-2 border-cream-900">
                  EQUITY
                </h4>
                <div className="space-y-1.5 text-xs">
                  {equities.map(e => (
                    <div key={e.id} className="flex justify-between py-1 border-b border-cream-100">
                      <span className="text-cream-700">{e.code} - {e.name}</span>
                      <span className="font-mono font-semibold text-cream-950">{formatCurrency(e.balance)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-1 border-b border-cream-100 text-emerald-800 font-semibold">
                    <span>Current Year Net Earnings (P&L)</span>
                    <span className="font-mono">+{formatCurrency(netIncome)}</span>
                  </div>
                </div>
                <div className="pt-2 flex justify-between font-bold text-xs text-cream-950 border-t border-cream-200">
                  <span>Total Equity:</span>
                  <span className="font-mono">{formatCurrency(totalEquity)}</span>
                </div>
              </div>

              <div className="pt-3 flex justify-between font-extrabold text-sm text-cream-950 border-t-2 border-cream-900">
                <span>TOTAL LIABILITIES & EQUITY:</span>
                <span className="font-mono text-emerald-900">{formatCurrency(totalLiabilities + totalEquity)}</span>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
