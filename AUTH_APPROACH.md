# Authentication Strategy

## Chosen Approach: JWT + MongoDB (with Refresh Tokens)

After evaluating the options, we've standardized on using JWT tokens with MongoDB for authentication with the following architecture:

### Authentication Flow

1. **Registration & Login**:
   - Users register/login via backend REST API endpoints
   - Backend validates credentials and returns:
     - Short-lived access token (JWT)
     - HTTP-only cookie containing refresh token
     - User data and token expiration information

2. **Token Storage**:
   - Access token: Stored in memory (React context) - NOT in localStorage
   - Refresh token: Stored as HTTP-only cookie (not accessible via JavaScript)

3. **Token Lifecycle**:
   - Access tokens expire after a short period (1 hour by default)
   - When access token expires, frontend automatically uses refresh token to get a new access token
   - Refresh tokens have longer expiry (7 days by default)
   - Refresh tokens are tracked in database to allow revocation

4. **Security Features**:
   - CSRF protection for all sensitive endpoints
   - Rate limiting on login/registration endpoints
   - HTTP-only cookies for refresh tokens
   - Token rotation (new refresh token issued when used)
   - IP and user agent tracking for refresh tokens
   - Ability to revoke all user sessions

### Why Not Supabase?

While Supabase provides a convenient auth solution, we've chosen to standardize on our own JWT+MongoDB implementation for the following reasons:

1. **Control**: Full control over the auth flow and token management
2. **Integration**: Seamless integration with our existing MongoDB database
3. **Customization**: Ability to customize token claims, expiry times, and validation logic
4. **Security**: Implementation of security best practices specific to our application
5. **Unified Data**: User data remains in the same database as other application data

### Supabase Integration

We maintain the Supabase client integration for other features such as:
- Storage (file uploads)
- Real-time subscriptions (if needed)
- Edge functions (if needed)

The Supabase client is configured to be optional in development environments, allowing developers to work without requiring Supabase credentials if not using these features.

### Implementation Location

The authentication logic is implemented in:

1. **Backend**:
   - `src/models/User.js` - User model with password hashing
   - `src/models/RefreshToken.js` - Refresh token model
   - `src/controllers/authController.js` - Auth logic
   - `src/middleware/auth.js` - Token validation middleware
   - `src/middleware/csrf.js` - CSRF protection
   - `src/middleware/rateLimiter.js` - Rate limiting

2. **Frontend**:
   - `src/context/AuthContext.tsx` - Auth state management
   - `src/hooks/use-auth.ts` - Auth hooks
   - `src/lib/api.ts` - API client with token handling