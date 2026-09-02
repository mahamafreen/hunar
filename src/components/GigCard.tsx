import React, { useState } from 'react';
import { 
  Star, 
  Truck, 
  ShoppingBag, 
  MessageSquare, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  MapPin, 
  Sparkles,
  Clock
} from 'lucide-react';
import { Gig, Language } from '../types';
import { speakText } from '../utils/speechAndLang';

interface GigCardProps {
  gig: Gig;
  language: Language;
  onOrderClick: (gig: Gig) => void;
  onChatClick: (sellerId: string, sellerName: string) => void;
  onSelectGig: (gigId: string) => void;
}

export const GigCard: React.FC<GigCardProps> = ({
  gig,
  language,
  onOrderClick,
  onChatClick,
  onSelectGig,
}) => {
  const isUrdu = language === 'ur';
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayVoiceNote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingAudio(true);
    const audioText = gig.voiceNoteDescription || (isUrdu ? gig.descriptionUrdu : gig.descriptionEn);
    speakText(audioText, isUrdu ? 'ur' : 'en');
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 4000);
  };

  return (
    <div
      id={`gig-card-${gig.id}`}
      onClick={() => onSelectGig(gig.id)}
      className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group cursor-pointer"
    >
      {/* Top Image & Voice Player Pill */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
        <img
          src={gig.images[0]}
          alt={gig.titleEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Courier Support Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="bg-stone-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20 flex items-center gap-1">
            <Truck className="w-3 h-3 text-amber-400" />
            <span>Leopard / PostEx</span>
          </span>
        </div>

        {/* Seller Voice Note Preview Button */}
        <button
          id={`play-voice-note-btn-${gig.id}`}
          onClick={handlePlayVoiceNote}
          className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-full backdrop-blur-md border text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
            isPlayingAudio
              ? 'bg-rose-600 text-white border-rose-400'
              : 'bg-white/90 hover:bg-white text-emerald-950 border-white/40'
          }`}
          title={isUrdu ? 'سیلر کی آواز میں سنیں' : 'Listen to seller voice note'}
        >
          {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-700" />}
          <span className="font-urdu text-[11px]">{isUrdu ? 'آواز میں سنیں 🎙️' : 'Voice Note 🎙️'}</span>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Seller Row */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={gig.sellerAvatar}
                alt={gig.sellerName}
                className="w-7 h-7 rounded-full object-cover border border-emerald-600 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-stone-900 truncate">
                    {gig.sellerName}
                  </span>
                  {gig.sellerIsVerified && (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-stone-500">
                  <MapPin className="w-2.5 h-2.5" />
                  <span>{gig.sellerCity}</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 shrink-0">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-amber-950">{gig.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-emerald-950 font-serif leading-snug line-clamp-2 mt-1">
            {isUrdu ? gig.titleUrdu : gig.titleEn}
          </h3>

          {/* Description Snippet */}
          <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed font-urdu">
            {isUrdu ? gig.descriptionUrdu : gig.descriptionEn}
          </p>
        </div>

        {/* Bottom Pricing & Action Buttons */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-stone-400 block uppercase tracking-wider">
              {isUrdu ? 'شروع قیمت:' : 'Starting from:'}
            </span>
            <div className="text-sm sm:text-base font-extrabold text-emerald-900 font-mono">
              Rs. {gig.pricePKR.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id={`card-chat-btn-${gig.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onChatClick(gig.sellerId, gig.sellerName);
              }}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              title={isUrdu ? 'سیلر سے گفتگو کریں' : 'Chat with seller'}
            >
              <MessageSquare className="w-4 h-4 text-stone-600" />
            </button>

            <button
              id={`card-order-btn-${gig.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onOrderClick(gig);
              }}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              <span>{isUrdu ? 'آرڈر کریں' : 'Order'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
