import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, 'ecommerce.db');
const db = new Database(dbPath);

// Initialize Database Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    phone TEXT,
    is_suspended INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    compare_at_price REAL,
    category_id INTEGER,
    brand TEXT,
    rating REAL DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 50,
    is_featured INTEGER DEFAULT 0,
    is_best_seller INTEGER DEFAULT 0,
    is_new INTEGER DEFAULT 0,
    colors TEXT, -- JSON string or comma-separated
    sizes TEXT,  -- JSON string or comma-separated
    images TEXT, -- JSON array of URLs
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS carts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    session_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cart_id INTEGER,
    product_id INTEGER,
    quantity INTEGER DEFAULT 1,
    color TEXT,
    size TEXT,
    FOREIGN KEY (cart_id) REFERENCES carts(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS wishlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    order_number TEXT UNIQUE NOT NULL,
    total_amount REAL NOT NULL,
    subtotal REAL NOT NULL,
    shipping_fee REAL NOT NULL,
    discount_amount REAL DEFAULT 0,
    status TEXT DEFAULT 'Order Placed',
    payment_status TEXT DEFAULT 'Pending',
    payment_method TEXT,
    shipping_address TEXT, -- JSON
    customer_info TEXT, -- JSON
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    product_name TEXT,
    price REAL,
    quantity INTEGER,
    color TEXT,
    size TEXT,
    image_url TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    reference TEXT UNIQUE NOT NULL,
    gateway TEXT,
    amount REAL,
    currency TEXT DEFAULT 'NGN',
    status TEXT DEFAULT 'pending',
    gateway_response TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
  );

  CREATE TABLE IF NOT EXISTS coupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL, -- 'percentage' or 'fixed'
    discount_value REAL NOT NULL,
    min_order_amount REAL DEFAULT 0,
    expires_at TEXT,
    usage_limit INTEGER DEFAULT 100,
    times_used INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS coupon_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coupon_id INTEGER,
    user_id INTEGER,
    order_id INTEGER,
    used_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    user_id INTEGER,
    user_name TEXT,
    rating INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    message TEXT,
    type TEXT, -- 'order', 'stock', 'system'
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS refunds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    amount REAL,
    reason TEXT,
    status TEXT DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER,
    action TEXT,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS payouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    amount REAL NOT NULL,
    bank_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    account_name TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    reference TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Seed initial data if empty
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
  console.log('Seeding database with initial users, categories, products, and coupons...');
  
  // Seed Users (Admin & Customer)
  const adminPass = crypto.createHash('sha256').update('admin123').digest('hex');
  const custPass = crypto.createHash('sha256').update('password123').digest('hex');
  
  db.prepare(`INSERT INTO users (name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?)`).run('Admin User', 'admin@luxestore.com', adminPass, 'admin', '+2348012345678');
  db.prepare(`INSERT INTO users (name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?)`).run('Amina Adebayo', 'customer@luxestore.com', custPass, 'customer', '+2348087654321');

  // Seed Categories
  const categories = [
    { name: 'Electronics & Gadgets', slug: 'electronics', desc: 'Smartphones, Laptops, Audio & Accessories', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop' },
    { name: 'Fashion & Apparel', slug: 'fashion', desc: 'Trendy clothing, luxury wear & outerwear', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop' },
    { name: 'Home & Kitchen', slug: 'home-kitchen', desc: 'Modern appliances, decor & cookware', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop' },
    { name: 'Beauty & Wellness', slug: 'beauty', desc: 'Skincare, cosmetics, and self-care essentials', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop' },
    { name: 'Footwear & Sneakers', slug: 'footwear', desc: 'Premium sneakers, boots, and casual shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop' },
    { name: 'Sports & Fitness', slug: 'sports', desc: 'Workout equipment, yoga gear & activewear', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop' }
  ];

  const catStmt = db.prepare('INSERT INTO categories (name, slug, description, image_url) VALUES (?, ?, ?, ?)');
  for (const c of categories) {
    catStmt.run(c.name, c.slug, c.desc, c.image);
  }

  // Seed Products
  const products = [
    {
      name: 'Apex Pro Wireless Noise-Cancelling Headphones',
      slug: 'apex-pro-wireless-headphones',
      desc: 'Immerse yourself in pure spatial audio with industry-leading Active Noise Cancellation, 40-hour battery life, and ultra-plush memory foam ear cushions.',
      price: 145000,
      compare_at_price: 180000,
      category_id: 1,
      brand: 'Apex Audio',
      rating: 4.8,
      review_count: 124,
      stock: 42,
      is_featured: 1,
      is_best_seller: 1,
      is_new: 0,
      colors: JSON.stringify(['Matte Black', 'Silver Frost', 'Midnight Blue']),
      sizes: JSON.stringify(['Standard']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=800&auto=format&fit=crop'
      ])
    },
    {
      name: 'Luxe Chrono Smartwatch Series 9',
      slug: 'luxe-chrono-smartwatch-9',
      desc: 'Advanced health monitoring, ECG, bright AMOLED display, GPS tracking, and aerospace-grade titanium casing. Water resistant up to 50 meters.',
      price: 210000,
      compare_at_price: 250000,
      category_id: 1,
      brand: 'LuxeTech',
      rating: 4.9,
      review_count: 98,
      stock: 19,
      is_featured: 1,
      is_best_seller: 1,
      is_new: 1,
      colors: JSON.stringify(['Titanium Black', 'Rose Gold', 'Space Gray']),
      sizes: JSON.stringify(['41mm', '45mm']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop'
      ])
    },
    {
      name: 'Velocity Ultra-Light Carbon Running Shoes',
      slug: 'velocity-carbon-running-shoes',
      desc: 'Engineered with responsive carbon-fiber plate technology and nitrogen-infused foam for maximum energy return and effortless speed on the track or road.',
      price: 95000,
      compare_at_price: 120000,
      category_id: 5,
      brand: 'Velocity',
      rating: 4.7,
      review_count: 215,
      stock: 35,
      is_featured: 1,
      is_best_seller: 1,
      is_new: 1,
      colors: JSON.stringify(['Solar Red', 'Neon Lime', 'Ghost White']),
      sizes: JSON.stringify(['US 8', 'US 9', 'US 10', 'US 11', 'US 12']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1608231387042-66d17b3070a1?q=80&w=800&auto=format&fit=crop'
      ])
    },
    {
      name: 'Minimalist Genuine Leather Executive Backpack',
      slug: 'minimalist-leather-executive-backpack',
      desc: 'Handcrafted from full-grain Italian leather with dedicated padded compartment for 16-inch laptops, RFID-blocking pocket, and water-resistant lining.',
      price: 78000,
      compare_at_price: 95000,
      category_id: 2,
      brand: 'Vanguard',
      rating: 4.6,
      review_count: 67,
      stock: 25,
      is_featured: 1,
      is_best_seller: 0,
      is_new: 1,
      colors: JSON.stringify(['Espresso Brown', 'Cognac Tan', 'Onyx Black']),
      sizes: JSON.stringify(['Standard']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop'
      ])
    },
    {
      name: 'Artisan Ceramic Pour-Over Coffee Maker Set',
      slug: 'artisan-ceramic-pour-over-coffee-maker',
      desc: 'Brew cafe-quality pour-over coffee at home. Includes matte ceramic dripper, hand-blown borosilicate glass carafe, wooden collar, and 100 filters.',
      price: 42000,
      compare_at_price: 55000,
      category_id: 3,
      brand: 'BrewMaster',
      rating: 4.9,
      review_count: 156,
      stock: 60,
      is_featured: 0,
      is_best_seller: 1,
      is_new: 0,
      colors: JSON.stringify(['Matte White', 'Charcoal Grey']),
      sizes: JSON.stringify(['600ml', '800ml']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop'
      ])
    },
    {
      name: 'Botanical Radiance Vitamin C Glow Serum',
      slug: 'botanical-radiance-vitamin-c-serum',
      desc: 'Powerful antioxidant formula infused with 20% pure L-Ascorbic acid, hyaluronic acid, and organic botanicals to brighten dark spots and firm skin.',
      price: 28500,
      compare_at_price: 35000,
      category_id: 4,
      brand: 'GlowBotanicals',
      rating: 4.8,
      review_count: 310,
      stock: 80,
      is_featured: 1,
      is_best_seller: 1,
      is_new: 0,
      colors: JSON.stringify(['Standard']),
      sizes: JSON.stringify(['30ml', '50ml']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1608248597359-9d77f07755ed?q=80&w=800&auto=format&fit=crop'
      ])
    },
    {
      name: 'ProFlex Adjustable Dumbbell Set (24kg)',
      slug: 'proflex-adjustable-dumbbell-set',
      desc: 'Space-saving adjustable dumbbells that replace 15 sets of weights. Quick selector dial lets you adjust from 2kg to 24kg effortlessly.',
      price: 185000,
      compare_at_price: 220000,
      category_id: 6,
      brand: 'ProFlex Fit',
      rating: 4.9,
      review_count: 84,
      stock: 12,
      is_featured: 1,
      is_best_seller: 0,
      is_new: 1,
      colors: JSON.stringify(['Slate Black']),
      sizes: JSON.stringify(['24kg Pair']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop'
      ])
    },
    {
      name: 'Silk Touch Premium Oversized Hoodie',
      slug: 'silk-touch-oversized-hoodie',
      desc: 'Crafted from heavyweight organic cotton fleece with a brushed interior for ultimate comfort, drop shoulders, and relaxed streetwear fit.',
      price: 45000,
      compare_at_price: 60000,
      category_id: 2,
      brand: 'UrbanAura',
      rating: 4.7,
      review_count: 142,
      stock: 50,
      is_featured: 0,
      is_best_seller: 1,
      is_new: 0,
      colors: JSON.stringify(['Sage Green', 'Sandstone', 'Jet Black']),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop'
      ])
    }
  ];

  const prodStmt = db.prepare(`
    INSERT INTO products (name, slug, description, price, compare_at_price, category_id, brand, rating, review_count, stock, is_featured, is_best_seller, is_new, colors, sizes, images)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of products) {
    prodStmt.run(p.name, p.slug, p.desc, p.price, p.compare_at_price, p.category_id, p.brand, p.rating, p.review_count, p.stock, p.is_featured, p.is_best_seller, p.is_new, p.colors, p.sizes, p.images);
  }

  // Seed Coupons
  db.prepare(`INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, expires_at, usage_limit, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)`).run('LUXE10', 'percentage', 10, 20000, '2027-12-31', 500, 1);
  db.prepare(`INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, expires_at, usage_limit, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)`).run('WELCOME5000', 'fixed', 5000, 50000, '2027-12-31', 200, 1);

  // Seed sample review
  db.prepare(`INSERT INTO reviews (product_id, user_id, user_name, rating, comment) VALUES (?, ?, ?, ?, ?)`).run(1, 2, 'Amina Adebayo', 5, 'Absolute game changer! The noise cancellation is unreal and battery lasts forever.');

  console.log('Database seeding complete.');
}

const app = express();
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- API ROUTES ---

// AUTH
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const password_hash = crypto.createHash('sha256').update(password).digest('hex');
    const result = db.prepare('INSERT INTO users (name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)').run(name, email, password_hash, phone || '', 'customer');
    
    const user = db.prepare('SELECT id, name, email, role, phone FROM users WHERE id = ?').get(result.lastInsertRowid);
    
    // Create welcome notification
    db.prepare('INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)').run(
      result.lastInsertRowid,
      'Welcome to LuxeStore!',
      'Thank you for joining our exclusive shopping community. Enjoy 10% off with coupon code LUXE10.',
      'system'
    );

    res.json({ user, token: 'session-' + result.lastInsertRowid });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if (user.is_suspended) {
      return res.status(403).json({ error: 'This account has been suspended. Please contact support.' });
    }
    const password_hash = crypto.createHash('sha256').update(password).digest('hex');
    if (user.password_hash !== password_hash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { password_hash: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token: 'session-' + user.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('session-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userId = authHeader.replace('session-', '');
  const user = db.prepare('SELECT id, name, email, role, phone, is_suspended, created_at FROM users WHERE id = ?').get(userId) as any;
  if (!user || user.is_suspended) {
    return res.status(401).json({ error: 'User not found or suspended' });
  }
  res.json({ user });
});

// CATEGORIES
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories').all();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PRODUCTS
app.get('/api/products', (req, res) => {
  try {
    const { category, search, brand, sort, minPrice, maxPrice, featured, bestSeller, newArrival } = req.query;
    let query = 'SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
    const params: any[] = [];

    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }
    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }
    if (brand) {
      query += ' AND p.brand = ?';
      params.push(brand);
    }
    if (minPrice) {
      query += ' AND p.price >= ?';
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(Number(maxPrice));
    }
    if (featured === 'true') {
      query += ' AND p.is_featured = 1';
    }
    if (bestSeller === 'true') {
      query += ' AND p.is_best_seller = 1';
    }
    if (newArrival === 'true') {
      query += ' AND p.is_new = 1';
    }

    if (sort === 'price_asc') {
      query += ' ORDER BY p.price ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY p.price DESC';
    } else if (sort === 'newest') {
      query += ' ORDER BY p.created_at DESC';
    } else if (sort === 'popular') {
      query += ' ORDER BY p.review_count DESC';
    } else if (sort === 'rating') {
      query += ' ORDER BY p.rating DESC';
    } else {
      query += ' ORDER BY p.id DESC';
    }

    const products = db.prepare(query).all(...params).map((p: any) => ({
      ...p,
      colors: JSON.parse(p.colors || '[]'),
      sizes: JSON.parse(p.sizes || '[]'),
      images: JSON.parse(p.images || '[]')
    }));

    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?').get(req.params.id) as any;
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    product.colors = JSON.parse(product.colors || '[]');
    product.sizes = JSON.parse(product.sizes || '[]');
    product.images = JSON.parse(product.images || '[]');

    const reviews = db.prepare('SELECT * FROM reviews WHERE product_id = ? ORDER BY id DESC').all(req.params.id);
    const related = db.prepare('SELECT * FROM products WHERE category_id = ? AND id != ? LIMIT 4').all(product.category_id, product.id).map((p: any) => ({
      ...p,
      colors: JSON.parse(p.colors || '[]'),
      sizes: JSON.parse(p.sizes || '[]'),
      images: JSON.parse(p.images || '[]')
    }));

    res.json({ product, reviews, related });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CART (stored in db or session)
app.get('/api/cart', (req, res) => {
  try {
    const { userId, sessionId } = req.query;
    let cart = userId 
      ? db.prepare('SELECT * FROM carts WHERE user_id = ?').get(userId) as any
      : db.prepare('SELECT * FROM carts WHERE session_id = ?').get(sessionId) as any;

    if (!cart) {
      return res.json({ items: [], subtotal: 0 });
    }

    const items = db.prepare(`
      SELECT ci.id, ci.quantity, ci.color, ci.size, p.id as product_id, p.name, p.price, p.compare_at_price, p.stock, p.images
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ?
    `).all(cart.id).map((item: any) => ({
      ...item,
      images: JSON.parse(item.images || '[]')
    }));

    const subtotal = items.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0);
    res.json({ cartId: cart.id, items, subtotal });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/cart/add', (req, res) => {
  try {
    const { userId, sessionId, productId, quantity = 1, color, size } = req.body;
    let cart = userId 
      ? db.prepare('SELECT * FROM carts WHERE user_id = ?').get(userId) as any
      : db.prepare('SELECT * FROM carts WHERE session_id = ?').get(sessionId) as any;

    if (!cart) {
      const resCart = db.prepare('INSERT INTO carts (user_id, session_id) VALUES (?, ?)').run(userId || null, sessionId || 'guest_' + Math.random());
      cart = { id: resCart.lastInsertRowid };
    }

    // Check if item already exists with same color/size
    const existing = db.prepare('SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ? AND color = ? AND size = ?').get(cart.id, productId, color || '', size || '') as any;
    if (existing) {
      db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?').run(quantity, existing.id);
    } else {
      db.prepare('INSERT INTO cart_items (cart_id, product_id, quantity, color, size) VALUES (?, ?, ?, ?, ?)').run(cart.id, productId, quantity, color || '', size || '');
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/cart/update', (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    if (quantity <= 0) {
      db.prepare('DELETE FROM cart_items WHERE id = ?').run(itemId);
    } else {
      db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, itemId);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/cart/remove', (req, res) => {
  try {
    const { itemId } = req.body;
    db.prepare('DELETE FROM cart_items WHERE id = ?').run(itemId);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// WISHLIST
app.get('/api/wishlist', (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.json([]);
    const items = db.prepare(`
      w.id as wishlist_id, p.*
      FROM wishlists w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
    `).all(userId).map((p: any) => ({
      ...p,
      colors: JSON.parse(p.colors || '[]'),
      sizes: JSON.parse(p.sizes || '[]'),
      images: JSON.parse(p.images || '[]')
    }));
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/wishlist/toggle', (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) return res.status(400).json({ error: 'Missing userId or productId' });
    const existing = db.prepare('SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?').get(userId, productId) as any;
    if (existing) {
      db.prepare('DELETE FROM wishlists WHERE id = ?').run(existing.id);
      res.json({ favorited: false });
    } else {
      db.prepare('INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)').run(userId, productId);
      res.json({ favorited: true });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// COUPONS
app.post('/api/coupons/validate', (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const coupon = db.prepare('SELECT * FROM coupons WHERE code = ? AND is_active = 1').get(code) as any;
    if (!coupon) {
      return res.status(404).json({ error: 'Invalid or expired coupon code' });
    }
    if (subtotal < coupon.min_order_amount) {
      return res.status(400).json({ error: `Minimum order amount for this coupon is ₦${coupon.min_order_amount.toLocaleString()}` });
    }
    if (coupon.times_used >= coupon.usage_limit) {
      return res.status(400).json({ error: 'Coupon usage limit reached' });
    }

    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (subtotal * coupon.discount_value) / 100;
    } else {
      discountAmount = coupon.discount_value;
    }

    res.json({ success: true, discountAmount, couponId: coupon.id, code: coupon.code });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CHECKOUT & PAYMENTS (Paystack / Flutterwave Simulation + Server Verification)
app.post('/api/checkout/initialize', (req, res) => {
  try {
    const { userId, cartId, shippingAddress, customerInfo, paymentMethod, couponId } = req.body;
    
    // Calculate totals
    const items = db.prepare(`
      ci.quantity, p.id as product_id, p.name, p.price, p.stock, p.images
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ?
    `).all(cartId) as any[];

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    let discountAmount = 0;
    if (couponId) {
      const coupon = db.prepare('SELECT * FROM coupons WHERE id = ?').get(couponId) as any;
      if (coupon) {
        discountAmount = coupon.discount_type === 'percentage' ? (subtotal * coupon.discount_value) / 100 : coupon.discount_value;
      }
    }

    const shippingFee = subtotal > 50000 ? 0 : 3500;
    const totalAmount = subtotal - discountAmount + shippingFee;
    const orderNumber = 'LUXE-' + Math.floor(100000 + Math.random() * 900000);
    const reference = 'TRX-' + crypto.randomBytes(6).toString('hex').toUpperCase();

    // Create Order
    const orderResult = db.prepare(`
      INSERT INTO orders (user_id, order_number, total_amount, subtotal, shipping_fee, discount_amount, status, payment_status, payment_method, shipping_address, customer_info)
      VALUES (?, ?, ?, ?, ?, ?, 'Order Placed', 'Pending', ?, ?, ?)
    `).run(userId || null, orderNumber, totalAmount, subtotal, shippingFee, discountAmount, paymentMethod || 'paystack', JSON.stringify(shippingAddress), JSON.stringify(customerInfo));

    const orderId = orderResult.lastInsertRowid;

    // Create Order Items & Reduce Stock
    const itemStmt = db.prepare('INSERT INTO order_items (order_id, product_id, product_name, price, quantity, color, size, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    for (const item of items) {
      const imgs = JSON.parse(item.images || '[]');
      itemStmt.run(orderId, item.product_id, item.name, item.price, item.quantity, item.color || '', item.size || '', imgs[0] || '');
      // Reduce stock
      db.prepare('UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?').run(item.quantity, item.product_id);
    }

    // Clear Cart
    db.prepare('DELETE FROM cart_items WHERE cart_id = ?').run(cartId);

    // Create Payment reference
    db.prepare('INSERT INTO payments (order_id, reference, gateway, amount, currency, status) VALUES (?, ?, ?, ?, ?, ?)').run(
      orderId, reference, paymentMethod || 'paystack', totalAmount, 'NGN', 'pending'
    );

    res.json({
      success: true,
      orderId,
      orderNumber,
      reference,
      totalAmount,
      authorizationUrl: `https://checkout.paystack.com/pay/${reference}` // Simulation checkout link
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/checkout/verify', (req, res) => {
  try {
    const { reference } = req.body;
    const payment = db.prepare('SELECT * FROM payments WHERE reference = ?').get(reference) as any;
    if (!payment) {
      return res.status(404).json({ error: 'Payment reference not found' });
    }

    // Simulate successful server-side verification with Paystack / Flutterwave
    db.prepare("UPDATE payments SET status = 'success', gateway_response = ? WHERE id = ?").run('Approved by gateway', payment.id);
    db.prepare("UPDATE orders SET payment_status = 'Paid', status = 'Payment Confirmed' WHERE id = ?").run(payment.order_id);

    // Get order details for notification
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(payment.order_id) as any;
    if (order && order.user_id) {
      db.prepare('INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)').run(
        order.user_id,
        `Order Confirmed (${order.order_number})`,
        `Your payment of ₦${order.total_amount.toLocaleString()} was successful. We are now processing your order.`,
        'order'
      );
    }

    res.json({ success: true, orderId: payment.order_id, orderNumber: order?.order_number });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ORDERS
app.get('/api/orders', (req, res) => {
  try {
    const { userId } = req.query;
    let query = 'SELECT * FROM orders';
    const params: any[] = [];
    if (userId) {
      query += ' WHERE user_id = ?';
      params.push(userId);
    }
    query += ' ORDER BY id DESC';
    const orders = db.prepare(query).all(...params).map((o: any) => ({
      ...o,
      shipping_address: JSON.parse(o.shipping_address || '{}'),
      customer_info: JSON.parse(o.customer_info || '{}'),
      items: db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(o.id)
    }));
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders/track/:orderNumber', (req, res) => {
  try {
    const order = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(req.params.orderNumber) as any;
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    order.shipping_address = JSON.parse(order.shipping_address || '{}');
    order.customer_info = JSON.parse(order.customer_info || '{}');
    order.items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// REVIEWS
app.post('/api/products/:id/reviews', (req, res) => {
  try {
    const { userId, userName, rating, comment } = req.body;
    const productId = req.params.id;
    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are required' });
    }
    db.prepare('INSERT INTO reviews (product_id, user_id, user_name, rating, comment) VALUES (?, ?, ?, ?, ?)').run(
      productId, userId || null, userName || 'Anonymous Customer', rating, comment
    );

    // Recalculate average rating
    const stats = db.prepare('SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE product_id = ?').get(productId) as any;
    db.prepare('UPDATE products SET rating = ?, review_count = ? WHERE id = ?').run(stats.avg_rating || 5.0, stats.count, productId);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// NOTIFICATIONS
app.get('/api/notifications', (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.json([]);
    const notes = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT 20').all(userId);
    res.json(notes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notifications/read', (req, res) => {
  try {
    const { userId } = req.body;
    db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(userId);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PAYOUTS API
app.get('/api/payouts', (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.json([]);
    const payouts = db.prepare('SELECT * FROM payouts WHERE user_id = ? ORDER BY id DESC').all(userId);
    res.json(payouts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/payouts/request', (req, res) => {
  try {
    const { userId, amount, bank_name, account_number, account_name } = req.body;
    if (!userId || !amount || !bank_name || !account_number || !account_name) {
      return res.status(400).json({ error: 'All payout fields are required' });
    }
    const reference = 'PO-' + crypto.randomBytes(5).toString('hex').toUpperCase();
    db.prepare(`
      INSERT INTO payouts (user_id, amount, bank_name, account_number, account_name, status, reference)
      VALUES (?, ?, ?, ?, ?, 'Pending', ?)
    `).run(Number(userId), Number(amount), bank_name, account_number, account_name, reference);

    db.prepare('INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)').run(
      userId,
      'Payout Request Submitted',
      `Your payout request of ₦${Number(amount).toLocaleString()} to ${bank_name} has been submitted.`,
      'system'
    );

    res.json({ success: true, reference });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/payouts', (req, res) => {
  try {
    const payouts = db.prepare(`
      p.*, u.name as user_name, u.email as user_email
      FROM payouts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.id DESC
    `).all();
    res.json(payouts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/payouts/:id/process', (req, res) => {
  try {
    const { status } = req.body;
    const payoutId = req.params.id;
    db.prepare('UPDATE payouts SET status = ? WHERE id = ?').run(status, payoutId);

    const payout = db.prepare('SELECT * FROM payouts WHERE id = ?').get(payoutId) as any;
    if (payout && payout.user_id) {
      db.prepare('INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)').run(
        payout.user_id,
        `Payout Status: ${status}`,
        `Your payout request of ₦${payout.amount.toLocaleString()} has been marked as ${status}.`,
        'system'
      );
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- ADMIN DASHBOARD API ---
app.get('/api/admin/stats', (req, res) => {
  try {
    const totalSalesResult = db.prepare("SELECT SUM(total_amount) as total FROM orders WHERE payment_status = 'Paid'").get() as any;
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get() as any;
    const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status != 'Delivered' AND status != 'Cancelled'").get() as any;
    const completedOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'Delivered'").get() as any;
    const totalCustomers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'").get() as any;
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get() as any;
    const lowStockProducts = db.prepare('SELECT COUNT(*) as count FROM products WHERE stock < 15').get() as any;

    const recentOrders = db.prepare('SELECT * FROM orders ORDER BY id DESC LIMIT 5').all().map((o: any) => ({
      ...o,
      shipping_address: JSON.parse(o.shipping_address || '{}'),
      customer_info: JSON.parse(o.customer_info || '{}')
    }));

    const recentCustomers = db.prepare("SELECT id, name, email, created_at FROM users WHERE role = 'customer' ORDER BY id DESC LIMIT 5").all();

    res.json({
      totalSales: totalSalesResult.total || 0,
      totalOrders: totalOrders.count || 0,
      pendingOrders: pendingOrders.count || 0,
      completedOrders: completedOrders.count || 0,
      totalCustomers: totalCustomers.count || 0,
      totalProducts: totalProducts.count || 0,
      lowStockProducts: lowStockProducts.count || 0,
      recentOrders,
      recentCustomers
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/products', (req, res) => {
  try {
    const products = db.prepare('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.id DESC').all().map((p: any) => ({
      ...p,
      colors: JSON.parse(p.colors || '[]'),
      sizes: JSON.parse(p.sizes || '[]'),
      images: JSON.parse(p.images || '[]')
    }));
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/products', (req, res) => {
  try {
    const { name, description, price, compare_at_price, category_id, brand, stock, is_featured, is_best_seller, is_new, colors, sizes, images } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const stmt = db.prepare(`
      INSERT INTO products (name, slug, description, price, compare_at_price, category_id, brand, stock, is_featured, is_best_seller, is_new, colors, sizes, images)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      name, slug, description, Number(price), Number(compare_at_price || price), Number(category_id), brand, Number(stock || 50),
      is_featured ? 1 : 0, is_best_seller ? 1 : 0, is_new ? 1 : 0,
      JSON.stringify(colors || []), JSON.stringify(sizes || []), JSON.stringify(images || ['https://images.unsplash.com/photo-1523275335684-37898b6baf30'])
    );

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/products/:id', (req, res) => {
  try {
    const { name, description, price, compare_at_price, category_id, brand, stock, is_featured, is_best_seller, is_new } = req.body;
    db.prepare(`
      UPDATE products SET name = ?, description = ?, price = ?, compare_at_price = ?, category_id = ?, brand = ?, stock = ?, is_featured = ?, is_best_seller = ?, is_new = ?
      WHERE id = ?
    `).run(name, description, Number(price), Number(compare_at_price), Number(category_id), brand, Number(stock), is_featured ? 1 : 0, is_best_seller ? 1 : 0, is_new ? 1 : 0, req.params.id);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/products/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/orders', (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY id DESC').all().map((o: any) => ({
      ...o,
      shipping_address: JSON.parse(o.shipping_address || '{}'),
      customer_info: JSON.parse(o.customer_info || '{}'),
      items: db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(o.id)
    }));
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/orders/:id/status', (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    if (status) {
      db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
    }
    if (paymentStatus) {
      db.prepare('UPDATE orders SET payment_status = ? WHERE id = ?').run(paymentStatus, req.params.id);
    }

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id) as any;
    if (order && order.user_id) {
      db.prepare('INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)').run(
        order.user_id,
        `Order Update (${order.order_number})`,
        `Your order status has been updated to: ${status || order.status}`,
        'order'
      );
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/customers', (req, res) => {
  try {
    const customers = db.prepare(`
      u.id, u.name, u.email, u.phone, u.role, u.is_suspended, u.created_at,
      (SELECT COUNT(*) FROM orders WHERE user_id = u.id) as order_count,
      (SELECT SUM(total_amount) FROM orders WHERE user_id = u.id AND payment_status = 'Paid') as total_spent
      FROM users u
      WHERE u.role = 'customer'
      ORDER BY u.id DESC
    `).all();
    res.json(customers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/customers/:id/suspend', (req, res) => {
  try {
    const user = db.prepare('SELECT is_suspended FROM users WHERE id = ?').get(req.params.id) as any;
    if (!user) return res.status(404).json({ error: 'Customer not found' });
    const newStatus = user.is_suspended ? 0 : 1;
    db.prepare('UPDATE users SET is_suspended = ? WHERE id = ?').run(newStatus, req.params.id);
    res.json({ success: true, is_suspended: newStatus });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/coupons', (req, res) => {
  try {
    const coupons = db.prepare('SELECT * FROM coupons ORDER BY id DESC').all();
    res.json(coupons);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/coupons', (req, res) => {
  try {
    const { code, discount_type, discount_value, min_order_amount, expires_at, usage_limit } = req.body;
    db.prepare(`
      INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, expires_at, usage_limit, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `).run(code.toUpperCase(), discount_type, Number(discount_value), Number(min_order_amount || 0), expires_at || '2027-12-31', Number(usage_limit || 100));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/coupons/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM coupons WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Vite middleware in development
async function startServer() {
  const PORT = process.env.PORT || 3000;

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`LuxeStore e-commerce server running on http://localhost:${PORT}`);
  });
}

startServer();
