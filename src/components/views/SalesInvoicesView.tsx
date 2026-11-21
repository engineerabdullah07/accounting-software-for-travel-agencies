import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { SaleInvoice } from '../../types';
import { 
  Receipt, 
  Plus, 
  Search, 
  Printer, 
  ArrowDownLeft, 
  Plane, 
  Building2, 
  Compass, 
  FileCheck 
} from 'lucide-react';

interface SalesInvoicesViewProps {
  onOpenNewSale: () => void;
  onPrintInvoice: (inv: SaleInvoice) => void;
  onReceivePayment: (inv: SaleInvoice) => void;
}

export const SalesInvoicesView: React.FC<SalesInvoicesViewProps> = ({
  onOpenNewSale,
  onPrintInvoice,
  onReceivePayment
}) => {
  const { salesInvoices, formatMoney } = useAccounting();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredInvoices = salesInvoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
      inv.items.some(i => (i.pnr && i.pnr.toLowerCase().includes(search.toLowerCase())) ||
                          (i.passengerName && i.passengerName.toLowerCase().includes(search.toLowerCase())) ||
                          (i.ticketNumber && i.ticketNumber.toLowerCase().includes(search.toLowerCase())));

    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSales = filteredInvoices.reduce((acc, i) => acc + i.totalSale, 0);
  const totalProfit = filteredInvoices.reduce((acc, i) => acc + i.totalProfit, 0);
  const totalDue = filteredInvoices.reduce((acc, i) => acc + i.balanceDue, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cream-950 tracking-tight">
            Sales Invoicing & Billing
          </h1>
          <p className="text-xs text-cream-500 mt-1">
            Enter tickets, hotel bookings, Umrah packages and visa invoices with supplier cost & client margins.
          </p>
        </div>

        <button
          onClick={onOpenNewSale}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs shadow-creamy active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Sales Invoice</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">Total Sales Billed</div>
          <div className="text-xl font-extrabold text-cream-950 mt-1">{formatMoney(totalSales)}</div>
          <div className="text-[10px] text-cream-400 mt-0.5">Across {filteredInvoices.length} invoices</div>
        </div>
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">Gross Agency Margin (Profit)</div>
          <div className="text-xl font-extrabold text-emerald-800 mt-1">{formatMoney(totalProfit)}</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Earned after paying supplier costs</div>
        </div>
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">Total Client Outstandings</div>
          <div className="text-xl font-extrabold text-amber-900 mt-1">{formatMoney(totalDue)}</div>
          <div className="text-[10px] text-amber-700 font-medium mt-0.5">Receivable on account / Khata</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="creamy-card p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Invoice #, Client, PNR, Pax..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-cream-50/60 border border-cream-200 rounded-lg text-cream-900 placeholder-cream-400 focus:outline-none focus:ring-2 focus:ring-gold-500/40"
          />
        </div>

        <div className="flex items-center gap-1 bg-cream-100/70 p-1 rounded-xl">
          {['ALL', 'UNPAID', 'PARTIAL', 'PAID'].map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === tab 
                  ? 'bg-white text-cream-950 shadow-sm' 
                  : 'text-cream-600 hover:text-cream-900'
              }`}
            >
              {tab === 'ALL' ? 'All Invoices' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Sales Invoices Table */}
      <div className="creamy-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-cream-200 text-cream-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Invoice # / Date</th>
                <th className="py-3 px-3">Client Khata</th>
                <th className="py-3 px-3">Service Details (PNR / Pax / Sector)</th>
                <th className="py-3 px-3 text-right">Supplier Cost</th>
                <th className="py-3 px-3 text-right">Sale Price</th>
                <th className="py-3 px-3 text-right">Agency Profit</th>
                <th className="py-3 px-3 text-right">Balance Due</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-xs text-cream-500">
                    No sales invoices found. Click "New Sales Invoice" to add one.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-cream-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-cream-950 text-sm">{inv.invoiceNumber}</div>
                      <div className="text-[11px] text-cream-500">{inv.date}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-cream-900">{inv.customerName}</div>
                      <div className="text-[10px] text-cream-400 font-mono">Due: {inv.dueDate}</div>
                    </td>
                    <td className="py-3 px-3">
                      {inv.items.map((item, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <div className="font-medium text-cream-900 flex items-center gap-1.5">
                            {item.pnr && <span className="font-mono font-bold text-gold-800 bg-gold-50 px-1.5 py-0.2 rounded border border-gold-200">{item.pnr}</span>}
                            <span>{item.passengerName || item.description}</span>
                          </div>
                          {item.sector && (
                            <div className="text-[11px] text-cream-500 font-mono">
                              Sector: {item.sector} • {item.serviceType}
                            </div>
                          )}
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-cream-600">
                      {formatMoney(inv.totalCost)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-cream-950">
                      {formatMoney(inv.totalSale)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-extrabold text-emerald-800">
                      +{formatMoney(inv.totalProfit)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-amber-900">
                      {inv.balanceDue > 0 ? (
                        formatMoney(inv.balanceDue)
                      ) : (
                        <span className="text-emerald-700 font-medium">Cleared</span>
                      )}
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
                          onClick={() => onPrintInvoice(inv)}
                          className="p-1.5 rounded-lg bg-cream-100 hover:bg-gold-100 text-cream-800 hover:text-gold-900 transition-colors"
                          title="Print Travel Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        {inv.balanceDue > 0 && (
                          <button
                            onClick={() => onReceivePayment(inv)}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold border border-emerald-200 transition-colors"
                            title="Receive Payment Voucher (RV)"
                          >
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                            <span>Pay RV</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
