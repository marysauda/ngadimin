# NgAdmin - E-commerce Website + Admin Panel...
ok
Complete e-commerce solution dengan public website untuk customers dan admin panel untuk management products & content.

## 🌟 Features

### **🛍️ Public Website (/)**
- ✅ **Hero Section** (customizable via admin)
- ✅ **Product Advantages** section (customizable via admin)
- ✅ **Product Catalog** dengan responsive grid
- ✅ **WhatsApp Buy Buttons** untuk setiap produk
- ✅ **Contact Section** dengan WhatsApp integration
- ✅ **Footer** (customizable via admin)
- ✅ **Mobile-responsive design**

### **🔐 Admin Panel (/admin)**
- ✅ Secure login system (single user: ngadim)
- ✅ **Product Management** (CRUD + multiple image upload)
- ✅ **Website Settings** (customize hero, advantages, WhatsApp, footer)
- ✅ Protected dashboard dengan session management
- ✅ Direct link preview website dari admin

## 🔐 Admin Login Credentials

- **URL:** `/admin`
- **Username:** `ngadim`
- **Password:** `#Maryono1920$`

## 🏗️ Architecture

```
Public Website (/) ← Customers browse & buy via WhatsApp
     ↕
Admin Panel (/admin) ← Admin manages products & content
     ↕
Supabase Database ← Products & site settings storage
```

## 💰 Cost Structure

- **Vercel Hosting:** FREE
- **Supabase Database:** FREE (500MB)
- **Supabase Storage:** FREE (1GB)
- **SSL Certificate:** FREE (auto)
- **Global CDN:** FREE
- **Total Cost:** **$0 selamanya**

## 🚀 Quick Start

### Step 1: Setup Database

📖 **[Follow SUPABASE_SETUP.md](./SUPABASE_SETUP.md) untuk complete setup guide**

### Step 2: Install & Run

```bash
npm install
npm run dev
```

### Step 3: Configure

1. **Public Website** → http://localhost:3000 
2. **Admin Panel** → http://localhost:3000/admin
3. Login dengan credentials di atas
4. Add products di Products Management
5. Customize website di Website Settings

## 🛍️ Customer Journey

1. **Customer** visits website → Browse products
2. **Interested** in product → Click "Buy via WhatsApp"
3. **WhatsApp** opens dengan pre-filled message
4. **Direct chat** dengan admin untuk transaksi
5. **Simple & effective** - no complicated checkout!

## 📱 WhatsApp Integration

- **Auto-generated messages** dengan product details
- **Customizable WhatsApp number** via admin panel
- **Direct link** untuk setiap produk
- **Format:** Includes product name, price, dan link

## 📦 Product Management

- ➕ **Add Products:** Name, description, price, category, multiple images
- ✏️ **Edit Products:** Update any product information  
- 🗑️ **Delete Products:** Remove products from catalog
- 🖼️ **Multiple Images:** Upload dan display multiple images per product
- 📱 **Auto WhatsApp:** Every product gets WhatsApp buy button

## ⚙️ Website Customization

Via Admin Panel → Website Settings:

- **🏠 Hero Section:** Title, description, background image
- **⭐ Advantages:** Why choose us section
- **📱 WhatsApp:** Contact number untuk buy buttons
- **📄 Footer:** Business info dan description

## Deployment to Vercel

### Method 1: GitHub (Recommended)

1. Push your code to GitHub repository
2. Connect your GitHub account to Vercel
3. Import your repository in Vercel dashboard
4. Deploy automatically

### Method 2: Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to complete deployment.

### Method 3: Drag & Drop

1. Build the project:
```bash
npm run build
```

2. Go to [vercel.com](https://vercel.com)
3. Drag and drop your project folder to Vercel dashboard

## Environment Variables

For production deployment, no additional environment variables are required as the authentication is hardcoded for security in this simple implementation.

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** CSS
- **Authentication:** Custom implementation
- **Deployment:** Vercel

## Security Notes

- Password is securely embedded in the API route
- Session is managed client-side with localStorage
- HTTPS required for production (automatic with Vercel)

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## File Structure

```
ngadimin/
├── app/
│   ├── api/auth/login/route.ts  # Login API
│   ├── dashboard/page.tsx       # Dashboard page
│   ├── globals.css              # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Login page
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Support

This is a simple admin panel ready for Vercel deployment. Customize as needed for your requirements.
