import React, { useState } from 'react';
import { 
  Fingerprint, 
  CheckCircle, 
  X, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  Smartphone, 
  Lock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Language, User } from '../types';

interface BiometricVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentUser: User | null;
  onVerifySuccess: (updatedUser: User) => void;
}

export const BiometricVerificationModal: React.FC<BiometricVerificationModalProps> = ({
  isOpen,
  onClose,
  language,
  currentUser,
  onVerifySuccess,
}) => {
  const isUrdu = language === 'ur';

  const [cnic, setCnic] = useState(currentUser?.cnicNumber || '35201-8934123-2');
  const [phone, setPhone] = useState(currentUser?.phone || '+92 301 4528990');
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [scanProgress, setScanProgress] = useState(0);

  if (!isOpen) return null;

  const handleStartFingerprintScan = () => {
    setScanState('scanning');
    setScanProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      if (progress >= 100) {
        clearInterval(interval);
        setScanProgress(100);
        setScanState('success');
        
        // Update user state after brief animation
        setTimeout(() => {
          if (currentUser) {
            const updated: User = {
              ...currentUser,
              isVerified: true,
              verificationStatus: 'verified',
              cnicNumber: cnic,
              phone: phone,
            };
            onVerifySuccess(updated);
          }
        }, 1500);
      } else {
        setScanProgress(progress);
      }
    }, 200);
  };

  return (
    <div id="biometric-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close */}
        <button
          id="close-biometric-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Trust Badges */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3 shadow-xs">
            <Fingerprint className="w-8 h-8 text-emerald-700" />
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 py-1 px-3 rounded-full mx-auto w-fit border border-emerald-200 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>JazzCash / Easypaisa Verified Biometric System</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 font-serif">
            {isUrdu ? 'بایومیٹرک شناخت کی تصدیق' : 'Biometric Identity Verification'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {isUrdu
              ? 'خریداروں کا اعتماد حاصل کرنے کے لیے اپنا فنگر پرنٹ اور شناختی کارڈ تصدیق کریں۔'
              : 'Secure verification inspired by JazzCash & Easypaisa for verified seller trust.'}
          </p>
        </div>

        {/* CNIC & Phone Input Section */}
        <div className="space-y-3 mb-6">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isUrdu ? 'قومی شناختی کارڈ نمبر (CNIC)' : 'National CNIC Number'}
            </label>
            <div className="relative">
              <CreditCard className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                id="biometric-cnic-input"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                placeholder="35201-XXXXXXX-X"
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isUrdu ? 'موبائل فون نمبر (JazzCash / Easypaisa)' : 'Registered Mobile Number'}
            </label>
            <div className="relative">
              <Smartphone className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                id="biometric-phone-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Interactive Fingerprint Scanner */}
        <div className="p-6 bg-stone-900 rounded-2xl text-center relative overflow-hidden flex flex-col items-center justify-center border border-stone-800 shadow-inner">
          {/* Laser Scanning Animation Beam */}
          {scanState === 'scanning' && (
            <div 
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] transition-all duration-200 z-10"
              style={{ top: `${scanProgress}%` }}
            ></div>
          )}

          <button
            id="fingerprint-scan-interactive-btn"
            onClick={handleStartFingerprintScan}
            disabled={scanState === 'scanning' || scanState === 'success'}
            className={`w-24 h-24 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative ${
              scanState === 'success'
                ? 'bg-emerald-600 text-white ring-4 ring-emerald-400'
                : scanState === 'scanning'
                ? 'bg-stone-800 text-emerald-400 ring-4 ring-emerald-500/50'
                : 'bg-stone-800 hover:bg-stone-700 text-emerald-400 ring-2 ring-emerald-500/30'
            }`}
          >
            {scanState === 'success' ? (
              <CheckCircle className="w-12 h-12 text-white animate-in zoom-in-50" />
            ) : (
              <Fingerprint className="w-14 h-14" />
            )}
          </button>

          {/* Scanner Status Message */}
          <div className="mt-4">
            {scanState === 'idle' && (
              <>
                <p className="text-xs sm:text-sm font-bold text-stone-200">
                  {isUrdu ? 'انگوٹھا اسکین کرنے کے لیے دبائیں' : 'Press to Scan Fingerprint'}
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  {isUrdu ? 'نادرا اور بینک سیکیورٹی پروٹوکول' : 'NADRA & Banking Biometric Protocol'}
                </p>
              </>
            )}

            {scanState === 'scanning' && (
              <>
                <p className="text-xs sm:text-sm font-bold text-emerald-400">
                  {isUrdu ? `شناخت کی تصدیق ہو رہی ہے... ${scanProgress}%` : `Verifying Biometrics... ${scanProgress}%`}
                </p>
                <div className="w-36 h-1.5 bg-stone-800 rounded-full mx-auto mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-200" 
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </>
            )}

            {scanState === 'success' && (
              <div className="text-emerald-400">
                <p className="text-sm font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  {isUrdu ? 'مبارک ہو! تصدیق کامیاب ہو گئی' : 'Verification Successful!'}
                </p>
                <p className="text-[11px] text-emerald-300 mt-0.5">
                  {isUrdu ? 'تصدیق شدہ ہنرمند بیج فعال کر دیا گیا ہے' : 'Verified Artisan Badge Granted'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Benefits Note */}
        <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-2.5 text-xs text-stone-600">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-emerald-950">
              {isUrdu ? 'تصدیق شدہ اکاؤنٹ کے فوائد:' : 'Verified Account Benefits:'}
            </span>
            <p className="text-[11px] mt-0.5 text-stone-500">
              {isUrdu
                ? 'فوری آرڈرز، جاز کیش/ایزی پیسہ میں 24 گھنٹے میں ادائیگی اور خریداروں کا فوری اعتماد۔'
                : 'Priority placement, 24-hr payouts to JazzCash/Easypaisa, and buyer trust badge.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
