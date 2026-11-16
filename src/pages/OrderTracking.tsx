import React, { useState } from 'react';
import { Package, Search, CheckCircle2, Clock, Truck, ShieldCheck } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackingProps {
  initialOrderNumber?: string;
  setActivePage: (page: string) => void;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({ initialOrderNumber, setActivePage }) => {
  const [orderNumber, setOrderNumber] = useState<string>(initialOrderNumber || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const statuses = [
    'Order Placed',
    'Payment Confirmed',
    'Processing',
    'Packaged',
    'Shipped',
    'Out for Delivery',
    'Delivered'
  ];

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderNumber) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/track/${orderNumber.trim()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order not found');
      setOrder(data);
    } catch (err: any) {
      setError(err.message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Track Your Order</h1>
        <p className="text-slate-500 text-sm">Enter your order ID (e.g. LUXE-123456) to view real-time delivery status</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 max-w-lg mx-auto">
        <div className="relative flex-1">
          <input 
            type="text" 
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter Order Number..."
            required
            className="w-full bg-white border border-slate-200 rounded-full py-3.5 pl-11 pr-4 text-sm text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 font-bold uppercase"
          />
          <Search className="absolute left-4 top-4 text-slate-400" size={18} />
        </div>
        <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-full transition shadow-md text-sm">
          {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {error && (
        <div className="bg-rose-50 text-rose-700 p-4 rounded-2xl text-center text-sm font-semibold max-w-md mx-auto">
          {error}
        </div>
      )}

      {order && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Order Reference</span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{order.order_number}</h3>
              <p className="text-xs text-slate-400 mt-1">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Payment Status</span>
              <span className="font-extrabold text-emerald-600 text-sm bg-emerald-50 px-3 py-1 rounded-full">{order.payment_status}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-6">
            <h4 className="font-bold text-slate-900 text-sm">Delivery Status Timeline</h4>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {statuses.map((st, i) => {
                const currentIndex = statuses.indexOf(order.status);
                const isPassed = i <= currentIndex;
                const isCurrent = st === order.status;

                return (
                  <div key={st} className="flex flex-col items-center text-center space-y-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition ${isCurrent ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : isPassed ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {isPassed ? <CheckCircle2 size={16} /> : i + 1}
                    </div>
                    <span className={`text-xs font-semibold ${isCurrent ? 'text-indigo-600 font-bold' : isPassed ? 'text-slate-800' : 'text-slate-400'}`}>{st}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Items Summary */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">Order Items</h4>
            <div className="divide-y divide-slate-100">
              {order.items.map(item => (
                <div key={item.id} className="py-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <img src={item.image_url} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <p className="font-bold text-slate-900">{item.product_name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 block">Shipping Address</span>
              <p className="text-sm font-semibold text-slate-800">{order.shipping_address.address}, {order.shipping_address.city}, {order.shipping_address.state}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Total Amount</span>
              <span className="text-xl font-extrabold text-indigo-600">₦{order.total_amount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
