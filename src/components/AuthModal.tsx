import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Fingerprint, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Language, User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onAuthSuccess: (user: User) => void;
  onTriggerBiometric: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language,
  onAuthSuccess,
  onTriggerBiometric,
}) => {
  const isUrdu = language === 'ur';

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [name, setName] = useState('Ayesha Bibi');
  const [email, setEmail] = useState('ayesha.freelancer@gmail.com');
  const [phone, setPhone] = useState('+92 301 4528990');
  const [city, setCity] = useState('Lahore');
  const [password, setPassword] = useState('password123');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const authenticatedUser: User = {
      id: `usr_${Date.now()}`,
      name: name,
      nameUrdu: isUrdu ? 'عائشہ بی بی' : name,
      email: email,
      phone: phone,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
      role: 'seller',
      city: city,
      isVerified: false,
      verificationStatus: 'pending',
      cnicNumber: '35201-8934123-2',
      bioUrdu: 'دستکاری اور ہنر کے ذریعے باوقار روزگار۔',
      bioEn: 'Independent artisan creating handmade value from home.',
      rating: 5.0,
      reviewsCount: 0,
      trialDaysLeft: 7,
      earningsPKR: 0,
      availableBalancePKR: 0,
      completedOrdersCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      paymentMethods: {
        jazzcash: phone,
        easypaisa: phone,
      },
    };

    onAuthSuccess(authenticatedUser);
    onClose();
    // Prompt biometric identity verification immediately
    setTimeout(() => {
      onTriggerBiometric();
    }, 400);
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close */}
        <button
          id="close-auth-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-amber-200 flex items-center justify-center text-2xl font-bold font-serif mx-auto mb-3 shadow-xs">
            ہـ
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 font-serif">
            {authMode === 'signup' 
              ? (isUrdu ? 'نیا اکاؤنٹ بنائیں (ہنر)' : 'Join Hunar Marketplace')
              : (isUrdu ? 'اپنے اکاؤنٹ میں لاگ ان کریں' : 'Sign In to Your Account')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {isUrdu
              ? 'محفوظ اکاؤنٹ کے بعد جاز کیش کی طرح فنگر پرنٹ تصدیق کریں۔'
              : 'Secure account with JazzCash-style biometric fingerprint verification.'}
          </p>
        </div>

        {/* Toggle Login vs Register */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-stone-100 rounded-xl mb-5 border border-stone-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              authMode === 'signup' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {isUrdu ? 'نیا اکاؤنٹ بنائیں' : 'Create Account'}
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              authMode === 'login' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {isUrdu ? 'لاگ ان' : 'Sign In'}
          </button>
        </div>

        {/* Form with Manual Inputs (No Voice for Security as Mandated) */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {authMode === 'signup' && (
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                {isUrdu ? 'پورا نام:' : 'Full Name:'}
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  id="auth-name-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ayesha Bibi"
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-600"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-stone-700 mb-1">
              {isUrdu ? 'ای میل ایڈریس:' : 'Email Address:'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="email"
                id="auth-email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-600"
                required
              />
            </div>
          </div>

          {authMode === 'signup' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {isUrdu ? 'موبائل نمبر:' : 'Mobile Number:'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    id="auth-phone-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {isUrdu ? 'شہر:' : 'City:'}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    id="auth-city-input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Lahore / Karachi"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-600"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-stone-700 mb-1">
              {isUrdu ? 'پاس ورڈ:' : 'Password:'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="password"
                id="auth-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-600"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            id="auth-submit-btn"
            className="w-full mt-2 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>
              {authMode === 'signup' 
                ? (isUrdu ? 'اکاؤنٹ بنائیں اور تصدیق کریں' : 'Register & Verify Identity') 
                : (isUrdu ? 'لاگ ان کریں' : 'Sign In')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Biometric Flow Notice */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2 text-[11px] text-stone-500">
          <Fingerprint className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            {isUrdu 
              ? 'رجسٹریشن کے بعد آپ کے فنگر پرنٹ اور شناختی کارڈ کی تصدیق ہوگی۔'
              : 'Next step: Fingerprint scan verification for verified badge.'}
          </span>
        </div>
      </div>
    </div>
  );
};
