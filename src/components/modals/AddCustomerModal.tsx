import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Users, X } from 'lucide-react';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose }) => {
  const { addCustomer, activeCurrency } = useAccounting();

  const [name, setName] = useState('');
  const [type, setType] = useState<'Corporate' | 'Sub-Agent' | 'Individual'>('Corporate');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [creditLimit, setCreditLimit] = useState<number>(20000);
  const [creditDays, setCreditDays] = useState<number>(30);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer({
      name,
      type,
      contactPerson,
      email,
      phone,
      address,
      creditLimit: Number(creditLimit),
      creditDays: Number(creditDays),
      currency: activeCurrency
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl border border-cream-200 shadow-creamy-lg max-w-md w-full p-6 space-y-4 my-8">
        
        <div className="flex items-center justify-between pb-3 border-b border-cream-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-50 text-gold-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-cream-950">Add Corporate / B2B Client</h3>
              <p className="text-xs text-cream-500">Configure credit limit, terms & invoicing profile</p>
            </div>
          </div>
          <button onClick={onClose} className="text-cream-400 hover:text-cream-800 text-sm font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-cream-600 font-semibold block mb-1">Company / Client Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Al-Nasser Trading International"
              className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Account Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-medium"
              >
                <option value="Corporate">Corporate B2B</option>
                <option value="Sub-Agent">Sub-Agent</option>
                <option value="Individual">Individual Walk-in</option>
              </select>
            </div>

            <div>
              <label className="text-cream-600 font-semibold block mb-1">Contact Person</label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Finance Manager"
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="accounts@client.com"
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900"
              />
            </div>
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Phone / WhatsApp</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+971 50 1234567"
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900"
              />
            </div>
          </div>

          <div>
            <label className="text-cream-600 font-semibold block mb-1">Office Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Commercial District / City"
              className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-cream-50/80 border border-cream-200">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Credit Limit ($)</label>
              <input
                type="number"
                required
                value={creditLimit}
                onChange={(e) => setCreditLimit(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-white border border-cream-200 rounded-lg font-mono font-bold text-cream-900"
              />
            </div>
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Credit Days</label>
              <input
                type="number"
                required
                value={creditDays}
                onChange={(e) => setCreditDays(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-white border border-cream-200 rounded-lg font-mono font-bold text-cream-900"
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
              Save Client Profile
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
