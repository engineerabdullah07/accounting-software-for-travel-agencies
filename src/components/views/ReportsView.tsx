import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Scale, TrendingUp, FileSpreadsheet, Calendar, Printer, CheckCircle2, AlertCircle } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { accounts, vouchers, getDayBook, formatMoney } = useAccounting();
  const [activeTab, setActiveTab] = useState<'trial' | 'pl' | 'balanceSheet' | 'daybook'>('trial');
  const [dayBookDate, setDayBookDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Trial Balance Rows
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

  const totalDebit = trialBalanceRows.reduce((acc, r) => acc + r.debit, 0);
  const totalCredit = trialBalanceRows.reduce((acc, r) => acc + r.credit, 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 1;

  // Profit & Loss Calculations
  const revenues = accounts.filter(a => a.category === 'INCOME');
  const expenses = accounts.filter(a => a.category === 'EXPENSE');

  const totalRevenue = revenues.reduce((acc, a) => acc + a.balance, 0);
  const totalExpenses = expenses.reduce((acc, a) => acc + a.balance, 0);
  const netProfit = totalRevenue - totalExpenses;

  // Balance Sheet
  const assets = accounts.filter(a => a.category === 'ASSET');
  const liabilities = accounts.filter(a => a.category === 'LIABILITY');
  const equities = accounts.filter(a => a.category === 'EQUITY');

  const totalAssets = assets.reduce((acc, a) => acc + a.balance, 0);
  const totalLiabilities = liabilities.reduce((acc, a) => acc + a.balance, 0);
  const totalEquity = equities.reduce((acc, a) => acc + a.balance, 0) + netProfit;

  // Day Book
  const dayBookRows = getDayBook(dayBookDate);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cream-950 tracking-tight">
            Financial Statements & Audit Reports
          </h1>
          <p className="text-xs text-cream-500 mt-1">
            Trial Balance equilibrium, real-time Profit & Loss (P&L), Balance Sheet, and Roznamcha Day Book.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-cream-200 text-cream-800 text-xs font-semibold hover:bg-cream-100 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print Statement</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-cream-200 pb-2">
        <button
          onClick={() => setActiveTab('trial')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'trial' ? 'bg-cream-900 text-gold-300 shadow-creamy' : 'text-cream-600 hover:bg-cream-100'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Trial Balance</span>
        </button>

        <button
          onClick={() => setActiveTab('pl')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pl' ? 'bg-cream-900 text-gold-300 shadow-creamy' : 'text-cream-600 hover:bg-cream-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Profit & Loss (P&L)</span>
        </button>

        <button
          onClick={() => setActiveTab('balanceSheet')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'balanceSheet' ? 'bg-cream-900 text-gold-300 shadow-creamy' : 'text-cream-600 hover:bg-cream-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Balance Sheet</span>
        </button>

        <button
          onClick={() => setActiveTab('daybook')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'daybook' ? 'bg-cream-900 text-gold-300 shadow-creamy' : 'text-cream-600 hover:bg-cream-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Roznamcha (Day Book)</span>
        </button>
      </div>

      {/* 1. Trial Balance */}
      {activeTab === 'trial' && (
        <div className="creamy-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200">
            <div>
              <h3 className="text-base font-bold text-cream-950">Trial Balance Verification</h3>
              <p className="text-xs text-cream-500">Every ledger balance verified as of today</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${
              isBalanced ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {isBalanced ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
              <span>{isBalanced ? 'Balanced: Total Debit = Total Credit' : 'Imbalance Detected'}</span>
            </div>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-cream-200 text-cream-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-4 w-28">GL Code</th>
                <th className="py-2.5 px-3">Account Title</th>
                <th className="py-2.5 px-3">Classification</th>
                <th className="py-2.5 px-4 text-right">Debit Balance</th>
                <th className="py-2.5 px-4 text-right">Credit Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100 font-mono">
              {trialBalanceRows.map(row => (
                <tr key={row.id} className="hover:bg-cream-50/70">
                  <td className="py-2 px-4 font-bold text-cream-900">{row.code}</td>
                  <td className="py-2 px-3 font-sans font-semibold text-cream-950">{row.name}</td>
                  <td className="py-2 px-3 font-sans text-cream-500">{row.subCategory}</td>
                  <td className="py-2 px-4 text-right text-cream-900">
                    {row.debit > 0 ? formatMoney(row.debit) : '-'}
                  </td>
                  <td className="py-2 px-4 text-right text-cream-900">
                    {row.credit > 0 ? formatMoney(row.credit) : '-'}
                  </td>
                </tr>
              ))}
              <tr className="bg-cream-200/60 font-extrabold text-sm text-cream-950">
                <td colSpan={3} className="py-3 px-4 font-sans text-right uppercase text-xs tracking-wider">
                  Total Trial Balance Equilibrium:
                </td>
                <td className="py-3 px-4 text-right text-emerald-900 font-mono">
                  {formatMoney(totalDebit)}
                </td>
                <td className="py-3 px-4 text-right text-emerald-900 font-mono">
                  {formatMoney(totalCredit)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* 2. Profit & Loss Statement */}
      {activeTab === 'pl' && (
        <div className="creamy-card p-6 space-y-6 max-w-4xl mx-auto">
          <div className="text-center pb-4 border-b border-cream-200">
            <h2 className="text-xl font-extrabold text-cream-950">Travel Agency Profit & Loss Statement</h2>
            <p className="text-xs text-cream-500 mt-1">Operating revenue (flight commissions, hotel margins) vs overhead expenses</p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Income */}
            <div>
              <h4 className="font-bold text-cream-900 uppercase tracking-wider pb-1 border-b border-cream-200">
                1. Operating Revenue & Gross Margins
              </h4>
              <div className="space-y-1.5 pt-2">
                {revenues.map(r => (
                  <div key={r.id} className="flex justify-between py-1">
                    <span className="text-cream-700">{r.code} - {r.name}</span>
                    <span className="font-mono font-bold text-cream-950">{formatMoney(r.balance)}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 border-t border-cream-200 font-bold text-emerald-900">
                  <span>Total Gross Revenue:</span>
                  <span className="font-mono">{formatMoney(totalRevenue)}</span>
                </div>
              </div>
            </div>

            {/* Expenses */}
            <div>
              <h4 className="font-bold text-cream-900 uppercase tracking-wider pb-1 border-b border-cream-200">
                2. Operating Expenses
              </h4>
              <div className="space-y-1.5 pt-2">
                {expenses.map(e => (
                  <div key={e.id} className="flex justify-between py-1">
                    <span className="text-cream-700">{e.code} - {e.name}</span>
                    <span className="font-mono text-rose-800">{formatMoney(e.balance)}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 border-t border-cream-200 font-bold text-rose-900">
                  <span>Total Expenses:</span>
                  <span className="font-mono">({formatMoney(totalExpenses)})</span>
                </div>
              </div>
            </div>

            {/* Net Profit */}
            <div className="p-4 rounded-xl bg-gold-50/80 border border-gold-300 flex items-center justify-between text-base font-extrabold text-cream-950">
              <div>
                <div>NET PROFIT / (LOSS)</div>
                <p className="text-[11px] text-cream-500 font-normal">Realized agency operating profit</p>
              </div>
              <div className="text-2xl font-mono text-emerald-900">
                {formatMoney(netProfit)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Balance Sheet */}
      {activeTab === 'balanceSheet' && (
        <div className="creamy-card p-6 space-y-6 max-w-4xl mx-auto">
          <div className="text-center pb-4 border-b border-cream-200">
            <h2 className="text-xl font-extrabold text-cream-950">Balance Sheet (Financial Position)</h2>
            <p className="text-xs text-cream-500 mt-1">Assets = Liabilities + Owner Capital & Retained Earnings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            {/* ASSETS */}
            <div className="space-y-3">
              <h4 className="font-bold text-cream-950 uppercase tracking-wider pb-1 border-b-2 border-cream-900">
                ASSETS (Current & Fixed)
              </h4>
              <div className="space-y-1.5">
                {assets.map(a => (
                  <div key={a.id} className="flex justify-between py-1 border-b border-cream-100">
                    <span className="text-cream-700">{a.code} - {a.name}</span>
                    <span className="font-mono font-bold text-cream-950">{formatMoney(a.balance)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 flex justify-between font-extrabold text-sm text-cream-950 border-t-2 border-cream-900">
                <span>TOTAL ASSETS:</span>
                <span className="font-mono text-emerald-900">{formatMoney(totalAssets)}</span>
              </div>
            </div>

            {/* LIABILITIES & EQUITY */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-bold text-cream-950 uppercase tracking-wider pb-1 border-b-2 border-cream-900">
                  LIABILITIES (Suppliers & Advances)
                </h4>
                <div className="space-y-1.5">
                  {liabilities.map(l => (
                    <div key={l.id} className="flex justify-between py-1 border-b border-cream-100">
                      <span className="text-cream-700">{l.code} - {l.name}</span>
                      <span className="font-mono font-bold text-cream-950">{formatMoney(l.balance)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 flex justify-between font-bold text-xs text-cream-950 border-t border-cream-200">
                  <span>Total Liabilities:</span>
                  <span className="font-mono">{formatMoney(totalLiabilities)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-cream-950 uppercase tracking-wider pb-1 border-b-2 border-cream-900">
                  CAPITAL & RESERVES
                </h4>
                <div className="space-y-1.5">
                  {equities.map(e => (
                    <div key={e.id} className="flex justify-between py-1 border-b border-cream-100">
                      <span className="text-cream-700">{e.code} - {e.name}</span>
                      <span className="font-mono font-bold text-cream-950">{formatMoney(e.balance)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-1 border-b border-cream-100 text-emerald-800 font-semibold">
                    <span>Current Year Net Profit (P&L)</span>
                    <span className="font-mono">+{formatMoney(netProfit)}</span>
                  </div>
                </div>
                <div className="pt-2 flex justify-between font-bold text-xs text-cream-950 border-t border-cream-200">
                  <span>Total Capital & Reserves:</span>
                  <span className="font-mono">{formatMoney(totalEquity)}</span>
                </div>
              </div>

              <div className="pt-3 flex justify-between font-extrabold text-sm text-cream-950 border-t-2 border-cream-900">
                <span>TOTAL LIABILITIES & CAPITAL:</span>
                <span className="font-mono text-emerald-900">{formatMoney(totalLiabilities + totalEquity)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Day Book (Roznamcha) */}
      {activeTab === 'daybook' && (
        <div className="creamy-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200 pb-3">
            <div>
              <h3 className="text-base font-bold text-cream-950">Roznamcha (Daily Cash & Bank Register)</h3>
              <p className="text-xs text-cream-500">Every voucher and settlement transacted on the selected date</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-cream-500 font-semibold">Select Date:</span>
              <input
                type="date"
                value={dayBookDate}
                onChange={(e) => setDayBookDate(e.target.value)}
                className="px-2.5 py-1 bg-cream-50 border border-cream-200 rounded-lg text-cream-900 font-medium"
              />
            </div>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-cream-200 text-cream-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-4 w-32">Voucher #</th>
                <th className="py-2.5 px-3 w-24">Type</th>
                <th className="py-2.5 px-3">Transaction Narration</th>
                <th className="py-2.5 px-4 text-right">Debit ($)</th>
                <th className="py-2.5 px-4 text-right">Credit ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100 font-mono">
              {dayBookRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-cream-500 font-sans">
                    No vouchers posted on {dayBookDate}.
                  </td>
                </tr>
              ) : (
                dayBookRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-cream-50/70">
                    <td className="py-2.5 px-4 font-bold text-cream-950">{row.voucherNo}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cream-200 text-cream-900">
                        {row.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans text-cream-800">{row.narration}</td>
                    <td className="py-2.5 px-4 text-right text-emerald-800">{formatMoney(row.debit)}</td>
                    <td className="py-2.5 px-4 text-right text-sky-800">{formatMoney(row.credit)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
