import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Voucher } from '../../types';
import { CreditCard, Plus, ArrowDownLeft, ArrowUpRight, Search, Printer } from 'lucide-react';

interface VouchersViewProps {
  onOpenQuickAction: (actionType: 'receipt' | 'payment') => void;
  onPrintVoucher: (voucher: Voucher) => void;
}

export const VouchersView: React.FC<VouchersViewProps> = ({ onOpenQuickAction, onPrintVoucher }) => {
  const { vouchers, formatMoney } = useAccounting();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filteredVouchers = vouchers.filter(v => {
    const matchesType = filterType === 'ALL' || v.type === filterType;
    const matchesSearch = 
      v.voucherNumber.toLowerCase().includes(search.toLowerCase()) ||
      (v.partyName && v.partyName.toLowerCase().includes(search.toLowerCase())) ||
      (v.chequeOrRefNo && v.chequeOrRefNo.toLowerCase().includes(search.toLowerCase())) ||
      v.narration.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cream-950 tracking-tight">
            Voucher Management Center (RV / PV / JV / CN)
          </h1>
          <p className="text-xs text-cream-500 mt-1">
            Receipt Vouchers (RV), Payment Vouchers (PV), Journal Vouchers (JV), and client Credit Notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenQuickAction('receipt')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-creamy active:scale-95 transition-all"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>New Receipt (RV)</span>
          </button>
          <button
            onClick={() => onOpenQuickAction('payment')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-creamy active:scale-95 transition-all"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>New Payment (PV)</span>
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="creamy-card p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search voucher number, party, cheque ref..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-cream-50/60 border border-cream-200 rounded-lg text-cream-900 placeholder-cream-400 focus:outline-none focus:ring-2 focus:ring-gold-500/40"
          />
        </div>

        <div className="flex items-center gap-1 bg-cream-100/70 p-1 rounded-xl">
          {['ALL', 'RV', 'PV', 'JV', 'CN'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterType === tab 
                  ? 'bg-white text-cream-950 shadow-sm' 
                  : 'text-cream-600 hover:text-cream-900'
              }`}
            >
              {tab === 'ALL' ? 'All Vouchers' : tab === 'RV' ? 'Receipts (RV)' : tab === 'PV' ? 'Payments (PV)' : tab === 'JV' ? 'Journals (JV)' : 'Credit Notes'}
            </button>
          ))}
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="creamy-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-cream-100/70 border-b border-cream-200 text-cream-600 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Voucher No</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3">Party / Account</th>
              <th className="py-3 px-3">Debit / Credit Accounts</th>
              <th className="py-3 px-3">Method & Ref</th>
              <th className="py-3 px-3 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Print</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-100">
            {filteredVouchers.map(v => (
              <tr key={v.id} className="hover:bg-cream-50/70 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-cream-950">
                  {v.voucherNumber}
                </td>
                <td className="py-3 px-3 text-cream-600 font-mono">{v.date}</td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    v.type === 'RV'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : v.type === 'PV'
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : 'bg-cream-100 text-cream-800 border border-cream-200'
                  }`}>
                    {v.type}
                  </span>
                </td>
                <td className="py-3 px-3 font-semibold text-cream-900">
                  {v.partyName || v.debitAccountName}
                  <div className="text-[11px] text-cream-500 font-normal">{v.narration}</div>
                </td>
                <td className="py-3 px-3 text-[11px] font-mono text-cream-600">
                  <div>Dr: {v.debitAccountName}</div>
                  <div>Cr: {v.creditAccountName}</div>
                </td>
                <td className="py-3 px-3 text-cream-700">
                  <div className="font-medium">{v.paymentMethod}</div>
                  {v.chequeOrRefNo && <div className="text-[10px] text-cream-400 font-mono">Ref: {v.chequeOrRefNo}</div>}
                </td>
                <td className="py-3 px-3 text-right font-mono font-extrabold text-sm text-cream-950">
                  {formatMoney(v.amount)}
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => onPrintVoucher(v)}
                    className="p-1.5 rounded-lg bg-cream-100 hover:bg-gold-100 text-cream-700 hover:text-gold-900 transition-colors"
                    title="Print Voucher Receipt"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
