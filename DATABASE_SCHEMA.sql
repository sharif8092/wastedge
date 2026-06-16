-- ====================================================================
-- WASTEAGE SOLUTION - DATABASE SCHEMA (PostgreSQL via Supabase)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & CONSTANTS
CREATE TYPE user_role AS ENUM ('customer', 'vendor', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE pickup_status AS ENUM ('pending', 'assigned', 'accepted', 'in_progress', 'completed', 'cancelled');

-- 3. PROFILES TABLE (Linked with Supabase Auth auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    role user_role DEFAULT 'customer'::user_role NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. VENDORS TABLE
CREATE TABLE public.vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    service_areas TEXT[] NOT NULL, -- List of target operational pincodes
    verification_status verification_status DEFAULT 'pending'::verification_status NOT NULL,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. CATEGORIES TABLE (Lookup)
CREATE TABLE public.categories (
    id VARCHAR(50) PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    price_range VARCHAR(100) NOT NULL, -- Estimated cost per kg in INR
    icon VARCHAR(100) NOT NULL,
    description TEXT NOT NULL
);

-- 6. PICKUP REQUESTS TABLE
CREATE TABLE public.pickup_requests (
    id VARCHAR(50) PRIMARY KEY, -- Visual short ID
    customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    category_id VARCHAR(50) REFERENCES public.categories(id) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    description TEXT,
    image_urls TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    status pickup_status DEFAULT 'pending'::pickup_status NOT NULL,
    vendor_id UUID REFERENCES public.profiles(id), -- Linked to assigned vendor's profile identifier
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Categories: Read for anyone, write for admins only
CREATE POLICY "Allow anyone to read categories" ON public.categories
    FOR SELECT USING (true);

-- Profiles Policies
CREATE POLICY "Allow users to read their own profile or admin to read all" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Allow users to modify their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Vendors Policies
CREATE POLICY "Allow anyone to query active approved vendors list" ON public.vendors
    FOR SELECT USING (verification_status = 'approved' OR auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Allow vendor to modify their own record" ON public.vendors
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow vendor registration" ON public.vendors
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Pickup Requests Policies
CREATE POLICY "Customers read/modify their own requests" ON public.pickup_requests
    FOR SELECT USING (customer_id = auth.uid() OR vendor_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Customers create pickup requests" ON public.pickup_requests
    FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Allowed entities modifier" ON public.pickup_requests
    FOR UPDATE USING (customer_id = auth.uid() OR vendor_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Notifications Policies
CREATE POLICY "Users read/update own notifications" ON public.notifications
    FOR ALL USING (user_id = auth.uid());

-- ====================================================================
-- INITIAL LOOKUP SEED DATA
-- ====================================================================

INSERT INTO public.categories (id, category_name, price_range, icon, description) VALUES
('paper', 'Paper & Cardboard', '₹8 - ₹15 / kg', 'FileText', 'Newspapers, Raddi journals, notebooks, packaging cardboard carton boxes.'),
('plastic', 'Plastic Waste', '₹10 - ₹22 / kg', 'Wine', 'PET containers, bottles, dry household containers, toys, PVC tubes.'),
('metal', 'Metal Scrap', '₹35 - ₹340 / kg', 'Wrench', 'Copper lines, brass ornaments, aluminum utensils, iron rods, tin canisters.'),
('e-waste', 'Electronic Scrap', '₹20 - ₹120 / kg font-bold', 'Laptop', 'Discarded chargers, computers, mobile motherboards, keyboards, printers.'),
('lead-acid-batteries', 'Lead-Acid Batteries', '₹60 - ₹85 / kg', 'BatteryCharging', 'Dead vehicle batteries, home helper IPS UPS inverter electric cells.');
