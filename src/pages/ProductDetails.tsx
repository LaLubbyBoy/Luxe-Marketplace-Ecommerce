import React, { useState, useEffect } from 'react';
import { Product, Review } from '../types';
import { Star, Heart, ShoppingBag, ShieldCheck, Truck, RotateCcw, Check, MessageSquare, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ProductDetailsProps {
  productId: number;
  setActivePage: (page: string, param?: any) => void;
  onSelectProduct: (id: number) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ productId, setActivePage, onSelectProduct }) => {
  const [productData, setProductData] = useState<{ product: Product; reviews: Review[]; related: Product[] } | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const { user } = useAuth();
  const { addToCart, wishlistIds, toggleWishlist } = useCart();

  const fetchProductDetails = () => {
    fetch(`/api/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        setProductData(data);
        if (data.product?.images?.[0]) setSelectedImage(data.product.images[0]);
        if (data.product?.colors?.[0]) setSelectedColor(data.product.colors[0]);
        if (data.product?.sizes?.[0]) setSelectedSize(data.product.sizes[0]);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment) return;
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          userName: user?.name || 'Valued Customer',
          rating: newRating,
          comment: newComment
        })
      });
      if (res.ok) {
        setNewComment('');
        setReviewSubmitted(true);
        fetchProductDetails();
        setTimeout(() => setReviewSubmitted(false), 4000);
      }
    } catch (e) {
      console.error('Review submission failed', e);
    }
  };

  if (!productData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-slate-500">Loading product details...</p>
      </div>
    );
  }

  const { product, reviews, related } = productData;
  const isWishlisted = wishlistIds.includes(product.id);
  const discount = product.compare_at_price ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
        <button onClick={() => setActivePage('home')} className="hover:text-indigo-600">Home</button>
        <span>/</span>
        <button onClick={() => setActivePage('catalog')} className="hover:text-indigo-600">Catalog</button>
        <span>/</span>
        <span className="text-slate-900 truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden h-[450px] sm:h-[550px] shadow-sm relative">
            <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                -{discount}% OFF
              </span>
            )}
            <button 
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full transition shadow-md ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
            >
              <Heart size={20} fill={isWishlisted ? 'white' : 'none'} />
            </button>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            {product.images.map((img, i) => (
              <button 
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition flex-shrink-0 ${selectedImage === img ? 'border-indigo-600 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info & Actions */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{product.brand}</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1 tracking-tight">{product.name}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
              <Star size={16} fill="currentColor" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.review_count} customer reviews)</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${product.stock > 10 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          <div className="flex items-baseline gap-4 pt-2 border-t border-slate-100">
            <span className="text-3xl font-extrabold text-slate-900">₦{product.price.toLocaleString()}</span>
            {product.compare_at_price && (
              <span className="text-lg text-slate-400 line-through">₦{product.compare_at_price.toLocaleString()}</span>
            )}
          </div>

          <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && product.colors[0] !== 'Standard' && (
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Select Colour: <span className="text-slate-900">{selectedColor}</span></label>
              <div className="flex items-center gap-3">
                {product.colors.map(col => (
                  <button 
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${selectedColor === col ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'Standard' && (
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Select Size: <span className="text-slate-900">{selectedSize}</span></label>
              <div className="flex items-center gap-3">
                {product.sizes.map(sz => (
                  <button 
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-12 h-12 rounded-xl text-xs font-bold border transition flex items-center justify-center ${selectedSize === sz ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-slate-600 hover:bg-slate-100 font-bold transition"
                >
                  -
                </button>
                <span className="px-4 font-bold text-slate-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-slate-600 hover:bg-slate-100 font-bold transition"
                >
                  +
                </button>
              </div>

              <button 
                onClick={() => addToCart(product.id, quantity, selectedColor, selectedSize)}
                className="flex-1 bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 px-6 rounded-2xl transition shadow-lg flex items-center justify-center gap-3 text-sm"
              >
                <ShoppingBag size={18} /> Add to Cart
              </button>
            </div>

            <button 
              onClick={() => {
                addToCart(product.id, quantity, selectedColor, selectedSize);
                setActivePage('checkout');
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition shadow-md text-sm"
            >
              Buy Now with Paystack / Flutterwave
            </button>
          </div>

          {/* Assurance info */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100 text-center">
            <div className="space-y-1">
              <Truck size={20} className="mx-auto text-indigo-600" />
              <span className="text-xs font-bold text-slate-800 block">Fast Delivery</span>
              <span className="text-[10px] text-slate-400">1-3 business days</span>
            </div>
            <div className="space-y-1">
              <ShieldCheck size={20} className="mx-auto text-emerald-600" />
              <span className="text-xs font-bold text-slate-800 block">Secure Payment</span>
              <span className="text-[10px] text-slate-400">Encrypted checkout</span>
            </div>
            <div className="space-y-1">
              <RotateCcw size={20} className="mx-auto text-amber-600" />
              <span className="text-xs font-bold text-slate-800 block">Easy Returns</span>
              <span className="text-[10px] text-slate-400">7 day guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Customer Reviews & Ratings</h3>
            <p className="text-slate-500 text-sm mt-0.5">Based on {reviews.length} reviews from verified buyers</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-3xl font-extrabold text-slate-900">{product.rating}</div>
            <div className="text-amber-500">
              <Star size={20} fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Review Submission Form */}
        <form onSubmit={handleReviewSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
          <h4 className="font-bold text-slate-900 text-sm">Write a Review</h4>
          {reviewSubmitted && (
            <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs font-semibold">
              ✅ Thank you! Your review has been published successfully.
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Rating:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className={`text-xl ${newRating >= star ? 'text-amber-500' : 'text-slate-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <textarea 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about product quality, performance, and durability..."
            rows={3}
            required
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <button type="submit" className="bg-slate-900 hover:bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-sm flex items-center gap-2">
            <Send size={14} /> Submit Review
          </button>
        </form>

        {/* Reviews List */}
        <div className="space-y-6 divide-y divide-slate-100">
          {reviews.length === 0 ? (
            <p className="text-slate-400 text-center py-6 text-sm">No reviews yet. Be the first to review this product!</p>
          ) : (
            reviews.map(rev => (
              <div key={rev.id} className="pt-6 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                      {rev.user_name.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-900 text-sm">{rev.user_name}</span>
                  </div>
                  <span className="text-xs text-slate-400">{new Date(rev.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">You Might Also Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(item => (
              <div 
                key={item.id} 
                onClick={() => onSelectProduct(item.id)}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 bg-slate-100 overflow-hidden">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <div className="p-4 space-y-1">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase">{item.brand}</span>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{item.name}</h4>
                  </div>
                </div>
                <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">₦{item.price.toLocaleString()}</span>
                  <span className="text-xs text-indigo-600 font-bold">View Product</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
