import React from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Voucher } from '../../types';
import { CreditCard, Printer, X } from 'lucide-react';

interface PrintVoucherModalProps {
  voucher: Voucher | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintVoucherModal: React.FC<PrintVoucherModalProps> = ({ voucher, isOpen, onClose }) => {
  const { formatCurrency } = useAccounting();

  if (!isOpen || !voucher) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl border border-cream-200 shadow-creamy-lg max-w-2xl w-full p-8 space-y-6 my-8 print:p-0 print:border-0 print:shadow-none">
        
        {/* Top Action Bar (Hidden on print) */}
        <div className="flex items-center justify-between pb-4 border-b border-cream-200 print:hidden">
          <div className="text-xs font-bold text-cream-500 uppercase tracking-wider">
            Official Accounting Voucher Printout
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs shadow-creamy active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Voucher</span>
            </button>
            <button onClick={onClose} className="p-2 rounded-xl border border-cream-200 text-cream-400 hover:text-cream-800 text-xs font-bold">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Voucher Document */}
        <div className="space-y-6 text-cream-900 font-sans border-2 border-cream-300 p-6 rounded-xl">
          <div className="flex justify-between items-start border-b border-cream-300 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-cream-950">SkyHorizon Travels & Tourism LLC</h2>
              <p className="text-xs text-cream-500">IATA Agency Code: 27-2-8910 • NTN # 4920194-8</p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded font-bold text-xs font-mono uppercase border ${
                voucher.type === 'RV' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                {voucher.type === 'RV' ? 'RECEIPT VOUCHER' : voucher.type === 'PV' ? 'PAYMENT VOUCHER' : 'JOURNAL VOUCHER'}
              </span>
              <div className="text-sm font-extrabold font-mono text-cream-950 mt-1">{voucher.voucherNumber}</div>
              <div className="text-xs text-cream-500 font-mono">Date: {voucher.date}</div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-cream-200">
              <span className="font-semibold text-cream-600">
                {voucher.type === 'RV' ? 'Received With Thanks From:' : 'Paid / Released To:'}
              </span>
              <span className="font-extrabold text-cream-950 text-sm">{voucher.partyName}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-cream-200">
              <span className="font-semibold text-cream-600">Payment Channel / Instrument:</span>
              <span className="font-bold text-cream-900">{voucher.paymentMethod} (Ref: {voucher.referenceNo})</span>
            </div>

            <div className="flex justify-between py-2 border-b border-cream-200">
              <span className="font-semibold text-cream-600">Amount Transacted:</span>
              <span className="text-lg font-mono font-extrabold text-gold-900">
                {formatCurrency(voucher.amount)}
              </span>
            </div>

            <div className="py-2">
              <span className="font-semibold text-cream-600 block mb-1">Particulars / Narration:</span>
              <p className="p-3 bg-cream-50 rounded-lg text-cream-800 italic">
                "{voucher.narration}"
              </p>
            </div>
          </div>

          {/* Signature Grid */}
          <div className="pt-10 grid grid-cols-3 gap-6 text-center text-xs text-cream-600">
            <div>
              <div className="border-t border-cream-400 pt-1.5 font-semibold">Prepared By</div>
            </div>
            <div>
              <div className="border-t border-cream-400 pt-1.5 font-semibold">Verified / Accountant</div>
            </div>
            <div>
              <div className="border-t border-cream-400 pt-1.5 font-semibold">Authorized Signatory / Receiver</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
