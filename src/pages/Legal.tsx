import React, { useState } from 'react';

interface LegalProps {
  initialTab?: string;
}

export const Legal: React.FC<LegalProps> = ({ initialTab = 'privacy' }) => {
  const [tab, setTab] = useState<string>(initialTab);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Legal & Store Policies</h1>
        <p className="text-slate-500 text-sm">Transparency and security are foundational to the LuxeStore shopping experience.</p>
      </div>

      <div className="flex flex-wrap gap-3 border-b border-slate-200 pb-4">
        <button 
          onClick={() => setTab('privacy')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${tab === 'privacy' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          Privacy Policy
        </button>
        <button 
          onClick={() => setTab('terms')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${tab === 'terms' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          Terms & Conditions
        </button>
        <button 
          onClick={() => setTab('return')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${tab === 'return' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          Return & Refund
        </button>
        <button 
          onClick={() => setTab('shipping')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${tab === 'shipping' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          Shipping Policy
        </button>
        <button 
          onClick={() => setTab('cookie')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${tab === 'cookie' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          Cookie Policy
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xs leading-relaxed text-sm text-slate-700">
        {tab === 'privacy' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-slate-900">Privacy Policy</h2>
            <p>At LuxeStore, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you visit our website or make purchases.</p>
            <h3 className="font-bold text-slate-900 text-base pt-2">1. Information We Collect</h3>
            <p>We collect personal information such as your name, email address, phone number, and delivery address when you register an account, place an order, or subscribe to our newsletter.</p>
            <h3 className="font-bold text-slate-900 text-base pt-2">2. Payment Security</h3>
            <p>All payments are processed securely through certified payment gateways like Paystack and Flutterwave. We never store your full credit card numbers or CVV information on our servers.</p>
          </div>
        )}

        {tab === 'terms' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-slate-900">Terms and Conditions</h2>
            <p>By accessing and placing an order with LuxeStore, you confirm that you agree to be bound by these terms and conditions.</p>
            <h3 className="font-bold text-slate-900 text-base pt-2">1. Pricing and Availability</h3>
            <p>All product prices are listed in Nigerian Naira (₦) and are subject to change without notice. We reserve the right to modify or discontinue products at any time.</p>
          </div>
        )}

        {tab === 'return' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-slate-900">Return and Refund Policy</h2>
            <p>We want you to be completely satisfied with your purchase. If you are not entirely satisfied, we offer a 7-day hassle-free return policy.</p>
            <h3 className="font-bold text-slate-900 text-base pt-2">1. Return Eligibility</h3>
            <p>Items must be unused, in their original packaging, and accompanied by the receipt or proof of purchase.</p>
          </div>
        )}

        {tab === 'shipping' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-slate-900">Shipping and Delivery Policy</h2>
            <p>We offer nationwide delivery across Nigeria through our reliable logistics partners.</p>
            <h3 className="font-bold text-slate-900 text-base pt-2">1. Free Shipping</h3>
            <p>Free nationwide shipping is automatically applied to all orders over ₦50,000.</p>
          </div>
        )}

        {tab === 'cookie' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-slate-900">Cookie Policy</h2>
            <p>LuxeStore uses cookies to enhance your browsing experience, analyze site traffic, and personalize content.</p>
          </div>
        )}
      </div>
    </div>
  );
};
