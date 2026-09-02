import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  Clock, 
  AlertCircle,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { Gig, Language, Order, User } from '../types';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  gig: Gig | null;
  currentUser: User | null;
  onOrderCreated: (order: Order) => void;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  isOpen,
  onClose,
  language,
  gig,
  currentUser,
  onOrderCreated,
}) => {
  const isUrdu = language === 'ur';

  const [deliveryAddress, setDeliveryAddress] = useState('House 12, Street 4, Gulberg III, Lahore');
  const [contactPhone, setContactPhone] = useState('+92 300 1234567');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedCourier, setSelectedCourier] = useState<'Leopard' | 'PostEx' | 'Direct Pickup'>('Leopard');
  const [paymentMethod, setPaymentMethod] = useState<'JazzCash' | 'Easypaisa' | 'COD' | 'Raast'>('JazzCash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);

  if (!isOpen || !gig) return null;

  const courierRates: Record<string, number> = {
    'Leopard': 250,
    'PostEx': 200,
    'Direct Pickup': 0,
  };

  const deliveryFee = courierRates[selectedCourier] || 250;
  const subtotal = gig.pricePKR;
  const platformFee = 0; // 0 during 1-Week Free trial
  const totalPKR = subtotal + deliveryFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const trackingPrefix = selectedCourier === 'Leopard' ? 'LEO' : selectedCourier === 'PostEx' ? 'PEX' : 'DIR';
    const randomTrack = `${trackingPrefix}-${Math.floor(100000 + Math.random() * 900000)}-PK`;

    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      gigId: gig.id,
      gigTitle: isUrdu ? gig.titleUrdu : gig.titleEn,
      buyerId: currentUser?.id || 'usr_buyer_guest',
      buyerName: currentUser?.name || 'Customer',
      sellerId: gig.sellerId,
      sellerName: gig.sellerName,
      amountPKR: subtotal,
      serviceFeePKR: platformFee,
      deliveryFeePKR: deliveryFee,
      courier: selectedCourier,
      trackingNumber: randomTrack,
      status: 'pending',
      deliveryAddress,
      contactPhone,
      specialInstructions,
      paymentMethod,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSuccess(newOrder);
      onOrderCreated(newOrder);
    }, 1000);
  };

  return (
    <div id="order-drawer-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          id="close-order-drawer-btn"
          onClick={() => {
            setOrderSuccess(null);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {orderSuccess ? (
          /* Order Confirmation Screen */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-bold text-emerald-950 font-serif">
              {isUrdu ? 'آرڈر کامیابی سے بک ہو گیا!' : 'Order Placed Successfully!'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-sm mx-auto">
              {isUrdu
                ? `سیلر ${gig.sellerName} کو آپ کا آرڈر مل گیا ہے اور کوریئر پارٹنر کو مطلع کر دیا گیا ہے۔`
                : `Seller ${gig.sellerName} has been notified and will prepare your order.`}
            </p>

            {/* Tracking Receipt Box */}
            <div className="mt-6 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">{isUrdu ? 'آرڈر نمبر:' : 'Order ID:'}</span>
                <span className="font-bold text-emerald-950">{orderSuccess.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{isUrdu ? 'کوریئر ٹریکنگ:' : 'Courier Tracking #:'}</span>
                <span className="font-mono font-bold text-rose-700">{orderSuccess.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{isUrdu ? 'ڈلیوری پارٹنر:' : 'Courier Partner:'}</span>
                <span className="font-bold text-stone-800">{orderSuccess.courier}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200">
                <span className="font-bold text-stone-700">{isUrdu ? 'کل ادا شدہ رقم:' : 'Total Amount:'}</span>
                <span className="font-extrabold text-emerald-900 text-sm">Rs. {totalPKR.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setOrderSuccess(null);
                onClose();
              }}
              className="mt-6 w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
            >
              {isUrdu ? 'ٹھیک ہے / آرڈرز میں دیکھیں' : 'Done / View in Orders'}
            </button>
          </div>
        ) : (
          /* Order Placement Form */
          <div>
            <div className="mb-4">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {isUrdu ? 'محفوظ خریداری اور آسان ادائیگی' : 'Safe Checkout & Easy Payment'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 font-serif mt-1">
                {isUrdu ? 'آرڈر مکمل کریں' : 'Checkout & Book Order'}
              </h2>
            </div>

            {/* Gig Item Summary Card */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3 mb-5">
              <img
                src={gig.images[0]}
                alt={gig.titleEn}
                className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-emerald-950 truncate font-urdu">
                  {isUrdu ? gig.titleUrdu : gig.titleEn}
                </p>
                <p className="text-[11px] text-stone-500">
                  {gig.sellerName} • {gig.sellerCity}
                </p>
                <p className="text-xs font-extrabold text-emerald-800">
                  Rs. {gig.pricePKR.toLocaleString()}
                </p>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              {/* Delivery Address & Contact */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isUrdu ? 'ڈلیوری کا مکمل پتہ:' : 'Delivery Address:'}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="text"
                      id="order-address-input"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Street, Sector/Area, City"
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-emerald-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isUrdu ? 'رابطہ نمبر (WhatsApp):' : 'Contact Phone / WhatsApp:'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="text"
                      id="order-phone-input"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+92 300 XXXXXXX"
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-emerald-600"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Courier Selection: Leopard vs PostEx */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center justify-between">
                  <span>{isUrdu ? 'کوریئر سروس منتخب کریں:' : 'Select Courier Service:'}</span>
                  <span className="text-[10px] text-stone-500">{isUrdu ? 'الگ چارجز' : 'Separate shipping fee'}</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    id="order-courier-leopard"
                    onClick={() => setSelectedCourier('Leopard')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedCourier === 'Leopard'
                        ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500'
                        : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-950">Leopard Courier</span>
                      <Truck className="w-4 h-4 text-amber-700" />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">Rs. 250 (2-3 Days)</p>
                  </button>

                  <button
                    type="button"
                    id="order-courier-postex"
                    onClick={() => setSelectedCourier('PostEx')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedCourier === 'PostEx'
                        ? 'bg-sky-50 border-sky-500 ring-1 ring-sky-500'
                        : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-950">PostEx Courier</span>
                      <Truck className="w-4 h-4 text-sky-700" />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">Rs. 200 (2 Days)</p>
                  </button>
                </div>
              </div>

              {/* Payment Methods: JazzCash / Easypaisa / COD */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {isUrdu ? 'ادائیگی کا طریقہ:' : 'Payment Method:'}
                </label>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <button
                    type="button"
                    id="order-pay-jazzcash"
                    onClick={() => setPaymentMethod('JazzCash')}
                    className={`p-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
                      paymentMethod === 'JazzCash'
                        ? 'bg-rose-50 border-rose-500 text-rose-950 ring-1 ring-rose-500'
                        : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}
                  >
                    JazzCash
                  </button>
                  <button
                    type="button"
                    id="order-pay-easypaisa"
                    onClick={() => setPaymentMethod('Easypaisa')}
                    className={`p-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
                      paymentMethod === 'Easypaisa'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500'
                        : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}
                  >
                    Easypaisa
                  </button>
                  <button
                    type="button"
                    id="order-pay-cod"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
                      paymentMethod === 'COD'
                        ? 'bg-amber-50 border-amber-500 text-amber-950 ring-1 ring-amber-500'
                        : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}
                  >
                    Cash on Delivery
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>{isUrdu ? 'خدمت کی قیمت:' : 'Service Subtotal:'}</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>{isUrdu ? `کوریئر فیس (${selectedCourier}):` : `Shipping Fee (${selectedCourier}):`}</span>
                  <span>Rs. {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>{isUrdu ? '1 ہفتہ فری ٹرائل فیس رعایت:' : '1-Week Trial App Fee (0%):'}</span>
                  <span>- Rs. 0 (Free)</span>
                </div>
                <div className="flex justify-between font-extrabold text-emerald-950 pt-2 border-t border-stone-200 text-sm">
                  <span>{isUrdu ? 'کل رقم:' : 'Total Payable:'}</span>
                  <span>Rs. {totalPKR.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                id="submit-order-checkout-btn"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span>
                  {isSubmitting
                    ? (isUrdu ? 'آرڈر پروسیس ہو رہا ہے...' : 'Processing...')
                    : (isUrdu ? `آرڈر بک کریں (Rs. ${totalPKR.toLocaleString()})` : `Confirm Order (Rs. ${totalPKR.toLocaleString()})`)}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
