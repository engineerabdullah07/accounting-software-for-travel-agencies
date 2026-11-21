import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { HotelBooking, UmrahPackage } from '../../types';
import { Hotel, Plus, Building, Compass, Calendar, Users, DollarSign, CheckCircle2 } from 'lucide-react';

interface HotelsViewProps {
  onOpenQuickAction: (actionType: 'hotel') => void;
}

export const HotelsView: React.FC<HotelsViewProps> = ({ onOpenQuickAction }) => {
  const { hotels, umrahPackages, formatCurrency } = useAccounting();
  const [activeTab, setActiveTab] = useState<'hotels' | 'umrah'>('hotels');

  const totalHotelProfit = hotels.reduce((acc, h) => acc + h.profitMargin, 0);
  const totalUmrahProfit = umrahPackages.reduce((acc, u) => acc + u.profit, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cream-950 tracking-tight">
            Hotels & Religious Tourism (Umrah/Hajj)
          </h1>
          <p className="text-xs text-cream-500 mt-1">
            Bedbank supplier reconciliation (Hotelbeds, Agoda, Direct Contracts) and multi-pax group packages.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenQuickAction('hotel')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs shadow-creamy active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Book Hotel Voucher</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">Confirmed Hotel Stays</div>
          <div className="text-xl font-extrabold text-cream-950 mt-1">{hotels.length} Vouchers</div>
          <div className="text-[10px] text-cream-400 mt-0.5">Makkah, Madinah, London & Global</div>
        </div>
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">Hotel Booking Margin</div>
          <div className="text-xl font-extrabold text-emerald-800 mt-1">{formatCurrency(totalHotelProfit)}</div>
          <div className="text-[10px] text-cream-400 mt-0.5">Net earned from room markups</div>
        </div>
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">Umrah Group Packages Profit</div>
          <div className="text-xl font-extrabold text-emerald-900 mt-1">{formatCurrency(totalUmrahProfit)}</div>
          <div className="text-[10px] text-cream-400 mt-0.5">Total group revenue less moafa/hotels</div>
        </div>
      </div>

      {/* Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-cream-200 pb-2">
        <button
          onClick={() => setActiveTab('hotels')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'hotels'
              ? 'bg-cream-900 text-gold-300 shadow-creamy'
              : 'text-cream-600 hover:bg-cream-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Individual Hotel Vouchers ({hotels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('umrah')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'umrah'
              ? 'bg-cream-900 text-gold-300 shadow-creamy'
              : 'text-cream-600 hover:bg-cream-100'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Umrah & Hajj Group Packages ({umrahPackages.length})</span>
        </button>
      </div>

      {/* Content for Hotel Vouchers */}
      {activeTab === 'hotels' && (
        <div className="creamy-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-cream-200 text-cream-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Voucher / Conf #</th>
                <th className="py-3 px-3">Hotel & Destination</th>
                <th className="py-3 px-3">Guest & Client</th>
                <th className="py-3 px-3">Stay Dates</th>
                <th className="py-3 px-3">Supplier / Bedbank</th>
                <th className="py-3 px-3 text-right">Net Cost</th>
                <th className="py-3 px-3 text-right">Selling Price</th>
                <th className="py-3 px-3 text-right">Profit Margin</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {hotels.map(h => (
                <tr key={h.id} className="hover:bg-cream-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono">
                    <div className="font-bold text-cream-950">{h.voucherNo}</div>
                    <div className="text-[10px] text-cream-400">{h.confirmationNo}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-cream-950">{h.hotelName}</div>
                    <div className="text-[11px] text-cream-500">{h.city}, {h.country} • {h.roomType}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-cream-900">{h.guestName}</div>
                    <div className="text-[11px] text-cream-400">{h.customerName}</div>
                  </td>
                  <td className="py-3 px-3 text-cream-600">
                    <div className="font-medium">{h.checkIn} → {h.checkOut}</div>
                    <div className="text-[10px] text-cream-400">{h.nights} Nights • {h.mealPlan}</div>
                  </td>
                  <td className="py-3 px-3 text-cream-700 font-medium">
                    {h.vendorName}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-cream-600">
                    {formatCurrency(h.buyingCost)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-cream-950">
                    {formatCurrency(h.sellingPrice)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-800">
                    +{formatCurrency(h.profitMargin)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Content for Umrah Packages */}
      {activeTab === 'umrah' && (
        <div className="creamy-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-cream-200 text-cream-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Package Code</th>
                <th className="py-3 px-3">Package Title & Leader</th>
                <th className="py-3 px-3">Pax Count & Duration</th>
                <th className="py-3 px-3">Hotels (Makkah / Madinah)</th>
                <th className="py-3 px-3 text-right">Total Cost</th>
                <th className="py-3 px-3 text-right">Package Sell Price</th>
                <th className="py-3 px-3 text-right">Group Profit</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {umrahPackages.map(u => (
                <tr key={u.id} className="hover:bg-cream-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-cream-950">
                    {u.packageCode}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-cream-950">{u.packageName}</div>
                    <div className="text-[11px] text-cream-500">Leader: {u.groupLeader} ({u.customerName})</div>
                  </td>
                  <td className="py-3 px-3 text-cream-700 font-medium">
                    <div>{u.paxCount} Pilgrims</div>
                    <div className="text-[10px] text-cream-400">{u.durationDays} Days • Departs {u.departureDate}</div>
                  </td>
                  <td className="py-3 px-3 text-cream-700">
                    <div>Makkah: <span className="font-semibold">{u.makkahHotel}</span></div>
                    <div className="text-[11px] text-cream-500">Madinah: {u.madinahHotel}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-cream-600">
                    {formatCurrency(u.totalCost)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-cream-950">
                    {formatCurrency(u.sellingPrice)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-extrabold text-emerald-800">
                    +{formatCurrency(u.profit)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
