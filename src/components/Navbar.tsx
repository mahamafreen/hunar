import React from 'react';
import { 
  Mic, 
  Globe, 
  ShieldAlert, 
  PlusCircle, 
  ShoppingBag, 
  Video, 
  Wallet, 
  UserCheck, 
  MessageSquare,
  Sparkles,
  PhoneCall,
  Menu,
  X,
  Languages
} from 'lucide-react';
import { Language, User } from '../types';

interface NavbarProps {
  language: Language;
  onToggleLanguage: () => void;
  currentUser: User | null;
  activeTab: 'marketplace' | 'ecosystem' | 'dashboard';
  onSelectTab: (tab: 'marketplace' | 'ecosystem' | 'dashboard') => void;
  onOpenVoiceAssistant: () => void;
  onOpenCreateGig: () => void;
  onOpenSafety: () => void;
  onOpenBiometric: () => void;
  onOpenAuth: () => void;
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  currentUser,
  activeTab,
  onSelectTab,
  onOpenVoiceAssistant,
  onOpenCreateGig,
  onOpenSafety,
  onOpenBiometric,
  onOpenAuth,
  onOpenChat,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const isUrdu = language === 'ur';

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Notice Banner: 1-Week Free Trial & Voice Notice & Quick Language Switcher */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-medium">
              {isUrdu 
                ? 'خوش آمدید! پہلے 7 دن تمام خدمات کی فروخت 100% مفت ہے (0% فیس)'
                : 'Welcome! First 7 days selling is 100% Free (0% platform fee)'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button 
              id="top-emergency-btn"
              onClick={onOpenSafety}
              className="flex items-center gap-1 text-rose-300 hover:text-rose-100 font-semibold cursor-pointer transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'خواتین ہیلپ لائن 1043' : 'Women Helpline 1043'}</span>
            </button>
            <span className="hidden sm:inline text-emerald-400">|</span>
            <span className="hidden sm:inline text-emerald-300">
              {isUrdu ? 'ڈلیوری: لیپرڈ اور پوسٹ ایکس' : 'Couriers: Leopard & PostEx'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button 
              id="brand-logo-btn"
              onClick={() => onSelectTab('marketplace')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-800 flex items-center justify-center text-amber-200 font-extrabold text-2xl shadow-sm group-hover:bg-emerald-900 transition-colors">
                ہـ
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-950 font-serif">
                    Hunar
                  </span>
                  <span className="text-sm font-urdu font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                    ہنر
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium line-clamp-1">
                  {isUrdu ? 'پاکستانی خواتین کا اپنا بازار' : 'Pakistani Women Freelancers & Artisans'}
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation Tabs for Desktop */}
          <nav className="hidden md:flex items-center p-1 bg-stone-100/80 rounded-xl border border-stone-200/80">
            <button
              id="nav-tab-marketplace"
              onClick={() => onSelectTab('marketplace')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'marketplace'
                  ? 'bg-white text-emerald-950 shadow-xs border border-stone-200'
                  : 'text-stone-600 hover:text-emerald-900 hover:bg-stone-50'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-700" />
              <span>{isUrdu ? 'خدمات بازار' : 'Services Marketplace'}</span>
            </button>

            <button
              id="nav-tab-ecosystem"
              onClick={() => onSelectTab('ecosystem')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'ecosystem'
                  ? 'bg-white text-emerald-950 shadow-xs border border-stone-200'
                  : 'text-stone-600 hover:text-emerald-900 hover:bg-stone-50'
              }`}
            >
              <Video className="w-4 h-4 text-rose-600" />
              <span>{isUrdu ? 'ویڈیو شوکیس و ریلز' : 'Artisan Showcase & Reels'}</span>
            </button>

            <button
              id="nav-tab-dashboard"
              onClick={() => onSelectTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-emerald-950 shadow-xs border border-stone-200'
                  : 'text-stone-600 hover:text-emerald-900 hover:bg-stone-50'
              }`}
            >
              <Wallet className="w-4 h-4 text-emerald-700" />
              <span>{isUrdu ? 'سیلر ڈیش بورڈ و والٹ' : 'Seller Dashboard & Wallet'}</span>
            </button>
          </nav>

          {/* Right Action Tools: Voice Mic, Post Gig, Language Toggle, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* High-Visibility Voice Assistant Trigger */}
            <button
              id="header-voice-mic-btn"
              onClick={onOpenVoiceAssistant}
              className="relative flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs transition-all cursor-pointer group"
              title={isUrdu ? 'آواز سے کنٹرول کریں (اردو / انگریزی)' : 'Voice Control (Urdu / English)'}
            >
              <div className="relative">
                <Mic className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition-transform" />
              </div>
              <span className="hidden sm:inline text-xs font-bold font-urdu">
                {isUrdu ? 'بول کر چلائیں 🎙️' : 'Voice Mode 🎙️'}
              </span>
            </button>

            {/* Quick Post Gig (+) Button */}
            <button
              id="header-create-gig-btn"
              onClick={onOpenCreateGig}
              className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span className="hidden lg:inline">{isUrdu ? 'نیا کام شائع کریں' : 'Post Gig'}</span>
              <span className="lg:hidden">{isUrdu ? 'نیا گگ' : 'Post'}</span>
            </button>

            {/* Chat Floating Button */}
            <button
              id="header-chat-btn"
              onClick={onOpenChat}
              className="p-2 sm:p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer relative"
              title={isUrdu ? 'پیغامات اور خودکار ترجمہ' : 'Messages with Auto-Translate'}
            >
              <MessageSquare className="w-4 h-4 text-stone-700" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-600 rounded-full border-2 border-white"></span>
            </button>

            {/* Dedicated Dual Language Toggle Mode: English <-> Urdu */}
            <div 
              id="language-toggle-container"
              className="flex items-center p-1 bg-stone-100 rounded-xl border border-stone-300 shadow-xs"
              role="group"
              aria-label="Language Mode Selector"
            >
              <button
                id="lang-toggle-en-btn"
                type="button"
                onClick={() => {
                  if (language !== 'en') {
                    onToggleLanguage();
                  }
                }}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  language === 'en'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/60'
                }`}
                title="Switch to English"
              >
                <span>English</span>
              </button>

              <button
                id="lang-toggle-ur-btn"
                type="button"
                onClick={() => {
                  if (language !== 'ur') {
                    onToggleLanguage();
                  }
                }}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold font-urdu transition-all cursor-pointer flex items-center gap-1 ${
                  language === 'ur'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/60'
                }`}
                title="اردو میں تبدیل کریں"
              >
                <span>اردو</span>
              </button>
            </div>

