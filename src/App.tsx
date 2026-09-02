import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Mic, 
  MicOff, 
  Sparkles, 
  ShieldCheck, 
  PhoneCall, 
  TrendingUp, 
  Tag, 
  Compass, 
  Layers, 
  ShoppingBag, 
  HeartHandshake, 
  CheckCircle2, 
  Truck, 
  SlidersHorizontal,
  ChevronRight,
  Flame,
  Volume2
} from 'lucide-react';
import { Gig, GigCategory, Language, Order, ReelItem, User } from './types';
import { INITIAL_GIGS, INITIAL_REELS, INITIAL_USER, INITIAL_ORDERS, CATEGORIES } from './data/mockData';
import { speakText, UI_STRINGS } from './utils/speechAndLang';

// Components
import { Navbar } from './components/Navbar';
import { GigCard } from './components/GigCard';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { BiometricVerificationModal } from './components/BiometricVerificationModal';
import { EasyGigPublisherModal } from './components/EasyGigPublisherModal';
import { EcosystemReels } from './components/EcosystemReels';
import { ChatModal } from './components/ChatModal';
import { OrderDrawer } from './components/OrderDrawer';
import { SellerDashboard } from './components/SellerDashboard';
import { SafetyModal } from './components/SafetyModal';
import { AuthModal } from './components/AuthModal';
import { GigDetailModal } from './components/GigDetailModal';

