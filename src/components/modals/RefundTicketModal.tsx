import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { TicketBooking } from '../../types';
import { RotateCcw, X, AlertTriangle } from 'lucide-react';

interface RefundTicketModalProps {
  ticket: TicketBooking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RefundTicketModal: React.FC<RefundTicketModalProps> = ({ ticket, isOpen, onClose }) => {
  const { processRefund, formatCurrency } = useAccounting();

  const [airlinePenalty, setAirlinePenalty] = useState<number>(150);
  const [agencyFee, setAgencyFee] = useState<number>(40);
  const [acmNumber, setAcmNumber] = useState('ACM-' + Math.floor(10000 + Math.random() * 90000));

  if (!isOpen || !ticket) return null;

  const gross = ticket.grossFare;
  const netRefund = Math.max(0, gross - Number(airlinePenalty || 0) - Number(agencyFee || 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await processRefund({
      ticketNumber: ticket.ticketNumber,
      pnr: ticket.pnr,
      passengerName: ticket.passengerName,
      airlineName: ticket.airlineName,
      customerId: ticket.customerId,
      customerName: ticket.customerName,
      originalGrossFare: ticket.grossFare,
      airlineCancellationPenalty: Number(airlinePenalty),
      agencyRefundServiceFee: Number(agencyFee),
      netCustomerRefund: netRefund,
      acmNumber,
      refundDate: new Date().toISOString().split('T')[0]
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl border border-cream-200 shadow-creamy-lg max-w-lg w-full p-6 space-y-4 my-8">
        
        <div className="flex items-center justify-between pb-3 border-b border-cream-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-cream-950">Process Ticket Refund & ACM</h3>
              <p className="text-xs text-cream-500">Calculate airline penalties, agency service fees & client credit</p>
            </div>
          </div>
          <button onClick={onClose} className="text-cream-400 hover:text-cream-800 text-sm font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Ticket Information Bar */}
          <div className="p-3 rounded-xl bg-cream-50/80 border border-cream-200 space-y-1">
            <div className="flex justify-between font-bold text-cream-950">
              <span>{ticket.passengerName}</span>
              <span className="font-mono">{ticket.pnr} ({ticket.airlineName})</span>
            </div>
            <div className="flex justify-between text-cream-500 text-[11px]">
              <span>Ticket: {ticket.ticketNumber} • {ticket.sector}</span>
              <span className="font-semibold text-cream-900">Gross: {formatCurrency(ticket.grossFare)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Airline Cancellation Penalty ($)</label>
              <input
                type="number"
                step="any"
                required
                value={airlinePenalty}
                onChange={(e) => setAirlinePenalty(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg font-mono font-bold text-rose-900"
              />
            </div>

            <div>
              <label className="text-cream-600 font-semibold block mb-1">Agency Refund Processing Fee ($)</label>
              <input
                type="number"
                step="any"
                required
                value={agencyFee}
                onChange={(e) => setAgencyFee(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg font-mono font-bold text-emerald-900"
              />
            </div>
          </div>

          <div>
            <label className="text-cream-600 font-semibold block mb-1">Airline Credit Memo (ACM Number)</label>
            <input
              type="text"
              required
              value={acmNumber}
              onChange={(e) => setAcmNumber(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg font-mono text-cream-900 font-medium"
            />
          </div>

          {/* Refund Calculation Output */}
          <div className="p-4 rounded-xl bg-gold-50/70 border border-gold-300 text-xs space-y-2">
            <div className="flex justify-between text-cream-700">
              <span>Original Gross Ticket Fare:</span>
              <span className="font-mono font-bold">{formatCurrency(gross)}</span>
            </div>
            <div className="flex justify-between text-rose-800">
              <span>Less Airline Penalty Deduction:</span>
              <span className="font-mono font-bold">-{formatCurrency(Number(airlinePenalty))}</span>
            </div>
            <div className="flex justify-between text-emerald-800">
              <span>Less Agency Refund Service Fee (Retained):</span>
              <span className="font-mono font-bold">-{formatCurrency(Number(agencyFee))}</span>
            </div>
            <div className="pt-2 border-t border-gold-300 flex justify-between text-sm font-extrabold text-cream-950">
              <span>Net Refund Credited to Client Ledger:</span>
              <span className="font-mono text-gold-900">{formatCurrency(netRefund)}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-cream-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-cream-200 text-cream-700 font-semibold hover:bg-cream-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-creamy active:scale-95 transition-all"
            >
              Confirm Refund & Post Journal
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
