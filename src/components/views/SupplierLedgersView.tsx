import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Party } from '../../types';
import { Building, Search, Printer, ArrowUpRight, Plus } from 'lucide-react';

interface SupplierLedgersViewProps {
  onOpenNewParty: () => void;
  onPaySupplier: (party: Party) => void;
}

export const SupplierLedgersView: React.FC<SupplierLedgersViewProps> = ({
  onOpenNewParty,
  onPaySupplier
}) => {
  const { parties, getPartyLedger, formatMoney } = useAccounting();

  const suppliers = parties.filter(p => p.type === 'SUPPLIER');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(suppliers[0]?.id || '');
  const [fromDate, setFromDate] = useState<string>('2026-11-01');
  const [toDate, setToDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ledgerTxs = selectedSupplier ? getPartyLedger(selectedSupplier.id, fromDate, toDate) : [];

  const totalDebit = ledgerTxs.reduce((acc, t) => acc + t.debit, 0);
  const totalCredit = ledgerTxs.reduce((acc, t) => acc + t.credit, 0);
  const closingBalance = selectedSupplier ? selectedSupplier.currentBalance : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cream-950 tracking-tight">
            Supplier & Airline Ledgers (Payables Khata)
          </h1>
          <p className="text-xs text-cream-500 mt-1">
            Running reconciliation statements for IATA BSP, ticketing consolidators, hotel beds, and visa providers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-cream-200 text-cream-800 text-xs font-semibold hover:bg-cream-100 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Supplier Statement</span>
          </button>
          <button
            onClick={onOpenNewParty}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs shadow-creamy active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Supplier / Airline</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Selector, Right Statement */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left: Supplier Selector */}
        <div className="space-y-3">
          <div className="creamy-card p-4 space-y-3">
            <span className="text-xs font-bold text-cream-500 uppercase tracking-wider block">
              Accredited Suppliers ({suppliers.length})
            </span>

            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cream-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter suppliers..."
                className="w-full pl-8 pr-2 py-1.5 text-xs bg-cream-50/80 border border-cream-200 rounded-lg text-cream-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredSuppliers.map(sup => (
                <div
                  key={sup.id}
                  onClick={() => setSelectedSupplierId(sup.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedSupplierId === sup.id
                      ? 'bg-cream-900 text-white border-cream-800 shadow-creamy'
                      : 'bg-cream-50/50 border-cream-200 hover:bg-white text-cream-900'
                  }`}
                >
                  <div className="font-bold text-xs">{sup.name}</div>
                  <div className={`text-[10px] mt-0.5 ${selectedSupplierId === sup.id ? 'text-cream-300' : 'text-cream-500'}`}>
                    {sup.companyName}
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-cream-200/40 flex justify-between items-center text-xs">
                    <span className="text-[10px] opacity-70">Payable:</span>
                    <span className={`font-mono font-extrabold ${selectedSupplierId === sup.id ? 'text-gold-300' : 'text-rose-900'}`}>
                      {formatMoney(sup.currentBalance)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Supplier Statement */}
        <div className="lg:col-span-3 space-y-4">
          <div className="creamy-card p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-4">
              <div>
                <span className="text-[10px] font-bold text-cream-400 uppercase tracking-wider">
                  Supplier Payable Statement
                </span>
                <h2 className="text-xl font-extrabold text-cream-950 mt-0.5">
                  {selectedSupplier?.name}
                </h2>
                <p className="text-xs text-cream-500">
                  {selectedSupplier?.companyName} • Phone: {selectedSupplier?.phone} • {selectedSupplier?.email}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {selectedSupplier && selectedSupplier.currentBalance > 0 && (
                  <button
                    onClick={() => onPaySupplier(selectedSupplier)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-creamy active:scale-95 transition-all"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Pay Supplier (PV)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Date Selectors */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-cream-500 font-semibold">From:</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="px-2.5 py-1 bg-cream-50 border border-cream-200 rounded-lg text-cream-900 font-medium"
                />
                <span className="text-cream-500 font-semibold ml-2">To:</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="px-2.5 py-1 bg-cream-50 border border-cream-200 rounded-lg text-cream-900 font-medium"
                />
              </div>

              <div className="text-right">
                <span className="text-cream-500 text-[11px] block">Current Payable Balance:</span>
                <span className="text-lg font-mono font-extrabold text-rose-900">
                  {formatMoney(closingBalance)}
                </span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="creamy-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-100/70 border-b border-cream-200 text-cream-600 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-28">Date</th>
                    <th className="py-3 px-3 w-36">Voucher / Bill #</th>
                    <th className="py-3 px-3">Description / Statement Detail</th>
                    <th className="py-3 px-3 text-right">Debit (Payment Released)</th>
                    <th className="py-3 px-3 text-right">Credit (Bill Received)</th>
                    <th className="py-3 px-4 text-right">Payable Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100 font-mono">
                  {ledgerTxs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-cream-500 font-sans">
                        No transactions recorded for this supplier in the selected date range.
                      </td>
                    </tr>
                  ) : (
                    ledgerTxs.map(t => (
                      <tr key={t.id} className="hover:bg-cream-50/70 transition-colors">
                        <td className="py-2.5 px-4 text-cream-600">{t.date}</td>
                        <td className="py-2.5 px-3 font-bold text-cream-950">{t.voucherNo}</td>
                        <td className="py-2.5 px-3 font-sans text-cream-800 text-xs">{t.particulars}</td>
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
                    <td colSpan={3} className="py-3 px-4 text-right font-sans uppercase text-[11px] text-cream-600">
                      Period Totals:
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-900 font-mono">
                      {formatMoney(totalDebit)}
                    </td>
                    <td className="py-3 px-3 text-right text-rose-900 font-mono">
                      {formatMoney(totalCredit)}
                    </td>
                    <td className="py-3 px-4 text-right text-rose-900 font-mono text-sm">
                      {formatMoney(closingBalance)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
