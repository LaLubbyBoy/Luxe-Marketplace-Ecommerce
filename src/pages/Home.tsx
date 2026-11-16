import React, { useEffect, useState } from 'react';
import { Product, Category } from '../types';
import { ArrowRight, Star, Heart, ShoppingBag, ShieldCheck, Sparkles, Flame, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HomeProps {
  setActivePage: (page: string, param?: any) => void;
  onSelectProduct: (productId: number) => void;
}

export const Home: React.FC<HomeProps> = ({ setActivePage, onSelectProduct }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const { addToCart, wishlistIds, toggleWishlist } = useCart();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(console.error);
    fetch('/api/products?featured=true').then(r => r.json()).then(setFeaturedProducts).catch(console.error);
    fetch('/api/products?bestSeller=true').then(r => r.json()).then(setBestSellers).catch(console.error);
    fetch('/api/products?newArrival=true').then(r => r.json()).then(setNewArrivals).catch(console.error);
  }, []);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-indigo-600/30 border border-indigo-500/30 px-3.5 py-1.5 rounded-full text-indigo-300 text-xs font-semibold">
              <Sparkles size={14} /> New Season Arrivals 2026
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Elevate Your Lifestyle With <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Curated Luxury</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-xl">
              Discover cutting-edge gadgets, exquisite fashion, premium home essentials, and skincare perfected for the modern connoisseur.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button 
                onClick={() => setActivePage('catalog')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-indigo-600/30 flex items-center gap-3 transition transform hover:-translate-y-0.5"
              >
                Shop Collection <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => setActivePage('catalog', { category: 'electronics' })}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-full border border-slate-700 transition"
              >
                Explore Gadgets
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700 group">
              <img 
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop" 
                alt="Featured Product" 
                className="w-full h-[400px] object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-8">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Best Seller</span>
                <h3 className="text-2xl font-extrabold text-white">Apex Pro Wireless Headphones</h3>
                <p className="text-sm text-slate-300 mt-1">₦145,000 <span className="line-through text-slate-400 text-xs ml-2">₦180,000</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Shop by Category</h2>
            <p className="text-sm text-slate-500 mt-1">Explore our wide selection of premium departments</p>
          </div>
          <button 
            onClick={() => setActivePage('catalog')}
            className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map(cat => (
            <div 
              key={cat.id}
              onClick={() => setActivePage('catalog', { category: cat.slug })}
              className="group cursor-pointer bg-white border border-slate-200 rounded-2xl p-4 text-center hover:shadow-xl hover:border-indigo-500 transition duration-300 flex flex-col items-center"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 shadow-md bg-slate-100">
                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition">{cat.name}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">{cat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Zap size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Featured Collection</h2>
              <p className="text-sm text-slate-500">Hand-picked luxury items with exceptional quality</p>
            </div>
          </div>
          <button 
            onClick={() => setActivePage('catalog')}
            className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1"
          >
            See More <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => {
            const isWishlisted = wishlistIds.includes(product.id);
            const discount = product.compare_at_price ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100) : 0;

            return (
              <div key={product.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition group flex flex-col justify-between">
                <div>
                  <div className="relative h-64 bg-slate-100 overflow-hidden">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-pointer"
                      onClick={() => onSelectProduct(product.id)}
                    />
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        -{discount}%
                      </span>
                    )}
                    <button 
                      onClick={() => toggleWishlist(product.id)}
                      className={`absolute top-3 right-3 p-2.5 rounded-full transition shadow-md ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
                    >
                      <Heart size={18} fill={isWishlisted ? 'white' : 'none'} />
                    </button>
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{product.brand}</span>
                    <h3 
                      onClick={() => onSelectProduct(product.id)}
                      className="font-bold text-slate-900 text-base line-clamp-1 cursor-pointer hover:text-indigo-600 transition"
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star size={14} fill="currentColor" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400 font-normal">({product.review_count})</span>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100">
                  <div>
                    <span className="text-lg font-extrabold text-slate-900">₦{product.price.toLocaleString()}</span>
                    {product.compare_at_price && (
                      <span className="block text-xs text-slate-400 line-through">₦{product.compare_at_price.toLocaleString()}</span>
                    )}
                  </div>
                  <button 
                    onClick={() => addToCart(product.id, 1, product.colors[0], product.sizes[0])}
                    className="bg-slate-900 hover:bg-indigo-600 text-white p-3 rounded-2xl transition shadow-md flex items-center gap-2 text-xs font-bold"
                  >
                    <ShoppingBag size={16} /> Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="bg-amber-400 text-slate-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Limited Time Offer</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Get ₦5,000 Off Your First Major Order</h2>
            <p className="text-slate-300 text-sm sm:text-base">Experience premium shopping with express nationwide delivery and secure Paystack or Flutterwave checkout.</p>
            <div className="pt-2">
              <button 
                onClick={() => setActivePage('catalog')}
                className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 py-3.5 rounded-full shadow-lg transition"
              >
                Claim Discount Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Trending Best Sellers</h2>
              <p className="text-sm text-slate-500">Most popular products chosen by our customers</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map(product => {
            const isWishlisted = wishlistIds.includes(product.id);
            return (
              <div key={product.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition group flex flex-col justify-between">
                <div>
                  <div className="relative h-64 bg-slate-100 overflow-hidden">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-pointer"
                      onClick={() => onSelectProduct(product.id)}
                    />
                    <button 
                      onClick={() => toggleWishlist(product.id)}
                      className={`absolute top-3 right-3 p-2.5 rounded-full transition shadow-md ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
                    >
                      <Heart size={18} fill={isWishlisted ? 'white' : 'none'} />
                    </button>
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{product.brand}</span>
                    <h3 onClick={() => onSelectProduct(product.id)} className="font-bold text-slate-900 text-base line-clamp-1 cursor-pointer hover:text-indigo-600 transition">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star size={14} fill="currentColor" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400 font-normal">({product.review_count})</span>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-lg font-extrabold text-slate-900">₦{product.price.toLocaleString()}</span>
                  <button 
                    onClick={() => addToCart(product.id, 1, product.colors[0], product.sizes[0])}
                    className="bg-slate-900 hover:bg-indigo-600 text-white p-3 rounded-2xl transition shadow-md flex items-center gap-2 text-xs font-bold"
                  >
                    <ShoppingBag size={16} /> Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Loved by Thousands of Shoppers</h2>
            <p className="text-slate-500 text-sm">See what our valued customers have to say about LuxeStore experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
              </div>
              <p className="text-slate-700 text-sm italic">"The delivery was incredibly fast, arriving in less than 24 hours in Lagos. The packaging was luxurious and the product quality surpassed my expectations!"</p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">AA</div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Amina Adebayo</h4>
                  <p className="text-xs text-slate-500">Verified Customer</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
              </div>
              <p className="text-slate-700 text-sm italic">"Paystack integration made checkout seamless. I love the order tracking feature which kept me updated at every stage from warehouse to doorstep."</p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">CO</div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Chinedu Okafor</h4>
                  <p className="text-xs text-slate-500">Verified Customer</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
              </div>
              <p className="text-slate-700 text-sm italic">"Customer support was extremely responsive when I needed help selecting the right size. LuxeStore is truly the best online shopping platform in Nigeria."</p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center">FB</div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Fatima Bello</h4>
                  <p className="text-xs text-slate-500">Verified Customer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Join the LuxeClub</h2>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">Subscribe to our newsletter for exclusive access to private sales, new product drops, and insider styling tips.</p>
          
          {newsletterSubscribed ? (
            <div className="bg-emerald-600/20 border border-emerald-500 text-emerald-300 py-3 rounded-2xl text-sm font-semibold">
              🎉 Thank you for subscribing! Check your email for your welcome discount.
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                required
                className="flex-1 bg-slate-800 border border-slate-700 rounded-full px-5 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-full transition">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
