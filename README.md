# Janya Foundation - Donation & Marathon Platform

A Next.js 16 application for Janya Foundation (NGO), providing a donation platform and marathon registration system with PhonePe payment integration, Supabase database, and email notifications.  
 
**Live URL:** https://janyafoundation.in/   
            
## Tech Stack          
          
- **Framework:**  Next.js 16 (App Router, React 19)      
- **Styling:**   Tailwind CSS 
- **Payments:** PhonePe (OAuth 2.0 + v2 Checkout API)   
- **Database:** Supabase (PostgreSQL) 
- **Email:** Resend 
- **PDF Generation:** jsPDF + qrcode
- **Analytics:** Google Analytics 4, Vercel Analytics, Meta Pixel 
- **Maps:** Leaflet + OpenStreetMap

## Commands

```bash
npm run dev      # Development server (Turbopack)
npm run build    # Production build
npm start        # Start production server
npm run lint     # ESLint
```

## Environment Variables

```env
PHONEPE_CLIENT_ID=
PHONEPE_CLIENT_SECRET=
PHONEPE_CLIENT_VERSION=1
PHONEPE_ENV=PRODUCTION          # or UAT for sandbox

NEXT_PUBLIC_BASE_URL=https://janyafoundation.in

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # Server-side only

RESEND_API_KEY=
ADMIN_EMAIL=

# Analytics (hardcoded in layout.js)
# GOOGLE_ANALYTICS_ID=G-MS35L4KY06
# META_PIXEL_ID=555306820676727
```

---

## Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.js` | Home/landing page with donation modal, hero section, impact metrics, about, mission areas, gallery, volunteer section |
| `/marathon` | `app/marathon/page.js` | Two-step marathon registration form (race selection -> personal details + payment) |
| `/marathon-success` | `app/marathon-success/page.js` | Post-payment page: verifies payment, saves registration to DB, sends emails, generates PDF receipt |
| `/donation-success` | `app/donation-success/page.js` | Post-donation page: verifies payment, shows status, auto-downloads PDF receipt |
| `/route-map` | `app/route-map/page.js` | Interactive marathon route map with Leaflet |
| `/donation-policy` | `app/donation-policy/page.js` | Donation policy content |
| `/privacy-policy` | `app/privacy-policy/page.js` | Privacy policy content |
| `/refund-policy` | `app/refund-policy/page.js` | Refund policy content |
| `/terms-of-service` | `app/terms-of-service/page.js` | Terms of service content |
| `/transparency` | `app/transparency/page.js` | Transparency and accountability info |
| `/registration-details` | `app/registration-details/page.js` | DARPAN registration and NGO certification details |
| `/dashboard` | `app/dashboard/page.js` | Admin dashboard for managing registrations, coupons, races |

**SEO URLs:**
- `/sitemap.xml` - XML sitemap for search engines
- `/robots.txt` - Search engine crawling directives

---

