export type Language = 'ur' | 'en';

export type UserRole = 'seller' | 'buyer';

export type VerificationStatus = 'unverified' | 'pending' | 'verified';

export interface User {
  id: string;
  name: string;
  nameUrdu?: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  city: string;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  cnicNumber?: string;
  bioUrdu?: string;
  bioEn?: string;
  rating: number;
  reviewsCount: number;
  trialDaysLeft: number;
  earningsPKR: number;
  availableBalancePKR: number;
  completedOrdersCount: number;
  createdAt: string;
  paymentMethods: {
    jazzcash?: string;
    easypaisa?: string;
    bankAccount?: string;
  };
}

export type GigCategory = 
  | 'Stitching & Tailoring'
  | 'Home Cooking & Bakery'
  | 'Mehndi & Beauty'
  | 'Handmade Crafts & Art'
  | 'Tuition & Assignment Writing'
  | 'Legal & Formal Services'
  | 'Household & Care';

export interface Gig {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerNameUrdu?: string;
  sellerAvatar: string;
  sellerCity: string;
  sellerRating: number;
  sellerIsVerified: boolean;
  titleUrdu: string;
  titleEn: string;
  descriptionUrdu: string;
  descriptionEn: string;
  category: GigCategory;
  pricePKR: number;
  deliveryDays: number;
  images: string[];
  tags: string[];
  couriers: ('Leopard' | 'PostEx' | 'Local')[];
  ordersCompleted: number;
  rating: number;
  voiceNoteDescription?: string;
  voiceNoteUrduAudio?: string;
  featured?: boolean;
}

export interface ReelItem {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerCity: string;
  sellerIsVerified: boolean;
  videoUrl: string;
  posterUrl: string;
  captionUrdu: string;
  captionEn: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  audioTrack: string;
  linkedGig: {
    id: string;
    titleUrdu: string;
    titleEn: string;
    pricePKR: number;
    category: GigCategory;
    image: string;
    courier: string;
  };
}

export type OrderStatus = 'pending' | 'in_progress' | 'dispatched' | 'delivered' | 'completed';

export interface Order {
  id: string;
  gigId: string;
  gigTitle: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  amountPKR: number;
  serviceFeePKR: number; // 5% app fee after trial
  deliveryFeePKR: number;
  courier: 'Leopard' | 'PostEx' | 'Direct Pickup';
  trackingNumber: string;
  status: OrderStatus;
  deliveryAddress: string;
  contactPhone: string;
  specialInstructions?: string;
  paymentMethod: 'JazzCash' | 'Easypaisa' | 'COD' | 'Raast' | 'BankTransfer';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  originalLang: 'en' | 'ur';
  translatedText: string;
  timestamp: string;
  audioData?: string;
}

export interface CategoryInfo {
  id: GigCategory;
  nameUrdu: string;
  nameEn: string;
  icon: string;
  descriptionUrdu: string;
  descriptionEn: string;
  samplePriceRange: string;
}
