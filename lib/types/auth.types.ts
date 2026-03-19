/**
 * Authentication and User Types
 * Based on the API responses provided
 */

export type RatingPreference = 'TMDB' | 'IMDB' | 'ROTTEN_TOMATOES'

export interface User {
  id: string
  name: string
  username: string | null
  email: string
  passwordHash: string
  avatarUrl: string | null
  preferredRating: RatingPreference
  refreshToken: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  username?: string
}

export interface AuthResponse extends AuthTokens {
  user?: User
}

export interface RefreshTokenResponse extends AuthTokens {}

export interface AuthError {
  message: string
  statusCode?: number
  errors?: Record<string, string[]>
}

export interface DecodedToken {
  sub: string // user id
  iat: number // issued at
  exp: number // expiration
}

// Made with Bob
