import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Truck, 
  ShoppingBag, 
  MessageSquare, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  Share2,
  Calendar
} from 'lucide-react';
import { Gig, Language } from '../types';
import { speakText } from '../utils/speechAndLang';

interface GigDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  gig: Gig | null;
  language: Language;
  onOrderClick: (gig: Gig) => void;
  onChatClick: (sellerId: string, sellerName: string) => void;
}

export const GigDetailModal: React.FC<GigDetailModalProps> = ({
  isOpen,
  onClose,
  gig,
  language,
  onOrderClick,
  onChatClick,
}) => {
  const isUrdu = language === 'ur';
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen || !gig) return null;

  const handlePlayVoiceNote = () => {
    setIsPlayingAudio(true);
    const audioText = gig.voiceNoteDescription || (isUrdu ? gig.descriptionUrdu : gig.descriptionEn);
    speakText(audioText, isUrdu ? 'ur' : 'en');
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 4500);
  };

  return (
    <div id="gig-detail-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 relative my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          id="close-gig-detail-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image with Overlay */}
        <div className="relative h-64 sm:h-72 w-full bg-stone-900">
          <img
            src={gig.images[0]}
            alt={gig.titleEn}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Badges on Hero */}
          <div className="absolute bottom-4 left-4 right-4 text-white flex flex-wrap items-center justify-between gap-2">
            <span className="bg-emerald-700/90 backdrop-blur-md text-emerald-100 text-xs font-bold px-3 py-1 rounded-full border border-white/20">
              {gig.category}
            </span>
            <div className="flex items-center gap-1 bg-amber-400/90 text-amber-950 font-bold text-xs px-2.5 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{gig.rating} ({gig.ordersCompleted} orders)</span>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Seller Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <img
                src={gig.sellerAvatar}
                alt={gig.sellerName}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm sm:text-base font-bold text-emerald-950">{gig.sellerName}</h4>
                  {gig.sellerIsVerified && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {isUrdu ? 'تصدیق شدہ' : 'Verified'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{gig.sellerCity}, Pakistan</span>
                </p>
              </div>
            </div>

            {/* Voice Audio Listen Button */}
            <button
              id="listen-gig-voice-btn"
              onClick={handlePlayVoiceNote}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-rose-600 text-white'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
              <span className="font-urdu">{isUrdu ? 'آواز میں تفصیل سنیں' : 'Hear Seller Audio'}</span>
            </button>
          </div>

          {/* Titles & Full Description */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-emerald-950 font-serif mb-2">
              {isUrdu ? gig.titleUrdu : gig.titleEn}
            </h2>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-urdu">
              {isUrdu ? gig.descriptionUrdu : gig.descriptionEn}
            </p>
          </div>

          {/* Courier & Logistics Guarantee */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
            <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-700" />
              <span>{isUrdu ? 'ڈلیوری اور کوریئر کی معلومات:' : 'Delivery & Courier Logistics:'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="font-bold text-amber-900 block">Leopard Courier</span>
                <span className="text-stone-500 text-[11px]">Rs. 250 • 2-3 Days Nationwide Delivery</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="font-bold text-sky-900 block">PostEx Courier</span>
                <span className="text-stone-500 text-[11px]">Rs. 200 • 2 Days Fast Track Delivery</span>
              </div>
            </div>
            <p className="text-[11px] text-emerald-800 font-medium">
              {isUrdu ? '✓ کوریئر چارجز الگ ہوں گے اور ٹریکنگ نمبر میسج میں بھیجا جائے گا۔' : '✓ Direct live parcel tracking sent via SMS & In-App.'}
            </p>
          </div>

          {/* Bottom Action Dock */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
            <div>
              <span className="text-xs text-stone-400 block uppercase tracking-wider">
                {isUrdu ? 'مقررہ قیمت:' : 'Fixed Price:'}
              </span>
              <div className="text-xl sm:text-2xl font-black text-emerald-950 font-mono">
                Rs. {gig.pricePKR.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="detail-chat-seller-btn"
                onClick={() => {
                  onClose();
                  onChatClick(gig.sellerId, gig.sellerName);
                }}
                className="py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-stone-600" />
                <span>{isUrdu ? 'سیلر سے بات کریں' : 'Chat'}</span>
              </button>

              <button
                id="detail-order-now-btn"
                onClick={() => {
                  onClose();
                  onOrderClick(gig);
                }}
                className="py-2.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span>{isUrdu ? 'ابھی آرڈر کریں' : 'Order Now'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
