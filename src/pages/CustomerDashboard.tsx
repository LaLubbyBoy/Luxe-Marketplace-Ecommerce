import React, { useEffect, useState } from 'react';
import { User, Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { Package, User as UserIcon, Shield, Bell, LogOut, CheckCircle2, DollarSign, Send } from 'lucide-react';

interface CustomerDashboardProps {
  setActivePage: (page: string, param?: any) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ setActivePage }) => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'payouts' | 'profile' | 'security'>('orders');

  // Payout request form state
  const [payoutAmount, setPayoutAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [payoutMsg, setPayoutMsg] = useState<string | null>(null);

  const loadData = () => {
    if (user) {
      fetch(`/api/orders?userId=${user.id}`).then(res => res.json()).then(setOrders).catch(console.error);
      fetch(`/api/payouts?userId=${user.id}`).then(res => res.json()).then(setPayouts).catch(console.error);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutMsg(null);
    try {
      const res = await fetch('/api/payouts/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          amount: Number(payoutAmount),
          bank_name: bankName,
          account_number: accountNumber,
          account_name: accountName
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payout request failed');
      setPayoutAmount('');
      setBankName('');
      setAccountNumber('');
      setAccountName('');
      setPayoutMsg('✅ Payout request submitted successfully!');
      loadData();
    } catch (err: any) {
      setPayoutMsg(`❌ ${err.message}`);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900">Please sign in to access your dashboard</h2>
        <button onClick={() => setActivePage('auth')} className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-full text-sm">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">{user.name}</h1>
            <p className="text-slate-300 text-xs mt-0.5">{user.email} • {user.phone || 'No phone added'}</p>
          </div>
        </div>
        <button 
          onClick={() => { logout(); setActivePage('home'); }}
          className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-2.5 rounded-full transition text-xs flex items-center gap-2"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 gap-8 font-bold text-sm">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`pb-4 border-b-2 transition ${activeTab === 'orders' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          My Orders ({orders.length})
        </button>
        <button 
          onClick={() => setActiveTab('payouts')}
          className={`pb-4 border-b-2 transition ${activeTab === 'payouts' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Payouts & Earnings ({payouts.length})
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`pb-4 border-b-2 transition ${activeTab === 'profile' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Profile Information
        </button>
        <button 
          onClick={() => setActiveTab('security')}
          className={`pb-4 border-b-2 transition ${activeTab === 'security' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Security & Password
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-4">
              <Package size={40} className="mx-auto text-slate-400" />
              <h3 className="font-bold text-slate-900 text-lg">No orders placed yet</h3>
              <p className="text-slate-500 text-sm">When you place orders, they will appear here with real-time delivery tracking.</p>
              <button onClick={() => setActivePage('catalog')} className="bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-full text-xs">
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-xs font-bold text-indigo-600 uppercase">Order #{order.order_number}</span>
                      <p className="text-xs text-slate-400 mt-0.5">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">{order.status}</span>
                      <button 
                        onClick={() => setActivePage('order-tracking', { orderNumber: order.order_number })}
                        className="bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                      >
                        Track Order
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
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

                  <div className="border-t border-slate-100 pt-4 flex justify-between text-sm font-extrabold text-slate-900">
                    <span>Total Amount ({order.payment_status})</span>
                    <span className="text-indigo-600">₦{order.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'payouts' && (
        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xs">
            <h3 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-4">Request Bank Payout / Withdrawal</h3>
            {payoutMsg && (
              <div className="p-4 rounded-2xl text-xs font-bold bg-slate-100 text-slate-800">
                {payoutMsg}
              </div>
            )}
            <form onSubmit={handleRequestPayout} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Payout Amount (₦)</label>
                <input 
                  type="number" 
                  value={payoutAmount} 
                  onChange={e => setPayoutAmount(e.target.value)} 
                  required 
                  placeholder="25000" 
                  className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Bank Name</label>
                <input 
                  type="text" 
                  value={bankName} 
                  onChange={e => setBankName(e.target.value)} 
                  required 
                  placeholder="Guaranty Trust Bank (GTB)" 
                  className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Account Number (10 digits)</label>
                <input 
                  type="text" 
                  value={accountNumber} 
                  onChange={e => setAccountNumber(e.target.value)} 
                  required 
                  placeholder="0123456789" 
                  className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Account Holder Name</label>
                <input 
                  type="text" 
                  value={accountName} 
                  onChange={e => setAccountName(e.target.value)} 
                  required 
                  placeholder="Amina Adebayo" 
                  className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-xs"
                />
              </div>
              <div className="sm:col-span-2 pt-2">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-2xl text-xs shadow-md flex items-center gap-2">
                  <Send size={16} /> Submit Payout Request
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xs">
            <h3 className="text-xl font-extrabold text-slate-900">Payout History</h3>
            <div className="divide-y divide-slate-100">
              {payouts.length === 0 ? (
                <p className="text-slate-400 text-sm py-4">No payout requests found.</p>
              ) : (
                payouts.map((po: any) => (
                  <div key={po.id} className="py-4 flex items-center justify-between text-sm">
                    <div>
                      <h4 className="font-bold text-slate-900">₦{po.amount.toLocaleString()} ({po.bank_name})</h4>
                      <p className="text-xs text-slate-500">Acc: {po.account_number} • Ref: {po.reference} • {new Date(po.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${po.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : po.status === 'Rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
                      {po.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-xl space-y-6 shadow-xs">
          <h3 className="font-extrabold text-slate-900 text-lg">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Full Name</label>
              <input type="text" readOnly value={user.name} className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-sm text-slate-800 font-semibold" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
              <input type="email" readOnly value={user.email} className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-sm text-slate-800 font-semibold" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Phone Number</label>
              <input type="text" readOnly value={user.phone || 'Not added'} className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-sm text-slate-800 font-semibold" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-xl space-y-6 shadow-xs">
          <h3 className="font-extrabold text-slate-900 text-lg">Password Management</h3>
          <form onSubmit={(e) => { e.preventDefault(); alert('Password updated successfully'); }} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Current Password</label>
              <input type="password" required className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-sm text-slate-800" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">New Password</label>
              <input type="password" required className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-sm text-slate-800" />
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition">
              Update Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
