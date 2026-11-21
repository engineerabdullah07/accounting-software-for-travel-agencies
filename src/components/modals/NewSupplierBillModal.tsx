import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { FileText, X } from 'lucide-react';

interface NewSupplierBillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewSupplierBillModal: React.FC<NewSupplierBillModalProps> = ({ isOpen, onClose }) => {
  const { parties, addSupplierBill } = useAccounting();

  const suppliers = parties.filter(p => p.type === 'SUPPLIER');

  const [supplierId, setSupplierId] = useState<string>(suppliers[0]?.id || '');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState<string>(new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0]);
  const [description, setDescription] = useState<string>('IATA BSP Fortnightly Remittance Statement');
  const [amount, setAmount] = useState<number>(350000);
  const [paidAmount, setPaidAmount] = useState<number>(0);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === supplierId) || suppliers[0];

    await addSupplierBill({
      date,
      dueDate,
      supplierId: sup.id,
      supplierName: sup.name,
      description,
      amount: Number(amount),
      paidAmount: Number(paidAmount)
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl border border-cream-200 shadow-creamy-lg max-w-md w-full p-6 space-y-4 my-8">
        
        <div className="flex items-center justify-between pb-3 border-b border-cream-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-cream-950">Log Supplier / Airline Bill</h3>
              <p className="text-xs text-cream-500">Record statement payable to airline, consolidator or bedbank</p>
            </div>
          </div>
          <button onClick={onClose} className="text-cream-400 hover:text-cream-800 text-sm font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-cream-600 font-semibold block mb-1">Supplier / Airline</label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-bold"
            >
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.companyName})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Bill Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-medium"
              />
            </div>
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Payment Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-cream-600 font-semibold block mb-1">Bill Description / Statement Period</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Fortnight 2 Billing"
              className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Total Bill Amount</label>
              <input
                type="number"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg font-mono font-bold text-cream-900"
              />
            </div>
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Advance / Paid Amount</label>
              <input
                type="number"
                step="any"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg font-mono font-bold text-emerald-800"
              />
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
              Record Supplier Bill
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
