import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Hunar Marketplace API", time: new Date().toISOString() });
});

// Translation API: Translates between Urdu (and Roman Urdu) and English
app.post("/api/translate", async (req, res) => {
  try {
    const { text, targetLang, context } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    if (!ai) {
      // Fallback translation if API key is not yet set
      const simpleUrduToEn: Record<string, string> = {
        "سلام، کیا یہ سوٹ 3 دن میں مل سکتا ہے؟": "Hello, can I get this suit in 3 days?",
        "جی بالکل، میں سلائی کرکے 3 دن میں لیپرڈ سے بھیج دوں گی۔": "Yes absolutely, I will stitch it and send via Leopard courier in 3 days.",
        "قیمت میں کچھ رعایت ہو سکتی ہے؟": "Is there any discount on the price?",
        "کھانا کتنے لوگوں کے لیے تیار ہو سکتا ہے؟": "For how many people can the meal be prepared?",
      };

      const simpleEnToUrdu: Record<string, string> = {
        "Hello, is this service available?": "سلام، کیا یہ سروس دستیاب ہے؟",
        "Can you customize the dress color?": "کیا آپ کپڑے کا رنگ تبدیل کر سکتی ہیں؟",
        "What are the delivery charges via PostEx?": "پوسٹ ایکس کے ذریعے ڈیلیوری چارجز کیا ہیں؟",
        "I need 2 kg homemade chicken biryani tomorrow.": "مجھے کل 2 کلو گھر کی بنی ہوئی چکن بریانی چاہیے۔",
      };

      const fallback = targetLang === 'ur' 
        ? (simpleEnToUrdu[text] || `(اردو ترجمہ) ${text}`) 
        : (simpleUrduToEn[text] || `(English Translation) ${text}`);

      return res.json({
        original: text,
        translated: fallback,
        sourceLang: targetLang === 'ur' ? 'en' : 'ur',
        targetLang,
      });
    }

    const systemInstruction = `You are an expert bilingual Urdu-English real-time translator for 'Hunar', a Pakistani marketplace app empowering women freelancers and home-based artisans (tailoring, food, crafts, legal, tutoring).
Target language: ${targetLang === 'ur' ? 'Urdu (اردو with clean, warm Pakistani conversational tone)' : 'English (clear, polite, professional)'}.
Context: ${context || 'Marketplace chat between buyer and seller'}.
Always provide direct translation only without meta explanations. If the text has Roman Urdu (e.g. 'ye suit kitne ka hai'), translate it accurately to ${targetLang === 'ur' ? 'proper Urdu script' : 'English'}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: text,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    const translated = response.text ? response.text.trim() : text;

    return res.json({
      original: text,
      translated,
      targetLang,
    });
  } catch (error: any) {
    console.error("Translation error:", error);
    return res.status(500).json({ error: error?.message || "Translation failed", translated: req.body.text });
  }
});

// Voice Command & Intent Recognition
app.post("/api/voice-command", async (req, res) => {
  try {
    const { transcript, language } = req.body;
    if (!transcript) {
      return res.status(400).json({ error: "Transcript is required" });
    }

    if (!ai) {
      // Rule-based fallback
      const lower = transcript.toLowerCase();
      if (lower.includes("سلائی") || lower.includes("stitching") || lower.includes("tailor") || lower.includes("نیا گگ") || lower.includes("create gig")) {
        return res.json({
          intent: "CREATE_GIG",
          suggestedData: {
            titleUrdu: "شاندار لیڈیز سوٹ سلائی اور ڈیزائننگ",
            titleEn: "Custom Ladies Suit Stitching & Fashion Designing",
            category: "Stitching & Tailoring",
            pricePKR: 1800,
            deliveryDays: 3,
          },
          responseUrdu: "میں نے آپ کے لیے سلائی کا نیا گگ کھول دیا ہے۔ آپ تصویر شامل کر کے شائع کر سکتی ہیں۔",
          responseEn: "I opened the new gig creation window for you. You can add a photo and publish.",
        });
      } else if (lower.includes("کمائی") || lower.includes("earning") || lower.includes("پیسے") || lower.includes("wallet")) {
        return res.json({
          intent: "NAVIGATE_EARNINGS",
          responseUrdu: "آپ کی کمائی کا صفحہ کھول دیا گیا ہے۔",
          responseEn: "Navigating to your earnings and wallet page.",
        });
      } else if (lower.includes("ریل") || lower.includes("ویڈیو") || lower.includes("reel") || lower.includes("ecosystem")) {
        return res.json({
          intent: "NAVIGATE_REELS",
          responseUrdu: "ایکو سسٹم کی ویڈیوز اور ریلز فیڈ کھول دی گئی ہے۔",
          responseEn: "Opening the Ecosystem reels feed.",
        });
      } else if (lower.includes("ایمرجنسی") || lower.includes("مدد") || lower.includes("help") || lower.includes("police")) {
        return res.json({
          intent: "OPEN_SAFETY",
          responseUrdu: "خواتین کی حفاظت اور ہیلپ لائن کھول دی گئی ہے۔",
          responseEn: "Opening Women Safety and Helpline.",
        });
      }

      return res.json({
        intent: "SEARCH",
        query: transcript,
        responseUrdu: `آپ کے لیے '${transcript}' تلاش کیا جا رہا ہے۔`,
        responseEn: `Searching for '${transcript}' across Hunar.`,
      });
    }

    const systemInstruction = `You are the core voice assistant for 'Hunar' (ہنر), a marketplace designed for Pakistani women freelancers, artisans, and family businesses.
Analyze the user's spoken voice command (which may be in Urdu script, Roman Urdu, or English).
Determine the intent and extract key details.
Possible intents:
1. 'CREATE_GIG' (e.g. user says they want to sell clothes, food, henna, legal help, tuition, cake, crafts) -> extract titleUrdu, titleEn, category, pricePKR (number), deliveryDays (number), descriptionUrdu, descriptionEn.
2. 'SEARCH' (user looking for something to buy or hire) -> extract search query and category.
3. 'NAVIGATE_REELS' (user wants to see videos/ecosystem)
4. 'NAVIGATE_EARNINGS' (user wants to check money, wallet, JazzCash cashout)
5. 'OPEN_SAFETY' (emergency, police, helpline, safety)
6. 'HELP_SELLER' (general seller questions like how trial works, 5% fee, Leopard courier)

Return ONLY valid JSON matching this structure:
{
  "intent": "CREATE_GIG" | "SEARCH" | "NAVIGATE_REELS" | "NAVIGATE_EARNINGS" | "OPEN_SAFETY" | "HELP_SELLER" | "GENERAL",
  "query": "string",
  "suggestedData": {
    "titleUrdu": "string",
    "titleEn": "string",
    "category": "Stitching & Tailoring" | "Home Cooking & Bakery" | "Mehndi & Beauty" | "Handmade Crafts & Art" | "Tuition & Assignment Writing" | "Legal & Formal Services" | "Household & Care",
    "pricePKR": 1500,
    "deliveryDays": 3,
    "descriptionUrdu": "string",
    "descriptionEn": "string"
  },
  "responseUrdu": "Warm, encouraging Urdu sentence to speak back to the user",
  "responseEn": "English translation of response"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `User voice input: "${transcript}" (Language setting: ${language})`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Voice command error:", error);
    return res.status(500).json({ error: error?.message || "Failed to process voice command" });
  }
});

// Smart Gig Auto-Draft Generator
app.post("/api/smart-gig-generator", async (req, res) => {
  try {
    const { promptText, spokenLanguage } = req.body;
    if (!promptText) {
      return res.status(400).json({ error: "Prompt text is required" });
    }

    if (!ai) {
      return res.json({
        titleUrdu: "گھریلو معیاری سروس",
        titleEn: "Custom Artisanal Quality Service",
        descriptionUrdu: promptText,
        descriptionEn: promptText,
        category: "Stitching & Tailoring",
        suggestedPricePKR: 1500,
        deliveryDays: 3,
        suggestedCourier: "Leopard",
        highlightsUrdu: ["گھریلو صاف ستھرا کام", "وقت پر ڈلیوری", "مناسب قیمت"],
        highlightsEn: ["Clean home-based craft", "On-time delivery", "Affordable rates"],
      });
    }

    const systemInstruction = `You are a gig drafting assistant for Pakistani women home-entrepreneurs on 'Hunar'.
The user speaks or writes a simple sentence in Urdu, Roman Urdu, or English about what they do (e.g. 'میں زردوزی کڑھائی اور کرتے بناتی ہوں' or 'I make fresh chocolate fudge cake in Lahore').
Generate complete, professional, yet simple gig data in both Urdu and English.
Return JSON:
{
  "titleUrdu": "string in Urdu script (e.g. نفیس ہینڈ ایمبرائیڈری اور کڑھائی سوٹ)",
  "titleEn": "string in English",
  "descriptionUrdu": "Detailed friendly Urdu description",
  "descriptionEn": "Detailed English description",
  "category": "Stitching & Tailoring" | "Home Cooking & Bakery" | "Mehndi & Beauty" | "Handmade Crafts & Art" | "Tuition & Assignment Writing" | "Legal & Formal Services" | "Household & Care",
  "suggestedPricePKR": number in Pakistani Rupees (realistic e.g. 1000 - 6000),
  "deliveryDays": number of days (1-7),
  "suggestedCourier": "Leopard" | "PostEx",
  "highlightsUrdu": ["point 1 in Urdu", "point 2 in Urdu", "point 3 in Urdu"],
  "highlightsEn": ["point 1 in English", "point 2 in English", "point 3 in English"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Smart gig generator error:", error);
    return res.status(500).json({ error: error?.message || "Failed to generate gig" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Hunar server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
