import React, { useEffect, useState } from 'react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface WishlistProps {
  setActivePage: (page: string) => void;
  onSelectProduct: (id: number) => void;
}

export const Wishlist: React.FC<WishlistProps> = ({ setActivePage, onSelectProduct }) => {
  const { user } = useAuth();
  const { addToCart, toggleWishlist } = useCart();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  const fetchWishlist = () => {
    if (!user) return;
    fetch(`/api/wishlist?userId=${user.id}`)
      .then(res => res.json())
      .then(setWishlistItems)
      .catch(console.error);
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <Heart size={32} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Sign in to view your wishlist</h2>
        <p className="text-slate-500 text-sm">Save your favorite products and access them across all your devices.</p>
        <button onClick={() => setActivePage('auth')} className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-full text-sm">
          Sign In
        </button>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <Heart size={32} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Your wishlist is empty</h2>
        <p className="text-slate-500 text-sm">Browse our products and click the heart icon to save your favorites.</p>
        <button onClick={() => setActivePage('catalog')} className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-full text-sm">
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Saved Wishlist</h1>
        <p className="text-slate-500 text-sm">{wishlistItems.length} items saved in your favorites</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map(product => (
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
                  onClick={async () => {
                    await toggleWishlist(product.id);
                    fetchWishlist();
                  }}
                  className="absolute top-3 right-3 p-2.5 rounded-full bg-rose-500 text-white transition shadow-md"
                  title="Remove from wishlist"
                >
                  <Trash2 size={18} />
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
              </div>
            </div>

            <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-lg font-extrabold text-slate-900">₦{product.price.toLocaleString()}</span>
              <button 
                onClick={() => addToCart(product.id, 1, product.colors[0], product.sizes[0])}
                className="bg-slate-900 hover:bg-indigo-600 text-white p-3 rounded-2xl transition shadow-md flex items-center gap-2 text-xs font-bold"
              >
                <ShoppingBag size={16} /> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
