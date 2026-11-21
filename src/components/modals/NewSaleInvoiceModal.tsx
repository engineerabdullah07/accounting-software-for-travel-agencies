import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { ServiceType } from '../../types';
import { Receipt, X, Plus, Calculator } from 'lucide-react';

interface NewSaleInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewSaleInvoiceModal: React.FC<NewSaleInvoiceModalProps> = ({ isOpen, onClose }) => {
  const { parties, accounts, addSaleInvoice, formatMoney } = useAccounting();

  const customers = parties.filter(p => p.type === 'CUSTOMER');
  const suppliers = parties.filter(p => p.type === 'SUPPLIER');
  const cashAndBanks = accounts.filter(a => a.category === 'ASSET' && (a.subCategory.includes('Cash') || a.subCategory.includes('Bank')));

  const [customerId, setCustomerId] = useState<string>(customers[0]?.id || '');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState<string>(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);

  // Item fields
  const [serviceType, setServiceType] = useState<ServiceType>('AIR_TICKET');
  const [description, setDescription] = useState('Flight E-Ticket');
  const [pnr, setPnr] = useState('EK' + Math.floor(1000 + Math.random() * 9000));
  const [ticketNumber, setTicketNumber] = useState('176-' + Math.floor(1000000000 + Math.random() * 9000000000));
  const [passengerName, setPassengerName] = useState('MR TARIQ / MANSOOR');
  const [sector, setSector] = useState('LHE-DXB-LHR-LHE');
  const [travelDate, setTravelDate] = useState('2026-12-10');
  const [supplierId, setSupplierId] = useState<string>(suppliers[0]?.id || '');
  const [costPrice, setCostPrice] = useState<number>(380000);
  const [salePrice, setSalePrice] = useState<number>(425000);

  // Payment fields
  const [paymentType, setPaymentType] = useState<'CREDIT' | 'CASH' | 'BANK'>('CREDIT');
  const [depositAccountId, setDepositAccountId] = useState<string>(cashAndBanks[0]?.id || '');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const margin = Number(salePrice || 0) - Number(costPrice || 0);
  const balanceDue = Math.max(0, Number(salePrice || 0) - Number(paidAmount || 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === customerId) || customers[0];

    await addSaleInvoice({
      date,
      dueDate,
      customerId: customer.id,
      customerName: customer.name,
      paymentType,
      depositAccountId: paidAmount > 0 ? depositAccountId : undefined,
      paidAmount: Number(paidAmount),
      notes,
      items: [
        {
          id: `item-${Date.now()}`,
          serviceType,
          description: description || `${serviceType} - ${sector}`,
          pnr: pnr.toUpperCase(),
          ticketNumber,
          passengerName: passengerName.toUpperCase(),
          sector: sector.toUpperCase(),
          travelDate,
          supplierId,
          costPrice: Number(costPrice),
          salePrice: Number(salePrice),
          margin
        }
      ]
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl border border-cream-200 shadow-creamy-lg max-w-2xl w-full p-6 space-y-4 my-8">
        
        <div className="flex items-center justify-between pb-3 border-b border-cream-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-50 text-gold-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-cream-950">New Travel Sales Invoice</h3>
              <p className="text-xs text-cream-500">Record ticket, hotel, Umrah or visa sale with cost & selling margin</p>
            </div>
          </div>
          <button onClick={onClose} className="text-cream-400 hover:text-cream-800 text-sm font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Client, Date, Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Billed Client (Khata)</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-bold"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({formatMoney(c.currentBalance)})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-cream-600 font-semibold block mb-1">Invoice Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-medium"
              />
            </div>

            <div>
              <label className="text-cream-600 font-semibold block mb-1">Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-medium"
              />
            </div>
          </div>

          {/* Service Category & Particulars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-cream-50/70 border border-cream-200">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Service Type</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as ServiceType)}
                className="w-full px-2 py-1.5 bg-white border border-cream-200 rounded-lg text-cream-900 font-bold"
              >
                <option value="AIR_TICKET">Air Ticket</option>
                <option value="HOTEL">Hotel Booking</option>
                <option value="UMRAH_HAJJ">Umrah / Hajj Package</option>
                <option value="VISA">Visa Processing</option>
                <option value="TOUR_PACKAGE">Tour Package</option>
                <option value="OTHER">Other Service</option>
              </select>
            </div>

            <div>
              <label className="text-cream-600 font-semibold block mb-1">PNR / Ref Code</label>
              <input
                type="text"
                value={pnr}
                onChange={(e) => setPnr(e.target.value)}
                placeholder="e.g. EK89QP"
                className="w-full px-2 py-1.5 bg-white border border-cream-200 rounded-lg font-mono font-bold uppercase text-cream-900"
              />
            </div>

            <div>
              <label className="text-cream-600 font-semibold block mb-1">Ticket # / Voucher #</label>
              <input
                type="text"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                placeholder="e.g. 176-2948102938"
                className="w-full px-2 py-1.5 bg-white border border-cream-200 rounded-lg font-mono text-cream-900"
              />
            </div>

            <div>
              <label className="text-cream-600 font-semibold block mb-1">Travel Date</label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-cream-200 rounded-lg text-cream-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Passenger Name(s) / Guest</label>
              <input
                type="text"
                required
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                placeholder="e.g. MR TARIQ / MANSOOR"
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg font-bold uppercase text-cream-900"
              />
            </div>

            <div>
              <label className="text-cream-600 font-semibold block mb-1">Sector / Routing / Description</label>
              <input
                type="text"
                required
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="e.g. LHE-DXB-LHR-LHE"
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg font-mono font-bold text-cream-900"
              />
            </div>
          </div>

          {/* Supplier & Financial Amounts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-gold-50/50 border border-gold-200">
            <div>
              <label className="text-cream-700 font-semibold block mb-1">Supplier (Airline / Bedbank)</label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-cream-200 rounded-lg text-cream-900 font-semibold"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-cream-700 font-semibold block mb-1">Supplier Net Cost</label>
              <input
                type="number"
                step="any"
                required
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-white border border-cream-200 rounded-lg font-mono font-bold text-cream-900"
              />
            </div>

            <div>
              <label className="text-cream-700 font-semibold block mb-1">Customer Selling Price</label>
              <input
                type="number"
                step="any"
                required
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-white border border-cream-200 rounded-lg font-mono font-extrabold text-gold-900"
              />
            </div>
          </div>

          {/* Profit Calculation Badge */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-cream-100/80 text-xs">
            <span className="font-semibold text-cream-700">Calculated Agency Gross Profit:</span>
            <span className="font-mono font-extrabold text-sm text-emerald-800">
              +{formatMoney(margin)}
            </span>
          </div>

          {/* Payment Terms & Advance Deposit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Payment Type</label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-medium"
              >
                <option value="CREDIT">On Credit (Charge to Client Khata)</option>
                <option value="CASH">Cash in Hand</option>
                <option value="BANK">Bank Deposit / Wire</option>
              </select>
            </div>

            <div>
              <label className="text-cream-600 font-semibold block mb-1">Advance Amount Received</label>
              <input
                type="number"
                step="any"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg font-mono text-cream-900 font-bold"
              />
            </div>

            <div>
              <label className="text-cream-600 font-semibold block mb-1">Remaining Balance Due</label>
              <div className="px-2.5 py-1.5 bg-cream-100 rounded-lg font-mono font-extrabold text-amber-900">
                {formatMoney(balanceDue)}
              </div>
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
              className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold shadow-creamy active:scale-95 transition-all"
            >
              Post Invoice & Update Ledgers
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
