-- ===========================================
-- Hazel App - Complete Database Schema
-- Version 3 (Updated with app-level fields)
-- ===========================================

-- ===========================================
-- SETUP: Clean slate (optional, but recommended)
-- ===========================================
DROP TRIGGER IF EXISTS on_auth_user_created_create_profile ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_profile;
DROP TABLE IF EXISTS public.favorites CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.items CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.admins CASCADE;
DROP TABLE IF EXISTS public.owners CASCADE;
DROP TABLE IF EXISTS public.renters CASCADE;
DROP TYPE IF EXISTS public.user_role;
DROP TYPE IF EXISTS public.user_status;
DROP TYPE IF EXISTS public.payment_method;
DROP TYPE IF EXISTS public.transaction_status;

-- ===========================================
-- ENUM TYPES
-- ===========================================
CREATE TYPE public.user_role AS ENUM ('renter', 'owner', 'admin');
CREATE TYPE public.user_status AS ENUM ('active', 'banned');
CREATE TYPE public.payment_method AS ENUM ('gcash', 'cod', 'maya');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'cancelled');

-- ===========================================
-- TABLES
-- ===========================================

-- Stores renter-specific profile information, linked to a Supabase auth user.
CREATE TABLE public.renters (
    renter_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255)
);

-- Stores owner-specific profile information, linked to a Supabase auth user.
CREATE TABLE public.owners (
    owner_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255)
);

-- Stores admin-specific profile information, linked to a Supabase auth user.
CREATE TABLE public.admins (
    admin_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    name VARCHAR(255) NOT NULL
);

