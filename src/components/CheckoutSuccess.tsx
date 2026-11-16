import React from 'react';
import { CheckCircle2, Package, Printer, ArrowRight, Home } from 'lucide-react';

interface CheckoutSuccessProps {
  orderNumber?: string;
  reference?: string;
  totalAmount?: number;
  customerName?: string;
  paymentMethod?: string;
  setActivePage: (page: string, param?: any) => void;
}

export const CheckoutSuccess: React.FC<CheckoutSuccessProps> = ({
  orderNumber = 'LUXE-' + Math.floor(100000 + Math.random() * 900000),
  reference = 'TRX-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
  totalAmount = 145000,
  customerName = 'Valued Customer',
  paymentMethod = 'card',
  setActivePage
}) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 space-y-8 animate-in fade-in duration-300">
      {/* Confirmation Header */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg animate-bounce">
          <CheckCircle2 size={42} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Order Placed Successfully!</h1>
        <p className="text-slate-500 text-sm">Thank you for shopping with LuxeStore. Your order has been confirmed and is now being processed.</p>
      </div>

      {/* Summary Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Order Reference</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{orderNumber}</h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Date</span>
            <span className="font-bold text-slate-800 text-xs">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="space-y-3 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Customer Name:</span>
            <span className="font-bold text-slate-900">{customerName}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Method:</span>
            <span className="font-bold text-indigo-600 uppercase">{paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span>Transaction Reference:</span>
            <span className="font-bold text-slate-900">{reference}</span>
          </div>
          <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-extrabold text-slate-900">
            <span>Total Purchase Amount:</span>
            <span className="text-indigo-600">₦{totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
          <button 
            onClick={() => setActivePage('order-tracking', { orderNumber })}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl transition shadow-md text-xs flex items-center justify-center gap-2"
          >
            <Package size={16} /> Track Order Status <ArrowRight size={14} />
          </button>
          <button 
            onClick={() => window.print()}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3.5 rounded-2xl transition text-xs flex items-center justify-center gap-2"
          >
            <Printer size={16} /> Print Receipt
          </button>
          <button 
            onClick={() => setActivePage('home')}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-2xl transition text-xs flex items-center justify-center gap-2"
          >
            <Home size={16} /> Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};
