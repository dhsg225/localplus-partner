# Fix partners.localplus.city Domain Configuration

## Problem
`partners.localplus.city` shows "Invalid Configuration" in Vercel because the DNS record is missing in Cloudflare.

## Solution: Add CNAME Record in Cloudflare

### Step 1: Get the Full Vercel DNS Value
1. Go to Vercel Dashboard → `localplus-partner-app` project
2. Go to **Settings** → **Domains**
3. Click on `partners.localplus.city`
4. Copy the **full** CNAME value (it's truncated in the UI, click the copy icon to get the full value)
   - It should look like: `b23efa022bed0092.vercel-dns-017.c...` (but full length)

### Step 2: Add CNAME Record in Cloudflare
1. Go to Cloudflare Dashboard → `localplus.city` domain
2. Navigate to **DNS** → **Records**
3. Click **"Add record"**
4. Configure:
   - **Type**: `CNAME`
   - **Name**: `partners`
   - **Target**: `b23efa022bed0092.vercel-dns-017.c...` (paste the FULL value from Vercel)
   - **Proxy status**: **ON** (orange cloud) ⚠️ **IMPORTANT** - This enables SSL
   - **TTL**: Auto
5. Click **"Save"**

### Step 3: Verify in Vercel
1. Go back to Vercel Dashboard → Domains
2. Click **"Refresh"** button next to `partners.localplus.city`
3. Wait 1-5 minutes for DNS propagation
4. Status should change from "Invalid Configuration" to "Valid Configuration"

### Step 4: Test
```bash
# Test DNS resolution
dig partners.localplus.city +short
# Should return Cloudflare IPs (not Vercel directly)

# Test the site
curl -I https://partners.localplus.city
# Should return 200 OK

# Test a route (should not 404)
curl -I https://partners.localplus.city/events
# Should return 200 OK (thanks to vercel.json rewrites)
```

## Expected Result
- ✅ DNS record exists in Cloudflare
- ✅ Proxy status is ON (orange cloud)
- ✅ Vercel shows "Valid Configuration"
- ✅ SSL certificate automatically provisioned by Cloudflare
- ✅ Site accessible at https://partners.localplus.city
- ✅ React Router routes work (thanks to vercel.json rewrites)

## Notes
- **Proxy must be ON**: This is critical for SSL to work
- **DNS Propagation**: Usually 1-5 minutes with Cloudflare
- **SSL**: Cloudflare automatically provisions SSL certificate
- **Routing**: The `vercel.json` rewrites ensure all routes work with React Router