-- Stores item categories.
CREATE TABLE public.categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Stores the rental items.
CREATE TABLE public.items (
    item_id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES public.owners(owner_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES public.categories(category_id),
    image_url VARCHAR(255),
    price_per_day DECIMAL(10,2) NOT NULL,
    -- App-specific fields found in code:
    availability BOOLEAN NOT NULL DEFAULT true,
    tracking_tag_id VARCHAR(255),
    owner_terms TEXT
);

-- Stores rental transaction history.
CREATE TABLE public.transactions (
    transaction_id SERIAL PRIMARY KEY,
    renter_id INTEGER NOT NULL REFERENCES public.renters(renter_id) ON DELETE CASCADE,
    item_id INTEGER NOT NULL REFERENCES public.items(item_id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method public.payment_method NOT NULL,
    status public.transaction_status NOT NULL DEFAULT 'pending',
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    service_fee DECIMAL(10,2) DEFAULT 0.00
);

-- Stores users' favorite items.
CREATE TABLE public.favorites (
    renter_id INTEGER NOT NULL REFERENCES public.renters(renter_id) ON DELETE CASCADE,
    item_id INTEGER NOT NULL REFERENCES public.items(item_id) ON DELETE CASCADE,
    PRIMARY KEY (renter_id, item_id)
);


-- ===========================================
-- AUTOMATION: Trigger to create role-specific profiles
-- ===========================================
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    user_role_from_meta TEXT := NEW.raw_user_meta_data ->> 'role';
    user_name_from_meta TEXT := (NEW.raw_user_meta_data ->> 'first_name') || ' ' || (NEW.raw_user_meta_data ->> 'last_name');
BEGIN
  IF user_role_from_meta = 'renter' THEN
    INSERT INTO public.renters (user_id, name) VALUES (NEW.id, user_name_from_meta);
  ELSIF user_role_from_meta = 'owner' THEN
    INSERT INTO public.owners (user_id, name) VALUES (NEW.id, user_name_from_meta);
  ELSIF user_role_from_meta = 'admin' THEN
    INSERT INTO public.admins (user_id, name) VALUES (NEW.id, user_name_from_meta);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_create_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_profile();

-- ===========================================
-- VIEW: Unified User Profile
-- ===========================================
CREATE OR REPLACE VIEW public.user_profiles_view AS
SELECT
    user_id,
    name,
    'renter' AS role,
    renter_id,
    NULL::int AS owner_id,
    NULL::int AS admin_id
FROM public.renters
UNION ALL
SELECT
    user_id,
    name,
    'owner' AS role,
    NULL::int AS renter_id,
    owner_id,
    NULL::int AS admin_id
FROM public.owners
UNION ALL
SELECT
    user_id,
    name,
    'admin' AS role,
    NULL::int AS renter_id,
    NULL::int AS owner_id,
    admin_id
FROM public.admins;

-- ===========================================
-- RLS (ROW LEVEL SECURITY) POLICIES
-- ===========================================
-- Enable RLS for all relevant tables
ALTER TABLE public.renters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Policies for renters
CREATE POLICY "Renters can view their own profile." ON public.renters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Renters can update their own profile." ON public.renters FOR UPDATE USING (auth.uid() = user_id);

-- Policies for owners
CREATE POLICY "Owners can view their own profile." ON public.owners FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owners can update their own profile." ON public.owners FOR UPDATE USING (auth.uid() = user_id);

-- Policies for admins
CREATE POLICY "Admins can view their own profile." ON public.admins FOR SELECT USING (auth.uid() = user_id);


-- Policies for items
CREATE POLICY "Anyone can view available items." ON public.items FOR SELECT USING (availability = true);
CREATE POLICY "Owners can manage their own items." ON public.items FOR ALL USING (auth.uid() = (SELECT user_id FROM owners WHERE owner_id = items.owner_id));

-- Policies for transactions
CREATE POLICY "Users can view their own transactions." ON public.transactions FOR SELECT USING (auth.uid() = (SELECT user_id FROM renters WHERE renter_id = transactions.renter_id));

-- Policies for favorites
CREATE POLICY "Renters can manage their own favorites." ON public.favorites FOR ALL USING (auth.uid() = (SELECT user_id FROM renters WHERE renter_id = favorites.renter_id));


-- ===========================================
-- SEED DATA (Optional)
-- ===========================================
-- Use a transaction to ensure all statements succeed or none do.
BEGIN;

-- Declare a variable to hold the owner's ID for later use.
DO $$
DECLARE
    v_owner_id INTEGER;
    v_tools_cat_id INTEGER;
    v_electronics_cat_id INTEGER;
    v_vehicles_cat_id INTEGER;
    v_sports_cat_id INTEGER;
BEGIN
    -- Step 1: Ensure the necessary categories exist.
    INSERT INTO public.categories (name) VALUES ('Tools'), ('Electronics'), ('Vehicles'), ('Sports')
    ON CONFLICT (name) DO NOTHING;

    -- Retrieve the IDs of the categories into variables.
    SELECT category_id INTO v_tools_cat_id FROM public.categories WHERE name = 'Tools';
    SELECT category_id INTO v_electronics_cat_id FROM public.categories WHERE name = 'Electronics';
    SELECT category_id INTO v_vehicles_cat_id FROM public.categories WHERE name = 'Vehicles';
    SELECT category_id INTO v_sports_cat_id FROM public.categories WHERE name = 'Sports';

    -- Step 2: Ensure the owner exists.
    -- Replace with a valid UUID from your auth.users table
    INSERT INTO public.owners (user_id, name, phone, address)
    VALUES ('9cf54ff0-5cae-48b2-9d80-c8695b2005bf', 'John Doe', '555-123-4567', '123 Main St, Anytown, USA')
    ON CONFLICT (user_id) DO UPDATE SET name = EXCLUDED.name -- Or do nothing if you prefer
    RETURNING owner_id INTO v_owner_id;

    -- Step 3: Insert the sample items, using the retrieved owner and category IDs.
    INSERT INTO public.items (owner_id, title, description, category_id, image_url, price_per_day, availability, owner_terms)
    VALUES
        (v_owner_id, 'DeWalt 20V MAX Cordless Drill', 'Powerful and versatile cordless drill with two batteries. Perfect for any home DIY project.', v_tools_cat_id, 'https://example.com/images/dewalt-drill.jpg', 15.00, true, 'Renter responsible for any damage.'),
        (v_owner_id, 'Canon EOS R6 Mirrorless Camera', 'Professional-grade full-frame mirrorless camera. Includes 24-105mm f/4L lens. Ideal for weddings and events.', v_electronics_cat_id, 'https://example.com/images/canon-r6.jpg', 55.00, true, 'Handle with care. Lens cap must be on when not in use.'),
        (v_owner_id, 'Trek Marlin 5 Mountain Bike', 'A great entry-level cross-country mountain bike with front suspension and 21 speeds. Size: Large.', v_vehicles_cat_id, 'https://example.com/images/trek-marlin-5.jpg', 25.00, true, 'Return clean. A cleaning fee may apply.'),
        (v_owner_id, '4-Person Camping Tent', 'Coleman Sundome tent. Easy setup and weatherproof. Spacious enough for 4 people or a couple with gear.', v_sports_cat_id, 'https://example.com/images/coleman-tent.jpg', 20.00, false, 'Must be returned dry and packed in its original bag.'),
        (v_owner_id, 'HD Digital Projector', 'Epson Home Cinema 1080p projector. Bright and clear picture for an amazing movie night experience. HDMI cable included.', v_electronics_cat_id, 'https://example.com/images/epson-projector.jpg', 30.00, true, NULL);

END $$;

-- Commit the transaction to save all changes.
COMMIT;
