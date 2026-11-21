import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { AccountCategory } from '../../types';
import { BookOpen, Plus, Search, Layers } from 'lucide-react';

export const ChartOfAccountsView: React.FC = () => {
  const { accounts, addAccount, formatMoney } = useAccounting();
  const [searchTerm, setSearchTerm] = useState('');

  // New account form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AccountCategory>('EXPENSE');
  const [subCategory, setSubCategory] = useState('Office Expenses');

  const categories: AccountCategory[] = ['ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE'];

  const filteredAccounts = accounts.filter(a =>
    a.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.subCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;
    addAccount({
      code,
      name,
      category,
      subCategory
    });
    setCode('');
    setName('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-cream-950 tracking-tight">
            Chart of Accounts (COA Manager)
          </h1>
          <p className="text-xs text-cream-500 mt-1">
            General ledger master accounts tree. Add new bank accounts, expense heads, or revenue categories.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs shadow-creamy active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Account</span>
        </button>
      </div>

      {/* Add Account Dropdown Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="creamy-card p-5 space-y-4 animate-slide-up border-2 border-gold-400">
          <h3 className="font-bold text-sm text-cream-950">Create New General Ledger Account</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">GL Code (e.g. 1045 or 6080)</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="1045"
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg font-mono font-bold text-cream-900"
              />
            </div>
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Account Title</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dubai Visa Float"
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-bold"
              />
            </div>
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AccountCategory)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-medium"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Sub-Category</label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="e.g. Current Assets"
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-medium"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-cream-200 text-xs">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-lg border border-cream-200 text-cream-700 font-semibold hover:bg-cream-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-cream-900 text-gold-300 font-bold hover:bg-cream-800"
            >
              Save Account to COA
            </button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="creamy-card p-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search GL code or account name..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-cream-50/60 border border-cream-200 rounded-lg text-cream-900 placeholder-cream-400 focus:outline-none focus:ring-2 focus:ring-gold-500/40"
          />
        </div>
      </div>

      {/* Grouped Table */}
      <div className="space-y-4">
        {categories.map(cat => {
          const catAccounts = filteredAccounts.filter(a => a.category === cat);
          if (catAccounts.length === 0) return null;
          const catTotal = catAccounts.reduce((acc, a) => acc + a.balance, 0);

          return (
            <div key={cat} className="creamy-card overflow-hidden">
              <div className="bg-cream-100/80 px-4 py-2.5 border-b border-cream-200 flex items-center justify-between">
                <span className="font-extrabold text-xs text-cream-950 uppercase tracking-wider">
                  {cat} ({catAccounts.length} ACCOUNTS)
                </span>
                <span className="font-mono font-bold text-xs text-cream-900">
                  Total: {formatMoney(catTotal)}
                </span>
              </div>

              <table className="w-full text-left text-xs">
                <tbody className="divide-y divide-cream-100">
                  {catAccounts.map(acc => (
                    <tr key={acc.id} className="hover:bg-cream-50/70">
                      <td className="py-2.5 px-4 font-mono font-bold text-cream-900 w-28">{acc.code}</td>
                      <td className="py-2.5 px-3 font-semibold text-cream-950">{acc.name}</td>
                      <td className="py-2.5 px-3 text-cream-500 text-[11px]">{acc.subCategory}</td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-cream-950">
                        {formatMoney(acc.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
};
