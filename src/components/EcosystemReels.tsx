import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  ShoppingBag, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  X, 
  ExternalLink,
  MessageSquare,
  ArrowRight,
  Music,
  Grid,
  Film,
  Layers,
  Search,
  Filter,
  Check
} from 'lucide-react';
import { Language, ReelItem, GigCategory } from '../types';

interface EcosystemReelsProps {
  reels: ReelItem[];
  language: Language;
  onSelectGig: (gigId: string) => void;
  onOrderGig: (gig: any) => void;
  onChatWithSeller: (sellerId: string, sellerName: string) => void;
  onUploadReel: (newReel: ReelItem) => void;
}

export const EcosystemReels: React.FC<EcosystemReelsProps> = ({
  reels,
  language,
  onSelectGig,
  onOrderGig,
  onChatWithSeller,
  onUploadReel,
}) => {
  const isUrdu = language === 'ur';
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [likesCountMap, setLikesCountMap] = useState<Record<string, number>>({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeCommentsReelId, setActiveCommentsReelId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewLayout, setViewLayout] = useState<'feed' | 'grid'>('feed');
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isWheeling, setIsWheeling] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [commentsMap, setCommentsMap] = useState<Record<string, string[]>>({
    reel_1: ['ماشاءاللہ بہت نفیس کڑھائی ہے!', 'How much for 2 suits?', 'Delivery to Islamabad available?'],
    reel_2: ['بہت لذیذ کباب لگ رہے ہیں!', 'Best authentic taste in Karachi.'],
    reel_3: ['بہت خوبصورت مہندی ڈیزائن ہے!', 'Natural cone color is best.'],
    reel_4: ['ملتانی مٹی کی نقاشی واقعی بے مثال ہے!', 'Is fragile courier safe?'],
    reel_5: ['سبحان اللہ! بہت خوبصورت خطاطی ہے۔', 'What are canvas dimensions?'],
    reel_6: ['بہت پیاری شال ہے!', 'Can I order in pink color?'],
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playlistScrollRef = useRef<HTMLDivElement | null>(null);
  const feedContainerRef = useRef<HTMLDivElement | null>(null);

  // Filter reels by category
  const filteredReels = reels.filter(reel => {
    if (selectedCategory === 'All') return true;
    return reel.linkedGig.category === selectedCategory;
  });

  // Ensure activeIndex is within filtered range
  const safeIndex = Math.min(activeIndex, Math.max(0, filteredReels.length - 1));
  const currentReel = filteredReels[safeIndex] || reels[0];

  useEffect(() => {
    // Sync initial likes count map
    const initialLikes: Record<string, number> = {};
    reels.forEach(r => {
      initialLikes[r.id] = r.likesCount;
    });
    setLikesCountMap(initialLikes);
  }, [reels]);

  // Video playback management when changing reel
  useEffect(() => {
    if (videoRef.current && viewLayout === 'feed') {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  }, [safeIndex, viewLayout]);

  // Scroll active item into view in thumbnail strip
  useEffect(() => {
    if (playlistScrollRef.current) {
      const activeElement = playlistScrollRef.current.querySelector(`#playlist-reel-item-${safeIndex}`) as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [safeIndex]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const handleNext = useCallback(() => {
    if (safeIndex < filteredReels.length - 1) {
      setActiveIndex(safeIndex + 1);
    }
  }, [safeIndex, filteredReels.length]);

  const handlePrev = useCallback(() => {
    if (safeIndex > 0) {
      setActiveIndex(safeIndex - 1);
    }
  }, [safeIndex]);

  // Mouse wheel scroll handler with debouncing for smooth page flip
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (viewLayout !== 'feed' || isWheeling) return;
    if (Math.abs(e.deltaY) > 35) {
      setIsWheeling(true);
      if (e.deltaY > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      setTimeout(() => {
        setIsWheeling(false);
      }, 400);
    }
  };

  // Touch gesture scroll handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY;

    // Minimum swipe threshold (50px)
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0) {
        handleNext(); // Swiped Up -> Next Reel
      } else {
        handlePrev(); // Swiped Down -> Prev Reel
      }
    }
    setTouchStartY(null);
  };

  // Keyboard navigation for power users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewLayout !== 'feed' || activeCommentsReelId || showUploadModal) return;
      if (e.key === 'ArrowDown' || e.key === 'j') {
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        handlePrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm') {
        setIsMuted(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isPlaying, viewLayout, activeCommentsReelId, showUploadModal]);

  const toggleLike = (reelId: string) => {
    const isCurrentlyLiked = likedReels[reelId];
    setLikedReels(prev => ({ ...prev, [reelId]: !isCurrentlyLiked }));
    setLikesCountMap(prev => ({
      ...prev,
      [reelId]: (prev[reelId] || 0) + (isCurrentlyLiked ? -1 : 1),
    }));
  };

  const handleShare = (reel: ReelItem) => {
    if (navigator.share) {
      navigator.share({ 
        title: isUrdu ? reel.linkedGig.titleUrdu : reel.linkedGig.titleEn, 
        text: isUrdu ? reel.captionUrdu : reel.captionEn,
        url: window.location.href 
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedId(reel.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeCommentsReelId) return;

    setCommentsMap(prev => ({
      ...prev,
      [activeCommentsReelId]: [...(prev[activeCommentsReelId] || []), newCommentText.trim()],
    }));
    setNewCommentText('');
  };

  // Categories list for horizontal scroll filter
  const categoriesList = [
    { id: 'All', labelEn: 'All Showcases', labelUr: 'تمام ویڈیوز' },
    { id: 'Stitching & Tailoring', labelEn: 'Stitching & Tailoring', labelUr: 'سلائی و کڑھائی' },
    { id: 'Home Cooking & Bakery', labelEn: 'Home Cooking & Bakery', labelUr: 'گھریلو کھانے و بیکری' },
    { id: 'Mehndi & Beauty', labelEn: 'Mehndi & Beauty', labelUr: 'مہندی و بیوٹی' },
    { id: 'Handmade Crafts & Art', labelEn: 'Handmade Crafts & Art', labelUr: 'دستکاری و خطاطی' },
  ];

  return (
    <div id="ecosystem-reels-container" className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
      {/* Top Header & View Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              {isUrdu ? 'ہنرمند خواتین ویڈیو شوکیس' : 'Artisan Showcase & Reels'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-emerald-950 font-serif">
            {isUrdu ? 'ہنر ویڈیو نمائش اور براہ راست خریداری' : 'Artisan Craft Showcases & Video Feed'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mt-0.5">
            {isUrdu
              ? 'پاکستانی خواتین کے ہاتھ سے تیار کردہ ملبوسات، لذیذ گھریلو کھانوں اور فن پاروں کی ویڈیوز دیکھیں اور آرڈر کریں۔'
              : 'Browse authentic handmade crafts, stitching, and homemade food video reels from verified Pakistani women artisans.'}
          </p>
        </div>

        {/* Action Controls: Layout Switcher & Upload Reel */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Layout Toggle: Feed vs Grid */}
          <div className="flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200 shadow-2xs">
            <button
              id="view-layout-feed-btn"
              type="button"
              onClick={() => setViewLayout('feed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewLayout === 'feed'
                  ? 'bg-white text-emerald-950 shadow-xs border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Feed Theater Mode"
            >
              <Film className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isUrdu ? 'فیڈ پلیئر' : 'Reels Feed'}</span>
            </button>

            <button
              id="view-layout-grid-btn"
              type="button"
              onClick={() => setViewLayout('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewLayout === 'grid'
                  ? 'bg-white text-emerald-950 shadow-xs border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Gallery Grid Mode"
            >
              <Grid className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isUrdu ? 'گیلری گرڈ' : 'Grid View'}</span>
            </button>
          </div>

          {/* Upload Reel Button */}
          <button
            id="open-upload-reel-btn"
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>{isUrdu ? 'ویڈیو لگائیں (+)' : 'Post Reel (+)'}</span>
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Category Filter Bar */}
      <div className="relative mb-5">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
          {categoriesList.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`reel-filter-${cat.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setActiveIndex(0);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                }`}
              >
                <span>{isUrdu ? cat.labelUr : cat.labelEn}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-300"></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty State when category has no reels */}
      {filteredReels.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 my-8">
          <Layers className="w-12 h-12 text-stone-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-emerald-950">
            {isUrdu ? 'اس کیٹیگری میں کوئی ویڈیو دستیاب نہیں' : 'No reels found in this category'}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {isUrdu ? 'تمام ویڈیوز دیکھنے کے لیے فلٹر تبدیل کریں۔' : 'Select another category or view all showcases.'}
          </p>
          <button
            onClick={() => setSelectedCategory('All')}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold cursor-pointer"
          >
            {isUrdu ? 'تمام ویڈیوز دیکھیں' : 'View All Reels'}
          </button>
        </div>
      ) : viewLayout === 'feed' ? (
        /* ================= THEATER FEED VIEW WITH SCROLLING MECHANISM ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Main Reel Theater Frame with Touch & Wheel Scrolling */}
          <div className="lg:col-span-8 flex flex-col items-center">
            {/* Reel Player Container */}
            <div
              ref={feedContainerRef}
              id="reel-scroll-player-frame"
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative w-full max-w-[400px] h-[520px] xs:h-[560px] sm:h-[600px] md:h-[640px] max-h-[calc(100dvh-130px)] bg-stone-950 rounded-3xl overflow-hidden shadow-xl border border-stone-800 flex flex-col justify-between select-none touch-none sm:touch-auto"
            >
              {/* Video Element */}
              <video
                ref={videoRef}
                src={currentReel.videoUrl}
                poster={currentReel.posterUrl}
                loop
                muted={isMuted}
                playsInline
                onClick={togglePlay}
                className="absolute inset-0 w-full h-full object-cover cursor-pointer"
              />

              {/* Gradient Overlays for Clear Readability */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none z-10" />

              {/* Top Controls: Reel Counter, Mute Button, Category */}
              <div className="relative z-20 flex items-center justify-between p-3 sm:p-4 text-white">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                    {safeIndex + 1} / {filteredReels.length}
                  </span>
                  <span className="text-[11px] bg-emerald-900/80 backdrop-blur-md text-emerald-200 font-semibold px-2 py-0.5 rounded-md border border-emerald-500/30 line-clamp-1 max-w-[140px]">
                    {currentReel.linkedGig.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="toggle-mute-reel-btn"
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 transition-colors cursor-pointer"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
                  </button>
                </div>
              </div>

              {/* Central Play/Pause Overlay Indicator on click */}
              {!isPlaying && (
                <div 
                  onClick={togglePlay}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 cursor-pointer"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white ring-2 ring-white/60">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1" />
                  </div>
                </div>
              )}

              {/* Right Side Social Actions Floating Bar */}
              <div className="absolute right-2.5 sm:right-3 bottom-32 sm:bottom-36 z-20 flex flex-col items-center gap-3 sm:gap-4 text-white">
                {/* Like Button */}
                <button
                  id={`reel-like-btn-${currentReel.id}`}
                  onClick={() => toggleLike(currentReel.id)}
                  className="flex flex-col items-center gap-0.5 cursor-pointer group"
                  title="Like this reel"
                >
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                    likedReels[currentReel.id]
                      ? 'bg-rose-600 text-white scale-105'
                      : 'bg-black/50 hover:bg-black/70 text-white border border-white/20'
                  }`}>
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${likedReels[currentReel.id] ? 'fill-current' : ''}`} />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold">
                    {likesCountMap[currentReel.id] || currentReel.likesCount}
                  </span>
                </button>

                {/* Comments Button */}
                <button
                  id={`reel-comment-btn-${currentReel.id}`}
                  onClick={() => setActiveCommentsReelId(currentReel.id)}
                  className="flex flex-col items-center gap-0.5 cursor-pointer"
                  title="View comments"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold">
                    {(commentsMap[currentReel.id] || []).length || currentReel.commentsCount}
                  </span>
                </button>

                {/* Share Button */}
                <button
                  id={`reel-share-btn-${currentReel.id}`}
                  onClick={() => handleShare(currentReel)}
                  className="flex flex-col items-center gap-0.5 cursor-pointer"
                  title="Share video link"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                    {copiedId === currentReel.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold">
                    {copiedId === currentReel.id ? (isUrdu ? 'کاپی' : 'Copied') : currentReel.sharesCount}
                  </span>
                </button>
              </div>

              {/* Bottom Content Area: Creator Info, Audio Track & Shop Dock */}
              <div className="relative z-20 p-3 sm:p-4 space-y-2.5">
                {/* Creator Avatar & Music */}
                <div className="flex items-center gap-2">
                  <img
                    src={currentReel.sellerAvatar}
                    alt={currentReel.sellerName}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-emerald-400 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-bold text-white truncate">
                        {currentReel.sellerName}
                      </span>
                      {currentReel.sellerIsVerified && (
                        <span className="text-[9px] bg-emerald-700 text-white px-1.5 py-0.2 rounded-full font-bold flex items-center gap-0.5 shrink-0">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-stone-300">
                      <Music className="w-3 h-3 text-amber-300 shrink-0" />
                      <span className="truncate">{currentReel.audioTrack}</span>
                    </div>
                  </div>
                </div>

                {/* Caption */}
                <p className="text-xs text-stone-100 font-urdu line-clamp-2 leading-relaxed">
                  {isUrdu ? currentReel.captionUrdu : currentReel.captionEn}
                </p>

                {/* Product Dock Floating Card */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 border border-white/40 shadow-lg flex items-center justify-between gap-2 text-stone-900">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <img
                      src={currentReel.linkedGig.image}
                      alt={currentReel.linkedGig.titleEn}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-emerald-950 truncate">
                        {isUrdu ? currentReel.linkedGig.titleUrdu : currentReel.linkedGig.titleEn}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-extrabold text-emerald-800">
                          Rs. {currentReel.linkedGig.pricePKR.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-stone-500 font-medium truncate">
                          {currentReel.linkedGig.courier}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Direct Buy / Order Button */}
                  <button
                    id={`reel-shop-now-btn-${currentReel.id}`}
                    onClick={() => onOrderGig(currentReel.linkedGig)}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold shrink-0 shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isUrdu ? 'آرڈر کریں' : 'Buy Now'}</span>
                  </button>
                </div>
              </div>

              {/* Floating Vertical Prev/Next Scroll Buttons */}
              <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
                <button
                  id="reel-scroll-prev-btn"
                  onClick={handlePrev}
                  disabled={safeIndex === 0}
                  className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center disabled:opacity-20 cursor-pointer border border-white/20 transition-all"
                  title="Previous Reel (Scroll Up)"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  id="reel-scroll-next-btn"
                  onClick={handleNext}
                  disabled={safeIndex === filteredReels.length - 1}
                  className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center disabled:opacity-20 cursor-pointer border border-white/20 transition-all"
                  title="Next Reel (Scroll Down)"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Scroll Instruction Helper */}
            <div className="text-center text-[11px] text-stone-500 mt-2.5 flex items-center gap-2">
              <span>{isUrdu ? '💡 انگلی سے اوپر/نیچے سوائپ کریں یا بٹن سے آگے بڑھیں' : '💡 Swipe up/down or scroll mouse to view next reel'}</span>
            </div>
          </div>

          {/* Right Side: Artisan Info Card & Quick-Scroll Playlist Strip */}
          <div className="lg:col-span-4 space-y-4">
            {/* Active Artisan Creator Info */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  {isUrdu ? 'ہنرمند دستکار:' : 'Artisan Creator:'}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {currentReel.sellerCity}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={currentReel.sellerAvatar}
                  alt={currentReel.sellerName}
                  className="w-12 h-12 rounded-xl object-cover border border-emerald-600"
                />
                <div>
                  <h3 className="text-sm font-bold text-emerald-950">{currentReel.sellerName}</h3>
                  <p className="text-xs text-stone-500 font-urdu">{isUrdu ? '100% گھر کا بنا ہوا خالص کام' : '100% Authentic Handmade Work'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  id="reel-chat-seller-btn"
                  onClick={() => onChatWithSeller(currentReel.sellerId, currentReel.sellerName)}
                  className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-stone-600" />
                  <span>{isUrdu ? 'میسج کریں' : 'Chat'}</span>
                </button>

                <button
                  id="reel-view-gig-btn"
                  onClick={() => onSelectGig(currentReel.linkedGig.id)}
                  className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isUrdu ? 'پروفائل دیکھیں' : 'View Gig'}</span>
                </button>
              </div>
            </div>

            {/* Scrollable Gallery Playlist Strip */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  {isUrdu ? 'تمام ریلز لسٹ:' : 'Browse Reel Gallery:'}
                </h3>
                <span className="text-xs font-bold text-stone-400">
                  {filteredReels.length} {isUrdu ? 'ویڈیوز' : 'Reels'}
                </span>
              </div>

              {/* Scrollable playlist container */}
              <div 
                ref={playlistScrollRef}
                className="space-y-2.5 max-h-[340px] sm:max-h-[380px] overflow-y-auto pr-1 scroll-smooth"
              >
                {filteredReels.map((reel, idx) => (
                  <button
                    key={reel.id}
                    id={`playlist-reel-item-${idx}`}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-full p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-3 ${
                      safeIndex === idx
                        ? 'bg-emerald-50 border-emerald-600 ring-1 ring-emerald-500 shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                    }`}
                  >
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                      <img
                        src={reel.posterUrl}
                        alt={reel.sellerName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 text-white/90" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-emerald-950 truncate">
                        {isUrdu ? reel.linkedGig.titleUrdu : reel.linkedGig.titleEn}
                      </p>
                      <p className="text-[11px] text-stone-500">{reel.sellerName} • {reel.sellerCity}</p>
                      <span className="text-[11px] font-extrabold text-emerald-800">
                        Rs. {reel.linkedGig.pricePKR.toLocaleString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= GALLERY GRID VIEW (RESPONSIVE SCROLLABLE CARDS) ================= */
        <div id="ecosystem-gallery-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReels.map((reel, idx) => (
            <div
              key={reel.id}
              id={`grid-reel-card-${reel.id}`}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              {/* Top Video Preview Thumbnail with Quick Play */}
              <div 
                className="relative aspect-4/5 bg-stone-900 cursor-pointer overflow-hidden"
                onClick={() => {
                  setActiveIndex(idx);
                  setViewLayout('feed');
                }}
              >
                <img
                  src={reel.posterUrl}
                  alt={reel.sellerName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 flex flex-col justify-between p-3.5">
                  <div className="flex items-center justify-between text-white">
                    <span className="text-[10px] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full font-bold">
                      {reel.linkedGig.category}
                    </span>
                    <span className="text-[10px] bg-emerald-800 text-white px-2 py-0.5 rounded-full font-bold">
                      Rs. {reel.linkedGig.pricePKR.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white ring-2 ring-white/70 group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 ml-0.5 fill-white" />
                    </div>
                  </div>

                  {/* Seller name inside thumbnail */}
                  <div className="flex items-center gap-2 text-white">
                    <img
                      src={reel.sellerAvatar}
                      alt={reel.sellerName}
                      className="w-7 h-7 rounded-full object-cover border border-white"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{reel.sellerName}</p>
                      <p className="text-[10px] text-stone-300">{reel.sellerCity}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="p-4 space-y-3">
                <p className="text-xs text-stone-700 line-clamp-2 font-urdu">
                  {isUrdu ? reel.captionUrdu : reel.captionEn}
                </p>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 text-xs text-stone-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      {likesCountMap[reel.id] || reel.likesCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-stone-400" />
                      {(commentsMap[reel.id] || []).length || reel.commentsCount}
                    </span>
                  </div>

                  <button
                    onClick={() => onOrderGig(reel.linkedGig)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isUrdu ? 'خریدیں' : 'Buy Now'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Comments Modal / Drawer */}
      {activeCommentsReelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-stone-200 relative max-h-[85vh] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h3 className="text-sm font-bold text-emerald-950">
                  {isUrdu ? 'تبصرے اور سوالات' : 'Comments & Questions'}
                </h3>
                <button
                  onClick={() => setActiveCommentsReelId(null)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-2 max-h-60 overflow-y-auto pr-1">
                {(commentsMap[activeCommentsReelId] || []).map((comm, i) => (
                  <div key={i} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                    <span className="font-bold text-emerald-900">{isUrdu ? 'خریدار:' : 'Buyer:'}</span>
                    <p className="text-stone-700 mt-0.5">{comm}</p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2 pt-3 border-t border-stone-100">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder={isUrdu ? 'اپنا سوال یا تبصرہ لکھیں...' : 'Write your comment...'}
                className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-emerald-600"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 cursor-pointer"
              >
                {isUrdu ? 'بھیجیں' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Upload Reel Modal for Artisans */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-emerald-950 font-serif mb-1">
              {isUrdu ? 'نئی ویڈیو ریل لگائیں' : 'Upload Artisan Video Reel'}
            </h3>
            <p className="text-xs text-stone-600 mb-4">
              {isUrdu
                ? 'اپنے ہنر اور مصنوعات کی 15 سے 30 سیکنڈ کی ویڈیو لگائیں تاکہ گاہک براہ راست آرڈر کر سکیں۔'
                : 'Upload a 15-30s showcase video of your handcrafted work to gain direct 1-click orders.'}
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {isUrdu ? 'ویڈیو کا کیپشن (اردو میں):' : 'Caption in Urdu / English:'}
                </label>
                <input
                  type="text"
                  placeholder={isUrdu ? 'مثلاً: تازہ سلائی شدہ سوٹ کا ڈیزائن...' : 'e.g. Handmade embroidery preview...'}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-urdu"
                  defaultValue="سلائی کا نیا ڈیزائن دیکھیں! ابھی آرڈر کریں۔"
                />
              </div>

              <div className="p-4 border-2 border-dashed border-stone-300 rounded-2xl text-center bg-stone-50">
                <ShoppingBag className="w-6 h-6 mx-auto text-emerald-700 mb-1" />
                <p className="font-bold text-emerald-950">{isUrdu ? 'ویڈیو فائل منتخب کریں' : 'Choose Video File (MP4)'}</p>
                <p className="text-[10px] text-stone-500 mt-0.5">{isUrdu ? 'زیادہ سے زیادہ 50MB' : 'Max file size 50MB'}</p>
              </div>

              <button
                onClick={() => {
                  alert(isUrdu ? 'ویڈیو کامیابی سے ایکو سسٹم میں شامل کر دی گئی ہے!' : 'Reel uploaded to Artisan Showcase!');
                  setShowUploadModal(false);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition-colors cursor-pointer"
              >
                {isUrdu ? 'ویڈیو ریل شائع کریں' : 'Publish Video Reel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
