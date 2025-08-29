# 🗄️ Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up/Login with GitHub
4. Click "New Project"
5. Fill project details:
   - **Name:** ngadimin
   - **Database Password:** (choose a strong password)
   - **Region:** closest to your users
6. Wait for project setup (2-3 minutes)

## Step 2: Get API Keys

1. Go to Project Settings → API
2. Copy these values to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Step 3: Create Database Tables

1. Go to SQL Editor in Supabase dashboard
2. Run this SQL:

```sql
-- Create products table
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create site_settings table for website customization
CREATE TABLE site_settings (
  id BIGSERIAL PRIMARY KEY,
  section TEXT NOT NULL UNIQUE,
  title TEXT,
  content TEXT,
  image_url TEXT,
  whatsapp_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default site settings
INSERT INTO site_settings (section, title, content, whatsapp_number) VALUES
('hero', 'Welcome to Our Store', 'Discover amazing products with the best quality and service', '6281234567890'),
('advantages', 'Why Choose Us?', 'We provide the best quality products with excellent service', null),
('contact', 'Contact', 'WhatsApp Contact', '6281234567890'),
('footer', 'Our Store', 'Your trusted partner for quality products', null);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create triggers
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at 
    BEFORE UPDATE ON site_settings 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (since we have single user)
CREATE POLICY "Allow all operations" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON site_settings FOR ALL USING (true);
```

## Step 4: Setup Storage

1. Go to Storage in Supabase dashboard
2. Click "Create a new bucket"
3. Bucket name: `products`
4. Set as Public bucket: ✅ YES
5. Click "Create bucket"

## Step 5: Configure Storage Policy

1. Go to Storage → products bucket → Configuration
2. Add this policy:

```sql
-- Allow public uploads and reads
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'products');

CREATE POLICY "Allow public reads" ON storage.objects
FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Allow public deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'products');
```

## Step 6: Update Environment Variables

Update your `.env.local` with the actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Step 7: Test Connection

1. Run `npm run dev`
2. Go to `http://localhost:3000`
3. Login and go to Products page
4. Try adding a product with image

## 📊 Database Schema

```
products
├── id (bigserial, primary key)
├── name (text, not null)
├── description (text)
├── price (decimal)
├── category (text, not null) 
├── images (text[], array of URLs)
├── created_at (timestamptz)
└── updated_at (timestamptz)

site_settings
├── id (bigserial, primary key)
├── section (text, unique - 'hero', 'advantages', 'contact', 'footer')
├── title (text)
├── content (text)
├── image_url (text, optional)
├── whatsapp_number (text, for contact section)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

## 🔒 Security Notes

- Row Level Security (RLS) is enabled
- All operations allowed since single user admin
- Images stored in public bucket for easy access
- Database and storage are on free tier (500MB + 1GB)

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] API keys copied to .env.local
- [ ] Database table created
- [ ] Storage bucket created
- [ ] Storage policies configured
- [ ] App can connect to database
- [ ] Image upload works

Your NgAdmin is now ready with full CRUD + image upload functionality! 🎉
