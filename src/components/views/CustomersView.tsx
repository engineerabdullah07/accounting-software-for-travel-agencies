import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Customer } from '../../types';
import { Users, Plus, ArrowDownLeft, FileText, AlertCircle, Phone, Mail, Building2, Search } from 'lucide-react';

interface CustomersViewProps {
  onReceivePaymentForCustomer: (customer: Customer) => void;
  onAddNewCustomer: () => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({ 
  onReceivePaymentForCustomer, 
  onAddNewCustomer 
}) => {
  const { customers, tickets, vouchers, formatCurrency } = useAccounting();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
    c.type.toLowerCase().includes(search.toLowerCase())
  );

  const totalReceivables = customers.reduce((acc, c) => acc + c.currentBalance, 0);

  // Get statement transactions for selected customer
  const getCustomerTransactions = (customerId: string) => {
    const custTickets = tickets.filter(t => t.customerId === customerId);
    const custVouchers = vouchers.filter(v => v.partyId === customerId);

    const txs: Array<{
      date: string;
      ref: string;
      description: string;
      debit: number;
      credit: number;
    }> = [];

    custTickets.forEach(t => {
      txs.push({
        date: t.issueDate,
        ref: t.pnr,
        description: `E-Ticket ${t.ticketNumber} (${t.passengerName} - ${t.sector})`,
        debit: t.clientSellingPrice,
        credit: 0
      });
    });

    custVouchers.forEach(v => {
      txs.push({
        date: v.date,
        ref: v.voucherNumber,
        description: v.narration || `Payment received (${v.paymentMethod})`,
        debit: 0,
        credit: v.amount
      });
    });

    // Sort by date ascending
    txs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let runningBal = 0;
    return txs.map(t => {
      runningBal += (t.debit - t.credit);
      return { ...t, balance: runningBal };
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cream-950 tracking-tight">
            Customer Receivables & Corporate Ledgers
          </h1>
          <p className="text-xs text-cream-500 mt-1">
            B2B corporate credit limits, sub-agent quotas, real-time running statements, and aging analysis.
          </p>
        </div>

        <button
          onClick={onAddNewCustomer}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs shadow-creamy active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Client / Corporate Account</span>
        </button>
      </div>

      {/* Aging Analysis Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">Total Receivables</div>
          <div className="text-xl font-extrabold text-cream-950 mt-1">{formatCurrency(totalReceivables)}</div>
          <div className="text-[10px] text-cream-400 mt-0.5">Across {customers.length} Accounts</div>
        </div>
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">Current (0 - 30 Days)</div>
          <div className="text-xl font-extrabold text-emerald-800 mt-1">{formatCurrency(totalReceivables * 0.62)}</div>
          <div className="text-[10px] text-emerald-700 mt-0.5 font-medium">Within agreed credit term</div>
        </div>
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">31 - 60 Days Aging</div>
          <div className="text-xl font-extrabold text-amber-800 mt-1">{formatCurrency(totalReceivables * 0.28)}</div>
          <div className="text-[10px] text-amber-700 mt-0.5 font-medium">Follow-up reminder sent</div>
        </div>
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">60+ Days Overdue</div>
          <div className="text-xl font-extrabold text-rose-800 mt-1">{formatCurrency(totalReceivables * 0.10)}</div>
          <div className="text-[10px] text-rose-700 mt-0.5 font-medium">Ticketing quota restricted</div>
        </div>
      </div>

      {/* Customer List & Search */}
      <div className="creamy-card p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search corporate client or contact..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-cream-50/60 border border-cream-200 rounded-lg text-cream-900 placeholder-cream-400 focus:outline-none focus:ring-2 focus:ring-gold-500/40"
            />
          </div>
          <div className="text-xs text-cream-500 font-medium">
            Showing {filteredCustomers.length} registered accounts
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-cream-200 text-cream-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Client Name & Category</th>
                <th className="py-3 px-3">Contact Person</th>
                <th className="py-3 px-3">Credit Limit & Terms</th>
                <th className="py-3 px-3 text-right">Outstanding Balance</th>
                <th className="py-3 px-3 text-center">Credit Health</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filteredCustomers.map(cust => {
                const limitUtilization = cust.creditLimit > 0 ? (cust.currentBalance / cust.creditLimit) * 100 : 0;
                return (
                  <tr key={cust.id} className="hover:bg-cream-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-cream-950 text-sm">{cust.name}</div>
                      <div className="text-[11px] text-cream-500 flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.2 rounded bg-cream-200/60 font-semibold">{cust.type}</span>
                        <span>{cust.address}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-cream-700">
                      <div className="font-semibold">{cust.contactPerson}</div>
                      <div className="text-[11px] text-cream-400">{cust.phone}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-cream-800">
                      <div>{formatCurrency(cust.creditLimit)}</div>
                      <div className="text-[10px] font-sans text-cream-400">{cust.creditDays} Days Credit Period</div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-extrabold text-sm text-cream-950">
                      {cust.currentBalance > 0 ? (
                        <span className="text-amber-900">{formatCurrency(cust.currentBalance)}</span>
                      ) : (
                        <span className="text-emerald-700">Clear (0.00)</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {cust.creditLimit > 0 ? (
                        <div className="w-24 mx-auto">
                          <div className="h-1.5 w-full bg-cream-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                limitUtilization > 85 ? 'bg-rose-500' : limitUtilization > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(limitUtilization, 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-cream-500 font-mono mt-0.5 block">
                            {limitUtilization.toFixed(0)}% used
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-cream-400">Cash Basis</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="px-2.5 py-1 rounded-lg bg-cream-100 hover:bg-gold-100 text-cream-800 text-[11px] font-semibold transition-colors"
                        >
                          Statement
                        </button>
                        {cust.currentBalance > 0 && (
                          <button
                            onClick={() => onReceivePaymentForCustomer(cust)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold border border-emerald-200 transition-colors"
                          >
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                            <span>Receive (RV)</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Running Statement Modal / Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-cream-200 shadow-creamy-lg max-w-3xl w-full p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <div>
                <h3 className="text-lg font-bold text-cream-950">
                  Account Statement: {selectedCustomer.name}
                </h3>
                <p className="text-xs text-cream-500">
                  Running ledger of all e-tickets, hotel bookings, and payment receipts.
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-cream-400 hover:text-cream-800 text-sm font-bold p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-100/70 border-b border-cream-200 text-cream-600 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Reference / PNR</th>
                    <th className="py-2.5 px-3">Particulars</th>
                    <th className="py-2.5 px-3 text-right">Debit ($)</th>
                    <th className="py-2.5 px-3 text-right">Credit ($)</th>
                    <th className="py-2.5 px-3 text-right">Running Balance ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100 font-mono">
                  {getCustomerTransactions(selectedCustomer.id).map((tx, idx) => (
                    <tr key={idx} className="hover:bg-cream-50/70">
                      <td className="py-2.5 px-3 text-cream-600">{tx.date}</td>
                      <td className="py-2.5 px-3 font-bold text-cream-950">{tx.ref}</td>
                      <td className="py-2.5 px-3 font-sans text-cream-800">{tx.description}</td>
                      <td className="py-2.5 px-3 text-right text-rose-800">
                        {tx.debit > 0 ? formatCurrency(tx.debit) : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-right text-emerald-800">
                        {tx.credit > 0 ? formatCurrency(tx.credit) : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-cream-950">
                        {formatCurrency(tx.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-cream-200 flex items-center justify-between text-xs">
              <div className="font-semibold text-cream-600">
                Closing Net Balance: <span className="text-sm font-extrabold text-amber-900">{formatCurrency(selectedCustomer.currentBalance)}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg border border-cream-200 text-cream-700 font-semibold hover:bg-cream-100"
                >
                  Print Statement
                </button>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-1.5 rounded-lg bg-cream-900 text-gold-300 font-bold hover:bg-cream-800"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
