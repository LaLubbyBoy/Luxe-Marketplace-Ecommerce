import React, { useState } from 'react';
import { ShoppingBag, Trash2, ArrowRight, Tag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartProps {
  setActivePage: (page: string, param?: any) => void;
  onSelectProduct: (id: number) => void;
}

export const Cart: React.FC<CartProps> = ({ setActivePage, onSelectProduct }) => {
  const { cartItems, subtotal, updateQuantity, removeFromCart } = useCart();
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ id: number; code: string; discountAmount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState<boolean>(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    setCouponLoading(true);
    setCouponError(null);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid coupon');
      setAppliedCoupon({ id: data.couponId, code: data.code, discountAmount: data.discountAmount });
      setCouponCode('');
    } catch (err: any) {
      setCouponError(err.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const shippingFee = subtotal > 50000 || subtotal === 0 ? 0 : 3500;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const totalAmount = subtotal - discountAmount + shippingFee;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag size={42} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your shopping cart is empty</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">Explore our exclusive catalog of electronics, fashion, and lifestyle products to start shopping.</p>
        </div>
        <button 
          onClick={() => setActivePage('catalog')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-full transition shadow-lg"
        >
          Start Shopping Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shopping Cart</h1>
        <p className="text-slate-500 text-sm">Review your selected items and proceed to secure checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs divide-y divide-slate-100">
            {cartItems.map(item => (
              <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div 
                    onClick={() => onSelectProduct(item.product_id)}
                    className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer shadow-xs"
                  >
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <h3 
                      onClick={() => onSelectProduct(item.product_id)}
                      className="font-bold text-slate-900 text-base cursor-pointer hover:text-indigo-600 transition line-clamp-1"
                    >
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                      {item.color && <span>Colour: <strong className="text-slate-800">{item.color}</strong></span>}
                      {item.size && <span>Size: <strong className="text-slate-800">{item.size}</strong></span>}
                    </div>
                    <span className="font-extrabold text-slate-900 block pt-1">₦{item.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  {/* Quantity Control */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold text-sm transition"
                    >
                      -
                    </button>
                    <span className="px-3 font-bold text-slate-900 text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold text-sm transition"
                    >
                      +
                    </button>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 transition"
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary & Checkout Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
            <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-4">Order Summary</h3>

            {/* Coupon Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Discount Coupon</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. LUXE10"
                  className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs uppercase font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <button type="submit" disabled={couponLoading} className="bg-slate-900 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition">
                  Apply
                </button>
              </div>
              {couponError && <p className="text-xs text-rose-500">{couponError}</p>}
              {appliedCoupon && (
                <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between">
                  <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-₦{appliedCoupon.discountAmount.toLocaleString()})</span>
                  <button type="button" onClick={() => setAppliedCoupon(null)} className="text-rose-600 font-bold">Remove</button>
                </div>
              )}
            </form>

            <div className="space-y-3 pt-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₦{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount Coupon</span>
                  <span className="font-bold">-₦{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-bold text-slate-900">{shippingFee === 0 ? 'FREE' : `₦${shippingFee.toLocaleString()}`}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-extrabold text-slate-900">
                <span>Total Payment</span>
                <span className="text-indigo-600">₦{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={() => setActivePage('checkout', { couponId: appliedCoupon?.id })}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 space-y-3 text-xs text-indigo-900">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck size={18} /> Secure Paystack & Flutterwave Checkout
            </div>
            <p className="leading-relaxed">All transactions are encrypted and secured. You can pay securely with credit/debit card, bank transfer, or USSD.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
