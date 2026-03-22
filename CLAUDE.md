# Janya Foundation - Complete Codebase Index

## Project Overview

**Project Name:** Janya Foundation - Donation & Marathon Platform
**Framework:** Next.js 16 with React 19
**Type:** NGO Donation & Marathon Registration Platform
**Live URL:** https://janyafoundation.in/

---

## Page URLs
 
| URL | Description |
|-----|-------------|
| `http://localhost:3000/` | Home/Landing Page - Donation form, hero, impact, about, mission areas, gallery, volunteer section |
| `http://localhost:3000/marathon` | Marathon registration form (2-step: race selection → personal details + payment) |
| `http://localhost:3000/marathon-success` | Post-payment verification, save to DB, send emails, generate PDF |
| `http://localhost:3000/donation-success` | Post-donation verification, show status, auto-download PDF |
| `http://localhost:3000/donation-policy` | Donation policy content |
| `http://localhost:3000/privacy-policy` | Privacy policy content |
| `http://localhost:3000/refund-policy` | Refund policy content |
| `http://localhost:3000/terms-of-service` | Terms of service content |
| `http://localhost:3000/transparency` | Transparency & fund utilization breakdown |
| `http://localhost:3000/registration-details` | NGO registration & DARPAN details |
| `http://localhost:3000/route-map` | Interactive marathon route map (Leaflet) |
| `http://localhost:3000/transactions` | Transaction lookup by single/bulk IDs |
| `http://localhost:3000/prize-claim` | Marathon prize claim form - Winners submit documents for prize money |
| `http://localhost:3000/dashboard` | Admin Dashboard - Login, registrations, coupons, races management |

**Production URLs:**
- https://janyafoundation.in/
- https://janyafoundation.in/marathon

**SEO & Utility URLs:**
- https://janyafoundation.in/sitemap.xml
- https://janyafoundation.in/robots.txt
- https://janyafoundation.in/googleb0a3ecec4869fb78.html (Google Search Console verification)

---

## Folder Structure

```
razorpaydonation/
├── app/                          # Main application
│   ├── api/                      # API routes (21 endpoints)
│   ├── components/               # Reusable components (15 files)
│   ├── dashboard/                # Admin dashboard
│   ├── donation-policy/
│   │   ├── page.js
│   │   └── layout.js            # SEO metadata
│   ├── donation-success/
│   ├── marathon/
│   │   ├── page.js
│   │   └── layout.js            # SEO metadata
│   ├── marathon-success/
│   ├── privacy-policy/
│   │   ├── page.js
│   │   └── layout.js            # SEO metadata
│   ├── refund-policy/
│   │   ├── page.js
│   │   └── layout.js            # SEO metadata
│   ├── registration-details/
│   │   ├── page.js
│   │   └── layout.js            # SEO metadata
│   ├── route-map/
│   │   ├── page.js
│   │   └── layout.js            # SEO metadata
│   ├── terms-of-service/
│   │   ├── page.js
│   │   └── layout.js            # SEO metadata
│   ├── transactions/
│   ├── transparency/
│   │   ├── page.js
│   │   └── layout.js            # SEO metadata
│   ├── page.js                   # Home page with SEO metadata & JSON-LD
│   ├── layout.js                 # Root layout (Analytics, Meta Pixel, WhatsApp)
│   └── globals.css
├── lib/                          # Utility libraries
│   └── supabase.js              # Supabase client initialization
├── public/                       # Static assets
│   ├── galleryimages/           # 8 images + 1 video
│   ├── logos/                   # Partner logos and assets
│   ├── sitemap.xml              # SEO sitemap
│   ├── robots.txt               # Search engine directives
│   └── googleb0a3ecec4869fb78.html  # Google Search Console verification
├── partners_logo/                # Partner logo directory
├── package.json                  # Dependencies manifest
├── next.config.mjs              # Next.js configuration
├── jsconfig.json                # JS path aliases (@/* → ./)
├── tailwind.config.mjs          # Tailwind CSS config
├── postcss.config.mjs           # PostCSS config
└── README.md                     # Documentation
```

---

## Analytics & Tracking

### Google Analytics 4
- **Measurement ID:** `G-MS35L4KY06`
- **Dashboard:** https://analytics.google.com
- **Features:** Real-time visitors, page views, geographic data, traffic sources

