import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { TicketBooking, GdsSystem, TicketStatus } from '../../types';
import { 
  Plane, 
  Search, 
  Plus, 
  Printer, 
  RotateCcw, 
  CheckCircle, 
  Filter, 
  ArrowUpDown,
  FileText,
  DollarSign
} from 'lucide-react';

interface TicketsViewProps {
  onOpenQuickAction: (actionType: 'ticket') => void;
  onPrintTicket: (ticket: TicketBooking) => void;
  onRefundTicket: (ticket: TicketBooking) => void;
}

export const TicketsView: React.FC<TicketsViewProps> = ({ 
  onOpenQuickAction, 
  onPrintTicket, 
  onRefundTicket 
}) => {
  const { tickets, formatCurrency } = useAccounting();

  const [search, setSearch] = useState('');
  const [selectedGds, setSelectedGds] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Filtered tickets
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.pnr.toLowerCase().includes(search.toLowerCase()) ||
      t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.passengerName.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase()) ||
      t.airlineName.toLowerCase().includes(search.toLowerCase()) ||
      t.sector.toLowerCase().includes(search.toLowerCase());

    const matchesGds = selectedGds === 'ALL' || t.gds === selectedGds;
    const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;

    return matchesSearch && matchesGds && matchesStatus;
  });

  // Financial aggregates
  const totalGross = filteredTickets.reduce((acc, t) => acc + t.grossFare, 0);
  const totalCommission = filteredTickets.reduce((acc, t) => acc + t.airlineCommissionAmount, 0);
  const totalMarkup = filteredTickets.reduce((acc, t) => acc + t.markupAmount, 0);
  const totalProfit = totalCommission + totalMarkup;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cream-950 tracking-tight">
            Air Ticketing & GDS PNR Management
          </h1>
          <p className="text-xs text-cream-500 mt-1">
            Amadeus, Sabre, Galileo, and Direct NDC booking reconciliation with automatic GL posting.
          </p>
        </div>

        <button
          onClick={() => onOpenQuickAction('ticket')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs shadow-creamy active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Issue New Air Ticket</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">Filtered Tickets</div>
          <div className="text-xl font-extrabold text-cream-950 mt-1">{filteredTickets.length}</div>
          <div className="text-[10px] text-cream-400 mt-0.5">Total across active filters</div>
        </div>
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">Gross Ticket Sales</div>
          <div className="text-xl font-extrabold text-cream-950 mt-1">{formatCurrency(totalGross)}</div>
          <div className="text-[10px] text-cream-400 mt-0.5">Base Fare + Airline Taxes</div>
        </div>
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">Airline Commissions</div>
          <div className="text-xl font-extrabold text-emerald-800 mt-1">{formatCurrency(totalCommission)}</div>
          <div className="text-[10px] text-cream-400 mt-0.5">Retained from airline gross</div>
        </div>
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">Net Agency Profit</div>
          <div className="text-xl font-extrabold text-emerald-900 mt-1">{formatCurrency(totalProfit)}</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Commission + Client Markup</div>
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
            placeholder="Search PNR, Ticket No, Pax, Airline..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-cream-50/60 border border-cream-200 rounded-lg text-cream-900 placeholder-cream-400 focus:outline-none focus:ring-2 focus:ring-gold-500/40"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* GDS Filter */}
          <select
            value={selectedGds}
            onChange={(e) => setSelectedGds(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-cream-200 rounded-lg text-cream-800 focus:outline-none focus:ring-2 focus:ring-gold-500/40 font-medium"
          >
            <option value="ALL">All GDS Systems</option>
            <option value="Amadeus">Amadeus</option>
            <option value="Sabre">Sabre</option>
            <option value="Galileo">Galileo</option>
            <option value="Direct NDC">Direct NDC</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-cream-200 rounded-lg text-cream-800 focus:outline-none focus:ring-2 focus:ring-gold-500/40 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="ISSUED">Issued</option>
            <option value="REFUNDED">Refunded</option>
            <option value="VOID">Voided</option>
          </select>
        </div>

      </div>

      {/* Tickets Master Table */}
      <div className="creamy-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-cream-200 text-cream-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">PNR / E-Ticket</th>
                <th className="py-3 px-3">Passenger & Client</th>
                <th className="py-3 px-3">Sector & Date</th>
                <th className="py-3 px-3">Airline & GDS</th>
                <th className="py-3 px-3 text-right">Base / Taxes</th>
                <th className="py-3 px-3 text-right">Gross Fare</th>
                <th className="py-3 px-3 text-right">Net Payable</th>
                <th className="py-3 px-3 text-right">Selling Price</th>
                <th className="py-3 px-3 text-right">Profit</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-xs text-cream-500">
                    No air ticket bookings match your query.
                  </td>
                </tr>
              ) : (
                filteredTickets.map(tkt => (
                  <tr key={tkt.id} className="hover:bg-cream-50/70 transition-colors">
                    
                    {/* PNR & Ticket */}
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-cream-950 text-sm">{tkt.pnr}</div>
                      <div className="text-[11px] text-cream-500">{tkt.ticketNumber}</div>
                    </td>

                    {/* Passenger & Client */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-cream-950">{tkt.passengerName}</div>
                      <div className="text-[11px] text-cream-500 flex items-center gap-1">
                        <span>{tkt.customerName}</span>
                        <span className="text-[10px] px-1 py-0.2 rounded bg-cream-200/60 font-semibold">{tkt.cabinClass}</span>
                      </div>
                    </td>

                    {/* Sector & Travel Date */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-sky-900 font-mono text-[11px] bg-sky-50 px-2 py-0.5 rounded border border-sky-100 inline-block">
                        {tkt.sector}
                      </div>
                      <div className="text-[11px] text-cream-400 mt-0.5">{tkt.flightDate}</div>
                    </td>

                    {/* Airline & GDS */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-cream-900">{tkt.airlineName}</div>
                      <div className="text-[10px] text-cream-500 font-mono">{tkt.gds} ({tkt.airlineCode})</div>
                    </td>

                    {/* Base & Taxes */}
                    <td className="py-3 px-3 text-right font-mono text-cream-600">
                      <div>{formatCurrency(tkt.baseFare)}</div>
                      <div className="text-[10px] text-cream-400">+{formatCurrency(tkt.taxes)} tx</div>
                    </td>

                    {/* Gross Fare */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-cream-900">
                      {formatCurrency(tkt.grossFare)}
                    </td>

                    {/* Net Payable to Airline */}
                    <td className="py-3 px-3 text-right font-mono text-cream-700">
                      <div>{formatCurrency(tkt.netCostToAirline)}</div>
                      <div className="text-[10px] text-cream-400 font-sans">Comm: {tkt.airlineCommissionPercent}%</div>
                    </td>

                    {/* Customer Selling Price */}
                    <td className="py-3 px-3 text-right font-mono font-extrabold text-cream-950">
                      {formatCurrency(tkt.clientSellingPrice)}
                      <div className="text-[10px] font-sans font-semibold text-cream-500">
                        {tkt.paymentStatus}
                      </div>
                    </td>

                    {/* Net Profit */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-800">
                      +{formatCurrency(tkt.airlineCommissionAmount + tkt.markupAmount)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tkt.status === 'ISSUED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : tkt.status === 'REFUNDED'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-cream-100 text-cream-600 border border-cream-200'
                      }`}>
                        {tkt.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onPrintTicket(tkt)}
                          title="Print Travel Invoice & E-Ticket"
                          className="p-1.5 rounded-lg bg-cream-100 hover:bg-gold-100 text-cream-700 hover:text-gold-900 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {tkt.status === 'ISSUED' && (
                          <button
                            onClick={() => onRefundTicket(tkt)}
                            title="Process Refund & Calculate Penalties"
                            className="p-1.5 rounded-lg bg-cream-100 hover:bg-rose-100 text-cream-700 hover:text-rose-900 transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
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
