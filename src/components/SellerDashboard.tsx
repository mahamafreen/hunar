import React, { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ArrowUpRight, 
  Download, 
  CreditCard, 
  Smartphone, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  Package,
  Calendar,
  X
} from 'lucide-react';
import { Language, Order, User } from '../types';

interface SellerDashboardProps {
  user: User;
  orders: Order[];
  language: Language;
  onUpdateOrderStatus: (orderId: string, newStatus: any) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  user,
  orders,
  language,
  onUpdateOrderStatus,
}) => {
  const isUrdu = language === 'ur';
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState<'JazzCash' | 'Easypaisa' | 'Bank'>('JazzCash');
  const [withdrawAmount, setWithdrawAmount] = useState('10000');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const totalEarnings = user.earningsPKR || 48500;
  const availableBalance = user.availableBalancePKR || 42000;
  const trialDaysLeft = user.trialDaysLeft || 7;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setShowWithdrawModal(false);
    }, 1800);
  };

  return (
    <div id="seller-dashboard-container" className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Welcome & Free Trial Notification Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Background Subtle Accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-emerald-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {isUrdu ? '1 ہفتہ فری ٹرائل فعال ہے' : '1-Week Free Trial Active'}
              </span>
              <span className="text-emerald-200 text-xs font-medium">
                {trialDaysLeft} {isUrdu ? 'دن باقی ہیں' : 'days left'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif">
              {isUrdu ? `خوش آمدید، ${user.nameUrdu || user.name}` : `Welcome, ${user.name}`}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
              {isUrdu
                ? 'پہلے 7 دن آپ کی تمام خدمات پر کوئی ایپ فیس نہیں ہے۔ ٹرائل کے بعد آپ کی کمائی سے صرف 5% شفاف ایپ سروس فیس لی جائے گی تاکہ سسٹم چلتا رہے۔'
                : 'Enjoy 100% free sales during your 7-day trial. Afterwards, a flat 5% platform fee applies per completed order to maintain services.'}
            </p>
          </div>

          {/* Quick Cashout Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 min-w-[260px] text-right">
            <span className="text-xs text-emerald-200 block text-left">
              {isUrdu ? 'قابلِ واپسی بیلنس:' : 'Available Balance:'}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono text-left my-1">
              Rs. {availableBalance.toLocaleString()}
            </div>
            <button
              id="open-cashout-modal-btn"
              onClick={() => setShowWithdrawModal(true)}
              className="w-full mt-2 py-2 px-3 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>{isUrdu ? 'جاز کیش / ایزی پیسہ میں کیش آؤٹ' : 'Withdraw Cash'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row: Total Revenue, Completed Orders, 5% Fee Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold mb-2">
            <span>{isUrdu ? 'کل فروخت و آمدن' : 'Total Revenue'}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-950 font-mono">
            Rs. {totalEarnings.toLocaleString()}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {user.completedOrdersCount} {isUrdu ? 'مکمل شدہ آرڈرز' : 'completed orders'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold mb-2">
            <span>{isUrdu ? 'کوریئر پارٹنرز' : 'Active Couriers'}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-stone-800">
            Leopard (Rs. 250) & PostEx (Rs. 200)
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">
            {isUrdu ? 'ہوم پک اپ سروس فعال ہے' : 'Home pickup enabled'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold mb-2">
            <span>{isUrdu ? 'ایپ فیس ماڈل' : 'Fee Structure'}</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-emerald-950">
            {isUrdu ? '0% فیس (ابھی) • بعد میں 5%' : '0% Fee (Trial) • 5% Later'}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {isUrdu ? 'کوئی پوشیدہ چارجز نہیں' : 'Zero hidden charges'}
          </p>
        </div>
      </div>

      {/* Orders & Shipments Management Table */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-emerald-950">
              {isUrdu ? 'آرڈرز اور ڈلیوری اسٹیٹس' : 'Active Orders & Dispatch Slips'}
            </h2>
            <p className="text-xs text-stone-500">
              {isUrdu ? 'لیپرڈ اور پوسٹ ایکس کے ٹریکنگ نمبرز کے ساتھ آرڈرز کو اپ ڈیٹ کریں۔' : 'Manage customer orders and courier dispatches.'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-bold">
                <th className="py-2.5 px-3">{isUrdu ? 'آرڈر ID' : 'Order ID'}</th>
                <th className="py-2.5 px-3">{isUrdu ? 'سروس' : 'Service / Gig'}</th>
                <th className="py-2.5 px-3">{isUrdu ? 'گاہک' : 'Customer'}</th>
                <th className="py-2.5 px-3">{isUrdu ? 'رقم' : 'Amount'}</th>
                <th className="py-2.5 px-3">{isUrdu ? 'کوریئر و ٹریکنگ' : 'Courier & Tracking'}</th>
                <th className="py-2.5 px-3">{isUrdu ? 'اسٹیٹس' : 'Status'}</th>
                <th className="py-2.5 px-3 text-right">{isUrdu ? 'ایکشن' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-stone-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-emerald-950">{ord.id}</td>
                  <td className="py-3 px-3 font-medium text-stone-800 max-w-xs truncate">{ord.gigTitle}</td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-stone-900">{ord.buyerName}</p>
                    <p className="text-[10px] text-stone-500">{ord.contactPhone}</p>
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-900">
                    Rs. {ord.amountPKR.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-stone-400" />
                      <span className="font-bold text-stone-800">{ord.courier}</span>
                    </div>
                    <span className="font-mono text-[10px] text-rose-700">{ord.trackingNumber}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      ord.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.status === 'dispatched'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.status === 'in_progress' ? (isUrdu ? 'کام جاری ہے' : 'In Progress') : ord.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {ord.status !== 'completed' && (
                      <button
                        onClick={() => onUpdateOrderStatus(ord.id, ord.status === 'in_progress' ? 'dispatched' : 'completed')}
                        className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                      >
                        {ord.status === 'in_progress' ? (isUrdu ? 'ارسال کریں' : 'Dispatch') : (isUrdu ? 'مکمل کریں' : 'Mark Done')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cashout / Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-emerald-950 font-serif">
                {isUrdu ? 'رقم اپنے اکاؤنٹ میں منتقل کریں' : 'Withdraw Earnings to Mobile Account'}
              </h3>
              <p className="text-xs text-stone-600">
                {isUrdu ? 'JazzCash یا Easypaisa کے ذریعے 24 گھنٹے میں ادائیگی' : 'Instant 24-hr transfer to JazzCash or Easypaisa'}
              </p>
            </div>

            {withdrawSuccess ? (
              <div className="text-center py-4 text-emerald-700 font-bold">
                <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-600 mb-2" />
                <p>{isUrdu ? 'درخواست موصول ہو گئی ہے!' : 'Transfer Request Submitted!'}</p>
                <p className="text-xs text-stone-500 font-normal mt-1">
                  Rs. {Number(withdrawAmount).toLocaleString()} will be sent to your {withdrawMethod}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {isUrdu ? 'ادائیگی کا ذریعہ:' : 'Select Destination:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <button
                      type="button"
                      onClick={() => setWithdrawMethod('JazzCash')}
                      className={`p-2 rounded-xl border font-bold ${
                        withdrawMethod === 'JazzCash' ? 'bg-rose-50 border-rose-500 text-rose-900 ring-1 ring-rose-500' : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      JazzCash
                    </button>
                    <button
                      type="button"
                      onClick={() => setWithdrawMethod('Easypaisa')}
                      className={`p-2 rounded-xl border font-bold ${
                        withdrawMethod === 'Easypaisa' ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500' : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      Easypaisa
                    </button>
                    <button
                      type="button"
                      onClick={() => setWithdrawMethod('Bank')}
                      className={`p-2 rounded-xl border font-bold ${
                        withdrawMethod === 'Bank' ? 'bg-sky-50 border-sky-500 text-sky-900 ring-1 ring-sky-500' : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      Bank Account
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {isUrdu ? 'موبائل نمبر / اکاؤنٹ نمبر:' : 'Account Number / Phone:'}
                  </label>
                  <input
                    type="text"
                    defaultValue={user.phone}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {isUrdu ? 'رقم (پاکستانی روپے):' : 'Amount (PKR):'}
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    max={availableBalance}
                    min={500}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold font-mono text-emerald-950"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    Available: Rs. {availableBalance.toLocaleString()}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold transition-colors cursor-pointer"
                >
                  {isUrdu ? 'منتقلی کی تصدیق کریں' : 'Confirm Cashout'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
