import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { GdsSystem } from '../../types';
import { Plane, X, DollarSign, Calculator, CheckCircle2 } from 'lucide-react';

interface IssueTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IssueTicketModal: React.FC<IssueTicketModalProps> = ({ isOpen, onClose }) => {
  const { customers, vendors, issueTicket, formatCurrency } = useAccounting();

  const [pnr, setPnr] = useState('EK' + Math.floor(1000 + Math.random() * 9000));
  const [ticketNumber, setTicketNumber] = useState('176-' + Math.floor(1000000000 + Math.random() * 9000000000));
  const [gds, setGds] = useState<GdsSystem>('Amadeus');
  const [airlineName, setAirlineName] = useState('Emirates');
  const [airlineCode, setAirlineCode] = useState('EK');
  const [passengerName, setPassengerName] = useState('MR AHMED / KHAN');
  const [sector, setSector] = useState('DXB-LHR-DXB');
  const [cabinClass, setCabinClass] = useState<'Economy' | 'Premium Economy' | 'Business' | 'First'>('Economy');
  const [flightDate, setFlightDate] = useState('2026-12-15');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);

  const [baseFare, setBaseFare] = useState<number>(1200);
  const [taxes, setTaxes] = useState<number>(280);
  const [commPercent, setCommPercent] = useState<number>(5);
  const [markup, setMarkup] = useState<number>(60);
  const [paidAmount, setPaidAmount] = useState<number>(0);

  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [selectedVendorId, setSelectedVendorId] = useState(vendors[0]?.id || '');

  if (!isOpen) return null;

  // Real-time fare calculations
  const grossFare = Number(baseFare || 0) + Number(taxes || 0);
  const commAmount = (Number(baseFare || 0) * Number(commPercent || 0)) / 100;
  const netCostToAirline = grossFare - commAmount;
  const sellingPrice = grossFare + Number(markup || 0);
  const profit = commAmount + Number(markup || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === selectedCustomerId) || customers[0];

    await issueTicket({
      pnr: pnr.toUpperCase(),
      ticketNumber,
      gds,
      airlineCode,
      airlineName,
      passengerName: passengerName.toUpperCase(),
      passengerType: 'Adult',
      sector: sector.toUpperCase(),
      flightDate,
      issueDate,
      cabinClass,
      baseFare: Number(baseFare),
      taxes: Number(taxes),
      airlineCommissionPercent: Number(commPercent),
      markupAmount: Number(markup),
      discount: 0,
      customerId: customer.id,
      customerName: customer.name,
      vendorId: selectedVendorId,
      status: 'ISSUED',
      paymentStatus: Number(paidAmount) >= sellingPrice ? 'PAID' : Number(paidAmount) > 0 ? 'PARTIAL' : 'UNPAID',
      paidAmount: Number(paidAmount)
    });

    onClose();
  };

  const handleAirlineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setAirlineName(val);
    if (val === 'Emirates') { setAirlineCode('EK'); setTicketNumber('176-' + Math.floor(1000000000 + Math.random() * 9000000000)); }
    else if (val === 'Qatar Airways') { setAirlineCode('QR'); setTicketNumber('157-' + Math.floor(1000000000 + Math.random() * 9000000000)); }
    else if (val === 'Saudia') { setAirlineCode('SV'); setTicketNumber('065-' + Math.floor(1000000000 + Math.random() * 9000000000)); }
    else if (val === 'PIA') { setAirlineCode('PK'); setTicketNumber('214-' + Math.floor(1000000000 + Math.random() * 9000000000)); }
    else if (val === 'Turkish Airlines') { setAirlineCode('TK'); setTicketNumber('235-' + Math.floor(1000000000 + Math.random() * 9000000000)); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl border border-cream-200 shadow-creamy-lg max-w-2xl w-full p-6 space-y-5 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cream-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-50 text-gold-700 flex items-center justify-center">
              <Plane className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-cream-950">Issue New Air Ticket (GDS Booking)</h3>
              <p className="text-xs text-cream-500">Auto-posts to Customer Ledger and IATA BSP Payable</p>
            </div>
          </div>
          <button onClick={onClose} className="text-cream-400 hover:text-cream-800 text-sm font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Row 1: GDS, Airline, PNR, Ticket No */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">GDS Engine</label>
              <select
                value={gds}
                onChange={(e) => setGds(e.target.value as GdsSystem)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-medium"
              >
                <option value="Amadeus">Amadeus</option>
                <option value="Sabre">Sabre</option>
                <option value="Galileo">Galileo</option>
                <option value="Direct NDC">Direct NDC</option>
              </select>
            </div>

            <div>
              <label className="text-cream-600 font-semibold block mb-1">Airline Carrier</label>
              <select
                value={airlineName}
                onChange={handleAirlineChange}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-medium"
              >
                <option value="Emirates">Emirates (EK)</option>
                <option value="Qatar Airways">Qatar Airways (QR)</option>
                <option value="Saudia">Saudia (SV)</option>
                <option value="PIA">PIA (PK)</option>
                <option value="Turkish Airlines">Turkish Airlines (TK)</option>
              </select>
            </div>

            <div>
              <label className="text-cream-600 font-semibold block mb-1">PNR Code</label>
              <input
                type="text"
                required
                value={pnr}
                onChange={(e) => setPnr(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg font-mono font-bold uppercase text-cream-900"
              />
            </div>

            <div>
              <label className="text-cream-600 font-semibold block mb-1">E-Ticket Number</label>
              <input
                type="text"
                required
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg font-mono font-medium text-cream-900"
              />
            </div>
          </div>

          {/* Row 2: Passenger Name, Sector, Cabin, Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Passenger Full Name</label>
              <input
                type="text"
                required
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                placeholder="e.g. MR TARIQ / MANSOOR"
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg uppercase font-bold text-cream-900"
              />
            </div>

            <div>
              <label className="text-cream-600 font-semibold block mb-1">Sector / Routing</label>
              <input
                type="text"
                required
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="e.g. DXB-LHR-DXB"
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg font-mono uppercase font-bold text-cream-900"
              />
            </div>

            <div>
              <label className="text-cream-600 font-semibold block mb-1">Cabin Class</label>
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-medium"
              >
                <option value="Economy">Economy</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Business">Business</option>
                <option value="First">First Class</option>
              </select>
            </div>
          </div>

          {/* Row 3: Client Account & Clearing Supplier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Client / Corporate Account</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-semibold"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-cream-600 font-semibold block mb-1">Settlement Clearing Vendor</label>
              <select
                value={selectedVendorId}
                onChange={(e) => setSelectedVendorId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-semibold"
              >
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.code})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Financial Construction (Base, Taxes, Comm%, Markup) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-cream-50/80 border border-cream-200">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Base Fare ($)</label>
              <input
                type="number"
                step="any"
                required
                value={baseFare}
                onChange={(e) => setBaseFare(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-white border border-cream-200 rounded-lg font-mono font-bold text-cream-900"
              />
            </div>

            <div>
              <label className="text-cream-600 font-semibold block mb-1">Aviation Taxes ($)</label>
              <input
                type="number"
                step="any"
                required
                value={taxes}
                onChange={(e) => setTaxes(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-white border border-cream-200 rounded-lg font-mono font-bold text-cream-900"
              />
            </div>

            <div>
              <label className="text-cream-600 font-semibold block mb-1">Commission %</label>
              <input
                type="number"
                step="0.5"
                required
                value={commPercent}
                onChange={(e) => setCommPercent(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-white border border-cream-200 rounded-lg font-mono font-bold text-cream-900"
              />
            </div>

            <div>
              <label className="text-cream-600 font-semibold block mb-1">Agency Markup ($)</label>
              <input
                type="number"
                step="any"
                value={markup}
                onChange={(e) => setMarkup(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-white border border-cream-200 rounded-lg font-mono font-bold text-cream-900"
              />
            </div>
          </div>

          {/* Automatic Accounting Summary Box */}
          <div className="p-4 rounded-xl bg-gold-50/70 border border-gold-200 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-gold-950 pb-1.5 border-b border-gold-200/80">
              <span className="flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-gold-600" />
                <span>Live Double-Entry Accounting Simulation</span>
              </span>
              <span className="text-emerald-800 font-mono">Net Profit: +{formatCurrency(profit)}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-cream-800">
              <div>
                <span className="text-[10px] text-cream-500 uppercase">Gross Ticket Fare</span>
                <div className="font-mono font-bold text-cream-950">{formatCurrency(grossFare)}</div>
              </div>
              <div>
                <span className="text-[10px] text-cream-500 uppercase">Airline Comm Earned</span>
                <div className="font-mono font-bold text-emerald-800">{formatCurrency(commAmount)}</div>
              </div>
              <div>
                <span className="text-[10px] text-cream-500 uppercase">Net Cost to Airline</span>
                <div className="font-mono font-bold text-cream-950">{formatCurrency(netCostToAirline)}</div>
              </div>
              <div>
                <span className="text-[10px] text-cream-500 uppercase">Customer Selling Price</span>
                <div className="font-mono font-extrabold text-gold-800 text-sm">{formatCurrency(sellingPrice)}</div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
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
              className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold shadow-creamy active:scale-95 transition-all"
            >
              Issue Ticket & Post to GL
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
