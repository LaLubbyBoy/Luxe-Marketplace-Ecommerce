import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, CheckCircle2, Lock, ArrowRight, CreditCard, Landmark, Smartphone, Package, Printer } from 'lucide-react';
import { CheckoutSuccess } from '../components/CheckoutSuccess';

interface CheckoutProps {
  couponId?: number;
  setActivePage: (page: string, param?: any) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ couponId, setActivePage }) => {
  const { cartItems, cartId, subtotal, refreshCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState<number>(1); // 1: Customer, 2: Delivery, 3: Payment
  
  // Customer info form
  const [fullName, setFullName] = useState<string>(user?.name || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');

  // Delivery info form
  const [country, setCountry] = useState<string>('Nigeria');
  const [state, setState] = useState<string>('Lagos State');
  const [city, setCity] = useState<string>('Victoria Island');
  const [address, setAddress] = useState<string>('12 Admiralty Way');
  const [instructions, setInstructions] = useState<string>('');

  // Payment Method: 'card' | 'bank' | 'ussd' | 'mobile'
  const [paymentMethod, setPaymentMethod] = useState<string>('card');

  // Card details mock
  const [cardNumber, setCardNumber] = useState<string>('4532 8921 7654 3210');
  const [cardExpiry, setCardExpiry] = useState<string>('09/28');
  const [cardCvv, setCardCvv] = useState<string>('492');

  // Checkout Response state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<{ orderNumber: string; reference: string; totalAmount: number } | null>(null);

  const shippingFee = subtotal > 50000 || subtotal === 0 ? 0 : 3500;
  const totalAmount = subtotal + shippingFee;

  const handleCompleteCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartId || cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Initialize order on backend
      const res = await fetch('/api/checkout/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          cartId,
          shippingAddress: { fullName, email, phone, country, state, city, address, instructions },
          customerInfo: { name: fullName, email, phone },
          paymentMethod,
          couponId
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');

      // Instantly mark payment verified and generate success mockup page
      await fetch('/api/checkout/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: data.reference })
      });

      setSuccessOrder({
        orderNumber: data.orderNumber,
        reference: data.reference,
        totalAmount: data.totalAmount
      });
      refreshCart();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <CheckoutSuccess 
        orderNumber={successOrder.orderNumber}
        reference={successOrder.reference}
        totalAmount={successOrder.totalAmount}
        customerName={fullName}
        paymentMethod={paymentMethod}
        setActivePage={setActivePage}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Secure Checkout</h1>
        <p className="text-slate-500 text-sm">Complete your customer, delivery, and payment details</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between max-w-2xl mx-auto mb-8">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>1</div>
          <span className="hidden sm:inline">Customer</span>
        </div>
        <div className={`flex-1 h-0.5 mx-4 ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2</div>
          <span className="hidden sm:inline">Delivery</span>
        </div>
        <div className={`flex-1 h-0.5 mx-4 ${step >= 3 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>3</div>
          <span className="hidden sm:inline">Payment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form Steps */}
        <div className="lg:col-span-2">
          <form onSubmit={handleCompleteCheckout} className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xs">
            {error && <div className="bg-rose-50 text-rose-700 p-4 rounded-2xl text-xs font-bold">{error}</div>}

            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-4">Step 1: Customer Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="e.g. Amina Adebayo"
                      className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="e.g. amina@example.com"
                      className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="e.g. +2348012345678"
                      className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button 
                    type="button" 
                    onClick={() => setStep(2)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-full transition shadow-md text-sm flex items-center gap-2"
                  >
                    Next: Delivery Info <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-4">Step 2: Delivery Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Country</label>
                    <input 
                      type="text" 
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">State / Region</label>
                    <input 
                      type="text" 
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">City</label>
                    <input 
                      type="text" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Street Address</label>
                    <input 
                      type="text" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Delivery Instructions (Optional)</label>
                  <textarea 
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Please leave package at front security gate."
                    rows={2}
                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800"
                  />
                </div>
                <div className="flex justify-between pt-4">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3 rounded-full transition text-sm"
                  >
                    Back
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setStep(3)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-full transition shadow-md text-sm flex items-center gap-2"
                  >
                    Next: Payment Method <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-4">Step 3: Select Payment Method</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label 
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Debit / Credit Card</h4>
                      <p className="text-xs text-slate-500">Visa, Mastercard, Verve</p>
                    </div>
                  </label>

                  <label 
                    onClick={() => setPaymentMethod('bank')}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${paymentMethod === 'bank' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <Landmark size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Bank Transfer</h4>
                      <p className="text-xs text-slate-500">Direct online bank deposit</p>
                    </div>
                  </label>

                  <label 
                    onClick={() => setPaymentMethod('ussd')}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${paymentMethod === 'ussd' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">USSD Code</h4>
                      <p className="text-xs text-slate-500">*737#, *966#, etc.</p>
                    </div>
                  </label>

                  <label 
                    onClick={() => setPaymentMethod('mobile')}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${paymentMethod === 'mobile' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Mobile Money</h4>
                      <p className="text-xs text-slate-500">OPay, PalmPay, Apple Pay</p>
                    </div>
                  </label>
                </div>

                {paymentMethod === 'card' && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Mock Card Details</h4>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Card Number</label>
                      <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Expiry Date</label>
                        <input type="text" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">CVV</label>
                        <input type="password" value={cardCvv} onChange={e => setCardCvv(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-1 text-slate-700">
                    <p className="font-bold">Bank Transfer Instructions:</p>
                    <p>Bank: <strong>Guaranty Trust Bank (GTB)</strong></p>
                    <p>Account Number: <strong>0123456789</strong></p>
                    <p>Account Name: <strong>LuxeStore Technologies Ltd</strong></p>
                    <p className="text-slate-400 pt-1">Your order will be processed instantly upon clicking checkout.</p>
                  </div>
                )}

                {paymentMethod === 'ussd' && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-1 text-slate-700">
                    <p className="font-bold">USSD Dial Code:</p>
                    <p>Dial <strong className="font-mono bg-amber-100 px-2 py-1 rounded text-amber-900">*737*000*₦{totalAmount.toLocaleString()}#</strong> on your registered phone number to complete payment instantly.</p>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button 
                    type="button" 
                    onClick={() => setStep(2)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3 rounded-full transition text-sm"
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-full transition shadow-md text-sm flex items-center gap-2"
                  >
                    {loading ? 'Processing...' : `Pay ₦${totalAmount.toLocaleString()} & Complete Order`} <Lock size={16} />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
            <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-4">Cart Summary</h3>
            <div className="space-y-3 max-h-72 overflow-y-auto divide-y divide-slate-100">
              {cartItems.map(item => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                      <p className="text-slate-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-bold text-slate-900">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Shipping</span>
                <span className="font-bold text-slate-900">{shippingFee === 0 ? 'FREE' : `₦${shippingFee.toLocaleString()}`}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between font-extrabold text-base text-slate-900">
                <span>Total</span>
                <span className="text-indigo-600">₦{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
