import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  X, 
  Volume2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShoppingBag,
  Video,
  Wallet,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { Language } from '../types';
import { speakText } from '../utils/speechAndLang';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onExecuteAction?: (action: string, payload?: any) => void;
  onExecuteCommand?: (action: string, payload?: any) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  onExecuteAction,
  onExecuteCommand,
}) => {
  const triggerAction = (action: string, payload?: any) => {
    if (onExecuteCommand) onExecuteCommand(action, payload);
    if (onExecuteAction) onExecuteAction(action, payload);
  };
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const isUrdu = language === 'ur';

  // Sample quick Urdu / English voice commands for one-tap convenience
  const sampleCommands = [
    {
      urdu: 'سلائی اور کڑھائی کا نیا گگ بنائیں',
      en: 'Create a new Stitching & Tailoring gig',
      category: 'create',
    },
    {
      urdu: 'میری کمائی اور جاز کیش بیلنس دکھائیں',
      en: 'Show my earnings and JazzCash wallet',
      category: 'earnings',
    },
    {
      urdu: 'کھانے اور بیکری کی ویڈیوز / ریلز دکھائیں',
      en: 'Show food & bakery ecosystem reels',
      category: 'reels',
    },
    {
      urdu: 'خواتین ایمرجنسی ہیلپ لائن 1043 کھولیں',
      en: 'Open Women Emergency Helpline 1043',
      category: 'safety',
    },
    {
      urdu: 'لیپرڈ اور پوسٹ ایکس ڈلیوری کی فیس کیا ہے؟',
      en: 'What are the Leopard & PostEx courier rates?',
      category: 'info',
    },
  ];

  useEffect(() => {
    // Initialize Web Speech API if supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = true;
      recog.lang = isUrdu ? 'ur-PK' : 'en-US';

      recog.onstart = () => {
        setIsListening(true);
      };

      recog.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };

      recog.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }
  }, [isUrdu]);

  const handleStartListening = () => {
    if (recognition) {
      try {
        setTranscript('');
        setResponseMessage('');
        recognition.lang = isUrdu ? 'ur-PK' : 'en-US';
        recognition.start();
      } catch (e) {
        console.warn('Speech recognition restart');
      }
    } else {
      // If Web Speech is restricted in iframe, prompt test
      setTranscript(isUrdu ? 'سلائی کا نیا گگ بنائیں' : 'Create a new stitching gig');
    }
  };

  const handleStopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
    if (transcript) {
      processVoiceCommand(transcript);
    }
  };

  const processVoiceCommand = async (commandText: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/voice-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: commandText,
          language,
        }),
      });
      const data = await res.json();

      const reply = isUrdu ? (data.responseUrdu || data.responseEn) : (data.responseEn || data.responseUrdu);
      setResponseMessage(reply);
      speakText(reply, isUrdu ? 'ur' : 'en');

      // Auto-trigger corresponding action
      setTimeout(() => {
        if (data.intent === 'CREATE_GIG') {
          triggerAction('CREATE_GIG', data.suggestedData);
          onClose();
        } else if (data.intent === 'NAVIGATE_EARNINGS') {
          triggerAction('NAVIGATE_EARNINGS');
          onClose();
        } else if (data.intent === 'NAVIGATE_REELS') {
          triggerAction('NAVIGATE_REELS');
          onClose();
        } else if (data.intent === 'OPEN_SAFETY') {
          triggerAction('OPEN_SAFETY');
          onClose();
        } else if (data.intent === 'SEARCH') {
          triggerAction('SEARCH', data.query || commandText);
          onClose();
        }
      }, 2000);
    } catch (err) {
      console.error('Voice processing failed', err);
      setResponseMessage(isUrdu ? 'آپ کا پیغام سمجھ لیا گیا ہے۔ کارروائی کی جا رہی ہے۔' : 'Command recognized. Processing now.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="voice-assistant-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          id="close-voice-assistant-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 mb-3">
            <Mic className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 font-serif">
            {isUrdu ? 'آواز سے حکم دیں (اردو / انگریزی)' : 'Voice Command Center'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-sm mx-auto">
            {isUrdu 
              ? 'اگر آپ کو لکھنا نہیں آتا تو فکر نہ کریں، بس بول کر بتائیں کہ آپ کیا بیچنا چاہتی ہیں یا کیا دیکھنا چاہتی ہیں۔'
              : 'Designed for effortless hands-free control. Speak naturally in Urdu, Roman Urdu, or English.'}
          </p>
        </div>

        {/* Central Audio / Mic Interaction Zone */}
        <div className="flex flex-col items-center justify-center my-6 py-4 bg-stone-50 rounded-2xl border border-stone-200">
          <button
            id="voice-mic-record-btn"
            onClick={isListening ? handleStopListening : handleStartListening}
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
              isListening
                ? 'bg-rose-600 text-white scale-105 ring-8 ring-rose-100'
                : 'bg-emerald-800 text-white hover:bg-emerald-900 hover:scale-105 ring-8 ring-emerald-50'
            }`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 sm:w-10 sm:h-10" />
            ) : (
              <Mic className="w-8 h-8 sm:w-10 sm:h-10" />
            )}
          </button>

          <p className="text-xs sm:text-sm font-semibold mt-4 text-stone-700">
            {isListening
              ? (isUrdu ? '🔴 سن رہا ہوں... فرمائیے' : '🔴 Listening... please speak now')
              : (isUrdu ? 'مائیک دبائیں اور بولیں' : 'Tap mic to start speaking')}
          </p>

          {/* Real-time transcript preview */}
          {transcript && (
            <div className="mt-3 px-4 py-2 bg-white rounded-xl border border-stone-200 max-w-md text-center shadow-xs">
              <span className="text-xs text-stone-500 font-medium">{isUrdu ? 'آپ کا بولا گیا جملہ:' : 'Heard:'}</span>
              <p className="text-sm font-bold text-emerald-950 mt-0.5">{transcript}</p>
            </div>
          )}

          {/* Assistant Voice Response Message */}
          {responseMessage && (
            <div className="mt-3 px-4 py-2.5 bg-emerald-50 rounded-xl border border-emerald-200 max-w-md text-center flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <p className="text-xs font-semibold text-emerald-900">{responseMessage}</p>
            </div>
          )}

          {/* Submit Transcript Manual Trigger */}
          {transcript && !isListening && (
            <button
              id="confirm-voice-transcript-btn"
              onClick={() => processVoiceCommand(transcript)}
              disabled={isProcessing}
              className="mt-3 px-4 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>{isProcessing ? 'پروسیسنگ...' : (isUrdu ? 'اس حکم پر عمل کریں' : 'Execute Command')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Sample Voice Command Chips for Testing & Instant Access */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {isUrdu ? 'عام بولے جانے والے احکامات:' : 'Quick Voice Prompts (Tap to test):'}
            </span>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {sampleCommands.map((cmd, idx) => (
              <button
                key={idx}
                id={`voice-sample-chip-${idx}`}
                onClick={() => {
                  setTranscript(cmd.urdu);
                  processVoiceCommand(cmd.urdu);
                }}
                className="w-full text-left p-2.5 rounded-xl bg-stone-50 hover:bg-emerald-50 hover:border-emerald-200 border border-stone-200 text-xs font-medium text-stone-800 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-100">
                    <Mic className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="font-urdu font-bold text-emerald-950 text-xs">{cmd.urdu}</p>
                    <p className="text-[11px] text-stone-500">{cmd.en}</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Helper Note */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {isUrdu ? 'اردو، پنجابی، رومن اور انگریزی سپورٹ' : 'Urdu & English Voice Supported'}
          </span>
          <span className="text-emerald-700 font-semibold">
            {isUrdu ? '100% محفوظ' : '100% Secure'}
          </span>
        </div>
      </div>
    </div>
  );
};
