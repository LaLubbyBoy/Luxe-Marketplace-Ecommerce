import React from 'react';
import { ShieldCheck, Truck, Headphones, RotateCcw, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: string, param?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      {/* Features Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
            <Truck size={24} />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Express Delivery</h4>
            <p className="text-xs text-slate-400">Free nationwide shipping over ₦50,000</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Secure Payments</h4>
            <p className="text-xs text-slate-400">Paystack & Flutterwave secure checkout</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
            <RotateCcw size={24} />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Easy Returns</h4>
            <p className="text-xs text-slate-400">7-day hassle-free return policy</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <Headphones size={24} />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">24/7 Support</h4>
            <p className="text-xs text-slate-400">Dedicated customer care assistance</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl">
              L
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">LUXE<span className="text-indigo-400">STORE</span></span>
          </div>
          <p className="text-sm text-slate-400 max-w-sm">
            Your premier destination for high-end electronics, luxury fashion, exquisite home decor, and premium beauty products. Delivered straight to your doorstep.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="#facebook" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-indigo-600 hover:text-white transition"><Facebook size={18} /></a>
            <a href="#twitter" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-indigo-600 hover:text-white transition"><Twitter size={18} /></a>
            <a href="#instagram" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-indigo-600 hover:text-white transition"><Instagram size={18} /></a>
            <a href="#linkedin" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-indigo-600 hover:text-white transition"><Linkedin size={18} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            <li><button onClick={() => setActivePage('home')} className="hover:text-indigo-400 transition">Home</button></li>
            <li><button onClick={() => setActivePage('catalog')} className="hover:text-indigo-400 transition">All Products</button></li>
            <li><button onClick={() => setActivePage('catalog', { category: 'electronics' })} className="hover:text-indigo-400 transition">Electronics</button></li>
            <li><button onClick={() => setActivePage('catalog', { category: 'fashion' })} className="hover:text-indigo-400 transition">Fashion & Apparel</button></li>
            <li><button onClick={() => setActivePage('catalog', { category: 'home-kitchen' })} className="hover:text-indigo-400 transition">Home & Kitchen</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Customer Care</h4>
          <ul className="space-y-2.5 text-sm">
            <li><button onClick={() => setActivePage('order-tracking')} className="hover:text-indigo-400 transition">Track Your Order</button></li>
            <li><button onClick={() => setActivePage('dashboard')} className="hover:text-indigo-400 transition">My Account</button></li>
            <li><button onClick={() => setActivePage('wishlist')} className="hover:text-indigo-400 transition">My Wishlist</button></li>
            <li><button onClick={() => setActivePage('contact')} className="hover:text-indigo-400 transition">Contact Support</button></li>
            <li><button onClick={() => setActivePage('about')} className="hover:text-indigo-400 transition">About Our Brand</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Legal & Policies</h4>
          <ul className="space-y-2.5 text-sm">
            <li><button onClick={() => setActivePage('legal', { tab: 'privacy' })} className="hover:text-indigo-400 transition">Privacy Policy</button></li>
            <li><button onClick={() => setActivePage('legal', { tab: 'terms' })} className="hover:text-indigo-400 transition">Terms & Conditions</button></li>
            <li><button onClick={() => setActivePage('legal', { tab: 'return' })} className="hover:text-indigo-400 transition">Return & Refund Policy</button></li>
            <li><button onClick={() => setActivePage('legal', { tab: 'shipping' })} className="hover:text-indigo-400 transition">Shipping Policy</button></li>
            <li><button onClick={() => setActivePage('legal', { tab: 'cookie' })} className="hover:text-indigo-400 transition">Cookie Policy</button></li>
          </ul>
        </div>
      </div>

      {/* Newsletter Bottom */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500">© 2026 LuxeStore Technologies Ltd. All rights reserved. Powered by secure Paystack & Flutterwave infrastructure.</p>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Supported Payments:</span>
          <span className="bg-slate-800 px-2.5 py-1 rounded font-bold text-white">Paystack</span>
          <span className="bg-slate-800 px-2.5 py-1 rounded font-bold text-white">Flutterwave</span>
          <span className="bg-slate-800 px-2.5 py-1 rounded font-bold text-white">Cards</span>
        </div>
      </div>
    </footer>
  );
};
