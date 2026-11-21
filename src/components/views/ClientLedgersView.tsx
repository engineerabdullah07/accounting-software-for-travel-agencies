import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Party } from '../../types';
import { 
  Users, 
  Search, 
  Printer, 
  ArrowDownLeft, 
  Calendar, 
  Plus, 
  Filter,
  FileSpreadsheet
} from 'lucide-react';

interface ClientLedgersViewProps {
  onOpenNewParty: () => void;
  onReceivePayment: (party: Party) => void;
}

export const ClientLedgersView: React.FC<ClientLedgersViewProps> = ({
  onOpenNewParty,
  onReceivePayment
}) => {
  const { parties, getPartyLedger, formatMoney } = useAccounting();

  const customers = parties.filter(p => p.type === 'CUSTOMER');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [fromDate, setFromDate] = useState<string>('2026-11-01');
  const [toDate, setToDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  // Filtered customer list
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get running ledger transactions for selected customer
  const ledgerTxs = selectedCustomer ? getPartyLedger(selectedCustomer.id, fromDate, toDate) : [];

  const totalDebit = ledgerTxs.reduce((acc, t) => acc + t.debit, 0);
  const totalCredit = ledgerTxs.reduce((acc, t) => acc + t.credit, 0);
  const closingBalance = selectedCustomer ? selectedCustomer.currentBalance : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cream-950 tracking-tight">
            Client Ledgers (Party Khata Statements)
          </h1>
          <p className="text-xs text-cream-500 mt-1">
            Running debit/credit statements for corporate clients, sub-agents, and walk-in passengers with date filtering.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-cream-200 text-cream-800 text-xs font-semibold hover:bg-cream-100 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Khata Statement</span>
          </button>
          <button
            onClick={onOpenNewParty}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs shadow-creamy active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Client</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Client List on Left, Active Ledger on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Customer Selector (1 Col) */}
        <div className="space-y-3">
          <div className="creamy-card p-4 space-y-3">
            <span className="text-xs font-bold text-cream-500 uppercase tracking-wider block">
              Client Accounts ({customers.length})
            </span>

            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cream-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter clients..."
                className="w-full pl-8 pr-2 py-1.5 text-xs bg-cream-50/80 border border-cream-200 rounded-lg text-cream-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredCustomers.map(cust => (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomerId(cust.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedCustomerId === cust.id
                      ? 'bg-cream-900 text-white border-cream-800 shadow-creamy'
                      : 'bg-cream-50/50 border-cream-200 hover:bg-white text-cream-900'
                  }`}
                >
                  <div className="font-bold text-xs">{cust.name}</div>
                  <div className={`text-[10px] mt-0.5 ${selectedCustomerId === cust.id ? 'text-cream-300' : 'text-cream-500'}`}>
                    {cust.companyName || cust.phone}
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-cream-200/40 flex justify-between items-center text-xs">
                    <span className="text-[10px] opacity-70">Balance Due:</span>
                    <span className={`font-mono font-extrabold ${selectedCustomerId === cust.id ? 'text-gold-300' : 'text-amber-900'}`}>
                      {formatMoney(cust.currentBalance)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Statement of Account / Khata Details (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Statement Header Card & Date Filters */}
          <div className="creamy-card p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-4">
              <div>
                <span className="text-[10px] font-bold text-cream-400 uppercase tracking-wider">
                  Statement of Account (Khata)
                </span>
                <h2 className="text-xl font-extrabold text-cream-950 mt-0.5">
                  {selectedCustomer?.name}
                </h2>
                <p className="text-xs text-cream-500">
                  {selectedCustomer?.companyName} • Phone: {selectedCustomer?.phone} • {selectedCustomer?.address}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {selectedCustomer && selectedCustomer.currentBalance > 0 && (
                  <button
                    onClick={() => onReceivePayment(selectedCustomer)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-creamy active:scale-95 transition-all"
                  >
                    <ArrowDownLeft className="w-4 h-4" />
                    <span>Receive Payment (RV)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Date Range Selectors */}
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
                <span className="text-cream-500 text-[11px] block">Current Net Balance:</span>
                <span className="text-lg font-mono font-extrabold text-amber-900">
                  {formatMoney(closingBalance)}
                </span>
              </div>
            </div>
          </div>

          {/* Running Ledger Table */}
          <div className="creamy-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-100/70 border-b border-cream-200 text-cream-600 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-28">Date</th>
                    <th className="py-3 px-3 w-36">Voucher / Ref #</th>
                    <th className="py-3 px-3">Particulars / Description</th>
                    <th className="py-3 px-3 text-right">Debit (Sale)</th>
                    <th className="py-3 px-3 text-right">Credit (Receipt)</th>
                    <th className="py-3 px-4 text-right">Balance Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100 font-mono">
                  {ledgerTxs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-cream-500 font-sans">
                        No transactions recorded for this client in the selected date range.
                      </td>
                    </tr>
                  ) : (
                    ledgerTxs.map(t => (
                      <tr key={t.id} className="hover:bg-cream-50/70 transition-colors">
                        <td className="py-2.5 px-4 text-cream-600">{t.date}</td>
                        <td className="py-2.5 px-3 font-bold text-cream-950">{t.voucherNo}</td>
                        <td className="py-2.5 px-3 font-sans text-cream-800 text-xs">
                          {t.particulars}
                        </td>
                        <td className="py-2.5 px-3 text-right text-rose-900 font-semibold">
                          {t.debit > 0 ? formatMoney(t.debit) : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right text-emerald-800 font-semibold">
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
                    <td className="py-3 px-3 text-right text-rose-900 font-mono">
                      {formatMoney(totalDebit)}
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-900 font-mono">
                      {formatMoney(totalCredit)}
                    </td>
                    <td className="py-3 px-4 text-right text-amber-900 font-mono text-sm">
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
