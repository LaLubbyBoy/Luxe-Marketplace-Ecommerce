export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  is_suspended?: number;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  brand: string;
  rating: number;
  review_count: number;
  stock: number;
  is_featured: number;
  is_best_seller: number;
  is_new: number;
  colors: string[];
  sizes: string[];
  images: string[];
  created_at: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  compare_at_price?: number;
  stock: number;
  quantity: number;
  color?: string;
  size?: string;
  images: string[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  image_url: string;
}

export interface Order {
  id: number;
  user_id?: number;
  order_number: string;
  total_amount: number;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  shipping_address: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    state: string;
    city: string;
    address: string;
    instructions?: string;
  };
  customer_info: {
    name: string;
    email: string;
    phone: string;
  };
  created_at: string;
  items: OrderItem[];
}

export interface Review {
  id: number;
  product_id: number;
  user_id?: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Coupon {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  expires_at: string;
  usage_limit: number;
  times_used: number;
  is_active: number;
}

export interface NotificationItem {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  is_read: number;
  created_at: string;
}
