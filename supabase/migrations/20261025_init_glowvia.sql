-- ==============================================================================
-- GLOWVIA BEAUTY & SKINCARE E-COMMERCE DATABASE MIGRATION
-- Generated for Supabase PostgreSQL
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 3. Customer Saved Addresses
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line TEXT NOT NULL,
  apartment TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pin_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 4. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 5. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  category_slug TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10, 2) CHECK (compare_at_price >= price),
  image_url TEXT NOT NULL,
  gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
  ingredients TEXT,
  directions TEXT,
  size TEXT,
  skin_types TEXT[] DEFAULT ARRAY[]::TEXT[],
  concerns TEXT[] DEFAULT ARRAY[]::TEXT[],
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC(2, 1) DEFAULT NULL,
  review_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 6. Wishlists Table
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_id UUID NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  UNIQUE(wishlist_id, product_id)
);

-- 7. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  shipping_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_amount >= 0),
  discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  shipping_address JSONB NOT NULL,
  delivery_method JSONB NOT NULL,
  coupon_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 8. Order Items Table (Snapshots product details at time of purchase)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name_snapshot TEXT NOT NULL,
  brand_snapshot TEXT NOT NULL,
  image_url_snapshot TEXT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  line_total NUMERIC(10, 2) NOT NULL CHECK (line_total >= 0),
  size_snapshot TEXT
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can view own profile or admins can view all"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Profile owners may edit their contact details, but only trusted operators may assign roles.
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (full_name, phone, updated_at) ON public.profiles TO authenticated;

-- Addresses Policies
CREATE POLICY "Users can manage own addresses"
  ON public.addresses FOR ALL
  USING (auth.uid() = user_id);

-- Categories Policies
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify categories"
  ON public.categories FOR ALL
  USING (public.is_admin());

-- Products Policies
CREATE POLICY "Active products are viewable by everyone"
  ON public.products FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Only admins can insert, update or delete products"
  ON public.products FOR ALL
  USING (public.is_admin());

-- Wishlist Policies
CREATE POLICY "Users can manage their own wishlist"
  ON public.wishlists FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wishlist items"
  ON public.wishlist_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.wishlists
      WHERE wishlists.id = wishlist_items.wishlist_id AND wishlists.user_id = auth.uid()
    )
  );

-- Orders Policies
CREATE POLICY "Users can view own orders, admins can view all"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can update orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Users can view own order items, admins can view all"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

-- Function to handle new user registration profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Valued Customer'),
    'customer'
  );
  
  -- Create empty wishlist
  INSERT INTO public.wishlists (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

