# Business Type Menu System

## Overview

The Partner Menu System dynamically displays menus and features based on the partner's business type. This allows different business types (Restaurant, Hotel, Event Organizer, Service Provider) to see only the relevant menus for their operations.

## Architecture

### Database Schema

1. **business_types** - Defines available business types
2. **menu_items** - Defines all available menu items/features
3. **business_type_menus** - Maps which menus each business type should see
4. **businesses.business_type_id** - Links businesses to their type

### Key Components

- `menuService.ts` - Service for fetching menus based on business type
- `Navigation.tsx` - Dynamic navigation component that renders menus based on type
- `business-types-schema.sql` - Database schema and initial data

## Features

### 1. Dynamic Menu Rendering

Menus are automatically loaded based on the partner's business type when they log in.

### 2. Business Type Override

Partners can temporarily switch to view menus for other business types:
- Click "🔄 Switch Type" in the navigation
- Select a different business type
- Menus update immediately
- Override persists in localStorage until cleared

### 3. Extensibility

Adding a new business type:
1. Insert into `business_types` table
2. Create menu mappings in `business_type_menus`
3. No code changes required - system automatically picks up new types

## Initial Business Types

- **Restaurant** (🍽️) - Menu Management, Orders, Table Booking, Promotions, Reviews
- **Hotel** (🏨) - Room Management, Booking Calendar, Services, Reviews
- **Event Organizer** (🎟️) - Events, Venues, Tickets, Reviews, Categories
- **Service Provider** (🔧) - Services, Appointments, Inventory, Reviews

## Usage

### For Partners

1. Log in to the partner app
2. Navigation automatically shows menus for your business type
3. Use "Switch Type" to view other types' menus (if needed)

### For Developers

```typescript
import { menuService } from './services/menuService';

// Get partner's business type
const businessType = await menuService.getPartnerBusinessType();

// Get menus for a specific type
const menus = await menuService.getMenusForBusinessType('restaurant');

// Get all available types
const allTypes = await menuService.getAllBusinessTypes();
```

## Database Setup

Run the SQL schema file:

```sql
-- Execute in Supabase SQL Editor
\i business-types-schema.sql
```

This will:
- Create all necessary tables
- Insert initial business types
- Insert initial menu items
- Create menu mappings
- Set up RLS policies

## Future Enhancements

- [ ] Sub-types/tags for specialization (e.g., Restaurant → Bakery, Fine Dining)
- [ ] Multiple business types per partner
- [ ] Custom menu ordering per partner
- [ ] Menu permissions/role-based access
- [ ] Menu analytics (which menus are used most)

