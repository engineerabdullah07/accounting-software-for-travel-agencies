import React from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Globe, Plus, CheckCircle, Clock } from 'lucide-react';

interface VisasViewProps {
  onOpenQuickAction: (actionType: 'visa') => void;
}

export const VisasView: React.FC<VisasViewProps> = ({ onOpenQuickAction }) => {
  const { visas, formatCurrency } = useAccounting();

  const totalEmbassyFees = visas.reduce((acc, v) => acc + v.embassyFee, 0);
  const totalServiceFees = visas.reduce((acc, v) => acc + v.serviceCharge, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cream-950 tracking-tight">
            Visa Processing & Embassy Charges
          </h1>
          <p className="text-xs text-cream-500 mt-1">
            Tracking official consular fees, Moafa electronic visas, and agency consultancy revenue.
          </p>
        </div>

        <button
          onClick={() => onOpenQuickAction('visa')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs shadow-creamy active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Visa Application</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">Total Applications</div>
          <div className="text-xl font-extrabold text-cream-950 mt-1">{visas.length} Passports</div>
          <div className="text-[10px] text-cream-400 mt-0.5">UAE, Saudi, UK & Schengen</div>
        </div>
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">Embassy / Consular Cost</div>
          <div className="text-xl font-extrabold text-cream-950 mt-1">{formatCurrency(totalEmbassyFees)}</div>
          <div className="text-[10px] text-cream-400 mt-0.5">Direct official charges payable</div>
        </div>
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">Visa Consultancy Revenue</div>
          <div className="text-xl font-extrabold text-emerald-800 mt-1">{formatCurrency(totalServiceFees)}</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Agency processing margin</div>
        </div>
      </div>

      {/* Visas Table */}
      <div className="creamy-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-cream-100/70 border-b border-cream-200 text-cream-600 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Ref #</th>
              <th className="py-3 px-3">Applicant Name</th>
              <th className="py-3 px-3">Passport No / Nationality</th>
              <th className="py-3 px-3">Country & Type</th>
              <th className="py-3 px-3">Supplier / Portal</th>
              <th className="py-3 px-3 text-right">Embassy Fee</th>
              <th className="py-3 px-3 text-right">Service Fee</th>
              <th className="py-3 px-3 text-right">Total Price</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-100">
            {visas.map(v => (
              <tr key={v.id} className="hover:bg-cream-50/70 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-cream-950">
                  {v.refNumber}
                </td>
                <td className="py-3 px-3 font-bold text-cream-900">
                  {v.applicantName}
                  <div className="text-[10px] text-cream-400 font-normal">{v.customerName}</div>
                </td>
                <td className="py-3 px-3 font-mono text-cream-700">
                  <div>{v.passportNumber}</div>
                  <div className="text-[10px] font-sans text-cream-400">{v.nationality}</div>
                </td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-cream-900">{v.destinationCountry}</div>
                  <div className="text-[11px] text-cream-500">{v.visaType}</div>
                </td>
                <td className="py-3 px-3 text-cream-600 font-medium">
                  {v.supplierName}
                </td>
                <td className="py-3 px-3 text-right font-mono text-cream-600">
                  {formatCurrency(v.embassyFee)}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-emerald-800">
                  +{formatCurrency(v.serviceCharge)}
                </td>
                <td className="py-3 px-3 text-right font-mono font-extrabold text-cream-950">
                  {formatCurrency(v.totalSellingPrice)}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    v.status === 'APPROVED'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {v.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
