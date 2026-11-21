import React, { useState, useEffect } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Cpu, 
  Building2, 
  Delete, 
  PlusCircle, 
  HardDrive,
  Edit3,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface LockScreenProps {
  onOpenNewAgencyModal: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onOpenNewAgencyModal }) => {
  const { 
    agencyProfile, 
    deviceFingerprint, 
    unlockApp, 
    updateAgencyProfile,
    clearDataForNewAgency 
  } = useAccounting();

  // Setup mode (if agency name is not configured or user clicked edit)
  const isSetupNeeded = agencyProfile.isConfigured === false;
  const [isSetupMode, setIsSetupMode] = useState<boolean>(isSetupNeeded);

  // Setup form states
  const [setupAgencyName, setSetupAgencyName] = useState(
    agencyProfile.agencyName === 'Al-Haramain Travels & Tours' || agencyProfile.agencyName === 'My Travel Agency'
      ? ''
      : agencyProfile.agencyName
  );
  const [setupTagline, setSetupTagline] = useState(agencyProfile.tagline || 'Complete Travel & Tourism Accounting');
  const [setupCity, setSetupCity] = useState(agencyProfile.address || '');
  const [setupPin, setSetupPin] = useState(agencyProfile.pinCode || '1234');
  const [setupModeType, setSetupModeType] = useState<'clean' | 'demo'>('clean');

  // PIN verification states
  const [pin, setPin] = useState('');
  const [errorShake, setErrorShake] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setFeedbackMsg('');
  };

  const verifyPin = (pinToTest: string) => {
    const success = unlockApp(pinToTest);
    if (!success) {
      setErrorShake(true);
      setFeedbackMsg('Ghalat PIN code! Dobara koshish karein.');
      setTimeout(() => {
        setPin('');
        setErrorShake(false);
      }, 700);
    }
  };

  const handleSaveSetup = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = setupAgencyName.trim() || 'My Travel Agency';
    const finalPin = setupPin.trim() || '1234';

    if (setupModeType === 'clean') {
      clearDataForNewAgency(finalName, finalPin);
    } else {
      updateAgencyProfile({
        agencyName: finalName,
        tagline: setupTagline,
        address: setupCity,
        pinCode: finalPin,
        isConfigured: true
      });
      unlockApp(finalPin);
    }
    setIsSetupMode(false);
  };

  // Keyboard support for PIN entry
  useEffect(() => {
    if (isSetupMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isSetupMode]);

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F4EE] flex items-center justify-center p-4 selection:bg-gold-200 overflow-y-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-cream-200/80 rounded-3xl shadow-creamy-lg p-6 sm:p-8 relative overflow-hidden my-4">
        
        {/* Hardware & Privacy Badge */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-cream-100">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold text-cream-600 uppercase tracking-wider flex items-center gap-1 font-mono">
              <Cpu className="w-3.5 h-3.5 text-gold-600" />
              {deviceFingerprint}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <HardDrive className="w-3 h-3" />
            100% Offline Vault
          </span>
        </div>

        {/* SETUP MODE: First-time or edit agency name */}
        {isSetupMode ? (
          <div>
            <div className="text-center mb-5">
              <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-cream-950 via-cream-900 to-cream-800 items-center justify-center text-gold-400 shadow-creamy border border-cream-700/40 mb-2">
                <Building2 className="w-7 h-7 text-gold-400" />
              </div>
              <h1 className="text-xl font-extrabold text-cream-950 tracking-tight">
                Apni Travel Agency Ka Setup Karein
              </h1>
              <p className="text-xs text-cream-500 mt-1">
                Aapka hisab-kitab sirf aapke is computer par mehfooz rahega
              </p>
            </div>

            <form onSubmit={handleSaveSetup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-cream-800 mb-1">
                  Travel Agency Ka Naam: *
                </label>
                <input
                  type="text"
                  required
                  value={setupAgencyName}
                  onChange={(e) => setSetupAgencyName(e.target.value)}
                  placeholder="maslan: Khan Travels, Falcon Aviation, etc."
                  className="w-full px-3.5 py-2 text-xs bg-cream-50 border border-cream-300 rounded-xl text-cream-950 focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 font-medium"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-cream-700 mb-1">
                    City / Address:
                  </label>
                  <input
                    type="text"
                    value={setupCity}
                    onChange={(e) => setSetupCity(e.target.value)}
                    placeholder="e.g. Lahore / Karachi"
                    className="w-full px-3 py-1.5 text-xs bg-cream-50 border border-cream-300 rounded-lg text-cream-950"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-cream-700 mb-1">
                    4-Digit Security PIN:
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={setupPin}
                    onChange={(e) => setSetupPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="1234"
                    className="w-full px-3 py-1.5 text-xs bg-cream-50 border border-cream-300 rounded-lg text-cream-950 font-mono tracking-widest text-center"
                  />
                </div>
              </div>

              {/* Initial Data Choice */}
              <div>
                <label className="block text-[11px] font-bold text-cream-700 mb-1.5">
                  Accounting Books Shuru Karein:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    setupModeType === 'clean' 
                      ? 'bg-gold-50/80 border-gold-400 text-gold-950 ring-1 ring-gold-400 shadow-sm' 
                      : 'bg-white border-cream-200 text-cream-700 hover:bg-cream-50'
                  }`}>
                    <input
                      type="radio"
                      name="setupMode"
                      checked={setupModeType === 'clean'}
                      onChange={() => setSetupModeType('clean')}
                      className="sr-only"
                    />
                    <div className="text-[11px] font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                      Clean 0-Balance
                    </div>
                    <p className="text-[10px] text-cream-500 mt-0.5 leading-tight">
                      Asal agency ka zero balance se naya khata.
                    </p>
                  </label>

                  <label className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    setupModeType === 'demo' 
                      ? 'bg-gold-50/80 border-gold-400 text-gold-950 ring-1 ring-gold-400 shadow-sm' 
                      : 'bg-white border-cream-200 text-cream-700 hover:bg-cream-50'
                  }`}>
                    <input
                      type="radio"
                      name="setupMode"
                      checked={setupModeType === 'demo'}
                      onChange={() => setSetupModeType('demo')}
                      className="sr-only"
                    />
                    <div className="text-[11px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                      Practice Demo
                    </div>
                    <p className="text-[10px] text-cream-500 mt-0.5 leading-tight">
                      Software seekhne k liye sample entries.
                    </p>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-600 active:scale-95 text-white font-bold text-xs shadow-creamy transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Launch My Accounting Software 🚀</span>
                </button>
              </div>

              {agencyProfile.isConfigured && (
                <button
                  type="button"
                  onClick={() => setIsSetupMode(false)}
                  className="w-full text-center text-xs text-cream-500 hover:text-cream-800 py-1"
                >
                  Cancel (PIN Code Screen Par Wapas Jayein)
                </button>
              )}
            </form>
          </div>
        ) : (
          /* REGULAR PIN LOCK SCREEN */
          <div>
            {/* Agency Icon & Name */}
            <div className="text-center mb-5">
              <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-tr from-cream-950 via-cream-900 to-cream-800 items-center justify-center text-gold-400 shadow-creamy border border-cream-700/40 mb-3">
                <Building2 className="w-8 h-8 text-gold-400" />
              </div>
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-xl font-extrabold text-cream-950 tracking-tight">
                  {agencyProfile.agencyName}
                </h1>
                <button
                  onClick={() => setIsSetupMode(true)}
                  className="p-1 rounded-lg hover:bg-cream-100 text-cream-400 hover:text-gold-700 transition-colors"
                  title="Agency Ka Naam Badlein"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-cream-500 mt-1 max-w-xs mx-auto">
                Double-Entry Accounting & Khata Register
              </p>
            </div>

            {/* Device Privacy Notice */}
            <div className="mb-5 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-center">
              <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                🔒 <strong>100% Private Device Storage:</strong> Yeh khata sirf aapke is computer/device par mehfooz hai.
              </p>
            </div>

            {/* PIN Dots Display */}
            <div className="text-center mb-5">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-cream-600 mb-2.5">
                <Lock className="w-3.5 h-3.5 text-gold-600" />
                <span>Enter 4-Digit Security PIN</span>
              </div>

              <div className={`flex justify-center gap-3.5 transition-transform ${errorShake ? 'animate-bounce' : ''}`}>
                {[0, 1, 2, 3].map(idx => (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                      pin.length > idx
                        ? 'bg-gold-500 scale-125 shadow-sm'
                        : 'bg-cream-200 border-2 border-cream-300'
                    }`}
                  />
                ))}
              </div>

              {feedbackMsg ? (
                <p className="text-xs font-medium text-rose-600 mt-2 animate-fade-in">
                  {feedbackMsg}
                </p>
              ) : (
                <p className="text-[11px] text-cream-400 mt-1.5 font-medium">
                  (Default PIN: <code className="bg-cream-100 text-cream-800 px-1 py-0.5 rounded font-mono font-bold">{agencyProfile.pinCode || '1234'}</code>)
                </p>
              )}
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto mb-5">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeyPress(digit)}
                  className="h-11 rounded-xl bg-cream-50 hover:bg-gold-100/50 active:bg-gold-200 text-cream-900 font-bold text-lg border border-cream-200/60 transition-all shadow-sm active:scale-95 flex items-center justify-center"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  const targetPin = agencyProfile.pinCode || '1234';
                  setPin(targetPin);
                  verifyPin(targetPin);
                }}
                className="h-11 rounded-xl bg-gold-50 hover:bg-gold-100 text-gold-800 text-[10px] font-bold border border-gold-200/70 transition-all active:scale-95 flex flex-col items-center justify-center leading-tight"
                title="Auto Unlock with PIN"
              >
                <KeyRound className="w-3.5 h-3.5 mb-0.5 text-gold-600" />
                Quick Unlock
              </button>
              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className="h-11 rounded-xl bg-cream-50 hover:bg-gold-100/50 active:bg-gold-200 text-cream-900 font-bold text-lg border border-cream-200/60 transition-all shadow-sm active:scale-95 flex items-center justify-center"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="h-11 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all active:scale-95 flex items-center justify-center"
                title="Delete digit"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>

            {/* Footer Actions */}
            <div className="pt-3 border-t border-cream-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setIsSetupMode(true)}
                className="w-full py-2 px-3 rounded-xl bg-cream-100 hover:bg-cream-200/80 text-cream-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-gold-600" />
                Apni Agency Ka Naam Rakhein (Rename)
              </button>
              
              <div className="text-center text-[10px] text-cream-400 font-mono">
                Hardware Vault: {deviceFingerprint} | Zero Cloud Exposure
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
