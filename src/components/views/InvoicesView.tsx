import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { TicketBooking } from '../../types';
import { Receipt, Search, Printer, CheckCircle, Clock, AlertTriangle, ArrowDownLeft } from 'lucide-react';

interface InvoicesViewProps {
  onPrintInvoice: (ticket: TicketBooking) => void;
  onReceivePayment: (ticket: TicketBooking) => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({ onPrintInvoice, onReceivePayment }) => {
  const { tickets, formatCurrency } = useAccounting();
  const [filter, setFilter] = useState<'ALL' | 'UNPAID' | 'PAID' | 'PARTIAL'>('ALL');
  const [search, setSearch] = useState('');

  const invoices = tickets.map((t, idx) => ({
    invoiceNo: `INV-2026-${String(idx + 101).padStart(4, '0')}`,
    date: t.issueDate,
    dueDate: new Date(new Date(t.issueDate).getTime() + 15 * 86400000).toISOString().split('T')[0],
    ticket: t,
    customer: t.customerName,
    amount: t.clientSellingPrice,
    paid: t.paidAmount,
    balance: t.clientSellingPrice - t.paidAmount,
    status: t.paymentStatus
  }));

  const filtered = invoices.filter(inv => {
    const matchesFilter = filter === 'ALL' || inv.status === filter;
    const matchesSearch = 
      inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.toLowerCase().includes(search.toLowerCase()) ||
      inv.ticket.pnr.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalOutstanding = invoices.reduce((acc, i) => acc + i.balance, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cream-950 tracking-tight">
            Travel Invoices & Billing Desk
          </h1>
          <p className="text-xs text-cream-500 mt-1">
            Corporate billing, passenger tax invoices, and receivables tracking with printable vouchers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold">
            Total Outstanding: <span className="font-extrabold">{formatCurrency(totalOutstanding)}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="creamy-card p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice number, client or PNR..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-cream-50/60 border border-cream-200 rounded-lg text-cream-900 placeholder-cream-400 focus:outline-none focus:ring-2 focus:ring-gold-500/40"
          />
        </div>

        <div className="flex items-center gap-1 bg-cream-100/70 p-1 rounded-xl">
          {(['ALL', 'UNPAID', 'PARTIAL', 'PAID'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === tab 
                  ? 'bg-white text-cream-950 shadow-sm' 
                  : 'text-cream-600 hover:text-cream-900'
              }`}
            >
              {tab === 'ALL' ? 'All Invoices' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice Table */}
      <div className="creamy-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-cream-100/70 border-b border-cream-200 text-cream-600 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Invoice #</th>
              <th className="py-3 px-3">Date / Due</th>
              <th className="py-3 px-3">Client / B2B Account</th>
              <th className="py-3 px-3">Service Details (PNR / Flight)</th>
              <th className="py-3 px-3 text-right">Invoice Amount</th>
              <th className="py-3 px-3 text-right">Balance Due</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-100">
            {filtered.map(inv => (
              <tr key={inv.invoiceNo} className="hover:bg-cream-50/70 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-cream-950">
                  {inv.invoiceNo}
                </td>
                <td className="py-3 px-3 text-cream-600">
                  <div>{inv.date}</div>
                  <div className="text-[10px] text-cream-400">Due: {inv.dueDate}</div>
                </td>
                <td className="py-3 px-3 font-semibold text-cream-900">
                  {inv.customer}
                </td>
                <td className="py-3 px-3">
                  <div className="font-mono text-xs font-bold text-cream-900">{inv.ticket.pnr} • {inv.ticket.sector}</div>
                  <div className="text-[11px] text-cream-500">{inv.ticket.passengerName} ({inv.ticket.airlineName})</div>
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-cream-950">
                  {formatCurrency(inv.amount)}
                </td>
                <td className="py-3 px-3 text-right font-mono font-extrabold text-amber-900">
                  {inv.balance > 0 ? formatCurrency(inv.balance) : <span className="text-emerald-700 font-normal">Cleared</span>}
                </td>
                <td className="py-3 px-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    inv.status === 'PAID'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : inv.status === 'PARTIAL'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => onPrintInvoice(inv.ticket)}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-cream-100 hover:bg-gold-100 text-cream-800 text-[11px] font-semibold transition-colors"
                      title="Print Tax Invoice"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                    {inv.balance > 0 && (
                      <button
                        onClick={() => onReceivePayment(inv.ticket)}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold border border-emerald-200 transition-colors"
                        title="Collect Receipt Voucher"
                      >
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                        <span>Pay RV</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
