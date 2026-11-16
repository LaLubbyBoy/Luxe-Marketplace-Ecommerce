import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderTracking } from './pages/OrderTracking';
import { Wishlist } from './pages/Wishlist';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { Legal } from './pages/Legal';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthPage } from './pages/AuthPage';

export function AppContent() {
  const [activePage, setActivePage] = useState<string>('home');
  const [pageParam, setPageParam] = useState<any>(null);

  const navigateTo = (page: string, param?: any) => {
    setActivePage(page);
    setPageParam(param || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (productId: number) => {
    navigateTo('product-details', { productId });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      <Header 
        activePage={activePage} 
        setActivePage={navigateTo} 
        onSearchSubmit={(q) => navigateTo('catalog', { search: q })} 
      />

      <main className="flex-1">
        {activePage === 'home' && (
          <Home setActivePage={navigateTo} onSelectProduct={handleSelectProduct} />
        )}
        {activePage === 'catalog' && (
          <Catalog 
            initialCategory={pageParam?.category} 
            initialSearch={pageParam?.search} 
            setActivePage={navigateTo} 
            onSelectProduct={handleSelectProduct} 
          />
        )}
        {activePage === 'product-details' && (
          <ProductDetails 
            productId={pageParam?.productId || 1} 
            setActivePage={navigateTo} 
            onSelectProduct={handleSelectProduct} 
          />
        )}
        {activePage === 'cart' && (
          <Cart setActivePage={navigateTo} onSelectProduct={handleSelectProduct} />
        )}
        {activePage === 'checkout' && (
          <Checkout couponId={pageParam?.couponId} setActivePage={navigateTo} />
        )}
        {activePage === 'order-tracking' && (
          <OrderTracking initialOrderNumber={pageParam?.orderNumber} setActivePage={navigateTo} />
        )}
        {activePage === 'wishlist' && (
          <Wishlist setActivePage={navigateTo} onSelectProduct={handleSelectProduct} />
        )}
        {activePage === 'dashboard' && (
          <CustomerDashboard setActivePage={navigateTo} />
        )}
        {activePage === 'contact' && (
          <Contact />
        )}
        {activePage === 'about' && (
          <About />
        )}
        {activePage === 'legal' && (
          <Legal initialTab={pageParam?.tab} />
        )}
        {activePage === 'admin' && (
          <AdminDashboard setActivePage={navigateTo} />
        )}
        {activePage === 'auth' && (
          <AuthPage setActivePage={navigateTo} />
        )}
      </main>

      <Footer setActivePage={navigateTo} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
