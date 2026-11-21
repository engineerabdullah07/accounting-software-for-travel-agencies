import React from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { TicketBooking } from '../../types';
import { Plane, Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';

interface PrintInvoiceModalProps {
  ticket: TicketBooking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintInvoiceModal: React.FC<PrintInvoiceModalProps> = ({ ticket, isOpen, onClose }) => {
  const { formatCurrency } = useAccounting();

  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl border border-cream-200 shadow-creamy-lg max-w-3xl w-full p-8 space-y-6 my-8 print:p-0 print:border-0 print:shadow-none">
        
        {/* Top Action Bar (Hidden on print) */}
        <div className="flex items-center justify-between pb-4 border-b border-cream-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cream-500 uppercase tracking-wider">
              Travel Tax Invoice & E-Ticket Voucher
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs shadow-creamy active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-cream-200 text-cream-400 hover:text-cream-800 text-xs font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="space-y-6 text-cream-900 font-sans">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-cream-900 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cream-900 text-gold-400 flex items-center justify-center">
                  <Plane className="w-4 h-4 -rotate-45" />
                </div>
                <h1 className="text-xl font-extrabold tracking-tight text-cream-950">
                  SkyHorizon Travels & Tourism LLC
                </h1>
              </div>
              <p className="text-xs text-cream-600 mt-1">
                IATA Accredited Agent • Code: <strong>27-2-8910</strong>
              </p>
              <p className="text-[11px] text-cream-500">
                Suite 401, Al-Saad Aviation Tower, Mall Road, Lahore • Phone: +92 42 3578 9900
              </p>
              <p className="text-[11px] text-cream-500">
                NTN # 4920194-8 • STRN # 32-00-4920 • www.skyhorizontravels.com
              </p>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 rounded bg-cream-100 font-mono text-xs font-extrabold text-cream-900 border border-cream-200">
                TAX INVOICE
              </span>
              <div className="text-base font-extrabold font-mono text-cream-950 mt-2">
                INV-2026-{ticket.pnr}
              </div>
              <div className="text-xs text-cream-500 mt-0.5">
                Date: {ticket.issueDate}
              </div>
              <div className="text-xs text-cream-500">
                GDS: {ticket.gds} System
              </div>
            </div>
          </div>

          {/* Bill To & Passenger Info */}
          <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-cream-50/70 border border-cream-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-cream-400 uppercase tracking-wider block mb-1">
                Billed Client / Corporate Account:
              </span>
              <div className="font-extrabold text-cream-950 text-sm">{ticket.customerName}</div>
              <div className="text-cream-600 mt-0.5">Corporate Account Reference</div>
              <div className="text-cream-500">Payment Status: <strong className="text-cream-900">{ticket.paymentStatus}</strong></div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-cream-400 uppercase tracking-wider block mb-1">
                Passenger & E-Ticket Details:
              </span>
              <div className="font-extrabold text-cream-950 text-sm">{ticket.passengerName}</div>
              <div className="text-cream-600 font-mono mt-0.5">E-Ticket #: {ticket.ticketNumber}</div>
              <div className="text-cream-600 font-mono">PNR: <strong className="text-gold-800">{ticket.pnr}</strong> • Cabin: {ticket.cabinClass}</div>
            </div>
          </div>

          {/* Itinerary Routing */}
          <div className="border border-cream-200 rounded-xl overflow-hidden">
            <div className="bg-cream-100/80 px-4 py-2 border-b border-cream-200 text-[11px] font-bold text-cream-700 uppercase">
              Flight Itinerary & Sector Information
            </div>
            <div className="p-4 grid grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-cream-400 text-[10px] block">Sector</span>
                <span className="font-mono font-bold text-cream-950 text-sm">{ticket.sector}</span>
              </div>
              <div>
                <span className="text-cream-400 text-[10px] block">Carrier</span>
                <span className="font-semibold text-cream-900">{ticket.airlineName} ({ticket.airlineCode})</span>
              </div>
              <div>
                <span className="text-cream-400 text-[10px] block">Departure Date</span>
                <span className="font-semibold text-cream-900">{ticket.flightDate}</span>
              </div>
              <div>
                <span className="text-cream-400 text-[10px] block">Ticket Status</span>
                <span className="font-bold text-emerald-800">{ticket.status}</span>
              </div>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <table className="w-full text-left text-xs border border-cream-200 rounded-xl overflow-hidden">
            <thead className="bg-cream-100/80 border-b border-cream-200 text-cream-600 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-2.5 px-4">Item Description</th>
                <th className="py-2.5 px-4 text-right">Taxable Amount</th>
                <th className="py-2.5 px-4 text-right">Airline Taxes</th>
                <th className="py-2.5 px-4 text-right">Agency Fee</th>
                <th className="py-2.5 px-4 text-right">Total Net ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100 font-mono">
              <tr>
                <td className="py-3 px-4 font-sans font-medium text-cream-950">
                  Electronic Air Passenger Ticket ({ticket.sector})
                  <div className="text-[11px] text-cream-500 font-mono">{ticket.passengerName}</div>
                </td>
                <td className="py-3 px-4 text-right">{formatCurrency(ticket.baseFare)}</td>
                <td className="py-3 px-4 text-right">{formatCurrency(ticket.taxes)}</td>
                <td className="py-3 px-4 text-right">{formatCurrency(ticket.markupAmount)}</td>
                <td className="py-3 px-4 text-right font-bold text-cream-950">
                  {formatCurrency(ticket.clientSellingPrice)}
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-cream-50 font-bold border-t border-cream-200">
              <tr>
                <td colSpan={4} className="py-3 px-4 text-right font-sans uppercase text-xs">
                  Total Payable Amount:
                </td>
                <td className="py-3 px-4 text-right text-base font-extrabold text-gold-900 font-mono">
                  {formatCurrency(ticket.clientSellingPrice)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Bank Wire Settlement Instructions */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-cream-200 bg-cream-50/50 text-[11px]">
            <div>
              <span className="font-bold text-cream-900 block mb-1">Direct Bank Remittance Instructions:</span>
              <p className="text-cream-600">Bank: Commercial Bank Operating Branch</p>
              <p className="text-cream-600 font-mono">IBAN: PK36COMB0001030492019482</p>
              <p className="text-cream-600 font-mono">Account Title: SkyHorizon Travels & Tourism LLC</p>
            </div>
            <div className="flex flex-col justify-between text-right">
              <div className="text-cream-500">
                This is a computer-generated tax invoice verified by IATA electronic ledger. No signature required.
              </div>
              <div className="font-semibold text-cream-900">
                Authorized Signatory: ________________________
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