## API Routes

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/phonepe` | Initiate PhonePe payment for donations |
| GET | `/api/phonepe/status` | Check payment status by transactionId |
| POST | `/api/phonepe/callback` | Server-to-server webhook from PhonePe |
| POST | `/api/marathon` | Initiate PhonePe payment for marathon registration |
| POST | `/api/marathon/save-registration` | Save marathon registration data to Supabase |
| GET | `/api/marathon/get-registration` | Retrieve registration details |
| POST | `/api/marathon/resend-email` | Resend confirmation email |
| GET | `/api/races` | Get available race categories |
| POST | `/api/coupon/check` | Validate coupon code + check phone usage |
| POST | `/api/coupon/record` | Record coupon usage in database |
| POST | `/api/send-email` | Send confirmation emails (admin + participant) via Resend |
| POST | `/api/volunteer` | Volunteer registration |
| POST | `/api/admin/auth` | Admin login |
| GET/POST/PUT/DELETE | `/api/admin/coupons` | Manage coupons |
| GET/POST/PUT/DELETE | `/api/admin/races` | Manage race categories |

---

## Components (14 Files)

| Component | File | Description |
|-----------|------|-------------|
| DonationPage | `app/components/DonationPage.js` | Main landing page layout, manages donation modal state |
| DonationForm | `app/components/DonationForm.js` | Two-step donation modal (amount selection -> personal details -> payment) |
| Header | `app/components/Header.js` | Sticky nav header, hides on scroll down, shows on scroll up, mobile menu |
| HeaderPolicy | `app/components/HeaderPolicy.js` | Simplified header for policy pages |
| Footer | `app/components/Footer.js` | Footer with links, social icons, contact info |
| HeroSection | `app/components/HeroSection.js` | Hero banner with CTA (contains main H1) |
| AboutSection | `app/components/AboutSection.js` | Foundation mission and story |
| ImpactMetrics | `app/components/ImpactMetrics.js` | Animated statistics counters |
| ImpactSection | `app/components/ImpactSection.js` | Impact stories and projects |
| MissionAreas | `app/components/MissionAreas.js` | Charitable program cards (cancer awareness, education, women's empowerment, healthcare) |
| Gallery | `app/components/Gallery.js` | Photo gallery with modal viewer |
| VolunteerSection | `app/components/VolunteerSection.js` | Volunteer opportunities |
| FloatingDonateButton | `app/components/FloatingDonateButton.js` | Fixed-position donate CTA |
| PartnersAndHelp | `app/components/PartnersAndHelp.js` | Partners and support section |

---

## Analytics & SEO

### Google Analytics 4
- **Measurement ID:** `G-MS35L4KY06`
- **Dashboard:** https://analytics.google.com

### Vercel Web Analytics
- **Package:** `@vercel/analytics`
- **Dashboard:** Vercel Project → Analytics tab

### Meta Pixel (Facebook)
- **Pixel ID:** `555306820676727`

### Google Search Console
- **Verification:** Meta tag + HTML file
- **Sitemap:** `/sitemap.xml`

### SEO Features
- Unique meta descriptions for each page
- Open Graph tags for social sharing
- Twitter cards
- JSON-LD structured data (NGO schema)
- Canonical URLs
- Single H1 per page
- XML sitemap & robots.txt

---

## Supabase Database Schema

### Table: `marathon_registrations`

| Column | Type | Description |
|--------|------|-------------|
| id | int (PK, auto) | Primary key |
| created_at | timestamp | Auto-set on insert |
| name | text | Participant name |
| email | text | Participant email |
| phone | text | Participant phone (10 digits) |
| emergency_phone | text | Emergency contact phone |
| age | int | Participant age |
| gender | text | Male / Female / Other |
| tshirt_size | text | XS / S / M / L / XL / XXL |
| address | text | Participant address |
| race_category | text | Selected race distance |
| race_name | text | Race display name |
| is_run_for_cause | boolean | True if non-competitive category |
| amount | decimal | Base race price |
| convenience_fee | decimal | 3.5% fee amount |
| coupon_code | text (nullable) | Applied coupon code |
| coupon_discount | decimal | Discount amount applied |
| total_amount | decimal | Final amount charged |
| payment_id | text | PhonePe payment ID |
| transaction_id | text | MARATHON{timestamp} |
| payment_status | text | SUCCESS / PENDING / FAILED |
| is_donation | boolean | True if donation-only option |

### Table: `coupon_usage`

| Column | Type | Description |
|--------|------|-------------|
| id | int (PK, auto) | Primary key |
| created_at | timestamp | Auto-set on insert |
| used_at | timestamp | When coupon was used |
| coupon_code | text | Coupon code used |
| phone | text (UNIQUE) | Phone number - one coupon per phone |
| email | text | User email |
| name | text (nullable) | User name |
| transaction_id | text (nullable) | Associated payment transaction |
| amount_discounted | decimal | Discount amount applied |

### Table: `races`

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (PK) | Race ID (e.g., '5km', '10km') |
| distance | varchar | Display distance |
| name | varchar | Race name |
| price | int | Current price |
| original_price | int | Original price (for strikethrough) |
| description | text | Race description |
| category | varchar | competitive / non-competitive / kids / donation |
| is_active | boolean | Active flag |
| is_sold_out | boolean | Sold out flag |
| sort_order | int | Display order |

---

## Payment Flow

### PhonePe Integration

Uses OAuth 2.0 client credentials flow with v2 Checkout API.

- **Production:** `api.phonepe.com` / `auth.phonepe.com`
- **UAT/Sandbox:** `api-preprod.phonepe.com` / `auth-preprod.phonepe.com`
- **Retry logic:** 3 attempts with delay
- **Payment expiry:** 20 minutes
- **Amounts:** Converted to paise (multiply by 100)

### Donation Flow

```
User clicks "Donate Now" on homepage
  -> DonationForm modal opens
  -> Step 1: Select amount
  -> Step 2: Personal details (name, email, phone, PAN, address)
  -> POST /api/phonepe
  -> User redirected to PhonePe checkout
  -> PhonePe redirects to /donation-success?transactionId=JANYA{timestamp}
  -> Verify payment + auto-download PDF receipt
