/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { apiClient } from "./client"
import { apiEndpoints } from "@/lib/config/env"
import { tokenStorage } from "@/lib/auth/token-storage"
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthTokens,
  User,
} from "@/lib/types"

export const authService = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
    const response = await apiClient.post<AuthTokens>(
      apiEndpoints.auth.login,
      credentials
    )

    const { access_token, refresh_token } = response.data

    // Store tokens
    tokenStorage.setTokens(access_token, refresh_token)

    return response.data
  },

  /**
   * Register a new user
   */
  register: async (credentials: RegisterCredentials): Promise<User> => {
    const response = await apiClient.post<User>(
      apiEndpoints.auth.register,
      credentials
    )
    return response.data
  },

  /**
   * Refresh access token
   */
  refresh: async (): Promise<AuthTokens> => {
    const refreshToken = tokenStorage.getRefreshToken()

    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    const response = await apiClient.post<AuthTokens>(
      apiEndpoints.auth.refresh,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    )

    const { access_token, refresh_token } = response.data

    // Store new tokens
    tokenStorage.setTokens(access_token, refresh_token)

    return response.data
  },

  /**
   * Logout - clear tokens
   */
  logout: (): void => {
    tokenStorage.clearTokens()
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return tokenStorage.hasTokens()
  },

  /**
   * Get current user from token
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const token = tokenStorage.getAccessToken()

      if (!token) {
        return null
      }
      // Fetch user data
      const response = await apiClient.get<User>(apiEndpoints.user.profile)
      return response.data
    } catch (error) {
      console.error("Failed to get current user:", error)
      return null
    }
  },
}

// Made with Bob
