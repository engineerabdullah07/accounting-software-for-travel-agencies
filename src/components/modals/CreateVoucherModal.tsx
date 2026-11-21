import React, { useState, useEffect } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { ArrowDownLeft, ArrowUpRight, X, CreditCard, Building } from 'lucide-react';

interface CreateVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'RV' | 'PV';
  initialPartyId?: string;
  initialAmount?: number;
}

export const CreateVoucherModal: React.FC<CreateVoucherModalProps> = ({
  isOpen,
  onClose,
  initialType = 'RV',
  initialPartyId,
  initialAmount
}) => {
  const { customers, vendors, accounts, createVoucher, activeCurrency } = useAccounting();

  const [type, setType] = useState<'RV' | 'PV'>(initialType);
  const [partyId, setPartyId] = useState(initialPartyId || '');
  const [amount, setAmount] = useState<number>(initialAmount || 500);
  const [paymentMethod, setPaymentMethod] = useState<'Bank Transfer' | 'Cash' | 'Cheque' | 'Credit Card'>('Bank Transfer');
  const [bankAccount, setBankAccount] = useState('acc-1030');
  const [referenceNo, setReferenceNo] = useState('TX-' + Math.floor(100000 + Math.random() * 900000));
  const [narration, setNarration] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    setType(initialType);
    if (initialPartyId) setPartyId(initialPartyId);
    if (initialAmount) setAmount(initialAmount);
  }, [initialType, initialPartyId, initialAmount]);

  if (!isOpen) return null;

  const bankAccounts = accounts.filter(a => a.category === 'ASSET' && (a.subCategory === 'Bank Accounts' || a.subCategory === 'Current Assets'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let partyName = '';
    if (type === 'RV') {
      const c = customers.find(cust => cust.id === partyId) || customers[0];
      partyName = c.name;
    } else {
      const v = vendors.find(vend => vend.id === partyId) || vendors[0];
      partyName = v.name;
    }

    await createVoucher({
      type,
      date,
      partyType: type === 'RV' ? 'CUSTOMER' : 'VENDOR',
      partyId: partyId || (type === 'RV' ? customers[0].id : vendors[0].id),
      partyName,
      amount: Number(amount),
      currency: activeCurrency,
      paymentMethod,
      bankAccount,
      referenceNo,
      narration: narration || `${type === 'RV' ? 'Receipt from' : 'Payment to'} ${partyName}`,
      status: 'POSTED'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl border border-cream-200 shadow-creamy-lg max-w-lg w-full p-6 space-y-4 my-8">
        
        <div className="flex items-center justify-between pb-3 border-b border-cream-200">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              type === 'RV' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}>
              {type === 'RV' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-cream-950">
                {type === 'RV' ? 'Issue Customer Receipt Voucher (RV)' : 'Issue Airline/Vendor Payment Voucher (PV)'}
              </h3>
              <p className="text-xs text-cream-500">Instant journal ledger update & balance settlement</p>
            </div>
          </div>
          <button onClick={onClose} className="text-cream-400 hover:text-cream-800 text-sm font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Voucher Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-cream-100/70 rounded-xl">
            <button
              type="button"
              onClick={() => { setType('RV'); setPartyId(customers[0]?.id || ''); }}
              className={`py-2 rounded-lg font-bold transition-all ${
                type === 'RV' ? 'bg-emerald-600 text-white shadow-sm' : 'text-cream-700 hover:text-cream-950'
              }`}
            >
              Receipt Voucher (RV)
            </button>
            <button
              type="button"
              onClick={() => { setType('PV'); setPartyId(vendors[0]?.id || ''); }}
              className={`py-2 rounded-lg font-bold transition-all ${
                type === 'PV' ? 'bg-rose-600 text-white shadow-sm' : 'text-cream-700 hover:text-cream-950'
              }`}
            >
              Payment Voucher (PV)
            </button>
          </div>

          {/* Party Selection */}
          <div>
            <label className="text-cream-600 font-semibold block mb-1">
              {type === 'RV' ? 'Receiving from Customer' : 'Paying to Supplier / Airline'}
            </label>
            <select
              value={partyId}
              onChange={(e) => setPartyId(e.target.value)}
              className="w-full px-3 py-2 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-bold"
            >
              {type === 'RV' ? (
                customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Due: ${c.currentBalance.toFixed(2)})
                  </option>
                ))
              ) : (
                vendors.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} (Payable: ${v.balance.toFixed(2)})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Voucher Amount ($)</label>
              <input
                type="number"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-cream-50/70 border border-cream-200 rounded-lg font-mono font-extrabold text-sm text-cream-950"
              />
            </div>
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Voucher Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-medium"
              />
            </div>
          </div>

          {/* Payment Method & Bank Account */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-medium"
              >
                <option value="Bank Transfer">Bank Transfer (Wire/IBFT)</option>
                <option value="Cash">Cash in Hand</option>
                <option value="Cheque">Crossed Cheque</option>
                <option value="Credit Card">Credit Card Terminal</option>
              </select>
            </div>

            <div>
              <label className="text-cream-600 font-semibold block mb-1">GL Account (Bank / Cash)</label>
              <select
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full px-3 py-2 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-medium"
              >
                {bankAccounts.map(b => (
                  <option key={b.id} value={b.id}>{b.code} - {b.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Reference & Narration */}
          <div>
            <label className="text-cream-600 font-semibold block mb-1">Cheque / Bank Reference No</label>
            <input
              type="text"
              required
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              placeholder="e.g. CHQ-482019 or Wire Ref"
              className="w-full px-3 py-2 bg-cream-50/70 border border-cream-200 rounded-lg font-mono text-cream-900"
            />
          </div>

          <div>
            <label className="text-cream-600 font-semibold block mb-1">Narration / Particulars</label>
            <textarea
              rows={2}
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              placeholder="Enter voucher narration notes..."
              className="w-full px-3 py-2 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900"
            />
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
              className={`px-5 py-2 rounded-xl text-white font-bold shadow-creamy active:scale-95 transition-all ${
                type === 'RV' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              Post {type} Voucher & Update GL
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