### Vercel Web Analytics
- **Package:** `@vercel/analytics`
- **Dashboard:** Vercel Project → Analytics tab
- **Features:** Privacy-friendly, no cookies, ad-blocker resistant

### Meta Pixel (Facebook)
- **Pixel ID:** `555306820676727`
- **Features:** Facebook/Instagram ad tracking, conversion events

### Google Search Console
- **Verification:** Meta tag + HTML file verification
- **Sitemap:** Submitted at `/sitemap.xml`

---

## SEO Configuration

### Root Layout (`app/layout.js`)
- metadataBase URL
- Default title template: `%s | Janya Foundation`
- Open Graph defaults
- Twitter card defaults
- Google Search Console verification
- Robots configuration

### Page-Specific SEO (layout.js files)

| Page | Title | Key Features |
|------|-------|--------------|
| Homepage | Janya Foundation - Donate for Women & Children Empowerment | JSON-LD NGO schema, full OG tags |
| Marathon | Janya Foundation Marathon 2025 - Register Now | Event keywords, race categories |
| Privacy Policy | Privacy Policy - Janya Foundation | Data protection keywords |
| Donation Policy | Donation Policy - Janya Foundation | 80G tax benefits keywords |
| Refund Policy | Refund Policy - Janya Foundation | Refund process keywords |
| Terms of Service | Terms of Service - Janya Foundation | User agreement keywords |
| Transparency | Transparency & Accountability - Janya Foundation | Fund utilization keywords |
| Registration Details | NGO Registration Details - Janya Foundation | DARPAN, 80G certification |
| Route Map | Marathon Route Map - Janya Foundation Marathon 2025 | Race course keywords |

### Structured Data (JSON-LD)
- **Type:** NGO (Organization)
- **Location:** Homepage (`app/page.js`)
- **Includes:** Name, URL, logo, description, contact info, social links

---

## API Routes (21 Endpoints)

### Payment Integration (PhonePe)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/phonepe` | Initiate donation payment |
| POST | `/api/phonepe/callback` | PhonePe webhook callback |
| POST | `/api/phonepe/status` | Check payment status |
| POST | `/api/phonepe/transactions` | Fetch transaction details |
| GET | `/api/phonepe/transactions/list` | List transactions |

### Marathon Registration

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/marathon` | Initiate marathon payment |
| POST | `/api/marathon/save-registration` | Save registration data to Supabase |
| GET | `/api/marathon/get-registration` | Retrieve registration details |
| POST | `/api/marathon/resend-email` | Resend confirmation email |
| POST | `/api/marathon/complete-pending` | Complete pending registrations |
| POST | `/api/marathon/fix-pending` | Fix pending transactions |

### Coupon Management

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/coupon/check` | Validate coupon + check phone usage |
| POST | `/api/coupon/record` | Record coupon usage |

### Admin Dashboard

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/admin/auth` | Admin login endpoint |
| GET/POST/PUT/DELETE | `/api/admin/coupons` | Manage coupons |
| GET/POST/PUT/DELETE | `/api/admin/races` | Manage race categories |
| GET | `/api/dashboard/coupons` | Get coupon usage stats |
| GET | `/api/dashboard/registrations` | Get registration stats |

### Utilities

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/send-email` | Send confirmation emails via Resend |
| GET | `/api/races` | Get available race categories |
| POST | `/api/volunteer` | Volunteer registration |

---

## Components (14 Files)

