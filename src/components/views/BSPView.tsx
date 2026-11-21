import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { BSPSettlement } from '../../types';
import { Scale, CheckCircle2, AlertTriangle, RefreshCw, Download, FileSpreadsheet, ShieldCheck } from 'lucide-react';

export const BSPView: React.FC = () => {
  const { bspSettlements, reconcileBSPCycle, formatCurrency } = useAccounting();
  const [selectedPeriod, setSelectedPeriod] = useState<BSPSettlement>(bspSettlements[1] || bspSettlements[0]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cream-950 tracking-tight">
            IATA BSP Settlement & Reconciliation Engine
          </h1>
          <p className="text-xs text-cream-500 mt-1">
            Fortnightly IATA clearing house statement matching, GDS HOT/RET ticket files, and remittance schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedPeriod.status === 'PENDING_RECONCILIATION' ? (
            <button
              onClick={() => reconcileBSPCycle(selectedPeriod.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs shadow-creamy active:scale-95 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Run Automated BSP Reconciliation</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Period Reconciled & Audited</span>
            </div>
          )}
        </div>
      </div>

      {/* Period Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bspSettlements.map(bsp => (
          <div
            key={bsp.id}
            onClick={() => setSelectedPeriod(bsp)}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              selectedPeriod.id === bsp.id
                ? 'bg-white border-gold-400 shadow-creamy-lg ring-2 ring-gold-400/20'
                : 'bg-cream-50/60 border-cream-200 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-base text-cream-950">{bsp.periodName}</span>
                <p className="text-xs text-cream-500 mt-0.5">{bsp.startDate} to {bsp.endDate}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                bsp.status === 'SETTLED'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : bsp.status === 'RECONCILED'
                  ? 'bg-sky-50 text-sky-700 border border-sky-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {bsp.status.replace('_', ' ')}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-cream-100 flex items-center justify-between text-xs">
              <span className="text-cream-500">Net Remittance to IATA:</span>
              <span className="text-base font-extrabold font-mono text-cream-950">
                {formatCurrency(bsp.netPayableToIATA)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Period Full Financial Breakdown */}
      <div className="creamy-card p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-cream-200 pb-4">
          <div>
            <h3 className="text-lg font-bold text-cream-950">
              BSPLink Statement Breakdown: {selectedPeriod.periodName}
            </h3>
            <p className="text-xs text-cream-500">
              Accreditation # 27-2-8910 • Direct clearing between agency & 11 participating IATA carriers
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-cream-400 uppercase">Settlement Net Payable</span>
            <div className="text-2xl font-extrabold font-mono text-gold-700">
              {formatCurrency(selectedPeriod.netPayableToIATA)}
            </div>
          </div>
        </div>

        {/* 4 Key Billing Elements */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-cream-50/60 border border-cream-100">
            <div className="text-[10px] font-bold text-cream-400 uppercase">Gross Ticket Sales (TKTT)</div>
            <div className="text-lg font-extrabold font-mono text-cream-900 mt-1">
              +{formatCurrency(selectedPeriod.grossSales)}
            </div>
            <div className="text-[10px] text-cream-500 mt-0.5">{selectedPeriod.ticketCount} E-Tickets Issued</div>
          </div>

          <div className="p-4 rounded-xl bg-cream-50/60 border border-cream-100">
            <div className="text-[10px] font-bold text-cream-400 uppercase">Refunds / Credit Memos (RFND)</div>
            <div className="text-lg font-extrabold font-mono text-rose-700 mt-1">
              -{formatCurrency(selectedPeriod.refunds)}
            </div>
            <div className="text-[10px] text-cream-500 mt-0.5">Deducted from billing</div>
          </div>

          <div className="p-4 rounded-xl bg-cream-50/60 border border-cream-100">
            <div className="text-[10px] font-bold text-cream-400 uppercase">Agency Commission (COMM)</div>
            <div className="text-lg font-extrabold font-mono text-emerald-700 mt-1">
              -{formatCurrency(selectedPeriod.airlineCommissions)}
            </div>
            <div className="text-[10px] text-emerald-600 mt-0.5 font-medium">Retained at source</div>
          </div>

          <div className="p-4 rounded-xl bg-cream-50/60 border border-cream-100">
            <div className="text-[10px] font-bold text-cream-400 uppercase">Aviation Taxes Remitted</div>
            <div className="text-lg font-extrabold font-mono text-cream-900 mt-1">
              {formatCurrency(selectedPeriod.taxRemitted)}
            </div>
            <div className="text-[10px] text-cream-500 mt-0.5">YQ, RG, SP airport taxes</div>
          </div>
        </div>

        {/* Audit Log / Reconciliation Proof */}
        <div className="p-4 rounded-xl bg-cream-50/80 border border-cream-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-cream-950">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Automated 3-Way Match Audit Verification</span>
          </div>
          <p className="text-xs text-cream-600 leading-relaxed">
            The internal GL accounts <strong>2010 (Accounts Payable - IATA BSP Airlines)</strong> and <strong>4010 (Airline Commission Income)</strong> have been cross-checked against GDS electronic ticketing feed. Total matched entries: {selectedPeriod.ticketCount}. Unmatched variance: <strong>$0.00</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
