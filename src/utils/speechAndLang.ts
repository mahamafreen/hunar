import { Language } from '../types';

// Web Speech API Voice synthesis helper
export function speakText(text: string, lang: Language = 'ur') {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'ur' ? 'ur-PK' : 'en-US';
  utterance.rate = 0.95; // Slightly slower for clarity
  utterance.pitch = 1.0;

  // Find Urdu voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.startsWith(lang === 'ur' ? 'ur' : 'en'));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// Bilingual UI translations dictionary
export const UI_STRINGS = {
  appName: {
    ur: 'ہنر',
    en: 'Hunar',
  },
  tagline: {
    ur: 'پاکستانی خواتین اور گھریلو ہنرمندوں کا آسان ترین بازار',
    en: 'Accessible Marketplace for Women Freelancers & Artisans',
  },
  voiceAssistBtn: {
    ur: 'آواز سے کنٹرول کریں',
    en: 'Voice Control',
  },
  voiceListening: {
    ur: 'سن رہا ہوں... فرمائیے',
    en: 'Listening... please speak',
  },
  publishGigBtn: {
    ur: 'نیا کام شائع کریں (+)',
    en: 'Post a Gig (+)',
  },
  exploreServices: {
    ur: 'تمام خدمات دریافت کریں',
    en: 'Explore Services',
  },
  ecosystemReels: {
    ur: 'ایکو سسٹم (ویڈیوز)',
    en: 'Ecosystem (Reels)',
  },
  myOrders: {
    ur: 'میرے آرڈرز',
    en: 'My Orders',
  },
  myEarnings: {
    ur: 'میری کمائی اور والٹ',
    en: 'Earnings & Wallet',
  },
  sellerMode: {
    ur: 'سیلر موڈ (ہنرمند)',
    en: 'Seller Mode',
  },
  buyerMode: {
    ur: 'خریدار موڈ',
    en: 'Buyer Mode',
  },
  safetySOS: {
    ur: 'خواتین ہیلپ لائن اور تحفظ',
    en: 'Safety & Emergency SOS',
  },
  freeTrialActive: {
    ur: '🎉 آپ کا 1 ہفتے کا فری ٹرائل فعال ہے! کوئی فیس نہیں',
    en: '🎉 1-Week Free Trial Active! 0% Platform Fee',
  },
  appFeeNotice: {
    ur: 'ٹرائل کے بعد صرف 5% شفاف ایپ فیس لاگو ہوگی',
    en: 'Only 5% transparent fee applies after trial period',
  },
  shopNow: {
    ur: 'ابھی خریدیں',
    en: 'Shop Now',
  },
  chatWithSeller: {
    ur: 'سیلر سے بات چیت',
    en: 'Chat with Seller',
  },
  autoTranslateActive: {
    ur: 'خودکار ترجمہ فعال ہے (اردو ↔ English)',
    en: 'Real-time Auto-Translate Active (Urdu ↔ English)',
  },
  biometricVerification: {
    ur: 'بائیو میٹرک و تصدیق',
    en: 'Biometric Verification',
  },
  verifiedSeller: {
    ur: 'تصدیق شدہ ہنرمند',
    en: 'Verified Artisan',
  },
  deliveryPartners: {
    ur: 'ڈلیوری پارٹنرز: لیپرڈ اور پوسٹ ایکس',
    en: 'Delivery Partners: Leopard & PostEx',
  },
};
