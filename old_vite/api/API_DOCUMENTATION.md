# LocalPlus API Documentation

**Base URL**: `https://api.localplus.city`

**Local Development**: `http://localhost:9004`

---

## Table of Contents

- [Authentication API](#authentication-api)
- [Bookings API](#bookings-api)
- [Restaurants API](#restaurants-api)
- [Businesses API](#businesses-api)
- [Notifications API](#notifications-api)

---

## Authentication API

**Base URL**: `https://api.localplus.city/api/auth`

### POST /api/auth

User login endpoint.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Example Request:**
```bash
curl -X POST https://api.localplus.city/api/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"partner@restaurant.com","password":"password123"}'
```

**Success Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "email": "partner@restaurant.com",
    "roles": ["partner"]
  },
  "session": {
    "access_token": "jwt-token-here"
  }
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

---

### GET /api/auth/me

Get current authenticated user.

**Headers:**
- `Authorization: Bearer jwt-token`

**Example Request:**
```bash
curl -H "Authorization: Bearer jwt-token" \
  https://api.localplus.city/api/auth/me
```

**Success Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "email": "partner@restaurant.com"
  }
}
```

---

### DELETE /api/auth

User logout endpoint.

**Headers:**
- `Authorization: Bearer jwt-token`

**Success Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Bookings API

**Base URL**: `https://api.localplus.city/api/bookings`

### GET /api/bookings

Get bookings for a business.

**Query Parameters:**
- `businessId` (string, required) - Business ID
- `status` (string, optional) - Filter by booking status
- `limit` (number, default: 50) - Number of results per page
- `offset` (number, default: 0) - Pagination offset

**Example Request:**
```bash
curl "https://api.localplus.city/api/bookings?businessId=550e8400-e29b-41d4-a716-446655440000&status=confirmed"
```

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "booking-123",
      "customer_name": "John Doe",
      "customer_email": "john@example.com",
      "party_size": 4,
      "booking_date": "2024-09-27",
      "booking_time": "19:00",
      "status": "confirmed"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 1
  }
}
```

---

### POST /api/bookings

Create a new booking.

**Request Body:**
```json
{
  "business_id": "string",
  "customer_name": "string",
  "customer_email": "string",
  "party_size": "number",
  "booking_date": "string",
  "booking_time": "string"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": "booking-123",
    "business_id": "550e8400-e29b-41d4-a716-446655440000",
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "party_size": 4,
    "booking_date": "2024-09-27",
    "booking_time": "19:00",
    "status": "pending"
  }
}
```

---

### PUT /api/bookings/[id]/confirm

Confirm a booking.

**Request Body:**
```json
{
  "restaurantId": "string"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": "booking-123",
    "status": "confirmed",
    "confirmed_at": "2024-09-27T10:00:00Z"
  }
}
```

---

## Restaurants API

**Base URL**: `https://api.localplus.city/api/restaurants`

### GET /api/restaurants

Get restaurants with optional filters.

**Query Parameters:**
- `location` (string, optional) - Location filter
- `cuisine` (string, optional) - Cuisine type filter
- `priceRange` (string, optional) - Price range filter
- `rating` (string, optional) - Minimum rating filter
- `limit` (number, default: 20) - Number of results per page
- `offset` (number, default: 0) - Pagination offset

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "restaurant-123",
      "name": "Shannon's Coastal Kitchen",
      "address": "123 Beach Road, Pattaya",
      "cuisine": "Seafood",
      "rating": 4.5,
      "price_range": "$$"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 50
  }
}
```

---

### GET /api/restaurants/search

Search restaurants by query string.

**Query Parameters:**
- `query` (string, required) - Search query
- `location` (string, optional) - Location filter
- `radius` (number, default: 5000) - Search radius in meters
- `limit` (number, default: 20) - Number of results

**Example Request:**
```bash
curl "https://api.localplus.city/api/restaurants/search?query=seafood&location=Pattaya&radius=5000"
```

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "restaurant-123",
      "name": "Shannon's Coastal Kitchen",
      "address": "123 Beach Road, Pattaya",
      "distance": 1200
    }
  ],
  "search": {
    "query": "seafood",
    "location": "Pattaya",
    "radius": 5000
  }
}
```

---

## Businesses API

**Base URL**: `https://api.localplus.city/api/businesses`

### GET /api/businesses

Get businesses for admin users.

**Query Parameters:**
- `status` (string, optional) - Filter by business status
- `limit` (number, default: 50) - Number of results per page
- `offset` (number, default: 0) - Pagination offset

**Headers:**
- `Authorization: Bearer jwt-token` (Admin role required)

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Shannon's Coastal Kitchen",
      "address": "123 Beach Road, Pattaya",
      "status": "active",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 150
  }
}
```

---

## Notifications API

**Base URL**: `https://api.localplus.city/api/notifications`

### GET /api/notifications

Get notification preferences for a business.

**Query Parameters:**
- `businessId` (string, required) - Business ID

**Headers:**
- `Authorization: Bearer jwt-token`

**Success Response:**
```json
{
  "success": true,
  "data": {
    "business_id": "550e8400-e29b-41d4-a716-446655440000",
    "email_enabled": true,
    "sms_enabled": false,
    "confirmation_template": "Your booking at {{business_name}} is confirmed for {{date}} at {{time}}",
    "cancellation_template": "Your booking at {{business_name}} has been cancelled"
  }
}
```

---

### POST /api/notifications

Update notification preferences for a business.

**Request Body:**
```json
{
  "business_id": "string",
  "email_enabled": "boolean",
  "sms_enabled": "boolean",
  "confirmation_template": "string",
  "cancellation_template": "string"
}
```

**Headers:**
- `Authorization: Bearer jwt-token`

**Success Response:**
```json
{
  "success": true,
  "data": {
    "business_id": "550e8400-e29b-41d4-a716-446655440000",
    "email_enabled": true,
    "sms_enabled": true,
    "confirmation_template": "Updated template",
    "cancellation_template": "Updated template",
    "updated_at": "2024-09-27T10:00:00Z"
  }
}
```

---

## Additional Services

### Billing API Server

**Local URL**: `http://localhost:3007`

**Endpoints:**
- `GET /health` - Server health check
- `GET /api/billing/google` - Google Cloud Platform costs
- `GET /api/billing/azure` - Azure Maps costs
- `GET /api/billing/all` - Combined billing data

See `localplus-admin/billing-api-server/README.md` for detailed documentation.

---

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

Tokens are obtained through the `/api/auth` login endpoint.

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

API rate limits may apply. Check response headers for rate limit information:
- `X-RateLimit-Limit` - Maximum requests per window
- `X-RateLimit-Remaining` - Remaining requests in current window
- `X-RateLimit-Reset` - Time when rate limit resets

---

## Support

For API support or questions, contact the development team.

**Last Updated**: 2024-09-26

