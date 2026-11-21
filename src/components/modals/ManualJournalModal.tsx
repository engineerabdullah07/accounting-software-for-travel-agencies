import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { BookOpen, X, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ManualJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TempLine {
  accountId: string;
  debit: number;
  credit: number;
  description: string;
}

export const ManualJournalModal: React.FC<ManualJournalModalProps> = ({ isOpen, onClose }) => {
  const { accounts, postDirectJournalEntry, formatCurrency } = useAccounting();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [referenceNo, setReferenceNo] = useState('JV-' + Math.floor(1000 + Math.random() * 9000));
  const [description, setDescription] = useState('Month-end depreciation & GDS terminal adjustment');

  const [lines, setLines] = useState<TempLine[]>([
    { accountId: accounts[0]?.id || '', debit: 500, credit: 0, description: '' },
    { accountId: accounts[1]?.id || '', debit: 0, credit: 500, description: '' }
  ]);

  if (!isOpen) return null;

  const totalDebit = lines.reduce((acc, l) => acc + Number(l.debit || 0), 0);
  const totalCredit = lines.reduce((acc, l) => acc + Number(l.credit || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

  const handleAddLine = () => {
    setLines([...lines, { accountId: accounts[0]?.id || '', debit: 0, credit: 0, description: '' }]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length > 2) {
      setLines(lines.filter((_, i) => i !== index));
    }
  };

  const handleLineChange = (index: number, field: keyof TempLine, val: any) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: val };
    setLines(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) return;

    const formattedLines = lines.map(l => {
      const acc = accounts.find(a => a.id === l.accountId) || accounts[0];
      return {
        accountId: acc.id,
        accountCode: acc.code,
        accountName: acc.name,
        debit: Number(l.debit || 0),
        credit: Number(l.credit || 0),
        description: l.description
      };
    });

    const success = postDirectJournalEntry({
      date,
      voucherType: 'JOURNAL',
      referenceNo,
      description,
      totalDebit,
      totalCredit,
      lines: formattedLines
    });

    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl border border-cream-200 shadow-creamy-lg max-w-2xl w-full p-6 space-y-4 my-8">
        
        <div className="flex items-center justify-between pb-3 border-b border-cream-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-50 text-gold-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-cream-950">Post Manual General Journal Entry</h3>
              <p className="text-xs text-cream-500">Double-entry voucher with live Debit = Credit balance enforcement</p>
            </div>
          </div>
          <button onClick={onClose} className="text-cream-400 hover:text-cream-800 text-sm font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Journal Reference #</label>
              <input
                type="text"
                required
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg font-mono font-bold text-cream-900"
              />
            </div>
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Entry Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-cream-600 font-semibold block mb-1">Entry Narration / Purpose</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900"
            />
          </div>

          {/* Dynamic Lines Table */}
          <div className="border border-cream-200 rounded-xl overflow-hidden">
            <div className="bg-cream-100/70 px-3 py-2 border-b border-cream-200 flex justify-between items-center text-[10px] font-bold text-cream-600 uppercase">
              <span>General Ledger Distribution Lines</span>
              <button
                type="button"
                onClick={handleAddLine}
                className="flex items-center gap-1 text-gold-700 hover:text-gold-900 font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Line</span>
              </button>
            </div>

            <div className="p-2 space-y-2 max-h-60 overflow-y-auto">
              {lines.map((line, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={line.accountId}
                    onChange={(e) => handleLineChange(idx, 'accountId', e.target.value)}
                    className="flex-1 px-2 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-medium text-xs"
                  >
                    {accounts.map(a => (
                      <option key={a.id} value={a.id}>{a.code} - {a.name} ({a.category})</option>
                    ))}
                  </select>

                  <input
                    type="number"
                    step="any"
                    placeholder="Debit"
                    value={line.debit || ''}
                    onChange={(e) => handleLineChange(idx, 'debit', Number(e.target.value))}
                    className="w-24 px-2 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg font-mono text-emerald-800 font-bold text-right"
                  />

                  <input
                    type="number"
                    step="any"
                    placeholder="Credit"
                    value={line.credit || ''}
                    onChange={(e) => handleLineChange(idx, 'credit', Number(e.target.value))}
                    className="w-24 px-2 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg font-mono text-sky-800 font-bold text-right"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveLine(idx)}
                    disabled={lines.length <= 2}
                    className="p-1.5 text-cream-400 hover:text-rose-600 disabled:opacity-30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-cream-100/90 px-3 py-2 border-t border-cream-200 flex justify-between items-center text-xs font-bold font-mono">
              <span className="font-sans text-cream-600">Totals:</span>
              <div className="flex gap-6 pr-6">
                <span className="text-emerald-900">Dr: {formatCurrency(totalDebit)}</span>
                <span className="text-sky-900">Cr: {formatCurrency(totalCredit)}</span>
              </div>
            </div>
          </div>

          {/* Validation Status */}
          <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
            isBalanced ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}>
            {isBalanced ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{isBalanced ? 'Balanced: Ready to post to General Ledger.' : `Imbalance of $${Math.abs(totalDebit - totalCredit).toFixed(2)}. Debits must equal Credits.`}</span>
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
              disabled={!isBalanced}
              className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 disabled:opacity-40 text-white font-bold shadow-creamy active:scale-95 transition-all"
            >
              Post Journal Voucher
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
