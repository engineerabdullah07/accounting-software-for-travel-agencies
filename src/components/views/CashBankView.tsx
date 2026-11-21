import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Wallet, Building2, ArrowDownLeft, ArrowUpRight, Search, Printer, Plus } from 'lucide-react';

export const CashBankView: React.FC = () => {
  const { accounts, getAccountLedger, formatMoney } = useAccounting();

  const cashAndBanks = accounts.filter(a => a.category === 'ASSET' && 
    (a.subCategory === 'Cash & Cash Equivalents' || a.subCategory === 'Bank Accounts')
  );

  const [selectedAccountId, setSelectedAccountId] = useState<string>(cashAndBanks[0]?.id || '');
  const [fromDate, setFromDate] = useState<string>('2026-11-01');
  const [toDate, setToDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const selectedAccount = cashAndBanks.find(a => a.id === selectedAccountId) || cashAndBanks[0];
  const ledgerTxs = selectedAccount ? getAccountLedger(selectedAccount.id, fromDate, toDate) : [];

  const totalReceipts = ledgerTxs.reduce((acc, t) => acc + t.debit, 0);
  const totalPayments = ledgerTxs.reduce((acc, t) => acc + t.credit, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cream-950 tracking-tight">
            Cash Book & Bank Account Registers
          </h1>
          <p className="text-xs text-cream-500 mt-1">
            Real-time cash in safe, petty cash, and commercial bank registers with running balance audit.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-cream-200 text-cream-800 text-xs font-semibold hover:bg-cream-100 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print Register</span>
        </button>
      </div>

      {/* Account Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cashAndBanks.map(acc => {
          const isSelected = selectedAccountId === acc.id;
          const isCash = acc.subCategory.includes('Cash');
          return (
            <div
              key={acc.id}
              onClick={() => setSelectedAccountId(acc.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-cream-900 text-white border-cream-800 shadow-creamy ring-2 ring-gold-400/30'
                  : 'bg-white border-cream-200 hover:border-gold-300 text-cream-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-gold-400">{acc.code}</span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-white/10 text-gold-300' : 'bg-cream-100 text-cream-700'
                }`}>
                  {isCash ? <Wallet className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                </div>
              </div>
              <div className="mt-2 font-bold text-xs truncate">{acc.name}</div>
              <div className="mt-2 pt-2 border-t border-cream-200/40 flex justify-between items-center text-xs">
                <span className="text-[10px] opacity-70">Current Balance:</span>
                <span className={`font-mono font-extrabold text-sm ${isSelected ? 'text-gold-300' : 'text-emerald-800'}`}>
                  {formatMoney(acc.balance)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Account Register Table */}
      <div className="creamy-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200 pb-3">
          <div>
            <span className="text-[10px] font-bold text-cream-400 uppercase tracking-wider">Account Register</span>
            <h2 className="text-lg font-extrabold text-cream-950 mt-0.5">
              {selectedAccount?.code} - {selectedAccount?.name}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-cream-500 font-semibold">From:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-2 py-1 bg-cream-50 border border-cream-200 rounded-lg text-cream-900 font-medium"
            />
            <span className="text-cream-500 font-semibold ml-1">To:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-2 py-1 bg-cream-50 border border-cream-200 rounded-lg text-cream-900 font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-cream-200 text-cream-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-4 w-28">Date</th>
                <th className="py-2.5 px-3 w-32">Voucher #</th>
                <th className="py-2.5 px-3">Particulars & Opposing Account</th>
                <th className="py-2.5 px-3 text-right">Debit (Funds Received In)</th>
                <th className="py-2.5 px-3 text-right">Credit (Funds Released Out)</th>
                <th className="py-2.5 px-4 text-right">Running Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100 font-mono">
              {ledgerTxs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-cream-500 font-sans">
                    No transactions found for this account in the selected date range.
                  </td>
                </tr>
              ) : (
                ledgerTxs.map(t => (
                  <tr key={t.id} className="hover:bg-cream-50/70">
                    <td className="py-2.5 px-4 text-cream-600">{t.date}</td>
                    <td className="py-2.5 px-3 font-bold text-cream-950">{t.voucherNo}</td>
                    <td className="py-2.5 px-3 font-sans text-cream-800">{t.particulars}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-800 font-semibold">
                      {t.debit > 0 ? formatMoney(t.debit) : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right text-rose-900 font-semibold">
                      {t.credit > 0 ? formatMoney(t.credit) : '-'}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-cream-950">
                      {formatMoney(t.runningBalance)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-cream-100/80 font-bold border-t border-cream-200 text-xs">
              <tr>
                <td colSpan={3} className="py-2.5 px-4 text-right font-sans uppercase text-[10px] text-cream-600">
                  Total Movement:
                </td>
                <td className="py-2.5 px-3 text-right text-emerald-900 font-mono">
                  +{formatMoney(totalReceipts)}
                </td>
                <td className="py-2.5 px-3 text-right text-rose-900 font-mono">
                  -{formatMoney(totalPayments)}
                </td>
                <td className="py-2.5 px-4 text-right text-cream-950 font-mono text-sm">
                  {formatMoney(selectedAccount ? selectedAccount.balance : 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