export function App() {
  // App States: Default initial view is English with instant option to toggle to Urdu or English
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<'marketplace' | 'ecosystem' | 'dashboard'>('marketplace');
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USER);
  const [gigs, setGigs] = useState<Gig[]>(INITIAL_GIGS);
  const [reels, setReels] = useState<ReelItem[]>(INITIAL_REELS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<GigCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  // Modals & Drawers
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState<{ id: string; name: string }>({ id: 'seller_1', name: 'Zainab Bibi' });
  const [selectedGigForDetail, setSelectedGigForDetail] = useState<Gig | null>(null);
  const [selectedGigForOrder, setSelectedGigForOrder] = useState<Gig | null>(null);

  const isUrdu = language === 'ur';

  // Filtered Gigs
  const filteredGigs = gigs.filter((gig) => {
    const matchesCategory = selectedCategory === 'all' || gig.category === selectedCategory;
    const matchesCity = selectedCity === 'all' || gig.sellerCity.toLowerCase() === selectedCity.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      gig.titleUrdu.toLowerCase().includes(query) ||
      gig.titleEn.toLowerCase().includes(query) ||
      gig.descriptionUrdu.toLowerCase().includes(query) ||
      gig.descriptionEn.toLowerCase().includes(query) ||
      gig.category.toLowerCase().includes(query) ||
      gig.sellerName.toLowerCase().includes(query);

    return matchesCategory && matchesCity && matchesSearch;
  });

  // Voice Command Action Handler from Assistant Modal
  const handleExecuteVoiceCommand = (action: string, payload?: any) => {
    if (action === 'navigate_ecosystem' || action === 'open_reels' || action === 'NAVIGATE_REELS') {
      setActiveTab('ecosystem');
    } else if (action === 'navigate_marketplace' || action === 'open_marketplace') {
      setActiveTab('marketplace');
    } else if (action === 'navigate_dashboard' || action === 'open_dashboard' || action === 'NAVIGATE_EARNINGS') {
      setActiveTab('dashboard');
    } else if (action === 'open_post_gig' || action === 'create_gig' || action === 'CREATE_GIG') {
      setIsPublishModalOpen(true);
    } else if (action === 'open_safety' || action === 'emergency_sos' || action === 'OPEN_SAFETY') {
      setIsSafetyModalOpen(true);
    } else if (action === 'open_biometric_verify') {
      setIsBiometricModalOpen(true);
    } else if ((action === 'filter_category' || action === 'SEARCH') && (payload?.category || payload)) {
      if (typeof payload === 'string') setSearchQuery(payload);
      else if (payload?.category) setSelectedCategory(payload.category);
      setActiveTab('marketplace');
    } else if (action === 'search_gigs' && payload?.query) {
      setSearchQuery(payload.query);
      setActiveTab('marketplace');
    } else if (action === 'open_chat') {
      setIsChatOpen(true);
    }
  };

  // Handlers
  const handleOpenChat = (sellerId: string, sellerName: string) => {
    setChatRecipient({ id: sellerId, name: sellerName });
    setIsChatOpen(true);
  };

  const handleOrderGig = (gigOrReelGig: any) => {
    if ('images' in gigOrReelGig) {
      setSelectedGigForOrder(gigOrReelGig as Gig);
    } else {
      // It's linkedGig from reel
      const matched = gigs.find(g => g.id === gigOrReelGig.id);
      if (matched) {
        setSelectedGigForOrder(matched);
      } else {
        // Build mock gig
        setSelectedGigForOrder({
          id: gigOrReelGig.id,
          sellerId: 'seller_1',
          sellerName: 'Zainab Bibi',
          sellerNameUrdu: 'زینب بی بی',
          sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
          sellerCity: 'Lahore',
          sellerRating: 5.0,
          sellerIsVerified: true,
          titleUrdu: gigOrReelGig.titleUrdu,
          titleEn: gigOrReelGig.titleEn,
          descriptionUrdu: 'اعلیٰ معیار کی گارنٹی۔',
          descriptionEn: 'High quality craftsmanship guaranteed.',
          category: 'Stitching & Tailoring',
          pricePKR: gigOrReelGig.pricePKR,
          deliveryDays: 3,
          images: [gigOrReelGig.image],
          tags: ['Handmade', 'Hunar'],
          couriers: ['Leopard', 'PostEx'],
          ordersCompleted: 24,
          rating: 4.9,
        });
      }
    }
  };

  const handleGigPublished = (newGig: Gig) => {
    setGigs([newGig, ...gigs]);
    speakText(
      isUrdu ? 'مبارک ہو! آپ کا کام شائع ہو گیا ہے اور خریداروں کو نظر آ رہا ہے۔' : 'Congratulations! Your gig is published and visible to buyers.',
      isUrdu ? 'ur' : 'en'
    );
  };

  const handleOrderCreated = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: any) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleBiometricVerified = (cnic: string) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        isVerified: true,
        verificationStatus: 'verified',
        cnicNumber: cnic,
      });
    }
  };

  return (
    <div className={`min-h-screen bg-[#FAF9F6] text-stone-900 ${isUrdu ? 'font-sans text-right' : 'font-sans'}`} dir={isUrdu ? 'rtl' : 'ltr'}>
      {/* Universal Navigation Header with Language Toggle */}
      <Navbar
        language={language}
        activeTab={activeTab}
        currentUser={currentUser}
        onToggleLanguage={() => {
          const nextLang = language === 'ur' ? 'en' : 'ur';
          setLanguage(nextLang);
          speakText(nextLang === 'ur' ? 'اردو زبان منتخب کر لی گئی ہے' : 'English language enabled', nextLang);
        }}
        onSelectTab={setActiveTab}
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
        onOpenBiometric={() => setIsBiometricModalOpen(true)}
        onOpenSafety={() => setIsSafetyModalOpen(true)}
        onOpenCreateGig={() => setIsPublishModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main Content Areas */}
      <main className="pb-16">
        {/* TAB 1: MAIN MARKETPLACE */}
        {activeTab === 'marketplace' && (
          <div id="marketplace-view" className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6">
            {/* Top Urdu-Centric Voice Command Banner */}
            <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-5 sm:p-7 shadow-lg border border-emerald-700/50 flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="space-y-1.5 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="bg-amber-400 text-emerald-950 font-black text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {isUrdu ? 'صوتی معاونت • Voice Control' : 'Urdu & English Voice Control'}
                  </span>
                  <span className="text-emerald-200 text-xs font-medium">
                    {isUrdu ? '100% مفت 7 دن ٹرائل' : '1-Week Free Trial'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif leading-tight">
                  {isUrdu
                    ? 'ہنر مند خواتین کے لیے آسان ترین مارکیٹ پلیس'
                    : 'Effortless Home-Craft Marketplace for Women'}
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl font-urdu leading-relaxed">
                  {isUrdu
                    ? 'سلائی، کھانا، مہندی، یا قانونی مشاورت۔ مائیک دبائیں اور اپنی زبان (اردو) میں بول کر کام ڈھونڈیں یا بیچیں۔'
                    : 'Stitching, culinary, henna, legal aid, or tutoring. Speak naturally in Urdu or English to publish gigs and sell.'}
                </p>
              </div>

              {/* Instant Voice Trigger Button */}
              <button
                id="hero-voice-assistant-trigger-btn"
                onClick={() => setIsVoiceAssistantOpen(true)}
                className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2.5 shrink-0"
              >
                <Mic className="w-5 h-5 text-emerald-900" />
                <span className="font-urdu">{isUrdu ? 'آواز سے حکم دیں (مائیک)' : 'Voice Search & Actions'}</span>
              </button>
            </div>

            {/* Quick Search & City Filter Bar */}
            <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                <input
                  type="text"
                  id="marketplace-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isUrdu ? 'سروس یا ہنرمند کا نام تلاش کریں (مثلاً: سلائی، بریانی، مہندی)...' : 'Search craft, tailoring, cooking, legal service...'}
                  className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-emerald-600 font-urdu"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-stone-700"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* City Selector */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  id="city-filter-select"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full sm:w-auto px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:bg-white focus:outline-hidden focus:border-emerald-600"
                >
                  <option value="all">{isUrdu ? 'تمام شہر (پاکستان)' : 'All Cities (Pakistan)'}</option>
                  <option value="Lahore">Lahore (لاہور)</option>
                  <option value="Karachi">Karachi (کراچی)</option>
                  <option value="Islamabad">Islamabad (اسلام آباد)</option>
                  <option value="Rawalpindi">Rawalpindi (راولپنڈی)</option>
                  <option value="Faisalabad">Faisalabad (فیصل آباد)</option>
                  <option value="Multan">Multan (ملتان)</option>
                  <option value="Peshawar">Peshawar (پشاور)</option>
                  <option value="Quetta">Quetta (کوئٹہ)</option>
                </select>
              </div>
            </div>

            {/* Category Pills Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-600 px-1">
                <span>{isUrdu ? 'خدمات کے شعبہ جات (کیٹیگریز):' : 'Explore Categories:'}</span>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="text-emerald-700 hover:underline cursor-pointer"
                  >
                    {isUrdu ? 'سب دیکھیں (ری سیٹ)' : 'Reset all'}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  id="cat-pill-all"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    selectedCategory === 'all'
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
                  }`}
                >
                  {isUrdu ? 'تمام خدمات (All)' : 'All Services'}
                </button>

                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    id={`cat-pill-${cat.id.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
                    }`}
                  >
                    <span className="font-urdu">{cat.nameUrdu}</span>
                    <span className="opacity-70 text-[10px]">({cat.nameEn})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gigs Grid */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-600" />
                  <h3 className="text-base sm:text-lg font-bold text-emerald-950 font-serif">
                    {isUrdu ? 'مقبول ترین خدمات اور پروڈکٹس' : 'Featured Services & Handcrafted Works'}
                  </h3>
                </div>
                <span className="text-xs text-stone-500 font-medium">
                  {filteredGigs.length} {isUrdu ? 'ہنر موجود ہیں' : 'gigs available'}
                </span>
              </div>

              {filteredGigs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredGigs.map((gig) => (
                    <GigCard
                      key={gig.id}
                      gig={gig}
                      language={language}
                      onSelectGig={(id) => {
                        const target = gigs.find(g => g.id === id);
                        if (target) setSelectedGigForDetail(target);
                      }}
                      onOrderClick={(g) => handleOrderGig(g)}
                      onChatClick={handleOpenChat}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 shadow-xs my-6">
                  <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-stone-700 font-serif">
                    {isUrdu ? 'اس تلاش کے مطابق کوئی کام نہیں ملا' : 'No gigs found matching criteria'}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1">
                    {isUrdu ? 'برائے مہربانی دیگر کیٹیگری یا شہر منتخب کریں۔' : 'Try switching categories or clearing search filters.'}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                      setSelectedCity('all');
                    }}
                    className="mt-4 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 cursor-pointer"
                  >
                    {isUrdu ? 'تمام ہنر دوبارہ دیکھیں' : 'Reset Filters'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ECOSYSTEM (REELS + TIKTOK SHOP DOCK) */}
        {activeTab === 'ecosystem' && (
          <div id="ecosystem-view">
            <EcosystemReels
              reels={reels}
              language={language}
              onSelectGig={(id) => {
                const target = gigs.find(g => g.id === id);
                if (target) setSelectedGigForDetail(target);
              }}
              onOrderGig={handleOrderGig}
              onChatWithSeller={handleOpenChat}
              onUploadReel={(newReel) => setReels([newReel, ...reels])}
            />
          </div>
        )}

        {/* TAB 3: SELLER DASHBOARD & LOGISTICS */}
        {activeTab === 'dashboard' && currentUser && (
          <div id="dashboard-view">
            <SellerDashboard
              user={currentUser}
              orders={orders}
              language={language}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          </div>
        )}
      </main>

      {/* MODALS & OVERLAYS */}

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        language={language}
        onExecuteCommand={handleExecuteVoiceCommand}
      />

      {/* Biometric Verification Modal */}
      <BiometricVerificationModal
        isOpen={isBiometricModalOpen}
        onClose={() => setIsBiometricModalOpen(false)}
        language={language}
        onSuccess={handleBiometricVerified}
      />

      {/* Easy Gig Publisher Modal */}
      <EasyGigPublisherModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        language={language}
        currentUser={currentUser}
        onGigPublished={handleGigPublished}
      />

      {/* Women Safety & Emergency SOS Modal */}
      <SafetyModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
        language={language}
      />

      {/* Auth / Register Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
        onAuthSuccess={(u) => setCurrentUser(u)}
        onTriggerBiometric={() => setIsBiometricModalOpen(true)}
      />

      {/* Gig Detail Modal */}
      <GigDetailModal
        isOpen={!!selectedGigForDetail}
        onClose={() => setSelectedGigForDetail(null)}
        gig={selectedGigForDetail}
        language={language}
        onOrderClick={handleOrderGig}
        onChatClick={handleOpenChat}
      />

      {/* Bilingual Auto-Translated Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        language={language}
        recipientName={chatRecipient.name}
      />

      {/* Order & Checkout Drawer with Leopard/PostEx and JazzCash */}
      <OrderDrawer
        isOpen={!!selectedGigForOrder}
        onClose={() => setSelectedGigForOrder(null)}
        language={language}
        gig={selectedGigForOrder}
        currentUser={currentUser}
        onOrderCreated={handleOrderCreated}
      />
    </div>
  );
}
export default App;
