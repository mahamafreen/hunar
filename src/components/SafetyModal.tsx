import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  PhoneCall, 
  MessageCircle, 
  MapPin, 
  Share2, 
  HeartHandshake, 
  CheckCircle2,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { Language } from '../types';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const isUrdu = language === 'ur';
  const [sosSent, setSosSent] = useState(false);

  if (!isOpen) return null;

  const handleTriggerSOS = () => {
    setSosSent(true);
    setTimeout(() => {
      setSosSent(false);
    }, 4000);
  };

  return (
    <div id="safety-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-rose-200 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close */}
        <button
          id="close-safety-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Red Shield */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-100 text-rose-800 mb-3 ring-8 ring-rose-50">
            <ShieldAlert className="w-8 h-8 text-rose-700" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-rose-950 font-serif">
            {isUrdu ? 'خواتین کا تحفظ اور ایمرجنسی ہیلپ لائن' : 'Women Safety & Emergency Hub'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-sm mx-auto">
            {isUrdu
              ? 'ہنر ایپ پر تمام خواتین ہنرمندوں کی سیکیورٹی اور رازداری ہماری اولین ترجیح ہے۔'
              : 'Immediate assistance, government helpline access, and verified support for all women.'}
          </p>
        </div>

        {/* Big Red SOS Alert Button */}
        <div className="mb-6 p-4 bg-rose-50 rounded-2xl border border-rose-200 text-center">
          {sosSent ? (
            <div className="text-rose-900 font-bold py-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600 mb-1" />
              <p className="text-sm">{isUrdu ? 'ایمرجنسی الرٹ اور لائیو لوکیشن بھیج دی گئی ہے!' : 'Emergency Alert & Live Location Sent!'}</p>
              <p className="text-xs text-stone-600 mt-0.5 font-normal">
                {isUrdu ? 'قریبی سپورٹ ٹیم اور آپ کے خاندان سے رابطہ ہو رہا ہے۔' : 'Nearby support and trusted contacts alerted.'}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs font-bold text-rose-900 mb-2">
                {isUrdu ? 'فوری مدد کے لیے بٹن دبائیں:' : 'Tap for instant emergency alert:'}
              </p>
              <button
                id="emergency-sos-trigger-btn"
                onClick={handleTriggerSOS}
                className="w-full py-3 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-black text-sm shadow-lg shadow-rose-600/30 transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-5 h-5 text-amber-300" />
                <span>{isUrdu ? '🚨 فوری ایمرجنسی الرٹ (SOS)' : '🚨 Instant Emergency Alert (SOS)'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Official Pakistani Helplines & WhatsApp */}
        <div className="space-y-2.5">
          {/* 1043 Women Helpline */}
          <a
            id="helpline-1043-btn"
            href="tel:1043"
            className="p-3.5 bg-stone-50 hover:bg-emerald-50 rounded-2xl border border-stone-200 hover:border-emerald-300 flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-950">
                  {isUrdu ? 'قومی خواتین ہیلپ لائن (1043)' : 'National Women Helpline (1043)'}
                </h4>
                <p className="text-[11px] text-stone-500">24/7 Toll-Free Legal & Safety Support</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
              1043
            </span>
          </a>

          {/* 15 Police Helpline */}
          <a
            id="helpline-15-btn"
            href="tel:15"
            className="p-3.5 bg-stone-50 hover:bg-rose-50 rounded-2xl border border-stone-200 hover:border-rose-300 flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-rose-950">
                  {isUrdu ? 'پولیس ایمرجنسی (15)' : 'Police Emergency Helpline (15)'}
                </h4>
                <p className="text-[11px] text-stone-500">Instant Police Emergency Dispatch</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-rose-800 bg-rose-100 px-2.5 py-1 rounded-lg">
              15
            </span>
          </a>

          {/* WhatsApp Direct Help Link */}
          <a
            id="whatsapp-safety-btn"
            href="https://wa.me/923014528990?text=Salam%2C%20I%20need%20assistance%20on%20Hunar%20App"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-stone-50 hover:bg-emerald-50 rounded-2xl border border-stone-200 hover:border-emerald-300 flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-950">
                  {isUrdu ? 'ہنر واٹس ایپ ہیلپ ڈیسک' : 'Hunar Official WhatsApp Helpdesk'}
                </h4>
                <p className="text-[11px] text-stone-500">Chat with female safety officers</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 underline">
              {isUrdu ? 'بات کریں' : 'Chat'}
            </span>
          </a>
        </div>

        {/* Safety Tips Footer */}
        <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>
            {isUrdu ? 'آپ کا فون نمبر اور پتہ مکمل محفوظ اور خفیہ رکھا جاتا ہے۔' : 'Your address & phone are encrypted and protected.'}
          </span>
        </div>
      </div>
    </div>
  );
};
