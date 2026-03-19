/**
 * Environment configuration
 * Centralized access to environment variables with type safety
 */

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/",
  authCookieName: process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || "wmdb_auth_token",
  refreshCookieName:
    process.env.NEXT_PUBLIC_REFRESH_COOKIE_NAME || "wmdb_refresh_token",
  tmdb: {
    apiKey: process.env.NEXT_PUBLIC_TMDB_API_KEY || "",
    apiUrl:
      process.env.NEXT_PUBLIC_TMDB_API_URL || "https://api.themoviedb.org/3",
    imageBaseUrl:
      process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL ||
      "https://image.tmdb.org/t/p",
  },
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
    genreInsights: "/me/insights/genres",
    peopleInsights: "/me/insights/people",
    peopleRankings: "/me/insights/people/rankings",
    watchedYears: "/me/insights/watched-years",
    releaseYears: "/me/insights/release-years",
    companyInsights: "/me/insights/companies",
  },
  movies: {
    history: "/me/history/movies",
    genres: "/genres",
  },
} as const

// Made with Bob
