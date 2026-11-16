import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, NotificationItem } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  cartId: number | null;
  subtotal: number;
  addToCart: (productId: number, quantity?: number, color?: string, size?: string) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  wishlistIds: number[];
  toggleWishlist: (productId: number) => Promise<void>;
  notifications: NotificationItem[];
  markNotificationsRead: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<number | null>(null);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [sessionId] = useState<string>(() => {
    let s = localStorage.getItem('luxe_session');
    if (!s) {
      s = 'sess_' + Math.random().toString(36).substring(2);
      localStorage.setItem('luxe_session', s);
    }
    return s;
  });

  const refreshCart = async () => {
    try {
      const url = user ? `/api/cart?userId=${user.id}` : `/api/cart?sessionId=${sessionId}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items || []);
        setCartId(data.cartId || null);
        setSubtotal(data.subtotal || 0);
      }
    } catch (e) {
      console.error('Failed to load cart', e);
    }
  };

  const refreshWishlist = async () => {
    if (!user) {
      setWishlistIds([]);
      return;
    }
    try {
      const res = await fetch(`/api/wishlist?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setWishlistIds(data.map((p: any) => p.id));
      }
    } catch (e) {
      console.error('Failed to load wishlist', e);
    }
  };

  const refreshNotifications = async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    try {
      const res = await fetch(`/api/notifications?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error('Failed to load notifications', e);
    }
  };

  useEffect(() => {
    refreshCart();
    refreshWishlist();
    refreshNotifications();
  }, [user]);

  const addToCart = async (productId: number, quantity = 1, color = '', size = '') => {
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          sessionId,
          productId,
          quantity,
          color,
          size
        })
      });
      if (res.ok) {
        await refreshCart();
      }
    } catch (e) {
      console.error('Add to cart failed', e);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const res = await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity })
      });
      if (res.ok) {
        await refreshCart();
      }
    } catch (e) {
      console.error('Update quantity failed', e);
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      const res = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      });
      if (res.ok) {
        await refreshCart();
      }
    } catch (e) {
      console.error('Remove from cart failed', e);
    }
  };

  const toggleWishlist = async (productId: number) => {
    if (!user) {
      alert('Please log in to manage your wishlist');
      return;
    }
    try {
      const res = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId })
      });
      if (res.ok) {
        await refreshWishlist();
      }
    } catch (e) {
      console.error('Toggle wishlist failed', e);
    }
  };

  const markNotificationsRead = async () => {
    if (!user) return;
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    } catch (e) {
      console.error('Mark read failed', e);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartId,
      subtotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      refreshCart,
      wishlistIds,
      toggleWishlist,
      notifications,
      markNotificationsRead
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
