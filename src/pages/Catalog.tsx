import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { Star, Heart, ShoppingBag, Filter, SlidersHorizontal, Search, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CatalogProps {
  initialCategory?: string;
  initialSearch?: string;
  setActivePage: (page: string, param?: any) => void;
  onSelectProduct: (productId: number) => void;
}

export const Catalog: React.FC<CatalogProps> = ({ initialCategory, initialSearch, setActivePage, onSelectProduct }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || '');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('default');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || '');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const { addToCart, wishlistIds, toggleWishlist } = useCart();

  const fetchProducts = () => {
    let url = '/api/products?';
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedBrand) params.append('brand', selectedBrand);
    if (sortOption !== 'default') params.append('sort', sortOption);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (searchQuery) params.append('search', searchQuery);

    fetch(url + params.toString())
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error);
  };

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedBrand, sortOption, minPrice, maxPrice, searchQuery]);

  const brands = Array.from(new Set(products.map(p => p.brand)));

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSortOption('default');
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Breadcrumb */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
          <button onClick={() => setActivePage('home')} className="hover:text-indigo-600">Home</button>
          <span>/</span>
          <span className="text-slate-900">Catalog</span>
          {selectedCategory && (
            <>
              <span>/</span>
              <span className="text-indigo-600 capitalize">{selectedCategory}</span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {selectedCategory ? `${selectedCategory.replace('-', ' ')} Collection` : 'All Products'}
        </h1>
        <p className="text-slate-500 text-sm">Showing {products.length} meticulously curated items</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block space-y-8 bg-white border border-slate-200 rounded-3xl p-6 h-fit shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Filter size={18} /> Filters</h3>
            <button onClick={resetFilters} className="text-xs text-indigo-600 font-bold hover:underline">Reset All</button>
          </div>

          {/* Search keyword */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Search</h4>
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800"
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Categories</h4>
            <div className="space-y-1.5 text-sm">
              <button 
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3 py-2 rounded-xl font-medium transition ${!selectedCategory ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                All Departments
              </button>
              {categories.map(c => (
                <button 
                  key={c.id}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl font-medium transition ${selectedCategory === c.slug ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Price Range (₦)</h4>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                placeholder="Min" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2 text-xs text-slate-800"
              />
              <span className="text-slate-400">-</span>
              <input 
                type="number" 
                placeholder="Max" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2 text-xs text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Main Content & Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sort & Mobile Filter Toggle Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <button 
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-800"
            >
              <SlidersHorizontal size={16} /> Filters
            </button>

            <div className="flex items-center gap-3 ml-auto">
              <span className="text-xs text-slate-500 font-medium">Sort By:</span>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="default">Featured / Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No products found</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">Try adjusting your filter criteria or search query to find what you are looking for.</p>
              <button onClick={resetFilters} className="bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-md">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => {
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
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xs h-full p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-lg">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-2 text-slate-500"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Categories</h4>
              <div className="space-y-1">
                <button 
                  onClick={() => { setSelectedCategory(''); setMobileFilterOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  All Departments
                </button>
                {categories.map(c => (
                  <button 
                    key={c.id}
                    onClick={() => { setSelectedCategory(c.slug); setMobileFilterOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Price Range (₦)</h4>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
                <span className="text-slate-400">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>
            </div>

            <button 
              onClick={() => setMobileFilterOpen(false)}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl text-sm shadow-md mt-6"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
