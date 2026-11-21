import React, { useState, useEffect } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { VoucherType } from '../../types';
import { CreditCard, X, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface NewVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: VoucherType;
  initialPartyId?: string;
  initialAmount?: number;
}

export const NewVoucherModal: React.FC<NewVoucherModalProps> = ({
  isOpen,
  onClose,
  initialType = 'RV',
  initialPartyId,
  initialAmount
}) => {
  const { parties, accounts, addVoucher, formatMoney } = useAccounting();

  const [type, setType] = useState<VoucherType>(initialType);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [partyId, setPartyId] = useState<string>(initialPartyId || '');
  const [amount, setAmount] = useState<number>(initialAmount || 50000);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'ONLINE' | 'ADJUSTMENT'>('BANK_TRANSFER');
  const [chequeOrRefNo, setChequeOrRefNo] = useState<string>('REF-' + Math.floor(100000 + Math.random() * 900000));
  const [narration, setNarration] = useState<string>('');

  // Default Debit & Credit GL accounts based on type
  const cashAcc = accounts.find(a => a.code === '1010') || accounts[0];
  const meezanAcc = accounts.find(a => a.code === '1030') || accounts[2];
  const receivableAcc = accounts.find(a => a.code === '1100') || accounts[5];
  const payableAcc = accounts.find(a => a.code === '2010') || accounts[6];

  const [debitAccountId, setDebitAccountId] = useState<string>(meezanAcc.id);
  const [creditAccountId, setCreditAccountId] = useState<string>(receivableAcc.id);

  useEffect(() => {
    setType(initialType);
    if (initialPartyId) setPartyId(initialPartyId);
    if (initialAmount) setAmount(initialAmount);

    if (initialType === 'RV') {
      setDebitAccountId(meezanAcc.id); // Dr. Bank
      setCreditAccountId(receivableAcc.id); // Cr. Receivables
      const cust = parties.filter(p => p.type === 'CUSTOMER')[0];
      if (!initialPartyId && cust) setPartyId(cust.id);
    } else if (initialType === 'PV') {
      setDebitAccountId(payableAcc.id); // Dr. Payables
      setCreditAccountId(meezanAcc.id); // Cr. Bank
      const sup = parties.filter(p => p.type === 'SUPPLIER')[0];
      if (!initialPartyId && sup) setPartyId(sup.id);
    }
  }, [initialType, initialPartyId, initialAmount]);

  if (!isOpen) return null;

  const relevantParties = type === 'RV' || type === 'CN'
    ? parties.filter(p => p.type === 'CUSTOMER')
    : parties.filter(p => p.type === 'SUPPLIER');

  const handleTypeSwitch = (newType: VoucherType) => {
    setType(newType);
    if (newType === 'RV') {
      setDebitAccountId(meezanAcc.id);
      setCreditAccountId(receivableAcc.id);
      const cust = parties.filter(p => p.type === 'CUSTOMER')[0];
      if (cust) setPartyId(cust.id);
    } else if (newType === 'PV') {
      setDebitAccountId(payableAcc.id);
      setCreditAccountId(meezanAcc.id);
      const sup = parties.filter(p => p.type === 'SUPPLIER')[0];
      if (sup) setPartyId(sup.id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const party = parties.find(p => p.id === partyId);
    const drAcc = accounts.find(a => a.id === debitAccountId) || accounts[0];
    const crAcc = accounts.find(a => a.id === creditAccountId) || accounts[1];

    await addVoucher({
      type,
      date,
      partyId: party?.id,
      partyName: party?.name,
      debitAccountId: drAcc.id,
      debitAccountName: `${drAcc.code} - ${drAcc.name}`,
      creditAccountId: crAcc.id,
      creditAccountName: `${crAcc.code} - ${crAcc.name}`,
      amount: Number(amount),
      paymentMethod,
      chequeOrRefNo,
      narration: narration || `${type === 'RV' ? 'Receipt from' : 'Payment to'} ${party?.name || drAcc.name}`
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
              {type === 'RV' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-cream-950">
                {type === 'RV' ? 'Customer Receipt Voucher (RV)' : type === 'PV' ? 'Supplier Payment Voucher (PV)' : 'General Journal Voucher (JV)'}
              </h3>
              <p className="text-xs text-cream-500">Post balanced debit/credit voucher to khata & cash/bank books</p>
            </div>
          </div>
          <button onClick={onClose} className="text-cream-400 hover:text-cream-800 text-sm font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Voucher Type Tabs */}
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-cream-100/70 rounded-xl font-bold">
            <button
              type="button"
              onClick={() => handleTypeSwitch('RV')}
              className={`py-1.5 rounded-lg transition-all ${
                type === 'RV' ? 'bg-emerald-600 text-white shadow-sm' : 'text-cream-700 hover:text-cream-950'
              }`}
            >
              Receipt (RV)
            </button>
            <button
              type="button"
              onClick={() => handleTypeSwitch('PV')}
              className={`py-1.5 rounded-lg transition-all ${
                type === 'PV' ? 'bg-rose-600 text-white shadow-sm' : 'text-cream-700 hover:text-cream-950'
              }`}
            >
              Payment (PV)
            </button>
            <button
              type="button"
              onClick={() => handleTypeSwitch('JV')}
              className={`py-1.5 rounded-lg transition-all ${
                type === 'JV' ? 'bg-cream-900 text-gold-300 shadow-sm' : 'text-cream-700 hover:text-cream-950'
              }`}
            >
              Journal (JV)
            </button>
            <button
              type="button"
              onClick={() => handleTypeSwitch('CN')}
              className={`py-1.5 rounded-lg transition-all ${
                type === 'CN' ? 'bg-sky-600 text-white shadow-sm' : 'text-cream-700 hover:text-cream-950'
              }`}
            >
              Credit Note
            </button>
          </div>

          {/* Party Selection (If RV or PV) */}
          {(type === 'RV' || type === 'PV' || type === 'CN') && (
            <div>
              <label className="text-cream-600 font-semibold block mb-1">
                {type === 'RV' || type === 'CN' ? 'Client Khata (Receiving from)' : 'Supplier Khata (Paying to)'}
              </label>
              <select
                value={partyId}
                onChange={(e) => setPartyId(e.target.value)}
                className="w-full px-3 py-2 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-bold"
              >
                {relevantParties.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.type === 'CUSTOMER' ? 'Due: ' + formatMoney(p.currentBalance) : 'Payable: ' + formatMoney(p.currentBalance)})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Voucher Amount</label>
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

          {/* Payment Method & Cheque Ref */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-medium"
              >
                <option value="BANK_TRANSFER">Bank Transfer (Online / IBFT)</option>
                <option value="CASH">Cash in Hand</option>
                <option value="CHEQUE">Crossed Cheque</option>
                <option value="ONLINE">POS / Online Terminal</option>
                <option value="ADJUSTMENT">Book Adjustment</option>
              </select>
            </div>

            <div>
              <label className="text-cream-600 font-semibold block mb-1">Cheque / Bank Reference #</label>
              <input
                type="text"
                value={chequeOrRefNo}
                onChange={(e) => setChequeOrRefNo(e.target.value)}
                placeholder="e.g. CHQ-882910"
                className="w-full px-3 py-2 bg-cream-50/70 border border-cream-200 rounded-lg font-mono text-cream-900 font-medium"
              />
            </div>
          </div>

          {/* Debit & Credit Accounts */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-cream-50/80 border border-cream-200">
            <div>
              <label className="text-emerald-800 font-bold block mb-1">Debit Account (Dr.)</label>
              <select
                value={debitAccountId}
                onChange={(e) => setDebitAccountId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-cream-200 rounded-lg text-cream-900 font-medium text-xs"
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sky-800 font-bold block mb-1">Credit Account (Cr.)</label>
              <select
                value={creditAccountId}
                onChange={(e) => setCreditAccountId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-cream-200 rounded-lg text-cream-900 font-medium text-xs"
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Narration */}
          <div>
            <label className="text-cream-600 font-semibold block mb-1">Particulars / Narration</label>
            <textarea
              rows={2}
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              placeholder="e.g. Payment received against invoice for Emirates tickets..."
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
              Post {type} Voucher to Ledger
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
