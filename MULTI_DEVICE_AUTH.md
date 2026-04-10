# Multi-Device Auth System

## Overview

The authentication system now supports **multiple concurrent device sessions** for the same user. Each device maintains its own refresh token, allowing seamless usage across multiple devices without logging out.

## How It Works

### Device Identification

Each device is identified by:
- **Device ID**: SHA-256 hash of User-Agent + Accept-Language headers (or client-side device UUID)
- **Device Name**: Extracted from User-Agent (e.g., "iPhone", "Chrome", "Safari")
- **IP Address**: Client IP address for security audit
- **User Agent**: Full browser/app info for identification

### Token Management per Device

```
User A (logged in on 3 devices)
├── Device 1: MacBook Safari
│   └── Refresh Token 1 (expires 30 days)
├── Device 2: iPhone
│   └── Refresh Token 2 (expires 30 days)
└── Device 3: Android Phone
    └── Refresh Token 3 (expires 30 days)
```

When User A logs in on Device 1:
1. Device ID is generated from the request
2. Any old token for that device is deleted (allows re-login)
3. New refresh token is created and stored with device info
4. User gets access token + refresh token

The same user can stay logged in on all three devices simultaneously.

## API Endpoints

### 1. Login - `POST /api/auth/login`

**How multi-device works:**
- When logging in on a new device, a new refresh token is created
- If logging in again on the same device, the old token is replaced
- Other devices remain unaffected

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": "user-id",
  "username": "username",
  "email": "user@example.com",
  "isVerified": false,
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

### 2. Refresh Token - `POST /api/auth/refresh`

**How multi-device works:**
- Uses the device ID from the current request
- Only refreshes the token for THIS specific device
- Other devices' tokens remain valid

**Request:**
```json
{
  "refreshToken": "refresh-token",
  "userId": "user-id"
}
```

**Response:**
```json
{
  "accessToken": "new-jwt-token",
  "refreshToken": "new-refresh-token"
}
```

### 3. Logout - `POST /api/auth/logout`

**Options:**

**Option A: Logout from current device only (default)**
```json
{
  "userId": "user-id"
}
```
Response: `{ "message": "Logged out successfully" }`

**Option B: Logout from ALL devices**
```json
{
  "userId": "user-id",
  "logoutAllDevices": true
}
```
Response: `{ "message": "Logged out from all devices" }`

### 4. List Active Sessions - `GET /api/auth/sessions?userId=user-id`

Get all active sessions for a user, identifying which is the current device.

**Response:**
```json
{
  "totalSessions": 3,
  "sessions": [
    {
      "id": "session-id",
      "deviceName": "MacBook Safari",
      "deviceId": "abc123...",
      "ipAddress": "192.168.1.1",
      "isCurrent": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "expiresAt": "2024-02-14T10:30:00Z"
    },
    {
      "id": "session-id-2",
      "deviceName": "iPhone",
      "deviceId": "def456...",
      "ipAddress": "203.0.113.45",
      "isCurrent": false,
      "createdAt": "2024-01-14T15:20:00Z",
      "expiresAt": "2024-02-13T15:20:00Z"
    }
  ]
}
```

### 5. Logout from Specific Device - `DELETE /api/auth/sessions`

Revoke a specific device session without logging out from other devices.

**Request:**
```json
{
  "sessionId": "session-id",
  "userId": "user-id"
}
```

**Response:**
```json
{
  "message": "Session deleted successfully"
}
```

## Examples

### Scenario 1: User logs in on Device 1 (Desktop), then Device 2 (Mobile)

**Step 1: Desktop Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)" \
  -d '{"email": "user@example.com", "password": "password123"}'
```
Response: Access token + Refresh token (Device 1)

**Step 2: Mobile Login (same user)**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (iPhone; CPU)" \
  -d '{"email": "user@example.com", "password": "password123"}'
```
Response: New access token + new refresh token (Device 2)

**Result:**
- Both devices stay logged in
- Each has its own refresh token in the database
- Desktop device can independently refresh tokens
- Mobile device can independently refresh tokens
- Logging out on mobile doesn't affect desktop

### Scenario 2: Refresh token expires on Device 2

**Step 1: Check active sessions from Device 1**
```bash
curl http://localhost:3000/api/auth/sessions?userId=user-id \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
```

