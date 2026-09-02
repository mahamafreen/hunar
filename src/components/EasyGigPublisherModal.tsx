import React, { useState } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Sparkles, 
  Upload, 
  Check, 
  Truck, 
  DollarSign, 
  Clock, 
  Tag, 
  Layers, 
  Volume2, 
  AlertCircle,
  HelpCircle,
  Scissors,
  UtensilsCrossed,
  Sparkles as HennaIcon,
  Scale,
  BookOpen,
  Palette,
  HeartHandshake
} from 'lucide-react';
import { Gig, GigCategory, Language, User } from '../types';
import { CATEGORIES } from '../data/mockData';
import { speakText } from '../utils/speechAndLang';

interface EasyGigPublisherModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentUser: User | null;
  initialData?: Partial<Gig>;
  onGigPublished: (gig: Gig) => void;
}

export const EasyGigPublisherModal: React.FC<EasyGigPublisherModalProps> = ({
  isOpen,
  onClose,
  language,
  currentUser,
  initialData,
  onGigPublished,
}) => {
  const isUrdu = language === 'ur';

  // Mode: Voice-Assist First or Step-by-Step Manual
  const [creationTab, setCreationTab] = useState<'voice' | 'manual'>('voice');

  // Form State
  const [titleUrdu, setTitleUrdu] = useState(initialData?.titleUrdu || '');
  const [titleEn, setTitleEn] = useState(initialData?.titleEn || '');
  const [descriptionUrdu, setDescriptionUrdu] = useState(initialData?.descriptionUrdu || '');
  const [descriptionEn, setDescriptionEn] = useState(initialData?.descriptionEn || '');
  const [category, setCategory] = useState<GigCategory>(initialData?.category || 'Stitching & Tailoring');
  const [pricePKR, setPricePKR] = useState<number>(initialData?.pricePKR || 2000);
  const [deliveryDays, setDeliveryDays] = useState<number>(initialData?.deliveryDays || 3);
  const [selectedCouriers, setSelectedCouriers] = useState<('Leopard' | 'PostEx' | 'Local')[]>(['Leopard', 'PostEx']);
  const [imagePreview, setImagePreview] = useState<string>(
    initialData?.images?.[0] || 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800'
  );
  const [voiceSpokenPrompt, setVoiceSpokenPrompt] = useState('');
  const [isGeneratingWithGemini, setIsGeneratingWithGemini] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);

  if (!isOpen) return null;

  // Voice recording & instant AI fill
  const handleVoiceSpeak = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.lang = isUrdu ? 'ur-PK' : 'en-US';
      recog.onstart = () => setIsVoiceRecording(true);
      recog.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setVoiceSpokenPrompt(text);
        handleGenerateFromPrompt(text);
      };
      recog.onend = () => setIsVoiceRecording(false);
      recog.onerror = () => setIsVoiceRecording(false);
      recog.start();
    } else {
      // Fallback sample prompt
      const fallbackPrompt = isUrdu 
        ? 'میں لاہور میں ہاتھ سے فینسی کڑھائی اور سلائی کے سوٹ تیار کرتی ہوں، قیمت 2500 اور 3 دن میں لیپرڈ سے ڈلیوری ہوگی۔'
        : 'I make handcrafted embroidered suits in Lahore, price 2500 PKR, delivery in 3 days with Leopard courier.';
      setVoiceSpokenPrompt(fallbackPrompt);
      handleGenerateFromPrompt(fallbackPrompt);
    }
  };

  const handleGenerateFromPrompt = async (prompt: string) => {
    setIsGeneratingWithGemini(true);
    try {
      const res = await fetch('/api/smart-gig-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptText: prompt,
          spokenLanguage: language,
        }),
      });
      const data = await res.json();

      if (data.titleUrdu) setTitleUrdu(data.titleUrdu);
      if (data.titleEn) setTitleEn(data.titleEn);
      if (data.descriptionUrdu) setDescriptionUrdu(data.descriptionUrdu);
      if (data.descriptionEn) setDescriptionEn(data.descriptionEn);
      if (data.category) setCategory(data.category);
      if (data.suggestedPricePKR) setPricePKR(data.suggestedPricePKR);
      if (data.deliveryDays) setDeliveryDays(data.deliveryDays);

      speakText(
        isUrdu ? 'آپ کا کام تیار کر دیا گیا ہے، برائے مہربانی چیک کر کے شائع کر دیں۔' : 'Your gig is prepared. Please review and publish.',
        isUrdu ? 'ur' : 'en'
      );
    } catch (err) {
      console.error('Smart generator error', err);
    } finally {
      setIsGeneratingWithGemini(false);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    const newGig: Gig = {
      id: `gig_${Date.now()}`,
      sellerId: currentUser?.id || 'usr_seller_guest',
      sellerName: currentUser?.name || 'Artisan Seller',
      sellerNameUrdu: currentUser?.nameUrdu || 'خاتون ہنرمند',
      sellerAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
      sellerCity: currentUser?.city || 'Lahore',
      sellerRating: 5.0,
      sellerIsVerified: currentUser?.isVerified || true,
      titleUrdu: titleUrdu || 'نئی معیاری گھریلو سروس',
      titleEn: titleEn || 'New Quality Home Service',
      descriptionUrdu: descriptionUrdu || 'مکمل تسلی بخش گھریلو کام۔',
      descriptionEn: descriptionEn || 'Reliable home-crafted service with care.',
      category: category,
      pricePKR: Number(pricePKR) || 1500,
      deliveryDays: Number(deliveryDays) || 3,
      images: [imagePreview],
      tags: [category, 'Hunar', 'Pakistani Women'],
      couriers: selectedCouriers,
      ordersCompleted: 0,
      rating: 5.0,
      featured: true,
    };

    onGigPublished(newGig);
    onClose();
  };

  const toggleCourier = (c: 'Leopard' | 'PostEx' | 'Local') => {
    if (selectedCouriers.includes(c)) {
      if (selectedCouriers.length > 1) {
        setSelectedCouriers(selectedCouriers.filter(item => item !== c));
      }
    } else {
      setSelectedCouriers([...selectedCouriers, c]);
    }
  };

  return (
    <div id="gig-publisher-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          id="close-gig-publisher-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Fee Guarantee */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
              {isUrdu ? '1 ہفتہ فری ٹرائل • 0% فیس' : '1-Week Free Trial • 0% Platform Fee'}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              {isUrdu ? 'ٹرائل کے بعد صرف 5% فیس' : 'Then only 5% flat fee'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 font-serif mt-1">
            {isUrdu ? 'آسانی سے نیا کام شائع کریں' : 'Post Your Service / Product'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            {isUrdu
              ? 'فائیور کی پیچیدگیوں کے بغیر، آواز سے یا 3 آسان قدموں میں اپنا ہنر بیچیں۔'
              : 'No complicated Fiverr forms. Speak in Urdu/English or fill simple cards.'}
          </p>
        </div>

        {/* Top Tab: Voice Generator vs Manual Simple Form */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl mb-6 border border-stone-200">
          <button
            id="gig-tab-voice"
            onClick={() => setCreationTab('voice')}
            className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              creationTab === 'voice'
                ? 'bg-white text-emerald-950 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Mic className="w-4 h-4 text-emerald-700" />
            <span>{isUrdu ? '🎙️ آواز سے فوری بنائیں' : '🎙️ Voice Auto-Draft'}</span>
          </button>
          <button
            id="gig-tab-manual"
            onClick={() => setCreationTab('manual')}
            className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              creationTab === 'manual'
                ? 'bg-white text-emerald-950 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-4 h-4 text-stone-700" />
            <span>{isUrdu ? '📝 سادہ فارم' : '📝 Simple Form'}</span>
          </button>
        </div>

        {/* Voice Auto-Fill Assistant Panel */}
        {creationTab === 'voice' && (
          <div className="p-4 sm:p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-emerald-700" />
                {isUrdu ? 'مائیک دبائیں اور بتائیں آپ کیا بیچنا چاہتی ہیں:' : 'Tap mic and describe what you want to sell:'}
              </span>
              {isGeneratingWithGemini && (
                <span className="text-xs font-bold text-emerald-700">
                  {isUrdu ? 'تیار ہو رہا ہے...' : 'Generating gig...'}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                id="voice-prompt-text-input"
                value={voiceSpokenPrompt}
                onChange={(e) => setVoiceSpokenPrompt(e.target.value)}
                placeholder={isUrdu ? 'مثلاً: میں کراچی میں گھر کی بنی ہوئی چکن بریانی اور کباب بیچتی ہوں...' : 'e.g. I make handmade crochet bags in Rawalpindi, price 1800 PKR...'}
                className="flex-1 px-3.5 py-2.5 bg-white border border-emerald-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-emerald-600"
              />
              <button
                id="voice-mic-trigger-btn"
                type="button"
                onClick={handleVoiceSpeak}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  isVoiceRecording
                    ? 'bg-rose-600 text-white'
                    : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs'
                }`}
              >
                {isVoiceRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-amber-300" />}
                <span className="hidden sm:inline">{isVoiceRecording ? 'سن رہے ہیں...' : (isUrdu ? 'بولیں' : 'Speak')}</span>
              </button>
            </div>

            {/* Instant Sample Prompts */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              <span className="text-[11px] text-stone-500 font-medium self-center">{isUrdu ? 'آزمائیں:' : 'Try:'}</span>
              <button
                type="button"
                onClick={() => {
                  const p = isUrdu ? 'ہاتھ کی کڑھائی والے فینسی سوٹ، قیمت 2400 اور 3 دن میں ڈلیوری' : 'Hand embroidery fancy suit, price 2400 PKR in 3 days';
                  setVoiceSpokenPrompt(p);
                  handleGenerateFromPrompt(p);
                }}
                className="text-[11px] bg-white hover:bg-emerald-100 text-emerald-900 px-2 py-1 rounded-md border border-emerald-200 cursor-pointer font-urdu"
              >
                {isUrdu ? 'سوٹ کی کڑھائی و سلائی' : 'Dress Stitching'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const p = isUrdu ? 'گھر کی تازہ بریانی اور شامی کباب 1500 روپے' : 'Fresh homemade biryani & kababs 1500 PKR';
                  setVoiceSpokenPrompt(p);
                  handleGenerateFromPrompt(p);
                }}
                className="text-[11px] bg-white hover:bg-emerald-100 text-emerald-900 px-2 py-1 rounded-md border border-emerald-200 cursor-pointer font-urdu"
              >
                {isUrdu ? 'گھر کا تازہ کھانا' : 'Home Cooking'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const p = isUrdu ? 'خواتین کے لیے قانونی دستاویزات اور مشاورت 3500 روپے' : 'Legal counseling for women 3500 PKR';
                  setVoiceSpokenPrompt(p);
                  handleGenerateFromPrompt(p);
                }}
                className="text-[11px] bg-white hover:bg-emerald-100 text-emerald-900 px-2 py-1 rounded-md border border-emerald-200 cursor-pointer font-urdu"
              >
                {isUrdu ? 'قانونی مشاورت' : 'Legal Advice'}
              </button>
            </div>
          </div>
        )}

        {/* Main Editable Form */}
        <form onSubmit={handlePublish} className="space-y-4">
          {/* Category Selector with Clean Cards */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              {isUrdu ? 'کام کا شعبہ / کیٹیگری منتخب کریں:' : 'Select Category:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  id={`cat-select-${cat.id.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setCategory(cat.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    category === cat.id
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-2 ring-emerald-500/20'
                      : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                  }`}
                >
                  <span className="font-urdu font-bold text-xs line-clamp-1">{cat.nameUrdu}</span>
                  <span className="text-[10px] text-stone-500 line-clamp-1">{cat.nameEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Titles in Urdu & English */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isUrdu ? 'عنوان (اردو میں):' : 'Title in Urdu:'}
              </label>
              <input
                type="text"
                id="gig-title-urdu-input"
                value={titleUrdu}
                onChange={(e) => setTitleUrdu(e.target.value)}
                placeholder="مثلاً: ہاتھ سے نفیس کڑھائی اور سلائی"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-urdu focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isUrdu ? 'عنوان (انگریزی میں):' : 'Title in English:'}
              </label>
              <input
                type="text"
                id="gig-title-en-input"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Custom Hand Embroidery & Dress Stitching"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                required
              />
            </div>
          </div>

          {/* Pricing (PKR) & Delivery Days */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isUrdu ? 'قیمت (پاکستانی روپے PKR):' : 'Price in PKR (Rs.):'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-stone-500">Rs.</span>
                <input
                  type="number"
                  id="gig-price-input"
                  value={pricePKR}
                  onChange={(e) => setPricePKR(Number(e.target.value))}
                  min={100}
                  step={50}
                  className="w-full pl-10 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-bold text-emerald-950 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                  required
                />
              </div>
              <p className="text-[10px] text-stone-500 mt-1">
                {isUrdu ? '100% رقم آپ کے جاز کیش/ایزی پیسہ میں آئے گی (ٹرائل کے دوران)' : '100% goes to your wallet during trial'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isUrdu ? 'ڈلیوری کا وقت (دن):' : 'Delivery Timeline (Days):'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={1}
                  max={7}
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(Number(e.target.value))}
                  className="flex-1 accent-emerald-700"
                />
                <span className="text-xs font-bold bg-stone-100 px-3 py-2 rounded-xl border border-stone-200 text-emerald-950 min-w-16 text-center">
                  {deliveryDays} {isUrdu ? 'دن' : 'Days'}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Couriers: Leopard & PostEx */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center justify-between">
              <span>{isUrdu ? 'ڈلیوری پارٹنرز (ملک بھر میں ترسیل):' : 'Integrated Shipping Couriers:'}</span>
              <span className="text-[11px] text-stone-500">{isUrdu ? 'الگ چارجز' : 'Separate shipping rates'}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                id="courier-toggle-leopard"
                onClick={() => toggleCourier('Leopard')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedCouriers.includes('Leopard')
                    ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold'
                    : 'bg-stone-50 border-stone-200 text-stone-500'
                }`}
              >
                <Truck className="w-4 h-4 mx-auto mb-0.5 text-amber-700" />
                <p className="text-xs font-bold">Leopard Courier</p>
                <p className="text-[10px] text-stone-500">Rs. 250 (2-3 Days)</p>
              </button>

              <button
                type="button"
                id="courier-toggle-postex"
                onClick={() => toggleCourier('PostEx')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedCouriers.includes('PostEx')
                    ? 'bg-sky-50 border-sky-500 text-sky-950 font-bold'
                    : 'bg-stone-50 border-stone-200 text-stone-500'
                }`}
              >
                <Truck className="w-4 h-4 mx-auto mb-0.5 text-sky-700" />
                <p className="text-xs font-bold">PostEx Courier</p>
                <p className="text-[10px] text-stone-500">Rs. 200 (2 Days)</p>
              </button>

              <button
                type="button"
                id="courier-toggle-local"
                onClick={() => toggleCourier('Local')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedCouriers.includes('Local')
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                    : 'bg-stone-50 border-stone-200 text-stone-500'
                }`}
              >
                <Truck className="w-4 h-4 mx-auto mb-0.5 text-emerald-700" />
                <p className="text-xs font-bold">Local Rider / Pickup</p>
                <p className="text-[10px] text-stone-500">Same City (24 hrs)</p>
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isUrdu ? 'تفصیل (اردو میں):' : 'Description in Urdu:'}
            </label>
            <textarea
              id="gig-desc-input"
              rows={2}
              value={descriptionUrdu}
              onChange={(e) => setDescriptionUrdu(e.target.value)}
              placeholder={isUrdu ? 'اپنے کام کی تفصیل بتائیں...' : 'Provide details about your craft...'}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-urdu focus:bg-white focus:border-emerald-600 focus:outline-hidden"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-200">
            <button
              type="button"
              id="cancel-publish-btn"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
            >
              {isUrdu ? 'منسوخ کریں' : 'Cancel'}
            </button>

            <button
              type="submit"
              id="submit-publish-gig-btn"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-amber-300" />
              <span>{isUrdu ? 'شائع کریں (فوری لائیو)' : 'Publish Gig (Live)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
