import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Globe, X, CheckCircle2 } from 'lucide-react';

interface VisaApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisaApplicationModal: React.FC<VisaApplicationModalProps> = ({ isOpen, onClose }) => {
  const { customers, addVisaApplication } = useAccounting();

  const [applicantName, setApplicantName] = useState('MR FAROOQ SADIQ');
  const [passportNumber, setPassportNumber] = useState('EG' + Math.floor(1000000 + Math.random() * 9000000));
  const [nationality, setNationality] = useState('Pakistani');
  const [destinationCountry, setDestinationCountry] = useState('Saudi Arabia');
  const [visaType, setVisaType] = useState<'Tourist 30D' | 'Tourist 90D' | 'Business' | 'Work' | 'Umrah eVisa'>('Umrah eVisa');
  const [embassyFee, setEmbassyFee] = useState<number>(140);
  const [serviceCharge, setServiceCharge] = useState<number>(50);
  const [supplierName, setSupplierName] = useState('Saudi Moafa Electronic Portal');
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === customerId) || customers[0];

    await addVisaApplication({
      applicantName,
      passportNumber,
      nationality,
      destinationCountry,
      visaType,
      embassyFee: Number(embassyFee),
      serviceCharge: Number(serviceCharge),
      supplierName,
      customerId: cust.id,
      customerName: cust.name,
      status: 'SUBMITTED',
      applicationDate: new Date().toISOString().split('T')[0]
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl border border-cream-200 shadow-creamy-lg max-w-lg w-full p-6 space-y-4 my-8">
        
        <div className="flex items-center justify-between pb-3 border-b border-cream-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-cream-950">Log Visa Application</h3>
              <p className="text-xs text-cream-500">Official embassy fee & agency consultancy service charge</p>
            </div>
          </div>
          <button onClick={onClose} className="text-cream-400 hover:text-cream-800 text-sm font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Applicant Full Name</label>
              <input
                type="text"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-bold"
              />
            </div>
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Passport Number</label>
              <input
                type="text"
                required
                value={passportNumber}
                onChange={(e) => setPassportNumber(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg font-mono font-bold text-cream-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Destination Country</label>
              <input
                type="text"
                required
                value={destinationCountry}
                onChange={(e) => setDestinationCountry(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-semibold"
              />
            </div>
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Visa Type</label>
              <select
                value={visaType}
                onChange={(e) => setVisaType(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-medium"
              >
                <option value="Umrah eVisa">Umrah eVisa</option>
                <option value="Tourist 30D">Tourist 30D</option>
                <option value="Tourist 90D">Tourist 90D</option>
                <option value="Business">Business Visa</option>
                <option value="Work">Work Visa Stamping</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-cream-600 font-semibold block mb-1">Client / Billing Account</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-cream-50/70 border border-cream-200 rounded-lg text-cream-900 font-semibold"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-cream-50/80 border border-cream-200">
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Consular / Embassy Fee ($)</label>
              <input
                type="number"
                step="any"
                required
                value={embassyFee}
                onChange={(e) => setEmbassyFee(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-white border border-cream-200 rounded-lg font-mono font-bold text-cream-900"
              />
            </div>
            <div>
              <label className="text-cream-600 font-semibold block mb-1">Agency Service Fee ($)</label>
              <input
                type="number"
                step="any"
                required
                value={serviceCharge}
                onChange={(e) => setServiceCharge(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-white border border-cream-200 rounded-lg font-mono font-bold text-emerald-800"
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
              Submit Visa & Post GL
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
