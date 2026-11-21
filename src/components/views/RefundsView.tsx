import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { RotateCcw, AlertTriangle, ShieldAlert, CheckCircle2, FileText, Plus } from 'lucide-react';

export const RefundsView: React.FC = () => {
  const { refunds, adms, formatCurrency } = useAccounting();
  const [activeTab, setActiveTab] = useState<'refunds' | 'adms'>('refunds');

  const totalRefundsProcessed = refunds.reduce((acc, r) => acc + r.netCustomerRefund, 0);
  const totalAgencyRefundFees = refunds.reduce((acc, r) => acc + r.agencyRefundServiceFee, 0);
  const totalOpenADMs = adms.filter(a => a.status === 'OPEN' || a.status === 'DISPUTED').reduce((acc, a) => acc + a.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cream-950 tracking-tight">
            Ticket Refunds & Airline Debit Memos (ADMs)
          </h1>
          <p className="text-xs text-cream-500 mt-1">
            Cancellation penalties, Agency Credit Memos (ACMs), airline dispute resolutions, and debit memos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
            Open ADM Risk: {formatCurrency(totalOpenADMs)}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">Processed Client Refunds</div>
          <div className="text-xl font-extrabold text-cream-950 mt-1">{formatCurrency(totalRefundsProcessed)}</div>
          <div className="text-[10px] text-cream-400 mt-0.5">Credited to customer accounts</div>
        </div>
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">Agency Refund Income</div>
          <div className="text-xl font-extrabold text-emerald-800 mt-1">{formatCurrency(totalAgencyRefundFees)}</div>
          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">Processing fees earned</div>
        </div>
        <div className="creamy-card p-4">
          <div className="text-[11px] font-bold text-cream-500 uppercase">Active ADMs Tracked</div>
          <div className="text-xl font-extrabold text-rose-800 mt-1">{adms.length} Memos</div>
          <div className="text-[10px] text-cream-400 mt-0.5">Disputed via BSPLink</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-cream-200 pb-2">
        <button
          onClick={() => setActiveTab('refunds')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'refunds'
              ? 'bg-cream-900 text-gold-300 shadow-creamy'
              : 'text-cream-600 hover:bg-cream-100'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Ticket Refunds & ACMs ({refunds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('adms')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'adms'
              ? 'bg-cream-900 text-gold-300 shadow-creamy'
              : 'text-cream-600 hover:bg-cream-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Airline Debit Memos / ADMs ({adms.length})</span>
        </button>
      </div>

      {activeTab === 'refunds' && (
        <div className="creamy-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-cream-200 text-cream-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Refund #</th>
                <th className="py-3 px-3">Ticket / PNR</th>
                <th className="py-3 px-3">Passenger & Client</th>
                <th className="py-3 px-3 text-right">Gross Fare</th>
                <th className="py-3 px-3 text-right">Airline Penalty</th>
                <th className="py-3 px-3 text-right">Agency Fee</th>
                <th className="py-3 px-3 text-right">Net Refund to Client</th>
                <th className="py-3 px-3">ACM Number</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {refunds.map(r => (
                <tr key={r.id} className="hover:bg-cream-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-cream-950">
                    {r.refundNumber}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <div className="font-bold text-cream-900">{r.pnr}</div>
                    <div className="text-[10px] text-cream-400">{r.ticketNumber}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-cream-950">{r.passengerName}</div>
                    <div className="text-[11px] text-cream-500">{r.customerName}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-cream-700">
                    {formatCurrency(r.originalGrossFare)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-rose-700 font-semibold">
                    -{formatCurrency(r.airlineCancellationPenalty)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-800 font-semibold">
                    +{formatCurrency(r.agencyRefundServiceFee)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-extrabold text-sm text-cream-950">
                    {formatCurrency(r.netCustomerRefund)}
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-cream-700">
                    {r.acmNumber || 'Pending'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'adms' && (
        <div className="creamy-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-cream-200 text-cream-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">ADM Number</th>
                <th className="py-3 px-3">Airline</th>
                <th className="py-3 px-3">Ticket / PNR</th>
                <th className="py-3 px-3">Reason Category</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3 text-right">ADM Amount</th>
                <th className="py-3 px-3 text-center">Dispute Status</th>
                <th className="py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {adms.map(adm => (
                <tr key={adm.id} className="hover:bg-cream-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-cream-950">
                    {adm.admNumber}
                  </td>
                  <td className="py-3 px-3 font-semibold text-cream-900">
                    {adm.airlineName} ({adm.airlineCode})
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <div className="font-bold text-cream-900">{adm.pnr}</div>
                    <div className="text-[10px] text-cream-400">{adm.ticketNumber}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-cream-800">
                    {adm.reason}
                  </td>
                  <td className="py-3 px-3 text-cream-600 font-mono">
                    {adm.dueDate}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-extrabold text-sm text-rose-800">
                    {formatCurrency(adm.amount)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      adm.status === 'DISPUTED'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : adm.status === 'ACCEPTED_PAID'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {adm.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-cream-500 text-[11px] max-w-xs truncate">
                    {adm.notes}
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
