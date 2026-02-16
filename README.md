# DGM Analytics Dashboard 📊

**Real-time analytics and ad management control panel for Daily Growth Map**

A unified dashboard for monitoring Facebook Ads performance, email signups from Klaviyo, and launching new ad campaigns with a single click.

---

## 🚀 Features

### READ (Analytics View)
- **Facebook Ads Metrics** (via Meta Marketing API v21.0)
  - Campaign performance (spend, impressions, clicks, CTR, CPC, conversions, ROAS)
  - Ad set breakdown
  - Real-time insights with 7-day/30-day views
  - Campaign status monitoring

- **Klaviyo Email Metrics**
  - New signups (daily/weekly)
  - List growth tracking
  - Recent signups table with source page tracking
  - Form submissions by landing page

- **Landing Page Analytics** (GA4 - Coming Soon)
  - Traffic by page
  - Bounce rates & time on page
  - Conversion rates
  - UTM source tracking

### WRITE (Ad Management)
- **Campaign Launcher** 🚀
  - Create full campaign structures via API
  - Launch campaigns with multiple ad sets in one click
  - Select landing pages and set budgets
  - Automatic ad set creation per landing page

- **Campaign Controls**
  - Pause/resume campaigns instantly
  - Update ad set budgets (coming soon)
  - Monitor campaign status in real-time

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS (DGM brand colors: #0A0A0A, #FDB813)
- **Charts:** Recharts
- **APIs:** Meta Marketing API v21.0, Klaviyo API
- **Deployment:** Vercel

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Meta Ads API credentials (App ID, Secret, Access Token)
- Klaviyo API key

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/domco685/dgm-analytics-dashboard.git
   cd dgm-analytics-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Meta Ads API
   NEXT_PUBLIC_META_APP_ID=your_app_id
   META_APP_SECRET=your_app_secret
   META_ACCESS_TOKEN=your_access_token
   META_AD_ACCOUNT_ID=act_your_account_id

   # Klaviyo API
   KLAVIYO_API_KEY=your_klaviyo_api_key
   KLAVIYO_LIST_ID=your_list_id

   # GA4 (Optional - for landing page analytics)
   GA4_PROPERTY_ID=your_property_id

   # Dashboard Auth (Optional)
   DASHBOARD_PASSWORD=your_secure_password
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

---

## 🎯 Usage Guide

### Overview Page
- View key metrics: total spend, active campaigns, clicks, email signups
- Monitor campaign performance with interactive charts
- Check campaign status at a glance

### Ads Page
- View all campaigns with detailed metrics (spend, impressions, clicks, CTR, CPC)
- Pause/resume campaigns with a single click
- Monitor real-time performance data

### Email Page
- Track email list growth
- View recent signups with source page attribution
- Monitor daily and weekly signup trends

### Landing Pages (Setup Required)
- Track traffic by page (requires GA4 integration)
- View conversion funnels
- Monitor bounce rates and time on page

### Campaign Launcher 🚀
- Create new campaigns with custom objectives
- Select multiple landing pages
- Set daily budget per ad set
- Launch campaigns instantly

**Example:**
1. Enter campaign name: "DGM Q1 2026 Launch"
2. Select objective: "TRAFFIC"
3. Set daily budget: $50 per ad set
4. Select landing pages: burnout-my-story, identity-shift
5. Click "Launch Campaign"
6. ✅ Campaign created with 2 ad sets ($100 total daily budget)

---

## 📡 API Endpoints

### Meta Ads API
- `GET /api/meta/campaigns` - Fetch all campaigns
- `POST /api/meta/campaigns` - Create a new campaign
- `PATCH /api/meta/campaigns/[id]` - Update campaign status
- `GET /api/meta/insights` - Fetch performance insights
- `GET /api/meta/adsets` - Fetch ad sets
- `POST /api/meta/adsets` - Create a new ad set

### Klaviyo API
- `GET /api/klaviyo/metrics` - Fetch email metrics and recent signups

---

## 🔐 Security

- **Environment Variables:** All API credentials stored in `.env.local` (never committed)
- **Token Management:** Long-lived Meta access tokens with secure storage
- **Rate Limiting:** Built-in protection against API abuse
- **Dashboard Auth:** Optional password protection (can be upgraded to Clerk/Auth0)

---

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import project in Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy

3. **Set up custom domain (optional):**
   - Add `analytics.dailygrowthmap.com` or `dashboard.dailygrowthmap.com`
   - Configure DNS records

---

## 🔧 Configuration

### Adding New Landing Pages
Edit `/app/launcher/page.tsx`:
```typescript
const advertorialPages = [
  'burnout-my-story',
  'burnout-case-study',
  'identity-shift',
  'founders-guide',
  'your-new-page', // Add here
];
```

### Customizing Brand Colors
Edit `/tailwind.config.ts`:
```typescript
dgm: {
  black: '#0A0A0A',
  gold: '#FDB813',
  // Add custom colors
}
```

---

## 📊 Analytics Integrations

### Current Integrations
✅ **Meta Ads API** (v21.0) - Fully integrated  
✅ **Klaviyo API** - Fully integrated  
🚧 **Google Analytics 4** - Coming soon (requires Property ID)

### Future Integrations
- Shopify (order tracking)
- Stripe (revenue analytics)
- Google Ads
- TikTok Ads

---

## 🐛 Troubleshooting

### Meta API Errors
- **"Invalid access token":** Token expired - regenerate in Meta Business Suite
- **"Rate limit exceeded":** Wait 1 hour or reduce API call frequency
- **"Permission denied":** Verify app has `ads_management` permission

### Klaviyo API Errors
- **"Invalid API key":** Check API key in Klaviyo account settings
- **"List not found":** Verify `KLAVIYO_LIST_ID` is correct

### Dashboard Not Loading
- Check browser console for errors
- Verify all environment variables are set
- Ensure API credentials are valid
- Check network tab for failed requests

---

## 📝 Changelog

### v1.0.0 (2026-02-15)
- ✅ Initial release
- ✅ Meta Ads integration (campaigns, insights, ad sets)
- ✅ Klaviyo email tracking
- ✅ Campaign launcher
- ✅ Overview dashboard with key metrics
- ✅ Dark theme with DGM brand colors
- ✅ Mobile responsive design

---

## 🤝 Contributing

This is a private project for Daily Growth Map. For feature requests or bug reports, contact Dom.

---

## 📄 License

Proprietary - © 2026 Daily Growth Map. All rights reserved.

---

## 🆘 Support

For questions or issues:
- Email: dom@dailygrowthmap.com
- Documentation: [Link to internal docs]

---

## 🎉 Acknowledgments

Built with ❤️ for Dom and the DGM team.

**Tech Stack:**
- Next.js, React, TypeScript
- Tailwind CSS, Recharts
- Meta Marketing API, Klaviyo API
- Vercel

---

**🚀 Ready to scale your paid traffic? Launch your first campaign now!**
