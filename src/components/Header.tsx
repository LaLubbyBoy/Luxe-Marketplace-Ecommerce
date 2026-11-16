import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, User as UserIcon, Bell, Menu, X, Shield, Package, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  activePage: string;
  setActivePage: (page: string, param?: any) => void;
  onSearchSubmit: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activePage, setActivePage, onSearchSubmit }) => {
  const { user, logout } = useAuth();
  const { cartItems, subtotal, wishlistIds, notifications, markNotificationsRead } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => n.is_read === 0).length;
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
      setActivePage('search', { q: searchQuery.trim() });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner */}
      <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-4">
        <span>✨ Free nationwide delivery on orders over ₦50,000</span>
        <span className="hidden md:inline">|</span>
        <span className="hidden md:inline">Use code <strong className="text-amber-400">LUXE10</strong> for 10% off your first order</span>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-slate-950"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div 
            onClick={() => setActivePage('home')}
            className="cursor-pointer flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl tracking-wider group-hover:bg-slate-800 transition shadow-md">
              L
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">LUXE<span className="text-indigo-600">STORE</span></span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Premium Marketplace</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg relative">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for electronics, fashion, beauty..."
            className="w-full bg-slate-100 border border-slate-200 rounded-full py-2.5 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
          />
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <button type="submit" className="absolute right-2 top-1.5 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-indigo-700 transition">
            Search
          </button>
        </form>

        {/* Nav Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          {user && (
            <div className="relative">
              <button 
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  if (!notificationsOpen && unreadCount > 0) markNotificationsRead();
                }}
                className="p-2.5 rounded-full text-slate-700 hover:bg-slate-100 transition relative"
                title="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-3 z-50">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
                    <span className="text-xs text-indigo-600 font-medium">{notifications.length} total</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="text-center text-slate-400 py-6 text-sm">No notifications yet</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-3 hover:bg-slate-50 transition">
                          <p className="font-semibold text-xs text-slate-900">{n.title}</p>
                          <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{new Date(n.created_at).toLocaleDateString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Wishlist */}
          <button 
            onClick={() => setActivePage('wishlist')}
            className="p-2.5 rounded-full text-slate-700 hover:bg-slate-100 transition relative"
            title="Wishlist"
          >
            <Heart size={20} />
            {wishlistIds.length > 0 && (
              <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlistIds.length}
              </span>
            )}
          </button>

          {/* Shopping Cart */}
          <button 
            onClick={() => setActivePage('cart')}
            className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2.5 rounded-full font-semibold transition"
          >
            <ShoppingBag size={20} />
            <span className="text-sm font-bold hidden sm:inline">₦{subtotal.toLocaleString()}</span>
            <span className="bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cartItemCount}
            </span>
          </button>

          {/* User Account */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-full hover:bg-slate-100 border border-slate-200 transition"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-slate-800 hidden lg:inline max-w-[100px] truncate">{user.name}</span>
                <ChevronDown size={14} className="text-slate-500 hidden lg:inline" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-sm text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => { setActivePage('dashboard'); setUserDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <UserIcon size={16} /> My Dashboard
                  </button>
                  <button 
                    onClick={() => { setActivePage('order-tracking'); setUserDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <Package size={16} /> Track Orders
                  </button>
                  {user.role === 'admin' && (
                    <button 
                      onClick={() => { setActivePage('admin'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 font-bold border-t border-slate-100"
                    >
                      <Shield size={16} /> Admin Portal
                    </button>
                  )}
                  <button 
                    onClick={() => { logout(); setUserDropdownOpen(false); setActivePage('home'); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium border-t border-slate-100"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setActivePage('auth')}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-bold transition shadow-md"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Sub Header Categories Navigation */}
      <div className="bg-slate-50 border-t border-slate-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-sm font-semibold text-slate-700 py-3">
          <div className="flex items-center gap-8">
            <button onClick={() => setActivePage('home')} className={`hover:text-indigo-600 transition ${activePage === 'home' ? 'text-indigo-600 font-bold' : ''}`}>Home</button>
            <button onClick={() => setActivePage('catalog')} className={`hover:text-indigo-600 transition ${activePage === 'catalog' ? 'text-indigo-600 font-bold' : ''}`}>All Products</button>
            <button onClick={() => setActivePage('catalog', { category: 'electronics' })} className="hover:text-indigo-600 transition">Electronics</button>
            <button onClick={() => setActivePage('catalog', { category: 'fashion' })} className="hover:text-indigo-600 transition">Fashion</button>
            <button onClick={() => setActivePage('catalog', { category: 'home-kitchen' })} className="hover:text-indigo-600 transition">Home & Kitchen</button>
            <button onClick={() => setActivePage('catalog', { category: 'beauty' })} className="hover:text-indigo-600 transition">Beauty</button>
            <button onClick={() => setActivePage('catalog', { category: 'footwear' })} className="hover:text-indigo-600 transition">Footwear</button>
          </div>
          <div className="flex items-center gap-6 text-slate-600 text-xs">
            <button onClick={() => setActivePage('order-tracking')} className="hover:text-indigo-600">Track Order</button>
            <button onClick={() => setActivePage('contact')} className="hover:text-indigo-600">Support</button>
            <button onClick={() => setActivePage('about')} className="hover:text-indigo-600">About Us</button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-4 shadow-xl">
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-slate-100 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-sm"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          </form>
          <div className="flex flex-col space-y-3 font-semibold text-slate-700">
            <button onClick={() => { setActivePage('home'); setMobileMenuOpen(false); }} className="text-left py-1 hover:text-indigo-600">Home</button>
            <button onClick={() => { setActivePage('catalog'); setMobileMenuOpen(false); }} className="text-left py-1 hover:text-indigo-600">All Products</button>
            <button onClick={() => { setActivePage('catalog', { category: 'electronics' }); setMobileMenuOpen(false); }} className="text-left py-1 hover:text-indigo-600">Electronics & Gadgets</button>
            <button onClick={() => { setActivePage('catalog', { category: 'fashion' }); setMobileMenuOpen(false); }} className="text-left py-1 hover:text-indigo-600">Fashion & Apparel</button>
            <button onClick={() => { setActivePage('catalog', { category: 'home-kitchen' }); setMobileMenuOpen(false); }} className="text-left py-1 hover:text-indigo-600">Home & Kitchen</button>
            <button onClick={() => { setActivePage('order-tracking'); setMobileMenuOpen(false); }} className="text-left py-1 hover:text-indigo-600">Track Order</button>
            <button onClick={() => { setActivePage('contact'); setMobileMenuOpen(false); }} className="text-left py-1 hover:text-indigo-600">Contact Us</button>
            <button onClick={() => { setActivePage('about'); setMobileMenuOpen(false); }} className="text-left py-1 hover:text-indigo-600">About Us</button>
          </div>
        </div>
      )}
    </header>
  );
};
