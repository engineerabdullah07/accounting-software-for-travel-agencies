import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { SupplierBill } from '../../types';
import { FileText, Plus, Search, ArrowUpRight } from 'lucide-react';

interface SupplierBillsViewProps {
  onOpenNewBill: () => void;
  onPayBill: (bill: SupplierBill) => void;
}

export const SupplierBillsView: React.FC<SupplierBillsViewProps> = ({ onOpenNewBill, onPayBill }) => {
  const { supplierBills, formatMoney } = useAccounting();
  const [search, setSearch] = useState('');

  const filteredBills = supplierBills.filter(b => 
    b.billNumber.toLowerCase().includes(search.toLowerCase()) ||
    b.supplierName.toLowerCase().includes(search.toLowerCase()) ||
    b.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalBillAmount = filteredBills.reduce((acc, b) => acc + b.amount, 0);
  const totalBalanceDue = filteredBills.reduce((acc, b) => acc + b.balanceDue, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cream-950 tracking-tight">
            Supplier & Airline Purchase Bills
          </h1>
          <p className="text-xs text-cream-500 mt-1">
            Log bills from IATA BSP, ticketing consolidators, hotel beds, and visa providers.
          </p>
        </div>

        <button
          onClick={onOpenNewBill}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs shadow-creamy active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Log Supplier Bill</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">Total Supplier Invoices Logged</div>
          <div className="text-xl font-extrabold text-cream-950 mt-1">{formatMoney(totalBillAmount)}</div>
          <div className="text-[10px] text-cream-400 mt-0.5">IATA BSP, Consolidators & Ground Suppliers</div>
        </div>
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">Outstanding Payable Balance</div>
          <div className="text-xl font-extrabold text-rose-900 mt-1">{formatMoney(totalBalanceDue)}</div>
          <div className="text-[10px] text-rose-700 font-medium mt-0.5">Payable to suppliers</div>
        </div>
      </div>

      {/* Search */}
      <div className="creamy-card p-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bill number, airline, or supplier..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-cream-50/60 border border-cream-200 rounded-lg text-cream-900 placeholder-cream-400 focus:outline-none focus:ring-2 focus:ring-gold-500/40"
          />
        </div>
      </div>

      {/* Bills Table */}
      <div className="creamy-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-cream-100/70 border-b border-cream-200 text-cream-600 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Bill # / Date</th>
              <th className="py-3 px-3">Supplier / Airline</th>
              <th className="py-3 px-3">Description / Statement Ref</th>
              <th className="py-3 px-3 text-right">Bill Total</th>
              <th className="py-3 px-3 text-right">Paid</th>
              <th className="py-3 px-3 text-right">Balance Due</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-100">
            {filteredBills.map(bill => (
              <tr key={bill.id} className="hover:bg-cream-50/70 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-cream-950">
                  <div>{bill.billNumber}</div>
                  <div className="text-[11px] text-cream-400 font-normal">{bill.date}</div>
                </td>
                <td className="py-3 px-3 font-semibold text-cream-900">
                  {bill.supplierName}
                  <div className="text-[10px] text-cream-400 font-mono">Due: {bill.dueDate}</div>
                </td>
                <td className="py-3 px-3 text-cream-700">
                  {bill.description}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-cream-950">
                  {formatMoney(bill.amount)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-emerald-800">
                  {formatMoney(bill.paidAmount)}
                </td>
                <td className="py-3 px-3 text-right font-mono font-extrabold text-rose-900">
                  {formatMoney(bill.balanceDue)}
                </td>
                <td className="py-3 px-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    bill.status === 'PAID'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : bill.status === 'PARTIAL'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {bill.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  {bill.balanceDue > 0 && (
                    <button
                      onClick={() => onPayBill(bill)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-semibold border border-rose-200 transition-colors"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Pay PV</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
