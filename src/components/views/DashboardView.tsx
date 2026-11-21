import React from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { 
  Building2, 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  TrendingUp, 
  Users, 
  Receipt, 
  CreditCard,
  Plus
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: any) => void;
  onOpenQuickAction: (actionType: 'sale' | 'receipt' | 'payment') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onOpenQuickAction }) => {
  const { 
    accounts, 
    parties, 
    salesInvoices, 
    vouchers, 
    formatMoney 
  } = useAccounting();

  // Metrics
  const cashAccounts = accounts.filter(a => a.category === 'ASSET' && a.subCategory === 'Cash & Cash Equivalents');
  const bankAccounts = accounts.filter(a => a.category === 'ASSET' && a.subCategory === 'Bank Accounts');

  const totalCashInHand = cashAccounts.reduce((acc, a) => acc + a.balance, 0);
  const totalBankBalances = bankAccounts.reduce((acc, a) => acc + a.balance, 0);

  const customers = parties.filter(p => p.type === 'CUSTOMER');
  const suppliers = parties.filter(p => p.type === 'SUPPLIER');

  const totalClientReceivables = customers.reduce((acc, c) => acc + c.currentBalance, 0);
  const totalSupplierPayables = suppliers.reduce((acc, s) => acc + s.currentBalance, 0);

  const totalSalesRevenue = salesInvoices.reduce((acc, s) => acc + s.totalSale, 0);
  const totalGrossProfit = salesInvoices.reduce((acc, s) => acc + s.totalProfit, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cream-900 via-cream-800 to-cream-950 rounded-2xl p-6 text-white shadow-creamy-lg border border-cream-700/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-400/20 text-gold-300 border border-gold-400/30 uppercase tracking-wider">
                Travel Agency Accounting Desk
              </span>
              <span className="text-xs text-cream-400">Pure Double-Entry • No GDS API Needed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cream-50">
              Accounts, Khatas & Ledgers Dashboard
            </h1>
            <p className="text-xs text-cream-300 mt-1 max-w-xl leading-relaxed">
              Ticket sales billing, supplier payables, client running statements, cash/bank books, and balanced trial balance.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onOpenQuickAction('sale')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs shadow-creamy active:scale-95 transition-all"
            >
              <Receipt className="w-4 h-4" />
              <span>New Sales Invoice</span>
            </button>
            <button
              onClick={() => onOpenQuickAction('receipt')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-creamy active:scale-95 transition-all"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Receive Payment (RV)</span>
            </button>
            <button
              onClick={() => onOpenQuickAction('payment')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-cream-100 font-semibold text-xs border border-white/15 backdrop-blur-md active:scale-95 transition-all"
            >
              <ArrowUpRight className="w-4 h-4 text-rose-400" />
              <span>Pay Supplier (PV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Cash in Hand */}
        <div className="creamy-card p-5 group hover:border-gold-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cream-500 uppercase tracking-wider">Cash in Hand (Safe)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-cream-950 font-sans tracking-tight">
              {formatMoney(totalCashInHand)}
            </div>
            <div className="text-[11px] text-cream-500 mt-1">Main Safe + Front Desk Counter</div>
          </div>
          <div className="mt-3 pt-3 border-t border-cream-100 text-[11px]">
            <button onClick={() => onNavigate('cashBank')} className="text-gold-700 hover:text-gold-900 font-semibold">
              Open Cash Book →
            </button>
          </div>
        </div>

        {/* Bank Balances */}
        <div className="creamy-card p-5 group hover:border-gold-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cream-500 uppercase tracking-wider">Total Bank Balances</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-cream-950 font-sans tracking-tight">
              {formatMoney(totalBankBalances)}
            </div>
            <div className="text-[11px] text-cream-500 mt-1">Meezan Bank, HBL & USD Accounts</div>
          </div>
          <div className="mt-3 pt-3 border-t border-cream-100 text-[11px]">
            <button onClick={() => onNavigate('cashBank')} className="text-gold-700 hover:text-gold-900 font-semibold">
              View Bank Registers →
            </button>
          </div>
        </div>

        {/* Client Receivables (Outstandings) */}
        <div className="creamy-card p-5 group hover:border-gold-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cream-500 uppercase tracking-wider">Client Outstandings</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-amber-900 font-sans tracking-tight">
              {formatMoney(totalClientReceivables)}
            </div>
            <div className="text-[11px] text-cream-500 mt-1">Receivable across {customers.length} client khatas</div>
          </div>
          <div className="mt-3 pt-3 border-t border-cream-100 text-[11px]">
            <button onClick={() => onNavigate('clientLedgers')} className="text-gold-700 hover:text-gold-900 font-semibold">
              Client Ledgers & Statements →
            </button>
          </div>
        </div>

        {/* Supplier & Airline Payables */}
        <div className="creamy-card p-5 group hover:border-gold-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cream-500 uppercase tracking-wider">Supplier & Airline Payables</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-rose-900 font-sans tracking-tight">
              {formatMoney(totalSupplierPayables)}
            </div>
            <div className="text-[11px] text-cream-500 mt-1">Owed to IATA BSP, Fly365 & Hotels</div>
          </div>
          <div className="mt-3 pt-3 border-t border-cream-100 text-[11px]">
            <button onClick={() => onNavigate('supplierLedgers')} className="text-gold-700 hover:text-gold-900 font-semibold">
              Supplier Statements →
            </button>
          </div>
        </div>

      </div>

      {/* Main Grid: Recent Sales Invoices & Recent Vouchers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Recent Invoices (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="creamy-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-cream-950">Recent Travel Sales Invoices</h3>
                <p className="text-xs text-cream-500">Air tickets, hotels, Umrah groups, and visas billed to clients</p>
              </div>
              <button
                onClick={() => onNavigate('sales')}
                className="text-xs font-bold text-gold-700 hover:text-gold-900 transition-colors"
              >
                All Sales Invoices ({salesInvoices.length}) →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-cream-200 text-cream-500 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="pb-2.5 pl-1">Invoice #</th>
                    <th className="pb-2.5">Date</th>
                    <th className="pb-2.5">Client Name</th>
                    <th className="pb-2.5">Services / PNR</th>
                    <th className="pb-2.5 text-right">Sale Total</th>
                    <th className="pb-2.5 text-right">Profit</th>
                    <th className="pb-2.5 text-right">Balance Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {salesInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-cream-50/70 transition-colors">
                      <td className="py-3 pl-1 font-mono font-bold text-cream-950">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3 text-cream-600 font-mono text-[11px]">{inv.date}</td>
                      <td className="py-3 font-semibold text-cream-900">{inv.customerName}</td>
                      <td className="py-3 text-cream-600">
                        {inv.items.map(i => i.pnr ? `${i.pnr} (${i.passengerName})` : i.description).join(', ')}
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-cream-950">
                        {formatMoney(inv.totalSale)}
                      </td>
                      <td className="py-3 text-right font-mono font-semibold text-emerald-800">
                        +{formatMoney(inv.totalProfit)}
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-amber-900">
                        {inv.balanceDue > 0 ? formatMoney(inv.balanceDue) : <span className="text-emerald-700 font-normal">Paid</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Recent Vouchers & Roznamcha Snapshot (1 Col) */}
        <div className="space-y-6">
          <div className="creamy-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-cream-950">Recent Cash & Bank Vouchers</h3>
                <p className="text-[11px] text-cream-500">Receipts (RV) & Payments (PV)</p>
              </div>
              <button
                onClick={() => onNavigate('vouchers')}
                className="text-xs font-bold text-gold-700 hover:text-gold-900"
              >
                View All →
              </button>
            </div>

            <div className="space-y-2.5">
              {vouchers.slice(0, 5).map(v => (
                <div key={v.id} className="p-3 rounded-xl bg-cream-50/60 border border-cream-100 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-cream-950">{v.voucherNumber}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      v.type === 'RV' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {v.type === 'RV' ? 'Receipt' : 'Payment'}
                    </span>
                  </div>
                  <div className="text-xs text-cream-700 font-medium">{v.partyName || v.debitAccountName}</div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-cream-100">
                    <span className="text-cream-400 font-mono">{v.date}</span>
                    <span className="font-mono font-bold text-cream-950">{formatMoney(v.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Double-Entry Compliance Box */}
          <div className="p-4 rounded-xl bg-gold-50/80 border border-gold-200 text-xs text-gold-950 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5">
              <span>Balanced Double-Entry Bookkeeping</span>
            </div>
            <p className="text-[11px] text-gold-900 leading-relaxed">
              Whenever you enter a ticket sale, hotel booking, or voucher, your client statement, supplier khata, cash/bank register, and general ledger update in real time.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