Response shows both devices, Desktop marked as `"isCurrent": true`

**Step 2: If Device 2's refresh token expires, user just needs to log in again on Device 2**
- Device 1 remains logged in
- Device 2 gets a new token pair
- Other devices unaffected

### Scenario 3: Suspicious activity - Logout from unknown device

**User sees sessions:**
```bash
curl http://localhost:3000/api/auth/sessions?userId=user-id
```

Response shows 3 sessions, one from unknown IP. User wants to revoke it:

```bash
curl -X DELETE http://localhost:3000/api/auth/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "suspicious-session-id",
    "userId": "user-id"
  }'
```

Result: That specific device is logged out, others remain active.

### Scenario 4: User wants to logout everywhere (security concern)

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-id",
    "logoutAllDevices": true
  }'
```

Result: All devices logged out, user must log in on each device again.

## Database Schema Update

The `RefreshToken` model now includes:

```typescript
{
  userId: ObjectId,           // User reference
  token: String,              // Hashed refresh token
  expiresAt: Date,            // Token expiry
  deviceId: String,           // Unique device identifier (indexed)
  deviceName: String,         // Human-readable device name
  ipAddress: String,          // Client IP address
  userAgent: String,          // Browser/app info
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

**Unique Index:** `(userId, deviceId)` - ensures one token per user per device

## Security Considerations

✅ **Device Isolation**: Each device has independent token management
✅ **IP Tracking**: Helps identify suspicious logins
✅ **Device Identification**: Browser fingerprinting prevents token theft between browsers
✅ **Token Rotation**: Refresh tokens are rotated on each refresh
✅ **Secure Storage**: Tokens are bcrypt hashed in database
✅ **Configurable Logout**: Users can logout selectively from devices
✅ **Activity Audit**: User can see all active sessions

## Client-Side Integration

### Option 1: Auto Device ID (Current - Server-side fingerprinting)
Device ID is generated from User-Agent on server side.

**Pros:** Simple, no client code needed
**Cons:** Same device type/browser = same ID (less accurate)

### Option 2: Client-Side Device UUID (Recommended for Production)

Store a persistent device UUID on the client:

```typescript
// Client-side code
function getOrCreateDeviceId() {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = generateUUID();
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
}

// Include in login request
fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({
    email,
    password,
    deviceId: getOrCreateDeviceId() // Send client-side ID
  })
});
```

Then update backend to use client-provided `deviceId` if available, fall back to server-generated if needed.

## File Changes

### New Files
- `lib/device.ts` - Device identification utilities
- `app/api/auth/sessions/route.ts` - Session management endpoints

### Updated Files
- `models/refresh_token.model.ts` - Added device tracking fields
- `app/api/auth/login/route.ts` - Device support in login
- `app/api/auth/refresh/route.ts` - Device-specific token refresh
- `app/api/auth/logout/route.ts` - Single device + all devices logout
- `app/api/auth/register/route.ts` - Device support in registration

## Testing

```bash
# Login on Device 1
curl -X POST http://localhost:3000/api/auth/login \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0)" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Save tokens from response

# Login on Device 2 (same user, different UA)
curl -X POST http://localhost:3000/api/auth/login \
  -H "User-Agent: Mozilla/5.0 (iPhone)" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# List sessions from Device 1
curl 'http://localhost:3000/api/auth/sessions?userId=<user-id>' \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0)"

# Refresh token on Device 2
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "User-Agent: Mozilla/5.0 (iPhone)" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "<device-2-token>", "userId": "<user-id>"}'

# Logout only from Device 1
curl -X POST http://localhost:3000/api/auth/logout \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0)" \
  -H "Content-Type: application/json" \
  -d '{"userId": "<user-id>"}'

# Verify Device 2 still works
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "User-Agent: Mozilla/5.0 (iPhone)" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "<device-2-token>", "userId": "<user-id>"}'
```

## Future Enhancements

- [ ] Push notifications when new device logs in
- [ ] "Trust this device for 30 days" to skip 2FA
- [ ] Real-time session invalidation for specific device
- [ ] Device management UI in user dashboard
- [ ] Geolocation tracking for logins
- [ ] Suspicious activity alerts
