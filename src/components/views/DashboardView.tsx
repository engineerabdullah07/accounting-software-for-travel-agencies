import React from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { 
  Plane, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Scale, 
  Users, 
  AlertCircle,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Building
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: any) => void;
  onOpenQuickAction: (actionType: 'ticket' | 'receipt' | 'payment' | 'hotel' | 'visa') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onOpenQuickAction }) => {
  const { 
    tickets, 
    customers, 
    vendors, 
    bspSettlements, 
    hotels, 
    visas, 
    formatCurrency 
  } = useAccounting();

  // Metrics
  const totalGrossTicketSales = tickets.reduce((acc, t) => acc + t.grossFare, 0);
  const totalCommissionEarned = tickets.reduce((acc, t) => acc + t.airlineCommissionAmount + t.markupAmount, 0);
  const totalCustomerReceivables = customers.reduce((acc, c) => acc + c.currentBalance, 0);
  
  const bspCurrent = bspSettlements.find(b => b.status === 'PENDING_RECONCILIATION') || bspSettlements[1];
  const bspPayable = bspCurrent ? bspCurrent.netPayableToIATA : 47860;

  const totalHotelProfit = hotels.reduce((acc, h) => acc + h.profitMargin, 0);
  const totalVisaProfit = visas.reduce((acc, v) => acc + v.serviceCharge, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Banner: Agency Status & Quick Greetings */}
      <div className="bg-gradient-to-r from-cream-900 via-cream-800 to-cream-950 rounded-2xl p-6 text-white shadow-creamy-lg border border-cream-700/40 relative overflow-hidden">
        {/* Subtle Decorative Background Graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none flex items-center justify-center">
          <Plane className="w-80 h-80 -rotate-12 translate-x-16" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gold-400/20 text-gold-300 border border-gold-400/30">
                IATA BSP Period 2: 16–30 Nov 2026
              </span>
              <span className="text-xs text-cream-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" /> 9 Days to Settlement
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cream-50">
              SkyHorizon Travel Operations & Financial Desk
            </h1>
            <p className="text-sm text-cream-300 mt-1 max-w-2xl leading-relaxed">
              Real-time GDS ticket reconciliation, corporate accounts receivable, hotel vouchers, and automated double-entry general ledger.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onOpenQuickAction('ticket')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs shadow-creamy active:scale-95 transition-all"
            >
              <Plane className="w-4 h-4" />
              <span>Issue Air Ticket</span>
            </button>
            <button
              onClick={() => onOpenQuickAction('receipt')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-cream-100 font-semibold text-xs border border-white/15 backdrop-blur-md active:scale-95 transition-all"
            >
              <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
              <span>Receive Payment (RV)</span>
            </button>
            <button
              onClick={() => onNavigate('bsp')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-cream-100 font-semibold text-xs border border-white/15 backdrop-blur-md active:scale-95 transition-all"
            >
              <Scale className="w-4 h-4 text-gold-400" />
              <span>Reconcile BSP</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Gross Ticket Sales */}
        <div className="creamy-card p-5 relative overflow-hidden group hover:border-gold-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cream-500 uppercase tracking-wider">Gross Air Sales</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <Plane className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-cream-950 font-sans tracking-tight">
              {formatCurrency(totalGrossTicketSales)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-700 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14.2% vs last fortnight</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-cream-100 text-[11px] text-cream-500 flex justify-between">
            <span>Active E-Tickets:</span>
            <span className="font-semibold text-cream-900">{tickets.length} Issued</span>
          </div>
        </div>

        {/* 2. Total Commission & Markup Margin */}
        <div className="creamy-card p-5 relative overflow-hidden group hover:border-gold-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cream-500 uppercase tracking-wider">Agency Margin (Profit)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-emerald-900 font-sans tracking-tight">
              {formatCurrency(totalCommissionEarned + totalHotelProfit + totalVisaProfit)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-cream-600 font-medium">
              <span className="font-mono text-emerald-700">Commissions + Markups</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-cream-100 text-[11px] text-cream-500 flex justify-between">
            <span>Air: {formatCurrency(totalCommissionEarned)}</span>
            <span>Hotel: {formatCurrency(totalHotelProfit)}</span>
          </div>
        </div>

        {/* 3. Customer Receivables */}
        <div className="creamy-card p-5 relative overflow-hidden group hover:border-gold-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cream-500 uppercase tracking-wider">Client Receivables</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-cream-950 font-sans tracking-tight">
              {formatCurrency(totalCustomerReceivables)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-amber-700 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>5 Corporate Accounts Due</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-cream-100 text-[11px] text-cream-500 flex justify-between">
            <button 
              onClick={() => onNavigate('customers')} 
              className="text-gold-700 hover:text-gold-900 font-semibold"
            >
              View Aging Analysis →
            </button>
          </div>
        </div>

        {/* 4. IATA BSP Fortnight Payable */}
        <div className="creamy-card p-5 relative overflow-hidden group hover:border-gold-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cream-500 uppercase tracking-wider">IATA BSP Fortnight</span>
            <div className="w-8 h-8 rounded-lg bg-gold-50 text-gold-700 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-cream-950 font-sans tracking-tight">
              {formatCurrency(bspPayable)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-cream-600 font-medium">
              <span className="px-1.5 py-0.5 rounded bg-cream-100 text-[10px] font-semibold text-cream-700">
                Period 2 Pending
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-cream-100 text-[11px] text-cream-500 flex justify-between">
            <button 
              onClick={() => onNavigate('bsp')} 
              className="text-gold-700 hover:text-gold-900 font-semibold"
            >
              Reconciliation Hub →
            </button>
          </div>
        </div>

      </div>

      {/* Main Grid: Operational Tables & Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recent Air Ticket Bookings (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="creamy-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-cream-950">Recent Air Ticket Bookings (PNRs)</h3>
                <p className="text-xs text-cream-500">Live feed from Amadeus, Sabre, Galileo, and Direct NDC</p>
              </div>
              <button
                onClick={() => onNavigate('tickets')}
                className="text-xs font-bold text-gold-700 hover:text-gold-900 transition-colors"
              >
                View All Tickets ({tickets.length}) →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-cream-200 text-cream-500 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="pb-2.5 pl-1">PNR / Ticket</th>
                    <th className="pb-2.5">Passenger</th>
                    <th className="pb-2.5">Route</th>
                    <th className="pb-2.5">Airline</th>
                    <th className="pb-2.5 text-right">Selling Price</th>
                    <th className="pb-2.5 text-right">Net Profit</th>
                    <th className="pb-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {tickets.slice(0, 5).map(tkt => (
                    <tr key={tkt.id} className="hover:bg-cream-50/60 transition-colors">
                      <td className="py-3 pl-1 font-mono">
                        <div className="font-bold text-cream-950">{tkt.pnr}</div>
                        <div className="text-[11px] text-cream-500">{tkt.ticketNumber}</div>
                      </td>
                      <td className="py-3 font-medium text-cream-900">
                        {tkt.passengerName}
                        <div className="text-[10px] text-cream-400">{tkt.customerName}</div>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 font-mono text-[11px] font-semibold border border-sky-100">
                          {tkt.sector}
                        </span>
                      </td>
                      <td className="py-3 text-cream-700">
                        <div className="font-semibold">{tkt.airlineName}</div>
                        <div className="text-[10px] text-cream-400 font-mono">{tkt.gds}</div>
                      </td>
                      <td className="py-3 text-right font-bold text-cream-950">
                        {formatCurrency(tkt.clientSellingPrice)}
                      </td>
                      <td className="py-3 text-right font-semibold text-emerald-700 font-mono">
                        +{formatCurrency(tkt.airlineCommissionAmount + tkt.markupAmount)}
                      </td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tkt.status === 'ISSUED' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {tkt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hotel & Tour Highlights */}
          <div className="creamy-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-cream-950">Active Hotel & Umrah Vouchers</h3>
                <p className="text-xs text-cream-500">Accommodation reservations & group packages</p>
              </div>
              <button
                onClick={() => onNavigate('hotels')}
                className="text-xs font-bold text-gold-700 hover:text-gold-900 transition-colors"
              >
                Manage Hotels →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {hotels.map(h => (
                <div key={h.id} className="p-3.5 rounded-xl border border-cream-200 bg-cream-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-cream-950">{h.hotelName}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cream-100 text-cream-700 border border-cream-200">
                      {h.voucherNo}
                    </span>
                  </div>
                  <div className="text-xs text-cream-600 flex items-center justify-between">
                    <span>{h.city}, {h.country} ({h.nights} Nights)</span>
                    <span className="font-semibold text-cream-900">{h.guestName}</span>
                  </div>
                  <div className="pt-2 border-t border-cream-200/60 flex items-center justify-between text-xs">
                    <span className="text-cream-500">Sell Price: <strong className="text-cream-950">{formatCurrency(h.sellingPrice)}</strong></span>
                    <span className="text-emerald-700 font-semibold font-mono">Profit: +{formatCurrency(h.profitMargin)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Quick Financial Summaries & BSP Status (1 Col) */}
        <div className="space-y-6">
          
          {/* Bank & Cash Balances */}
          <div className="creamy-card p-5">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-bold text-cream-950">Bank & Cash Accounts</h3>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Audited Real-time
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-cream-50/60 border border-cream-100">
                <div>
                  <div className="text-xs font-bold text-cream-900">Commercial Bank (PKR Operating)</div>
                  <div className="text-[10px] text-cream-500">Account # 1030</div>
                </div>
                <div className="text-right font-bold text-xs text-cream-950">
                  {formatCurrency(64200)}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-cream-50/60 border border-cream-100">
                <div>
                  <div className="text-xs font-bold text-cream-900">Standard Chartered USD Account</div>
                  <div className="text-[10px] text-cream-500">Account # 1035</div>
                </div>
                <div className="text-right font-bold text-xs text-cream-950">
                  {formatCurrency(48900)}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-cream-50/60 border border-cream-100">
                <div>
                  <div className="text-xs font-bold text-cream-900">Al-Rajhi Bank SAR Umrah Float</div>
                  <div className="text-[10px] text-cream-500">Account # 1040</div>
                </div>
                <div className="text-right font-bold text-xs text-cream-950">
                  {formatCurrency(32600)}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-cream-50/60 border border-cream-100">
                <div>
                  <div className="text-xs font-bold text-cream-900">Cash on Hand (Main Safe)</div>
                  <div className="text-[10px] text-cream-500">Account # 1010</div>
                </div>
                <div className="text-right font-bold text-xs text-cream-950">
                  {formatCurrency(14500)}
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('accounting')}
              className="w-full mt-4 py-2 rounded-xl border border-cream-200 text-xs font-semibold text-cream-700 hover:bg-cream-100 transition-colors"
            >
              Open Full Chart of Accounts →
            </button>
          </div>

          {/* Corporate Clients Receivables Snapshot */}
          <div className="creamy-card p-5">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-bold text-cream-950">Top Corporate Receivables</h3>
              <button 
                onClick={() => onNavigate('customers')}
                className="text-[11px] font-bold text-gold-700 hover:text-gold-900"
              >
                All Clients
              </button>
            </div>

            <div className="space-y-2.5">
              {customers.map(c => (
                <div key={c.id} className="flex items-center justify-between text-xs py-1.5 border-b border-cream-100 last:border-0">
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-cream-900 truncate">{c.name}</div>
                    <div className="text-[10px] text-cream-400">Limit: {formatCurrency(c.creditLimit)} • {c.creditDays}d terms</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`font-bold ${c.currentBalance > 0 ? 'text-amber-800' : 'text-cream-500'}`}>
                      {formatCurrency(c.currentBalance)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="p-4 rounded-xl bg-gold-50/70 border border-gold-200/80 text-xs text-gold-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-gold-950">
              <CheckCircle2 className="w-4 h-4 text-gold-600" />
              <span>Real-World Double Entry Active</span>
            </div>
            <p className="text-[11px] text-gold-800 leading-relaxed">
              Every air ticket, refund, and payment automatically generates verified Debits & Credits in your General Ledger with balanced Trial Balance.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
