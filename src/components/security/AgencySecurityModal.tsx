import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { 
  Building2, 
  ShieldCheck, 
  Cpu, 
  KeyRound, 
  Trash2, 
  Save, 
  X, 
  HardDrive, 
  Lock,
  Download,
  AlertTriangle,
  Smartphone
} from 'lucide-react';

interface AgencySecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPromptInstall?: () => void;
  canInstall?: boolean;
}

export const AgencySecurityModal: React.FC<AgencySecurityModalProps> = ({
  isOpen,
  onClose,
  onPromptInstall,
  canInstall
}) => {
  const { 
    agencyProfile, 
    deviceFingerprint, 
    updateAgencyProfile, 
    clearDataForNewAgency,
    exportDatabaseJSON,
    lockApp
  } = useAccounting();

  const [agencyName, setAgencyName] = useState(agencyProfile.agencyName);
  const [tagline, setTagline] = useState(agencyProfile.tagline || '');
  const [licenseNo, setLicenseNo] = useState(agencyProfile.licenseNo || '');
  const [phone, setPhone] = useState(agencyProfile.phone || '');
  const [email, setEmail] = useState(agencyProfile.email || '');
  const [address, setAddress] = useState(agencyProfile.address || '');
  const [pinCode, setPinCode] = useState(agencyProfile.pinCode || '1234');
  const [isLockEnabled, setIsLockEnabled] = useState(agencyProfile.isLockEnabled);

  // New clean agency state
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);
  const [newAgencyNameInput, setNewAgencyNameInput] = useState('');
  const [newAgencyPinInput, setNewAgencyPinInput] = useState('1234');

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.length !== 4 || !/^\d+$/.test(pinCode)) {
      alert('PIN Code must be exactly 4 numeric digits!');
      return;
    }
    updateAgencyProfile({
      agencyName,
      tagline,
      licenseNo,
      phone,
      email,
      address,
      pinCode,
      isLockEnabled
    });
    onClose();
  };

  const handleConfirmWipe = () => {
    if (!newAgencyNameInput.trim()) {
      alert('Please enter your agency name!');
      return;
    }
    clearDataForNewAgency(newAgencyNameInput, newAgencyPinInput);
    setShowWipeConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-cream-950/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-creamy-lg border border-cream-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-4 bg-cream-900 text-white flex items-center justify-between border-b border-cream-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-500/30">
              <ShieldCheck className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-cream-50">
                Agency Profile & Device Security
              </h2>
              <p className="text-xs text-cream-400 font-mono">
                Hardware Vault: {deviceFingerprint}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-cream-800 hover:bg-cream-700 text-cream-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Alert Badge */}
        <div className="p-4 bg-emerald-50/70 border-b border-emerald-100 flex items-center gap-3 text-xs text-emerald-900">
          <HardDrive className="w-5 h-5 text-emerald-700 shrink-0" />
          <div>
            <p className="font-bold">100% Client-Side Private Vault Guaranteed</p>
            <p className="text-emerald-700 mt-0.5">
              Tamam data aapke is specific device ke browser storage me encrypted hai. Koi cloud server ya doosra user aapka record access nahi kar sakta.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Section 1: Agency Business Details */}
          <div>
            <h3 className="text-xs font-bold text-cream-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gold-600" />
              Agency Details (Printed on Invoices & Statements)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-cream-700 mb-1">
                  Travel Agency Name *
                </label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-cream-50/50 border border-cream-300 rounded-lg text-cream-950 focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-cream-700 mb-1">
                  Tagline / Sub-heading
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-cream-50/50 border border-cream-300 rounded-lg text-cream-950"
                  placeholder="e.g. Govt Approved IATA Agency"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-cream-700 mb-1">
                  License / IATA / DTS Number
                </label>
                <input
                  type="text"
                  value={licenseNo}
                  onChange={(e) => setLicenseNo(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-cream-50/50 border border-cream-300 rounded-lg text-cream-950"
                  placeholder="e.g. IATA-PK-784210"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-cream-700 mb-1">
                  Agency Phone / WhatsApp
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-cream-50/50 border border-cream-300 rounded-lg text-cream-950"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-cream-700 mb-1">
                  Agency Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-cream-50/50 border border-cream-300 rounded-lg text-cream-950"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-cream-700 mb-1">
                  Office Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-cream-50/50 border border-cream-300 rounded-lg text-cream-950"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Security PIN & Hardware Fingerprint */}
          <div className="pt-4 border-t border-cream-200">
            <h3 className="text-xs font-bold text-cream-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-gold-600" />
              Vault Security & Hardware Lock
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-cream-700 mb-1">
                  4-Digit Security PIN *
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 text-sm font-mono tracking-widest bg-cream-50/50 border border-cream-300 rounded-lg text-cream-950"
                  placeholder="1234"
                />
                <span className="text-[11px] text-cream-500 mt-1 block">
                  Software ko kholte waqt yeh PIN manga jayega.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-cream-700 mb-1">
                  Auto-Lock Feature
                </label>
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLockEnabled}
                    onChange={(e) => setIsLockEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-gold-600 border-cream-300 focus:ring-gold-500"
                  />
                  <span className="text-xs font-medium text-cream-800">
                    Browser refresh ya tab band karne par auto lock karein
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Offline Desktop App Installation */}
          <div className="pt-4 border-t border-cream-200">
            <h3 className="text-xs font-bold text-cream-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-gold-600" />
              Download & Install as Offline Desktop App
            </h3>
            <div className="p-4 rounded-xl bg-gold-50/60 border border-gold-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-gold-950">
                  Apne Computer me Software ki tarah install karein
                </p>
                <p className="text-[11px] text-gold-800 mt-0.5">
                  Chrome / Edge browser me is web app ko direct desktop application ke taur par download kar sakte hain, internet ke baghair chalega.
                </p>
              </div>
              {canInstall && onPromptInstall ? (
                <button
                  type="button"
                  onClick={onPromptInstall}
                  className="px-4 py-2 rounded-xl bg-gold-600 hover:bg-gold-700 text-white font-bold text-xs shadow-creamy shrink-0"
                >
                  📥 Install App Now
                </button>
              ) : (
                <div className="text-[11px] font-semibold text-gold-800 bg-white/70 px-3 py-1.5 rounded-lg border border-gold-200 shrink-0">
                  Browser Menu (⋮) → "Install App" click karein
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Start Fresh Agency (Wipe Demo) */}
          <div className="pt-4 border-t border-cream-200">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                    <Trash2 className="w-4 h-4 text-rose-600" />
                    Demo Data Khatam Karein & Apni Asal Agency Shuru Karein
                  </h4>
                  <p className="text-[11px] text-rose-700 mt-1">
                    Agar aap dummy tickets aur ledgers hatakar bilkul naya, zero balance khata shuru karna chahte hain, toh yahan click karein.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWipeConfirm(!showWipeConfirm)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 transition-colors"
                >
                  {showWipeConfirm ? 'Cancel' : 'Start Clean Agency'}
                </button>
              </div>

              {showWipeConfirm && (
                <div className="mt-4 pt-4 border-t border-rose-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-rose-900 mb-1">
                        Apni Agency Ka Naam Likhein:
                      </label>
                      <input
                        type="text"
                        value={newAgencyNameInput}
                        onChange={(e) => setNewAgencyNameInput(e.target.value)}
                        placeholder="e.g. Bismillah Travels & Tours"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-rose-300 rounded-lg text-cream-950"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-rose-900 mb-1">
                        Naya 4-Digit Security PIN:
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={newAgencyPinInput}
                        onChange={(e) => setNewAgencyPinInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="1234"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-rose-300 rounded-lg text-cream-950 font-mono tracking-widest"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleConfirmWipe}
                      className="px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-all shadow-sm"
                    >
                      ⚠️ Yes, Wipe Demo & Create Clean Workspace
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-cream-50 border-t border-cream-200 flex items-center justify-between">
          <button
            type="button"
            onClick={lockApp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cream-200 hover:bg-cream-300 text-cream-800 text-xs font-bold transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-cream-700" />
            Lock Vault Now
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-cream-300 text-cream-700 hover:bg-cream-100 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveProfile}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-white text-xs font-bold shadow-creamy transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