```

### Marathon Registration Flow

```
User visits /marathon
  -> Step 1: Select race category
  -> Step 2: Personal details + optional coupon code
  -> POST /api/marathon
  -> User redirected to PhonePe checkout
  -> PhonePe redirects to /marathon-success?transactionId=MARATHON{timestamp}
  -> Verify payment
  -> Save registration to Supabase
  -> Record coupon usage (if used)
  -> Send confirmation emails
  -> Auto-download PDF receipt
```

---

## Project Structure

```
app/
├── page.js                          # Home page (with SEO metadata)
├── layout.js                        # Root layout (Analytics, Meta Pixel)
├── marathon/
│   ├── page.js                      # Marathon registration
│   └── layout.js                    # SEO metadata
├── marathon-success/
│   └── page.js                      # Post-payment success page
├── donation-success/
│   └── page.js                      # Donation success page
├── route-map/
│   ├── page.js                      # Interactive marathon route map
│   └── layout.js                    # SEO metadata
├── dashboard/
│   └── page.js                      # Admin dashboard
├── donation-policy/
│   ├── page.js
│   └── layout.js                    # SEO metadata
├── privacy-policy/
│   ├── page.js
│   └── layout.js                    # SEO metadata
├── refund-policy/
│   ├── page.js
│   └── layout.js                    # SEO metadata
├── terms-of-service/
│   ├── page.js
│   └── layout.js                    # SEO metadata
├── transparency/
│   ├── page.js
│   └── layout.js                    # SEO metadata
├── registration-details/
│   ├── page.js
│   └── layout.js                    # SEO metadata
├── components/
│   ├── DonationPage.js
│   ├── DonationForm.js
│   ├── Header.js
│   ├── HeaderPolicy.js
│   ├── Footer.js
│   ├── HeroSection.js
│   ├── AboutSection.js
│   ├── ImpactMetrics.js
│   ├── ImpactSection.js
│   ├── MissionAreas.js
│   ├── Gallery.js
│   ├── VolunteerSection.js
│   ├── FloatingDonateButton.js
│   └── PartnersAndHelp.js
├── api/
│   ├── phonepe/
│   ├── marathon/
│   ├── coupon/
│   ├── admin/
│   ├── races/
│   ├── send-email/
│   └── volunteer/
lib/
└── supabase.js
public/
├── sitemap.xml
├── robots.txt
└── galleryimages/
```

---

## Foundation Info

- **Name:** Janya Foundation
- **DARPAN ID:** MH/2025/0529327
- **NGO Registration:** Raigad/0000004/2025
- **Tax Exemption:** 80G & 12A Certified
- **Location:** Ulwe, Navi Mumbai, Maharashtra
- **Phone:** +91 9867275101 / +91 9321496142
- **Email:** janyafoundation.04@gmail.com
- **Website:** https://janyafoundation.in
