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
  CheckCircle2,
  HardDrive
} from 'lucide-react';

interface LockScreenProps {
  onOpenNewAgencyModal: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onOpenNewAgencyModal }) => {
  const { agencyProfile, deviceFingerprint, unlockApp } = useAccounting();
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

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin]);

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F4EE] flex items-center justify-center p-4 selection:bg-gold-200">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-cream-200/80 rounded-3xl shadow-creamy-lg p-6 sm:p-8 relative overflow-hidden">
        
        {/* Hardware & Privacy Badge */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-cream-100">
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

        {/* Agency Icon & Name */}
        <div className="text-center mb-6">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-tr from-cream-950 via-cream-900 to-cream-800 items-center justify-center text-gold-400 shadow-creamy border border-cream-700/40 mb-3">
            <Building2 className="w-8 h-8 text-gold-400" />
          </div>
          <h1 className="text-xl font-extrabold text-cream-950 tracking-tight">
            {agencyProfile.agencyName}
          </h1>
          <p className="text-xs text-cream-500 mt-1 max-w-xs mx-auto">
            Double-Entry Accounting & Khata Register
          </p>
        </div>

        {/* Device Privacy Notice */}
        <div className="mb-6 p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-center">
          <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
            🔒 <strong>Device Security Active:</strong> Tamam khate aur bills sirf aapke is computer/browser par mehfooz hain. Kisi doosre user ko aapka data nazar nahi aayega.
          </p>
        </div>

        {/* PIN Dots Display */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-cream-600 mb-3">
            <Lock className="w-3.5 h-3.5 text-gold-600" />
            <span>Enter 4-Digit Security PIN</span>
          </div>

          <div className={`flex justify-center gap-4 transition-transform ${errorShake ? 'animate-bounce' : ''}`}>
            {[0, 1, 2, 3].map(idx => (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  pin.length > idx
                    ? 'bg-gold-500 scale-125 shadow-sm'
                    : 'bg-cream-200 border-2 border-cream-300'
                }`}
              />
            ))}
          </div>

          {feedbackMsg ? (
            <p className="text-xs font-medium text-rose-600 mt-2.5 animate-fade-in">
              {feedbackMsg}
            </p>
          ) : (
            <p className="text-[11px] text-cream-400 mt-2 font-medium">
              (Pehle se tay-shuda Demo PIN: <code className="bg-cream-100 text-cream-800 px-1 py-0.5 rounded font-mono font-bold">1234</code>)
            </p>
          )}
        </div>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="h-12 rounded-xl bg-cream-50 hover:bg-gold-100/50 active:bg-gold-200 text-cream-900 font-bold text-lg border border-cream-200/60 transition-all shadow-sm active:scale-95 flex items-center justify-center"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setPin('1234');
              verifyPin('1234');
            }}
            className="h-12 rounded-xl bg-gold-50 hover:bg-gold-100 text-gold-800 text-[11px] font-bold border border-gold-200/70 transition-all active:scale-95 flex flex-col items-center justify-center leading-tight"
            title="Auto Unlock with default 1234"
          >
            <KeyRound className="w-3.5 h-3.5 mb-0.5 text-gold-600" />
            Quick 1234
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-12 rounded-xl bg-cream-50 hover:bg-gold-100/50 active:bg-gold-200 text-cream-900 font-bold text-lg border border-cream-200/60 transition-all shadow-sm active:scale-95 flex items-center justify-center"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-12 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all active:scale-95 flex items-center justify-center"
            title="Delete digit"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-cream-100 flex flex-col gap-2">
          <button
            type="button"
            onClick={onOpenNewAgencyModal}
            className="w-full py-2.5 px-3 rounded-xl bg-cream-100 hover:bg-cream-200/80 text-cream-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-gold-600" />
            Start Clean (Apni Nayi Agency Banayein)
          </button>
          
          <div className="text-center text-[10px] text-cream-400 font-mono">
            Hardware Vault: {deviceFingerprint} | Zero Cloud Exposure
          </div>
        </div>

      </div>
    </div>
  );
};
