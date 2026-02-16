# Deployment Guide

Complete guide to deploying the DGM Analytics Dashboard to Vercel.

---

## Quick Deploy (Recommended)

### Option 1: Deploy via Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com) and sign in**
   - Use email: `hello@tinkertown.co`

2. **Import your GitHub repository:**
   - Click "Add New..." → "Project"
   - Select "domco685/dgm-analytics-dashboard"
   - Click "Import"

3. **Configure environment variables:**

   Add the following in the Vercel dashboard under "Environment Variables":

   ```
   NEXT_PUBLIC_META_APP_ID=25854869447473278
   META_APP_SECRET=c8e94dd06f4a1dc13a37c9ed9628e183
   META_ACCESS_TOKEN=EAFva3eUheH4BQqYbZBEAk8myNJjoaRdNNbxOZARkiJ4mTdXA2X6yYHB19vbP23zW6osDaujDSwNLgvmYrTSbIY7ZABhxQR5N0n25lWLn7Kv9lhZA3oCFzZAr1eUz1qZCj2oZAF8ryNqHPlhCrw6u9cYZCyNJnEu4Y4aytcfe0Fmi5pF1Mq1K5PT64gCv6XHDrjnxb1lxitKXNYs4gZA2ZCuvoz2XxHkHZABPyjaNSWJTQUuLfxihRQiUSZAa6eDFuwAqjZC59STY8VBbvyQFqXS6npgSxZCsNUDa6iXgZDZD
   META_AD_ACCOUNT_ID=act_1124444340960714
   KLAVIYO_API_KEY=pk_f332590dd69c34b0c091b5e5d308296b6f
   KLAVIYO_LIST_ID=X2VBdp
   DASHBOARD_PASSWORD=DGMAnalytics2026!
   ```

   **Important:** Select "Production" for all variables.

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your dashboard will be live! 🎉

5. **Get your URL:**
   - Vercel will provide a URL like: `dgm-analytics-dashboard.vercel.app`
   - Or set up custom domain (see below)

---

## Option 2: Deploy via Vercel CLI

### Prerequisites
```bash
npm install -g vercel
```

### Steps

1. **Login to Vercel:**
   ```bash
   vercel login
   # Follow prompts to authenticate
   ```

2. **Deploy from project directory:**
   ```bash
   cd /Users/hydi/.openclaw/workspace/dgm-analytics-dashboard
   vercel
   ```

