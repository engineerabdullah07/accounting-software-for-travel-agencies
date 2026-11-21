import React from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { SaleInvoice } from '../../types';
import { Printer, X, Building2 } from 'lucide-react';

interface PrintSaleInvoiceModalProps {
  invoice: SaleInvoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintSaleInvoiceModal: React.FC<PrintSaleInvoiceModalProps> = ({ invoice, isOpen, onClose }) => {
  const { formatMoney } = useAccounting();

  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl border border-cream-200 shadow-creamy-lg max-w-3xl w-full p-8 space-y-6 my-8 print:p-0 print:border-0 print:shadow-none">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between pb-4 border-b border-cream-200 print:hidden">
          <span className="text-xs font-bold text-cream-500 uppercase tracking-wider">
            Travel Agency Sales Invoice Printout
          </span>
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

        {/* Printable Tax Invoice Document */}
        <div className="space-y-6 text-cream-900 font-sans border-2 border-cream-300 p-6 rounded-xl">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-cream-900 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cream-900 text-gold-400 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h1 className="text-xl font-extrabold tracking-tight text-cream-950">
                  SkyHorizon Travels & Tourism
                </h1>
              </div>
              <p className="text-xs text-cream-600 mt-1">
                Travel & Tourism Accounting Desk • IATA Accr. # <strong>27-2-8910</strong>
              </p>
              <p className="text-[11px] text-cream-500">
                Suite 401, Al-Saad Aviation Tower, Mall Road, Lahore • Phone: 042-35789900
              </p>
              <p className="text-[11px] text-cream-500">
                NTN # 4920194-8 • STRN # 32-00-4920-001
              </p>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 rounded bg-cream-100 font-mono text-xs font-extrabold text-cream-900 border border-cream-200 uppercase">
                SALES INVOICE
              </span>
              <div className="text-base font-extrabold font-mono text-cream-950 mt-2">
                {invoice.invoiceNumber}
              </div>
              <div className="text-xs text-cream-500 mt-0.5">
                Date: {invoice.date}
              </div>
              <div className="text-xs text-cream-500">
                Due Date: {invoice.dueDate}
              </div>
            </div>
          </div>

          {/* Customer Khata Info */}
          <div className="p-4 rounded-xl bg-cream-50/70 border border-cream-200 text-xs flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold text-cream-400 uppercase tracking-wider block mb-0.5">
                Billed To (Client Khata):
              </span>
              <div className="font-extrabold text-cream-950 text-sm">{invoice.customerName}</div>
              <div className="text-cream-500 mt-0.5">Payment Terms: {invoice.paymentType}</div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-cream-400 uppercase tracking-wider block mb-0.5">
                Invoice Status:
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                invoice.status === 'PAID'
                  ? 'bg-emerald-100 text-emerald-800'
                  : invoice.status === 'PARTIAL'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {invoice.status}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left text-xs border border-cream-200 rounded-xl overflow-hidden">
            <thead className="bg-cream-100/80 border-b border-cream-200 text-cream-600 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-2.5 px-4">#</th>
                <th className="py-2.5 px-3">Service / Particulars</th>
                <th className="py-2.5 px-3">PNR / Ticket</th>
                <th className="py-2.5 px-3">Passenger & Sector</th>
                <th className="py-2.5 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-cream-50/50">
                  <td className="py-3 px-4 font-mono text-cream-500">{idx + 1}</td>
                  <td className="py-3 px-3 font-medium text-cream-900">
                    <div>{item.description}</div>
                    <div className="text-[10px] text-cream-400 font-mono">{item.serviceType}</div>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <div className="font-bold text-cream-950">{item.pnr || '-'}</div>
                    <div className="text-[10px] text-cream-400">{item.ticketNumber || ''}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-cream-900">{item.passengerName || '-'}</div>
                    <div className="text-[11px] text-cream-500 font-mono">{item.sector || ''}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-cream-950">
                    {formatMoney(item.salePrice)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-cream-50 font-bold border-t border-cream-200">
              <tr>
                <td colSpan={4} className="py-2.5 px-4 text-right font-sans uppercase text-xs">
                  Total Billed Amount:
                </td>
                <td className="py-2.5 px-4 text-right text-sm font-extrabold text-cream-950 font-mono">
                  {formatMoney(invoice.totalSale)}
                </td>
              </tr>
              {invoice.paidAmount > 0 && (
                <tr>
                  <td colSpan={4} className="py-2 px-4 text-right font-sans uppercase text-xs text-emerald-800">
                    Paid / Received:
                  </td>
                  <td className="py-2 px-4 text-right text-xs font-bold text-emerald-800 font-mono">
                    -{formatMoney(invoice.paidAmount)}
                  </td>
                </tr>
              )}
              <tr className="border-t border-cream-200 bg-cream-100/60">
                <td colSpan={4} className="py-3 px-4 text-right font-sans uppercase text-xs text-amber-950">
                  Net Balance Payable:
                </td>
                <td className="py-3 px-4 text-right text-base font-extrabold text-amber-900 font-mono">
                  {formatMoney(invoice.balanceDue)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Payment Instructions & Stamp */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-cream-200 bg-cream-50/50 text-[11px]">
            <div>
              <span className="font-bold text-cream-900 block mb-1">Direct Bank Remittance Details:</span>
              <p className="text-cream-600">Bank: Meezan Bank (Gulberg Branch, Lahore)</p>
              <p className="text-cream-600 font-mono">IBAN: PK36MEZN0001030049201948</p>
              <p className="text-cream-600">Account Title: SkyHorizon Travels & Tourism</p>
            </div>
            <div className="flex flex-col justify-between text-right">
              <div className="text-cream-500">
                Please make crossed cheques payable to SkyHorizon Travels & Tourism.
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
