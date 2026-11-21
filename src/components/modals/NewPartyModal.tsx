import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { PartyType } from '../../types';
import { Users, X } from 'lucide-react';

interface NewPartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: PartyType;
}

export const NewPartyModal: React.FC<NewPartyModalProps> = ({ isOpen, onClose, defaultType = 'CUSTOMER' }) => {
  const { addParty } = useAccounting();

  const [type, setType] = useState<PartyType>(defaultType);
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [creditLimit, setCreditLimit] = useState<number>(300000);
  const [creditDays, setCreditDays] = useState<number>(15);
  const [openingBalance, setOpeningBalance] = useState<number>(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addParty({
      type,
      name,
      companyName,
      phone,
      email,
      address,
      creditLimit: type === 'CUSTOMER' ? Number(creditLimit) : undefined,
      creditDays: type === 'CUSTOMER' ? Number(creditDays) : undefined,
      openingBalance: Number(openingBalance)
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
              <h3 className="text-base font-bold text-cream-950">
                {type === 'CUSTOMER' ? 'Add Client / Customer Khata' : 'Add Supplier / Airline Khata'}
              </h3>
              <p className="text-xs text-cream-500">Configure party ledger profile and credit terms</p>
            </div>
          </div>
          <button onClick={onClose} className="text-cream-400 hover:text-cream-800 text-sm font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          <div className="grid grid-cols-2 gap-2 p-1 bg-cream-100/70 rounded-xl font-bold">
            <button
              type="button"
              onClick={() => setType('CUSTOMER')}
              className={`py-1.5 rounded-lg transition-all ${
                type === 'CUSTOMER' ? 'bg-gold-500 text-white shadow-sm' : 'text-cream-700 hover:text-cream-950'
              }`}
            >
              Client (Customer)
            </button>
            <button
              type="button"
              onClick={() => setType('SUPPLIER')}
              className={`py-1.5 rounded-lg transition-all ${
                type === 'SUPPLIER' ? 'bg-gold-500 text-white shadow-sm' : 'text-cream-700 hover:text-cream-950'
              }`}
            >
              Supplier (Airline/Vendor)
            </button>
          </div>

          <div>
            <label className="text-cream-600 font-semibold block mb-1">
              {type === 'CUSTOMER' ? 'Client / Individual Name' : 'Supplier / Airline Name'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Al-Nasser Logistics or Emirates Direct"
              className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Company / Sub-Agency Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Business entity"
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900"
              />
            </div>
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Phone / Mobile</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0300-1234567"
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="accounts@email.com"
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900"
              />
            </div>
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Opening Balance</label>
              <input
                type="number"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(Number(e.target.value))}
                placeholder="0"
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg font-mono font-bold text-cream-900"
              />
            </div>
          </div>

          {type === 'CUSTOMER' && (
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-cream-50/80 border border-cream-200">
              <div>
                <label className="text-cream-600 font-semibold block mb-1">Credit Limit</label>
                <input
                  type="number"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-white border border-cream-200 rounded-lg font-mono font-bold text-cream-900"
                />
              </div>
              <div>
                <label className="text-cream-600 font-semibold block mb-1">Credit Days</label>
                <input
                  type="number"
                  value={creditDays}
                  onChange={(e) => setCreditDays(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-white border border-cream-200 rounded-lg font-mono font-bold text-cream-900"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-cream-600 font-semibold block mb-1">Address / Location</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="City / Area"
              className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900"
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
              className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold shadow-creamy active:scale-95 transition-all"
            >
              Save Party Khata
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