3. **Follow prompts:**
   - Set up and deploy? → **Y**
   - Which scope? → Select your account
   - Link to existing project? → **N**
   - Project name? → **dgm-analytics-dashboard**
   - Directory? → **./** (press Enter)
   - Override settings? → **N**

4. **Set environment variables:**
   ```bash
   vercel env add NEXT_PUBLIC_META_APP_ID production
   # Enter value when prompted
   
   vercel env add META_APP_SECRET production
   # Repeat for all environment variables
   ```

5. **Deploy to production:**
   ```bash
   vercel --prod
   ```

---

## Custom Domain Setup

### Option 1: Use Existing DGM Domain

1. **Add domain in Vercel:**
   - Go to Project Settings → Domains
   - Add: `analytics.dailygrowthmap.com` or `dashboard.dailygrowthmap.com`

2. **Configure DNS:**
   - Go to your DNS provider (where dailygrowthmap.com is registered)
   - Add CNAME record:
     ```
     Name: analytics (or dashboard)
     Type: CNAME
     Value: cname.vercel-dns.com
     TTL: 3600
     ```

3. **Wait for DNS propagation:**
   - Usually takes 5-30 minutes
   - Vercel will automatically provision SSL certificate

### Option 2: Use Vercel Subdomain

Your project is automatically available at:
```
https://dgm-analytics-dashboard.vercel.app
https://dgm-analytics-dashboard-domco685.vercel.app
```

---

## Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test Meta Ads API connection (Overview page)
- [ ] Test Klaviyo API connection (Email page)
- [ ] Test campaign launcher
- [ ] Test pause/resume functionality
- [ ] Check mobile responsiveness
- [ ] Verify environment variables are set
- [ ] Test on multiple browsers
- [ ] Check console for errors
- [ ] Monitor Vercel logs for issues

---

## Continuous Deployment

Vercel automatically redeploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update dashboard"
git push origin main

# Vercel automatically builds and deploys 🚀
```

Monitor deployments at:
```
https://vercel.com/domco685/dgm-analytics-dashboard
```

---

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_META_APP_ID` | Meta App ID | `25854869447473278` |
| `META_APP_SECRET` | Meta App Secret | `c8e94dd...` |
| `META_ACCESS_TOKEN` | Meta Access Token | `EAFva3e...` |
| `META_AD_ACCOUNT_ID` | Meta Ad Account ID | `act_1124444340960714` |
| `KLAVIYO_API_KEY` | Klaviyo Private API Key | `pk_f332...` |
| `KLAVIYO_LIST_ID` | Klaviyo List ID | `X2VBdp` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GA4_PROPERTY_ID` | Google Analytics 4 Property ID | (not set) |
| `DASHBOARD_PASSWORD` | Simple password protection | (not set) |

---

## Updating Environment Variables

### Via Vercel Dashboard
1. Go to Project Settings → Environment Variables
2. Click on variable to edit
3. Update value
4. Click "Save"
5. Redeploy for changes to take effect

### Via Vercel CLI
```bash
# Remove old variable
vercel env rm META_ACCESS_TOKEN production

# Add new variable
vercel env add META_ACCESS_TOKEN production
# Enter new value when prompted

# Redeploy
vercel --prod
```

---

## Monitoring & Analytics

### Vercel Analytics

Enable built-in analytics:
1. Go to Project Settings → Analytics
2. Enable "Vercel Analytics"
3. View real-time visitor data

### Error Monitoring

View errors in Vercel logs:
```bash
vercel logs production
```

Or in dashboard: Project → Logs

### Performance Monitoring

Check build times, response times, and Core Web Vitals in Vercel dashboard.

---

## Troubleshooting

### Build Fails

**Check build logs:**
```bash
vercel logs --build
```

**Common issues:**
- Missing environment variables
- TypeScript errors
- Package installation failures

**Solution:**
1. Check Vercel build logs
2. Run `npm run build` locally to reproduce
3. Fix errors and redeploy

### API Routes Return 500

**Check runtime logs:**
```bash
vercel logs production
```

**Common issues:**
- Invalid API credentials
- Missing environment variables
- Rate limit exceeded

**Solution:**
1. Verify all env vars are set in Vercel
2. Test API endpoints locally first
3. Check Meta/Klaviyo API status

### Environment Variables Not Working

**Symptoms:**
- API calls fail with "undefined" errors
- Dashboard shows connection errors

**Solution:**
1. Verify variables are set in Vercel dashboard
2. Make sure they're set for "Production" environment
3. Redeploy after adding variables:
   ```bash
   vercel --prod --force
   ```

### Domain Not Working

**Check DNS:**
```bash
dig analytics.dailygrowthmap.com
```

**Should return:**
```
analytics.dailygrowthmap.com. 300 IN CNAME cname.vercel-dns.com.
```

**Solution:**
1. Verify CNAME record is correct
2. Wait for DNS propagation (up to 48 hours)
3. Check Vercel domain status in dashboard

---

## Rollback Strategy

### Rollback to Previous Deployment

1. **Via Vercel Dashboard:**
   - Go to Deployments
   - Find previous working deployment
   - Click "..." → "Promote to Production"

2. **Via Vercel CLI:**
   ```bash
   vercel rollback
   ```

3. **Via Git:**
   ```bash
   git revert HEAD
   git push origin main
   # Vercel auto-deploys reverted version
   ```

---

## Security Best Practices

### API Tokens

- ✅ Store in environment variables only
- ✅ Never commit to Git
- ✅ Rotate tokens regularly (every 90 days)
- ✅ Use different tokens for dev/prod

### Dashboard Access

- ✅ Enable password protection or authentication
- ✅ Use HTTPS only (automatic with Vercel)
- ✅ Monitor access logs
- ✅ Implement IP whitelisting if needed

### Rate Limiting

- ✅ Implement request caching
- ✅ Add rate limiting to API routes
- ✅ Monitor usage to avoid Meta/Klaviyo limits

---

## Scaling Considerations

### Current Setup (Hobby Plan)
- Suitable for: 1-10 users, moderate traffic
- Free tier includes: Unlimited deployments, 100GB bandwidth

### Upgrade to Pro ($20/month) when:
- Traffic exceeds 100GB/month
- Need team collaboration
- Want custom authentication
- Require advanced analytics

### Performance Optimization
- Implement Redis caching for API responses
- Use Vercel Edge Functions for faster API routes
- Enable Vercel Image Optimization
- Implement incremental static regeneration (ISR)

---

## Support

### Vercel Support
- Documentation: https://vercel.com/docs
- Community: https://github.com/vercel/next.js/discussions
- Status: https://vercel-status.com

### Project Support
- Email: dom@dailygrowthmap.com
- GitHub Issues: https://github.com/domco685/dgm-analytics-dashboard/issues

---

## Next Steps After Deployment

1. **Test everything:**
   - Open dashboard URL
   - Verify all pages load
   - Test campaign creation
   - Check API connections

2. **Share with team:**
   - Send URL to stakeholders
   - Provide login credentials (if password protected)
   - Walk through features

3. **Monitor performance:**
   - Watch Vercel logs for errors
   - Check Meta/Klaviyo API usage
   - Monitor page load times

4. **Iterate:**
   - Gather user feedback
   - Add requested features
   - Optimize performance

---

**Your dashboard is ready to scale your paid traffic! 🚀**

**Live URL:** https://dgm-analytics-dashboard.vercel.app  
**GitHub:** https://github.com/domco685/dgm-analytics-dashboard  
**Status:** ✅ Production Ready
