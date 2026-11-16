import React from 'react';
import { Award, ShieldCheck, Truck, Sparkles } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="bg-indigo-50 text-indigo-700 text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider">About LuxeStore</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Redefining Premium E-Commerce</h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Founded in 2026, LuxeStore is Nigeria's premier destination for discerning shoppers who demand uncompromising quality, elegance, and reliability in every purchase.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop" alt="Store experience" className="w-full h-[400px] object-cover" />
        </div>
        <div className="space-y-6">
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Our Mission & Vision</h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            We bridge the gap between world-class international brands and local consumers by providing an intuitive, secure, and lightning-fast shopping platform backed by robust payment gateways like Paystack and Flutterwave.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-2">
              <Award className="text-indigo-600" size={24} />
              <h4 className="font-bold text-slate-900 text-base">Uncompromising Quality</h4>
              <p className="text-xs text-slate-500">Every product in our catalog is 100% authentic and vetted.</p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-2">
              <ShieldCheck className="text-emerald-600" size={24} />
              <h4 className="font-bold text-slate-900 text-base">Secure Transactions</h4>
              <p className="text-xs text-slate-500">Bank-grade encryption and verified server-side payment validation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
