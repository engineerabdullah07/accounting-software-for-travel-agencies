import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Hotel, X, Building, CheckCircle2 } from 'lucide-react';

interface BookHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookHotelModal: React.FC<BookHotelModalProps> = ({ isOpen, onClose }) => {
  const { customers, addHotelBooking } = useAccounting();

  const [hotelName, setHotelName] = useState('Pullman Zamzam Makkah');
  const [city, setCity] = useState('Makkah');
  const [country, setCountry] = useState('Saudi Arabia');
  const [confirmationNo, setConfirmationNo] = useState('CONF-' + Math.floor(10000 + Math.random() * 90000));
  const [checkIn, setCheckIn] = useState('2026-12-18');
  const [checkOut, setCheckOut] = useState('2026-12-24');
  const [nights, setNights] = useState<number>(6);
  const [roomType, setRoomType] = useState('Deluxe Kaaba View Room');
  const [mealPlan, setMealPlan] = useState<'Room Only' | 'Bed & Breakfast' | 'Half Board' | 'Full Board' | 'All Inclusive'>('Bed & Breakfast');
  const [guestName, setGuestName] = useState('MR TARIQ MANSOOR (2 PAX)');
  const [vendorName, setVendorName] = useState('Hotelbeds Bedbank Ltd');
  const [buyingCost, setBuyingCost] = useState<number>(1850);
  const [sellingPrice, setSellingPrice] = useState<number>(2250);
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');

  if (!isOpen) return null;

  const profit = Number(sellingPrice || 0) - Number(buyingCost || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === customerId) || customers[0];

    await addHotelBooking({
      confirmationNo,
      hotelName,
      city,
      country,
      checkIn,
      checkOut,
      nights: Number(nights),
      roomType,
      mealPlan,
      guestName,
      vendorName,
      buyingCost: Number(buyingCost),
      sellingPrice: Number(sellingPrice),
      customerId: cust.id,
      customerName: cust.name,
      status: 'CONFIRMED',
      issueDate: new Date().toISOString().split('T')[0]
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl border border-cream-200 shadow-creamy-lg max-w-xl w-full p-6 space-y-4 my-8">
        
        <div className="flex items-center justify-between pb-3 border-b border-cream-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Hotel className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-cream-950">Book Hotel Voucher</h3>
              <p className="text-xs text-cream-500">Accommodation booking with supplier cost & client markup</p>
            </div>
          </div>
          <button onClick={onClose} className="text-cream-400 hover:text-cream-800 text-sm font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Hotel Property Name</label>
              <input
                type="text"
                required
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-bold"
              />
            </div>
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Supplier / Bedbank</label>
              <input
                type="text"
                required
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">City</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900"
              />
            </div>
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Country</label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900"
              />
            </div>
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Room Nights</label>
              <input
                type="number"
                required
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Check-in Date</label>
              <input
                type="date"
                required
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900"
              />
            </div>
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Check-out Date</label>
              <input
                type="date"
                required
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Guest Name(s)</label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-semibold"
              />
            </div>
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Billing Client Account</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-semibold"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-cream-50/80 border border-cream-200">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Supplier Cost ($)</label>
              <input
                type="number"
                step="any"
                required
                value={buyingCost}
                onChange={(e) => setBuyingCost(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-white border border-cream-200 rounded-lg font-mono font-bold text-cream-900"
              />
            </div>
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Selling Price ($)</label>
              <input
                type="number"
                step="any"
                required
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-white border border-cream-200 rounded-lg font-mono font-extrabold text-gold-800"
              />
            </div>
            <div className="sm:col-span-1 col-span-2 flex flex-col justify-center">
              <span className="text-[10px] text-cream-500 uppercase font-semibold">Net Profit Margin</span>
              <span className="font-mono font-extrabold text-base text-emerald-800 mt-0.5">
                +${profit.toFixed(2)}
              </span>
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
              Issue Hotel Voucher & Post GL
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
