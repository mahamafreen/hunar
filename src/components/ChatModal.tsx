import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Languages, 
  CheckCheck, 
  Phone, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { ChatMessage, Language } from '../types';
import { speakText } from '../utils/speechAndLang';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  recipientName: string;
  recipientAvatar?: string;
  onQuickOrder?: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  language,
  recipientName,
  recipientAvatar = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
  onQuickOrder,
}) => {
  const isUrdu = language === 'ur';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      conversationId: 'conv_1',
      senderId: 'buyer_guest',
      senderName: 'Client (English Speaker)',
      senderRole: 'buyer',
      text: 'Hello! I loved your embroidery work on the reels. Can you prepare this custom design in green lawn fabric within 3 days?',
      originalLang: 'en',
      translatedText: 'سلام! مجھے ریلز پر آپ کا کڑھائی کا کام بہت پسند آیا۔ کیا آپ یہ خاص ڈیزائن 3 دن میں سبز لان کے کپڑے پر تیار کر سکتی ہیں؟',
      timestamp: '10:14 AM',
    },
    {
      id: 'msg_2',
      conversationId: 'conv_1',
      senderId: 'seller_current',
      senderName: 'Ayesha Bibi',
      senderRole: 'seller',
      text: 'جی بالکل! میں سبز لان کے کپڑے پر نفیس ہاتھ کی کڑھائی کر کے لیپرڈ کوریئر سے 3 دن میں بھجوا دوں گی۔',
      originalLang: 'ur',
      translatedText: 'Yes absolutely! I will craft the delicate hand embroidery on green lawn fabric and dispatch it via Leopard courier within 3 days.',
      timestamp: '10:16 AM',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [showOriginals, setShowOriginals] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setIsTranslating(true);

    try {
      // Send to translation API
      const targetLang = isUrdu ? 'en' : 'ur';
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: userText,
          targetLang,
          context: 'Pakistani artisan marketplace chat',
        }),
      });

      const data = await res.json();

      const newMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        conversationId: 'conv_1',
        senderId: 'seller_current',
        senderName: 'You',
        senderRole: 'seller',
        text: userText,
        originalLang: isUrdu ? 'ur' : 'en',
        translatedText: data.translated || userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, newMsg]);

      // Client auto-reply simulation for testing
      setTimeout(() => {
        const clientReplyUrdu = 'بہت شکریہ! میں آرڈر کر رہا ہوں۔ ایڈریس اسلام آباد کا ہے۔';
        const clientReplyEn = 'Thank you so much! Placing the order now with Leopard delivery to Islamabad.';

        const simulatedBuyerMsg: ChatMessage = {
          id: `msg_${Date.now() + 1}`,
          conversationId: 'conv_1',
          senderId: 'buyer_guest',
          senderName: recipientName,
          senderRole: 'buyer',
          text: isUrdu ? clientReplyEn : clientReplyUrdu,
          originalLang: isUrdu ? 'en' : 'ur',
          translatedText: isUrdu ? clientReplyUrdu : clientReplyEn,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, simulatedBuyerMsg]);
        speakText(isUrdu ? clientReplyUrdu : clientReplyEn, isUrdu ? 'ur' : 'en');
      }, 1200);

    } catch (err) {
      console.error('Translation error', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.lang = isUrdu ? 'ur-PK' : 'en-US';
      recog.onstart = () => setIsVoiceRecording(true);
      recog.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setInputMessage(text);
      };
      recog.onend = () => setIsVoiceRecording(false);
      recog.onerror = () => setIsVoiceRecording(false);
      recog.start();
    } else {
      setInputMessage(isUrdu ? 'میں 3 دن میں تیار کر کے بھیج دوں گی' : 'I will prepare and ship in 3 days');
    }
  };

  const toggleOriginal = (msgId: string) => {
    setShowOriginals(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  return (
    <div id="chat-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full h-[620px] shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Chat Header */}
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src={recipientAvatar}
              alt={recipientName}
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm sm:text-base leading-tight">{recipientName}</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <p className="text-[11px] text-emerald-200 flex items-center gap-1">
                <Languages className="w-3 h-3 text-amber-300" />
                <span>{isUrdu ? 'خودکار دوطرفہ ترجمہ فعال ہے' : 'Bilingual Auto-Translate Active'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* WhatsApp Quick Connect */}
            <a
              href="https://wa.me/923014528990?text=Hello%20I%20am%20contacting%20regarding%20Hunar%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 transition-colors"
              title="Direct WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
            </a>

            <button
              id="close-chat-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Translation Status Bar */}
        <div className="bg-amber-50 px-4 py-1.5 border-b border-amber-200 flex items-center justify-between text-[11px] text-amber-900">
          <span className="flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3 text-amber-700" />
            {isUrdu 
              ? 'اگر کلائنٹ انگریزی میں لکھے گا تو آپ کو اردو میں نظر آئے گا۔'
              : 'English and Urdu messages are translated live in real-time.'}
          </span>
          <span className="font-bold text-emerald-800 font-urdu">{isUrdu ? '100% آسان' : 'Auto-Sync'}</span>
        </div>

        {/* Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8F9FA]">
          {messages.map((msg) => {
            const isMe = msg.senderId === 'seller_current';
            const showOrig = showOriginals[msg.id];

            // If viewer is in Urdu mode: show Urdu text (either original or translated)
            // If viewer is in English mode: show English text
            const primaryText = isUrdu 
              ? (msg.originalLang === 'ur' ? msg.text : msg.translatedText)
              : (msg.originalLang === 'en' ? msg.text : msg.translatedText);

            const secondaryText = isUrdu 
              ? (msg.originalLang === 'en' ? msg.text : msg.translatedText)
              : (msg.originalLang === 'ur' ? msg.text : msg.translatedText);

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs border ${
                    isMe
                      ? 'bg-emerald-800 text-white border-emerald-900 rounded-br-xs'
                      : 'bg-white text-stone-900 border-stone-200 rounded-bl-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-[10px] font-bold ${isMe ? 'text-emerald-200' : 'text-emerald-800'}`}>
                      {msg.senderName}
                    </span>
                    <button
                      onClick={() => speakText(primaryText, isUrdu ? 'ur' : 'en')}
                      className={`p-1 rounded-md transition-colors ${
                        isMe ? 'hover:bg-emerald-700 text-emerald-200' : 'hover:bg-stone-100 text-stone-500'
                      }`}
                      title="Listen via audio"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Primary Translated Message (Always easy to read) */}
                  <p className={`text-xs sm:text-sm leading-relaxed ${isUrdu ? 'font-urdu font-medium' : ''}`}>
                    {primaryText}
                  </p>

                  {/* Original text toggle if translation occurred */}
                  {msg.originalLang !== (isUrdu ? 'ur' : 'en') && (
                    <div className="mt-2 pt-1.5 border-t border-black/10 text-[11px]">
                      <button
                        onClick={() => toggleOriginal(msg.id)}
                        className={`font-semibold cursor-pointer underline ${
                          isMe ? 'text-amber-200 hover:text-amber-100' : 'text-emerald-700 hover:text-emerald-900'
                        }`}
                      >
                        {showOrig 
                          ? (isUrdu ? 'اصل زبان چھپائیں' : 'Hide Original') 
                          : (isUrdu ? `اصل پیغام دیکھیں (${msg.originalLang === 'en' ? 'English' : 'اردو'})` : 'Show Original')}
                      </button>
                      {showOrig && (
                        <p className={`mt-1 opacity-80 text-[11px] ${msg.originalLang === 'ur' ? 'font-urdu' : ''}`}>
                          {msg.text}
                        </p>
                      )}
                    </div>
                  )}

                  <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-emerald-200' : 'text-stone-400'}`}>
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-amber-300" />}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with Voice & Instant Translate */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
          {/* Voice Input Button */}
          <button
            id="chat-voice-input-btn"
            type="button"
            onClick={handleVoiceInput}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              isVoiceRecording
                ? 'bg-rose-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
            title={isUrdu ? 'بول کر میسج لکھیں' : 'Voice message input'}
          >
            {isVoiceRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            id="chat-text-input"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isUrdu ? 'اپنا پیغام اردو یا انگلش میں لکھیں...' : 'Type message in Urdu or English...'}
            className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-emerald-600 font-urdu"
          />

          {/* Send Button */}
          <button
            type="submit"
            id="chat-send-btn"
            disabled={!inputMessage.trim() || isTranslating}
            className="p-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl disabled:opacity-40 transition-colors cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
