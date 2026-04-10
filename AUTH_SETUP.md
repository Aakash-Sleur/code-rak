# Auth System Setup

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
INTERNAL_API_URL=http://localhost:3000

# Database
MONGO_URI=your-mongodb-connection-string

# Authentication Secrets (Change these in production!)
JWT_SECRET=your-jwt-secret-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

## Auth Endpoints

### 1. **POST /api/auth/login**
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
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

### 2. **POST /api/auth/register**
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "username": "username",
    "isVerified": false
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

### 3. **POST /api/auth/refresh**
Refresh the access token.

**Request:**
```json
{
  "refreshToken": "refresh-token",
  "userId": "user-id"
}
```

**Response (200):**
```json
{
  "accessToken": "new-jwt-token",
  "refreshToken": "new-refresh-token"
}
```

### 4. **POST /api/auth/logout**
Logout user and invalidate refresh token.

**Request:**
```json
{
  "userId": "user-id"
}
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

## How It Works

### Token Flow

1. **User Registration/Login**
   - User credentials are validated
   - Password is hashed with bcrypt
   - Access Token (JWT) is generated - valid for 1 hour
   - Refresh Token is generated and stored in database (hashed)
   - Both tokens are sent to client

2. **Token Refresh**
   - When access token expires, client calls refresh endpoint
   - Server validates refresh token against database
   - New access and refresh tokens are generated
   - Refresh token in database is updated with new hash and expiry

3. **Logout**
   - Refresh token is deleted from database
   - User is signed out on both client and server

### Security Features

- ✅ Passwords are hashed with bcrypt (salted, 12 rounds)
- ✅ Access tokens are JWT (1 hour expiry)
- ✅ Refresh tokens are stored hashed in database (30 day expiry)
- ✅ HttpOnly cookies for session storage
- ✅ Secure cookie settings in production
- ✅ CSRF protection with NextAuth
- ✅ Input validation on all endpoints

## Files Created/Modified

### New Files:
- `/lib/token.ts` - JWT token generation and verification utilities
- `/app/api/auth/register/route.ts` - User registration endpoint
- `/app/api/auth/refresh/route.ts` - Token refresh endpoint
- `/app/api/auth/logout/route.ts` - Logout endpoint

### Modified Files:
- `/app/api/auth/login/route.ts` - Fixed to return tokens
- `/lib/auth.ts` - Updated API URL handling and token management

## Testing the Auth System

### 1. Register a new user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Refresh Token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your-refresh-token",
    "userId": "your-user-id"
  }'
```

### 4. Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "your-user-id"
  }'
```

## Environment Setup for Production

For production deployment:

1. **Use strong secret keys** - Generate random secure strings for JWT_SECRET and NEXTAUTH_SECRET
   ```bash
   openssl rand -base64 32
   ```

2. **Use HTTPS** - Set `secure: true` in cookie options

3. **Use environment variables** - Never commit secrets to version control

4. **Configure NEXTAUTH_URL** - Set to your production domain

5. **Set INTERNAL_API_URL** - Use internal network URL if available

## Troubleshooting

### "JWT_SECRET is not defined"
- Add `JWT_SECRET` to your `.env.local` file
- Ensure environment variables are loaded correctly

### "NEXTAUTH_SECRET is not defined"
- Add `NEXTAUTH_SECRET` to your `.env.local` file

### "Refresh token expired"
- Refresh tokens are valid for 30 days
- Users need to login again after expiry

### Database Connection Errors
- Verify `MONGO_URI` is correct
- Ensure MongoDB cluster is accessible
- Check network connectivity
