/**
 * Environment configuration
 * Centralized access to environment variables with type safety
 */

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/",
  authCookieName: process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || "wmdb_auth_token",
  refreshCookieName:
    process.env.NEXT_PUBLIC_REFRESH_COOKIE_NAME || "wmdb_refresh_token",
} as const

export const apiEndpoints = {
  auth: {
    login: "/sessions/password",
    register: "/sessions/register",
    refresh: "/sessions/refresh",
  },
  user: {
    profile: "/me/profile",
    insights: "/me/insights",
  },
  movies: {
    history: "/me/history/movies",
    genres: "/genres",
  },
} as const

// Made with Bob