| Component | File | Purpose |
|-----------|------|---------|
| DonationPage | `app/components/DonationPage.js` | Main landing page layout, manages donation modal state |
| DonationForm | `app/components/DonationForm.js` | 2-step donation form (amount → personal details → payment) |
| Header | `app/components/Header.js` | Sticky navigation, hides on scroll down, shows on scroll up, mobile menu |
| HeaderPolicy | `app/components/HeaderPolicy.js` | Simplified header for policy pages |
| Footer | `app/components/Footer.js` | Footer with links, social icons, contact info, WhatsApp link |
| HeroSection | `app/components/HeroSection.js` | Hero banner with CTA buttons (contains main H1) |
| AboutSection | `app/components/AboutSection.js` | Foundation mission and story |
| ImpactMetrics | `app/components/ImpactMetrics.js` | Animated statistics counters |
| ImpactSection | `app/components/ImpactSection.js` | Impact stories and completed projects |
| MissionAreas | `app/components/MissionAreas.js` | 4 main programs (cancer awareness, education, women's empowerment, healthcare) |
| Gallery | `app/components/Gallery.js` | Photo/video gallery with modal viewer |
| VolunteerSection | `app/components/VolunteerSection.js` | Volunteer opportunities and sign-up |
| FloatingDonateButton | `app/components/FloatingDonateButton.js` | Fixed-position donate button |
| PartnersAndHelp | `app/components/PartnersAndHelp.js` | Partners and support section |

---

## Libraries & Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| @supabase/supabase-js | ^2.89.0 | Database & backend |
| @vercel/analytics | latest | Vercel Web Analytics |
| axios | ^1.9.0 | HTTP requests |
| crypto | ^1.0.1 | Cryptography utilities |
| jspdf | ^4.0.0 | PDF generation |
| leaflet | ^1.9.4 | Map display |
| next | ^16.0.7 | React framework |
| qrcode | ^1.5.4 | QR code generation |
| react | ^19.2.1 | UI library |
| react-dom | ^19.2.1 | DOM rendering |
| react-icons | ^5.5.0 | Icon library |
| resend | ^6.5.2 | Email service |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| postcss | ^8 | CSS processing |
| tailwindcss | ^3.4.1 | CSS framework |

---

## Public Assets & Images

### SEO Files (`/public/`)

| File | Description |
|------|-------------|
| sitemap.xml | XML sitemap for search engines |
| robots.txt | Search engine crawling directives |
| googleb0a3ecec4869fb78.html | Google Search Console verification |

### Gallery Images (`/public/galleryimages/`)

| File | Type |
|------|------|
| IMG-20250524-WA0022.jpg | Image |
| IMG-20250524-WA0023.jpg | Image |
| IMG-20250524-WA0024.jpg | Image |
| IMG-20250524-WA0025.jpg | Image |
| IMG-20250524-WA0026.jpg | Image |
| IMG-20250524-WA0027.jpg | Image |
| IMG-20250524-WA0028.jpg | Image |
| IMG-20250524-WA0030.jpg | Image |
| WhatsApp Image 2025-05-24 at 19.14.58_7c6904d8.jpg | Image |
| WhatsApp Image 2025-05-24 at 19.14.58_c023c036.jpg | Image |
| VID-20250524-WA0001.mp4 | Video |

### Logos & Branding (`/public/`)

| File | Description |
|------|-------------|
| janya-logo.svg | Main foundation logo |
| sitelogo.jpg | Site logo |
| partner-janyafarm.jpg | Partner: Janya Farm |
| partner-logo1.png | Partner logo 1 |
| partner-logo2.png | Partner logo 2 |
| partner-plush.webp | Partner: Plush |
| partner-pocari.png | Partner: Pocari Sweat |
| partner-reliance.jpg | Partner: Reliance |
| Pocari_Sweat_logo.png | Pocari Sweat logo |
| partners-logos.png | Combined partners logo |
| sponsors-logos.png | Combined sponsors logo |

### Other Assets (`/public/`)

| File | Description |
|------|-------------|
| marathon-qr.png | Marathon QR code (PNG) |
| marathon-qr.svg | Marathon QR code (SVG) |
| file.svg | Generic file icon |
| globe.svg | Globe icon |
| next.svg | Next.js logo |
| vercel.svg | Vercel logo |
| window.svg | Window icon |
| photo-1608686207856-001b95cf60ca.avif | Background image |

---

## Lib Directory

| File | Purpose |
|------|---------|
| `lib/supabase.js` | Supabase client initialization with public/service role keys |

---

## Major Functionality

### 1. Donation System
- 2-step donation form (amount selection → personal details)
- PhonePe payment integration with OAuth 2.0
- Automatic PDF receipt generation (jsPDF)
- Payment status verification
- Email confirmation via Resend

### 2. Marathon Registration
- Race category selection (competitive, non-competitive, kids, donation)
- Personal details collection (name, email, phone, age, gender, address, t-shirt size)
- Emergency contact information
- PAN number capture for tax benefits
- Coupon code validation
- 3.5% convenience fee calculation
- QR code generation for registration receipts
- Automatic email notifications

### 3. Coupon System
- Fixed amount discounts
- Percentage-based discounts
- Race-specific fixed discounts
- One coupon per phone number enforcement
- Expiration date support
- Max usage limits
- Admin management UI

### 4. Admin Dashboard
- Secure login with token-based authentication
- Registration management with filters (race, payment status, coupon, gender, t-shirt size)
- Advanced search by name, email, phone
- Coupon CRUD operations
- Race category CRUD operations
- Real-time statistics (total registrations, revenue, active coupons/races)
- Data export capabilities

### 5. Route Visualization
- Interactive Leaflet map with marathon route
- Waypoint markers (start, stops, end)
- Gate and playground visualization
- Navigation integration with Google Maps
- Flyto animation to waypoints

### 6. Transparency
- Financial breakdown (donations, expenses, administrative costs)
- Fund utilization by program (cancer awareness, education, women empowerment, sanitary support)
- Operational cost breakdown
- Impact metrics display

### 7. Analytics & SEO
- Google Analytics 4 integration (real-time tracking)
- Vercel Web Analytics (privacy-friendly)
- Meta Pixel for Facebook/Instagram ads
- Google Search Console integration
- XML sitemap for search indexing
- Structured data (JSON-LD) for rich results
- Open Graph & Twitter cards for social sharing

### 8. Additional Features
- Floating WhatsApp chat button (919321496142)
- Responsive design (mobile-first)
- CSS animations (Tailwind animate classes)
- Social media links
- Volunteer registration form

---

## Database Schema (Supabase)

### Table: `marathon_registrations`

| Column | Type | Notes |
|--------|------|-------|
| id | int | Primary key, auto-increment |
| created_at | timestamp | Auto-set on insert |
| name | text | Participant name |
| email | text | Email address |
| phone | text | 10-digit phone (indexed) |
| emergency_phone | text | Emergency contact |
| age | int | Age |
| gender | text | Male/Female/Other |
| tshirt_size | text | XS/S/M/L/XL/XXL |
| address | text | Address |
| race_category | text | Race distance (indexed) |
| race_name | text | Display name |
| is_run_for_cause | boolean | Non-competitive flag |
| amount | decimal | Base price |
| convenience_fee | decimal | 3.5% fee |
| coupon_code | text | Applied coupon |
| coupon_discount | decimal | Discount amount |
| total_amount | decimal | Final charged amount |
| payment_id | text | PhonePe payment ID |
| transaction_id | text | MARATHON{timestamp} |
| payment_status | text | SUCCESS/PENDING/FAILED |
| is_donation | boolean | Donation-only flag |

### Table: `coupon_usage`

| Column | Type | Notes |
|--------|------|-------|
| id | int | Primary key |
| created_at | timestamp | Creation date |
| used_at | timestamp | When coupon was used |
| coupon_code | text | Code used |
| phone | text | UNIQUE - One coupon per phone |
| email | text | User email |
| name | text | User name (nullable) |
| transaction_id | text | Associated payment |
| amount_discounted | decimal | Discount amount |

### Table: `races`

| Column | Type | Notes |
|--------|------|-------|
| id | varchar | Primary key (e.g., '5km', 'cause5km', '21km') |
| distance | varchar | Display distance (e.g., '5 KM', '21.1 KM') |
| name | varchar | Race name (e.g., 'Medium Distance', 'Fun Run') |
| price | int | Current discounted price |
| original_price | int | Original price for strikethrough display (nullable) |
| description | text | Race description |
| is_run_for_cause | boolean | Non-competitive flag (default: false) |
| is_kids_run | boolean | Kids race flag (default: false) |
| is_donation | boolean | Donation-only flag (default: false) |
| is_test | boolean | Test race flag (default: false) |
| min_age | int | Minimum age requirement (default: 5) |
| max_age | int | Maximum age requirement (default: 100) |
| is_sold_out | boolean | Sold out flag (default: false) |
| is_active | boolean | Active flag (default: true) |
| sort_order | int | Display order (default: 0) |
| category | varchar | Category: 'competitive', 'non-competitive', 'kids', 'donation' |
| image_url | text | Race card background image URL |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

### Current Race Pricing (with Promotional Discounts)

**Competitive Races (Timed with Prizes):**
| Race ID | Distance | Original Price | Discounted Price |
|---------|----------|----------------|------------------|
| 5km | 5 KM | ~~₹799~~ | ₹499 |
| 10km | 10 KM | ~~₹1099~~ | ₹799 |
| 21km | 21.1 KM | ~~₹1499~~ | ₹1199 |

**Non-Competitive Races (Run for Cause - No Prize, No Chip):**
| Race ID | Distance | Original Price | Discounted Price |
|---------|----------|----------------|------------------|
| 3km | 3 KM | ~~₹599~~ | ₹499 |
| cause5km | 5 KM | ~~₹799~~ | ₹599 |
| cause10km | 10 KM | ~~₹1099~~ | ₹799 |

**Other Categories:**
| Race ID | Distance | Price | Category |
|---------|----------|-------|----------|
| kidsrun | Kids | ₹499 | Kids Special Run |
| donate100 | ₹100 | ₹100 | Donation |
| donate200 | ₹200 | ₹200 | Donation |

*Note: All prices are stored in the `races` table in Supabase. The `original_price` column is used for strikethrough display on the marathon page UI.*

---

## Environment Variables Required

```env
# PhonePe Payment Gateway
PHONEPE_CLIENT_ID=
PHONEPE_CLIENT_SECRET=
PHONEPE_CLIENT_VERSION=1
PHONEPE_ENV=PRODUCTION  # or UAT for sandbox

# Base URL
NEXT_PUBLIC_BASE_URL=https://janyafoundation.in

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
SUPABASE_SERVICE_ROLE_KEY=  # Server-side only

# Email Service
RESEND_API_KEY=
ADMIN_EMAIL=

# Analytics (Hardcoded in layout.js)
# META_PIXEL_ID=555306820676727
# GOOGLE_ANALYTICS_ID=G-MS35L4KY06
```

---

## Payment Flow

1. User selects donation/marathon amount
2. Submits personal details
3. Initiates PhonePe payment via `/api/phonepe` or `/api/marathon`
4. PhonePe handles OAuth and checkout
5. User completes payment on PhonePe platform
6. PhonePe redirects to `/donation-success` or `/marathon-success`
7. Frontend fetches status via `/api/phonepe/status`
8. Backend saves registration if successful
9. Email sent via Resend
10. PDF receipt auto-generated and downloaded

---

## Third-Party Integrations

| Service | Purpose |
|---------|---------|
| PhonePe | Payment processing (OAuth 2.0 + Checkout API) |
| Supabase | PostgreSQL database + authentication option |
| Resend | Email delivery |
| OpenRouteService | Marathon route data |
| OpenStreetMap | Map tiles via Leaflet |
| Cloudflare CDN | Leaflet library CDN |
| Google Maps | Navigation links |
| Google Analytics 4 | Website analytics & tracking |
| Vercel Analytics | Privacy-friendly web analytics |
| Meta Pixel | Facebook/Instagram analytics |
| Google Search Console | SEO monitoring & indexing |
| Google Fonts | Inter font family |

---

## Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `package.json` | Project dependencies |
| `app/layout.js` | Root layout (Meta Pixel, GA4, Vercel Analytics, WhatsApp) |
| `app/page.js` | Home page with SEO metadata & JSON-LD schema |
| `app/dashboard/page.js` | Admin dashboard (800+ lines) |
| `app/marathon/page.js` | Marathon registration |
| `app/marathon/layout.js` | Marathon page SEO metadata |
| `app/components/DonationForm.js` | Donation form (22KB) |
| `app/components/Header.js` | Navigation (20KB) |
| `app/components/HeroSection.js` | Hero section with main H1 |
| `lib/supabase.js` | Supabase client init |
| `public/sitemap.xml` | SEO sitemap |
| `public/robots.txt` | Search engine directives |

---

## SEO Best Practices Implemented

1. **Single H1 per page** - Main title in HeroSection (homepage) or page title (other pages)
2. **Proper heading hierarchy** - H1 → H2 → H3 structure
3. **Meta descriptions** - Unique for each page
4. **Open Graph tags** - For social media sharing
5. **Twitter cards** - For Twitter sharing
6. **Canonical URLs** - Prevent duplicate content
7. **Structured data** - JSON-LD for Google rich results
8. **XML sitemap** - All pages indexed
9. **Robots.txt** - Proper crawling directives
10. **Alt text on images** - Accessibility & SEO

---

## Contact & Support

- **WhatsApp:** +91 9321496142
- **Website:** https://janyafoundation.in/
- **Email:** janyafoundation.04@gmail.com
