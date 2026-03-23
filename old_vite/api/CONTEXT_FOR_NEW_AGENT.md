# Context for New Agent - LocalPlus API Documentation

**Date**: January 2025

## What Was Just Done

✅ **Extracted API Documentation** from React component into standalone markdown file

**Location**: `/Users/admin/Dropbox/Development/localplus-partner/api/API_DOCUMENTATION.md`

## Key Information to Know

### 1. API Documentation Location
- **Standalone Markdown**: `localplus-partner/api/API_DOCUMENTATION.md` (NEW - just created)
- **React Component**: `localplus-partner/src/pages/Structure.tsx` (still exists and functional)
- Both coexist - markdown is for reference, component provides interactive UI

### 2. API Base URLs
- **Production**: `https://api.localplus.city`
- **Local Development**: `http://localhost:9004` (per PORT_ALLOCATION_STANDARD.md)

### 3. Available API Endpoints
1. **Authentication API** (`/api/auth`)
   - POST `/api/auth` - Login
   - GET `/api/auth/me` - Get current user
   - DELETE `/api/auth` - Logout

2. **Bookings API** (`/api/bookings`)
   - GET `/api/bookings` - List bookings
   - POST `/api/bookings` - Create booking
   - PUT `/api/bookings/[id]/confirm` - Confirm booking

3. **Restaurants API** (`/api/restaurants`)
   - GET `/api/restaurants` - List with filters
   - GET `/api/restaurants/search` - Search restaurants

4. **Businesses API** (`/api/businesses`)
   - GET `/api/businesses` - List businesses (admin)

5. **Notifications API** (`/api/notifications`)
   - GET `/api/notifications` - Get preferences
   - POST `/api/notifications` - Update preferences

### 4. Additional Services
- **Billing API Server**: `http://localhost:3007` (see `localplus-admin/billing-api-server/README.md`)

### 5. Project Structure
- **Partner App**: `/Users/admin/Dropbox/Development/localplus-partner/`
- **Admin App**: `/Users/admin/Dropbox/Development/localplus-admin/`
- **Consumer App**: `/Users/admin/Dropbox/Development/localplus-consumer/`

### 6. Important Notes
- The React component in `Structure.tsx` is still functional and used in the Partner app UI
- The markdown file was created as standalone documentation for reference/sharing
- No breaking changes were made - everything still works as before
- API documentation is accessible via Partner app at `/structure` route (API Documentation tab)

## What to Do Next

If working on API-related tasks:
1. Check `api/API_DOCUMENTATION.md` for endpoint details
2. The React component in `Structure.tsx` can be updated if API changes are made
3. Both should be kept in sync if API evolves

## Files Modified/Created
- ✅ Created: `localplus-partner/api/API_DOCUMENTATION.md`
- ✅ No changes to: `localplus-partner/src/pages/Structure.tsx` (still functional)

