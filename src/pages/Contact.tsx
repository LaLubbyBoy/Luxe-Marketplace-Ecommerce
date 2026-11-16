import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const [sent, setSent] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  const faqs = [
    { q: 'How long does nationwide delivery take?', a: 'Standard nationwide delivery takes 1-3 business days within major cities like Lagos, Abuja, and Port Harcourt, and 3-5 days for other regions.' },
    { q: 'What payment methods do you accept?', a: 'We accept debit/credit cards, bank transfers, and USSD via our secure Paystack and Flutterwave payment gateways.' },
    { q: 'What is your return and refund policy?', a: 'We offer a 7-day hassle-free return policy for items in their original packaging and unused condition.' },
    { q: 'How can I track my order?', a: 'You can track your order in real-time by entering your order ID on our Order Tracking page or viewing it in your customer dashboard.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Get in Touch</h1>
        <p className="text-slate-500 text-sm">Have questions about our products or your order? Our support team is here 24/7.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <Mail size={22} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Email Support</h4>
              <p className="text-xs text-slate-500">support@luxestore.com</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Phone size={22} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Customer Hotline</h4>
              <p className="text-xs text-slate-500">+234 800 LUXE STORE</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <MapPin size={22} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Corporate Headquarters</h4>
              <p className="text-xs text-slate-500">12 Admiralty Way, Lekki Phase 1, Lagos</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-4">Send Us a Message</h3>
            {sent && (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl text-xs font-semibold">
                ✅ Thank you! Your message has been sent. Our support team will reply shortly.
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Your Name</label>
                <input type="text" required placeholder="Amina Adebayo" className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Email Address</label>
                <input type="email" required placeholder="amina@example.com" className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Subject</label>
              <input type="text" required placeholder="Order inquiry / Product question" className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Message</label>
              <textarea rows={4} required placeholder="How can we assist you today?" className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800" />
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-2xl transition shadow-md text-sm flex items-center gap-2">
              <Send size={16} /> Send Message
            </button>
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-6 max-w-4xl mx-auto pt-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-slate-500 text-sm">Quick answers to common questions about shopping with LuxeStore</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-6 text-left font-bold text-slate-900 text-base flex items-center justify-between hover:bg-slate-50 transition"
              >
                <span>{faq.q}</span>
                <span className="text-indigo-600 text-xl font-bold">{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6 text-slate-600 text-sm border-t border-slate-100 pt-4 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