            {/* User Profile / Biometric Trigger */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 pl-1">
                <button
                  id="user-profile-avatar-btn"
                  onClick={onOpenBiometric}
                  className="relative flex items-center gap-1.5 p-1 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer group"
                  title={currentUser.isVerified ? 'Verified Artisan' : 'Tap to verify biometric'}
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-emerald-600"
                  />
                  {currentUser.isVerified && (
                    <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-600 text-white p-0.5 rounded-full ring-2 ring-white">
                      <UserCheck className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              </div>
            ) : (
              <button
                id="header-login-btn"
                onClick={onOpenAuth}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 px-2 py-1.5 rounded-lg hover:bg-emerald-50 cursor-pointer"
              >
                {isUrdu ? 'لاگ ان' : 'Sign In'}
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 py-3 space-y-2">
          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <span className="text-xs font-semibold text-stone-600 flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-emerald-700" />
              {isUrdu ? 'زبان منتخب کریں:' : 'App Language:'}
            </span>
            <div className="flex items-center p-0.5 bg-stone-100 rounded-lg border border-stone-200">
              <button
                id="mobile-lang-en"
                onClick={() => {
                  if (language !== 'en') onToggleLanguage();
                }}
                className={`px-3 py-1 text-xs font-bold rounded-md ${
                  language === 'en' ? 'bg-emerald-800 text-white' : 'text-stone-600'
                }`}
              >
                English
              </button>
              <button
                id="mobile-lang-ur"
                onClick={() => {
                  if (language !== 'ur') onToggleLanguage();
                }}
                className={`px-3 py-1 text-xs font-bold font-urdu rounded-md ${
                  language === 'ur' ? 'bg-emerald-800 text-white' : 'text-stone-600'
                }`}
              >
                اردو
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 pb-2">
            <button
              onClick={() => { onSelectTab('marketplace'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                activeTab === 'marketplace' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-stone-50 text-stone-700'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-700" />
              <span>{isUrdu ? 'خدمات بازار' : 'Marketplace'}</span>
            </button>
            <button
              onClick={() => { onSelectTab('ecosystem'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                activeTab === 'ecosystem' ? 'bg-rose-50 text-rose-900 border border-rose-200' : 'bg-stone-50 text-stone-700'
              }`}
            >
              <Video className="w-4 h-4 text-rose-600" />
              <span>{isUrdu ? 'ویڈیو شوکیس و ریلز' : 'Artisan Showcase & Reels'}</span>
            </button>
            <button
              onClick={() => { onSelectTab('dashboard'); setMobileMenuOpen(false); }}
              className={`col-span-2 p-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 ${
                activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-stone-50 text-stone-700'
              }`}
            >
              <Wallet className="w-4 h-4 text-emerald-700" />
              <span>{isUrdu ? 'سیلر ڈیش بورڈ، آرڈرز و کمائی' : 'Seller Dashboard, Orders & Earnings'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
            <button
              onClick={() => { onOpenBiometric(); setMobileMenuOpen(false); }}
              className="flex items-center gap-1.5 text-emerald-800 font-bold"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>{isUrdu ? 'بایومیٹرک تصدیق (JazzCash)' : 'Biometric ID Verification'}</span>
            </button>
            <button
              onClick={() => { onOpenSafety(); setMobileMenuOpen(false); }}
              className="flex items-center gap-1 text-rose-700 font-bold"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{isUrdu ? 'ہیلپ لائن 1043' : 'Helpline 1043'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
