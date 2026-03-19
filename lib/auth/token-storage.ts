/**
 * Token Storage Utilities
 * Handles secure storage and retrieval of authentication tokens
 * Uses cookies for better security and SSR support
 */

import Cookies from 'js-cookie'
import { env } from '@/lib/config/env'

const TOKEN_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

export const tokenStorage = {
  /**
   * Store access token
   */
  setAccessToken: (token: string): void => {
    Cookies.set(env.authCookieName, token, {
      expires: TOKEN_MAX_AGE / (60 * 60 * 24), // Convert to days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })
  },

  /**
   * Get access token
   */
  getAccessToken: (): string | undefined => {
    return Cookies.get(env.authCookieName)
  },

  /**
   * Store refresh token
   */
  setRefreshToken: (token: string): void => {
    Cookies.set(env.refreshCookieName, token, {
      expires: REFRESH_TOKEN_MAX_AGE / (60 * 60 * 24), // Convert to days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })
  },

  /**
   * Get refresh token
   */
  getRefreshToken: (): string | undefined => {
    return Cookies.get(env.refreshCookieName)
  },

  /**
   * Store both tokens
   */
  setTokens: (accessToken: string, refreshToken: string): void => {
    tokenStorage.setAccessToken(accessToken)
    tokenStorage.setRefreshToken(refreshToken)
  },

  /**
   * Clear all tokens (logout)
   */
  clearTokens: (): void => {
    Cookies.remove(env.authCookieName, { path: '/' })
    Cookies.remove(env.refreshCookieName, { path: '/' })
  },

  /**
   * Check if user has valid tokens
   */
  hasTokens: (): boolean => {
    return !!(tokenStorage.getAccessToken() && tokenStorage.getRefreshToken())
  },
}

// Made with Bob
