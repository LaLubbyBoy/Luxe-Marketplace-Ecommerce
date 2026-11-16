import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Product, Order, User, Coupon } from '../types';
import { Shield, Package, Users, Tag, TrendingUp, DollarSign, Plus, Trash2, Edit, CheckCircle2, AlertTriangle, Download } from 'lucide-react';

interface AdminDashboardProps {
  setActivePage: (page: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActivePage }) => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'coupons' | 'payouts'>('overview');
  
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);

  // Add Product Form State
  const [newProductName, setNewProductName] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductCompare, setNewProductCompare] = useState('');
  const [newProductCat, setNewProductCat] = useState('1');
  const [newProductBrand, setNewProductBrand] = useState('');
  const [newProductStock, setNewProductStock] = useState('50');
  const [newProductImg, setNewProductImg] = useState('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800');

  // Coupon Form State
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponVal, setCouponVal] = useState('');
  const [couponMin, setCouponMin] = useState('');

  const loadAdminData = () => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats).catch(console.error);
    fetch('/api/admin/products').then(r => r.json()).then(setProducts).catch(console.error);
    fetch('/api/admin/orders').then(r => r.json()).then(setOrders).catch(console.error);
    fetch('/api/admin/customers').then(r => r.json()).then(setCustomers).catch(console.error);
    fetch('/api/admin/coupons').then(r => r.json()).then(setCoupons).catch(console.error);
    fetch('/api/admin/payouts').then(r => r.json()).then(setPayouts).catch(console.error);
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <Shield size={48} className="mx-auto text-rose-500" />
        <h2 className="text-2xl font-extrabold text-slate-900">Administrator Access Required</h2>
        <p className="text-slate-500 text-sm">Please sign in with the admin demo account (admin@luxestore.com) to access the admin portal.</p>
        <button onClick={() => setActivePage('auth')} className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-full text-sm">
          Sign In as Admin
        </button>
      </div>
    );
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProductName,
          description: newProductDesc,
          price: Number(newProductPrice),
          compare_at_price: Number(newProductCompare || newProductPrice),
          category_id: Number(newProductCat),
          brand: newProductBrand,
          stock: Number(newProductStock),
          is_featured: 1,
          is_best_seller: 0,
          is_new: 1,
          colors: ['Standard'],
          sizes: ['Standard'],
          images: [newProductImg]
        })
      });
      if (res.ok) {
        setNewProductName('');
        setNewProductDesc('');
        setNewProductPrice('');
        setNewProductCompare('');
        setNewProductBrand('');
        loadAdminData();
        alert('Product added successfully!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      loadAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSuspendCustomer = async (customerId: number) => {
    try {
      await fetch(`/api/admin/customers/${customerId}/suspend`, { method: 'POST' });
      loadAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode,
          discount_type: couponType,
          discount_value: Number(couponVal),
          min_order_amount: Number(couponMin || 0)
        })
      });
      setCouponCode('');
      setCouponVal('');
      setCouponMin('');
      loadAdminData();
      alert('Coupon created successfully!');
    } catch (e) {
      console.error(e);
    }
  };

  const handleProcessPayout = async (payoutId: number, status: 'Paid' | 'Rejected') => {
    try {
      await fetch(`/api/admin/payouts/${payoutId}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      loadAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + orders.map(o => `${o.order_number},${o.customer_info.name},${o.total_amount},${o.status},${o.created_at}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "luxestore_orders_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">Administrator Portal</h1>
            <p className="text-slate-400 text-xs mt-0.5">Manage products, inventory, orders, customers, coupons, and bank payouts</p>
          </div>
        </div>
        <button 
          onClick={exportCSV}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-full transition text-xs shadow-md flex items-center gap-2"
        >
          <Download size={16} /> Export Sales CSV
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4 font-bold text-sm">
        <button 
          onClick={() => setTab('overview')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${tab === 'overview' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          Dashboard Overview
        </button>
        <button 
          onClick={() => setTab('products')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${tab === 'products' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          Product Management ({products.length})
        </button>
        <button 
          onClick={() => setTab('orders')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${tab === 'orders' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          Order Management ({orders.length})
        </button>
        <button 
          onClick={() => setTab('customers')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${tab === 'customers' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          Customer Directory ({customers.length})
        </button>
        <button 
          onClick={() => setTab('coupons')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${tab === 'coupons' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          Coupons
        </button>
        <button 
          onClick={() => setTab('payouts')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${tab === 'payouts' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          Payouts Management ({payouts.length})
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {tab === 'overview' && stats && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Sales Revenue</span>
              <h3 className="text-3xl font-extrabold text-slate-900">₦{stats.totalSales.toLocaleString()}</h3>
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Orders</span>
              <h3 className="text-3xl font-extrabold text-indigo-600">{stats.totalOrders}</h3>
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Registered Customers</span>
              <h3 className="text-3xl font-extrabold text-emerald-600">{stats.totalCustomers}</h3>
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Low Stock Products</span>
              <h3 className="text-3xl font-extrabold text-rose-600">{stats.lowStockProducts}</h3>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {tab === 'products' && (
        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xs">
            <h3 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-4">Add New Product</h3>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Product Name</label>
                <input type="text" value={newProductName} onChange={e => setNewProductName(e.target.value)} required placeholder="Wireless Earbuds" className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Brand</label>
                <input type="text" value={newProductBrand} onChange={e => setNewProductBrand(e.target.value)} required placeholder="Apex Audio" className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Price (₦)</label>
                <input type="number" value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} required placeholder="45000" className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Compare Price (₦)</label>
                <input type="number" value={newProductCompare} onChange={e => setNewProductCompare(e.target.value)} placeholder="60000" className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Category</label>
                <select value={newProductCat} onChange={e => setNewProductCat(e.target.value)} className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-xs font-bold">
                  <option value="1">Electronics & Gadgets</option>
                  <option value="2">Fashion & Apparel</option>
                  <option value="3">Home & Kitchen</option>
                  <option value="4">Beauty & Wellness</option>
                  <option value="5">Footwear & Sneakers</option>
                  <option value="6">Sports & Fitness</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Initial Stock</label>
                <input type="number" value={newProductStock} onChange={e => setNewProductStock(e.target.value)} required className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-xs" />
              </div>
              <div className="sm:col-span-3">
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Description</label>
                <textarea value={newProductDesc} onChange={e => setNewProductDesc(e.target.value)} required rows={2} placeholder="Product description..." className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-xs" />
              </div>
              <div className="sm:col-span-3">
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Image URL</label>
                <input type="text" value={newProductImg} onChange={e => setNewProductImg(e.target.value)} required className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-xs" />
              </div>
              <div className="sm:col-span-3">
                <button type="submit" className="bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-2xl text-xs shadow-md">
                  Publish Product
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xs">
            <h3 className="text-xl font-extrabold text-slate-900">Manage Products ({products.length})</h3>
            <div className="divide-y divide-slate-100">
              {products.map(p => (
                <div key={p.id} className="py-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <img src={p.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-900">{p.name}</h4>
                      <p className="text-xs text-slate-500">Stock: <strong className={p.stock < 15 ? 'text-rose-600 font-bold' : 'text-slate-800'}>{p.stock}</strong> • ₦{p.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <button 
                    onClick={async () => {
                      if (confirm('Are you sure you want to delete this product?')) {
                        await fetch(`/api/admin/products/${p.id}`, { method: 'DELETE' });
                        loadAdminData();
                      }
                    }}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {tab === 'orders' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xs">
          <h3 className="text-xl font-extrabold text-slate-900">All Customer Orders ({orders.length})</h3>
          <div className="space-y-4">
            {orders.map(o => (
              <div key={o.id} className="border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{o.order_number}</h4>
                    <p className="text-xs text-slate-500">{o.customer_info.name} • {o.customer_info.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select 
                      value={o.status}
                      onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                      className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Payment Confirmed">Payment Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Packaged">Packaged</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <span className="font-extrabold text-indigo-600 text-sm">₦{o.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CUSTOMERS TAB */}
      {tab === 'customers' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xs">
          <h3 className="text-xl font-extrabold text-slate-900">Registered Customers ({customers.length})</h3>
          <div className="divide-y divide-slate-100">
            {customers.map((c: any) => (
              <div key={c.id} className="py-4 flex items-center justify-between text-sm">
                <div>
                  <h4 className="font-bold text-slate-900">{c.name}</h4>
                  <p className="text-xs text-slate-500">{c.email} • {c.phone || 'No phone'} • Orders: {c.order_count}</p>
                </div>
                <button 
                  onClick={() => handleSuspendCustomer(c.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${c.is_suspended ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}
                >
                  {c.is_suspended ? 'Unsuspend Account' : 'Suspend Account'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COUPONS TAB */}
      {tab === 'coupons' && (
        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xs">
            <h3 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-4">Create Discount Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Coupon Code</label>
                <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} required placeholder="SUMMER20" className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-xs uppercase font-bold" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Discount Type</label>
                <select value={couponType} onChange={(e: any) => setCouponType(e.target.value)} className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-xs font-bold">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₦)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Discount Value</label>
                <input type="number" value={couponVal} onChange={e => setCouponVal(e.target.value)} required placeholder="15" className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Min Order (₦)</label>
                <input type="number" value={couponMin} onChange={e => setCouponMin(e.target.value)} placeholder="20000" className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-xs" />
              </div>
              <div className="sm:col-span-4">
                <button type="submit" className="bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-2xl text-xs shadow-md">
                  Create Coupon
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xs">
            <h3 className="text-xl font-extrabold text-slate-900">Active Coupons ({coupons.length})</h3>
            <div className="divide-y divide-slate-100">
              {coupons.map(cp => (
                <div key={cp.id} className="py-4 flex items-center justify-between text-sm">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{cp.code}</h4>
                    <p className="text-xs text-slate-500">
                      {cp.discount_type === 'percentage' ? `${cp.discount_value}% OFF` : `₦${cp.discount_value.toLocaleString()} OFF`} • Min Order: ₦{cp.min_order_amount.toLocaleString()} • Used: {cp.times_used} times
                    </p>
                  </div>
                  <button 
                    onClick={async () => {
                      if (confirm('Delete this coupon?')) {
                        await fetch(`/api/admin/coupons/${cp.id}`, { method: 'DELETE' });
                        loadAdminData();
                      }
                    }}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PAYOUTS MANAGEMENT TAB */}
      {tab === 'payouts' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xs">
          <h3 className="text-xl font-extrabold text-slate-900">Merchant Payout Requests ({payouts.length})</h3>
          <div className="divide-y divide-slate-100">
            {payouts.length === 0 ? (
              <p className="text-slate-400 text-sm py-4">No payout requests submitted yet.</p>
            ) : (
              payouts.map((po: any) => (
                <div key={po.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                  <div>
                    <h4 className="font-bold text-slate-900">{po.user_name} ({po.user_email})</h4>
                    <p className="text-xs text-slate-500">Amount: <strong className="text-slate-900">₦{po.amount.toLocaleString()}</strong> • Bank: {po.bank_name} • Acc: {po.account_number} ({po.account_name})</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Ref: {po.reference} • Date: {new Date(po.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${po.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : po.status === 'Rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
                      {po.status}
                    </span>
                    {po.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleProcessPayout(po.id, 'Paid')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                        >
                          Approve & Pay
                        </button>
                        <button 
                          onClick={() => handleProcessPayout(po.id, 'Rejected')}
                          className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold px-4 py-2 rounded-xl text-xs transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
