import React from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { VendorSupplier } from '../../types';
import { Building, Plus, ArrowUpRight, Scale, ShieldCheck, Mail, Phone } from 'lucide-react';

interface VendorsViewProps {
  onIssuePaymentToVendor: (vendor: VendorSupplier) => void;
  onAddNewVendor: () => void;
}

export const VendorsView: React.FC<VendorsViewProps> = ({ 
  onIssuePaymentToVendor, 
  onAddNewVendor 
}) => {
  const { vendors, formatCurrency } = useAccounting();

  const totalPayables = vendors.reduce((acc, v) => acc + v.balance, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cream-950 tracking-tight">
            Airline & Supplier Payables
          </h1>
          <p className="text-xs text-cream-500 mt-1">
            IATA BSP clearing house payables, GDS consolidator floats, bedbanks, and visa vendors.
          </p>
        </div>

        <button
          onClick={onAddNewVendor}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs shadow-creamy active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Airline / Vendor</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">Total Supplier Payables</div>
          <div className="text-xl font-extrabold text-cream-950 mt-1">{formatCurrency(totalPayables)}</div>
          <div className="text-[10px] text-cream-400 mt-0.5">Across {vendors.length} accredited suppliers</div>
        </div>
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">IATA BSP Clearing Share</div>
          <div className="text-xl font-extrabold text-sky-900 mt-1">{formatCurrency(48500)}</div>
          <div className="text-[10px] text-sky-700 font-medium">Period 2 Fortnight cycle</div>
        </div>
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">Hotelbeds & Ground Floats</div>
          <div className="text-xl font-extrabold text-amber-900 mt-1">{formatCurrency(25300)}</div>
          <div className="text-[10px] text-cream-400 mt-0.5">Hospitality & accommodation due</div>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="creamy-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-cream-100/70 border-b border-cream-200 text-cream-600 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Supplier / Airline Name</th>
              <th className="py-3 px-3">Supplier Code</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Contact & Support</th>
              <th className="py-3 px-3 text-right">Payable Balance</th>
              <th className="py-3 px-4 text-center">Settlement Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-100">
            {vendors.map(v => (
              <tr key={v.id} className="hover:bg-cream-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-cream-950 text-sm">{v.name}</div>
                  <div className="text-[11px] text-cream-500">{v.contactPerson}</div>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-cream-700">
                  {v.code}
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-cream-200/70 text-cream-800 text-[11px] font-semibold">
                    {v.type}
                  </span>
                </td>
                <td className="py-3 px-3 text-cream-600">
                  <div>{v.email}</div>
                  <div className="text-[10px] text-cream-400">{v.phone}</div>
                </td>
                <td className="py-3 px-3 text-right font-mono font-extrabold text-sm text-cream-950">
                  {v.balance > 0 ? (
                    <span className="text-rose-900">{formatCurrency(v.balance)}</span>
                  ) : (
                    <span className="text-emerald-700">Settled (0.00)</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {v.balance > 0 && (
                    <button
                      onClick={() => onIssuePaymentToVendor(v)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200 transition-colors"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Issue Payment (PV)</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
