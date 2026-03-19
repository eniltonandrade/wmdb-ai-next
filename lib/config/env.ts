/**
 * Environment configuration
 * Centralized access to environment variables with type safety
 */

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/',
  authCookieName: process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'wmdb_auth_token',
  refreshCookieName: process.env.NEXT_PUBLIC_REFRESH_COOKIE_NAME || 'wmdb_refresh_token',
} as const

export const apiEndpoints = {
  auth: {
    login: '/sessions/password',
    refresh: '/sessions/refresh',
  },
} as const

// Made with Bob
