/**
 * OMDb API Types
 * Type definitions for the Open Movie Database (OMDb) API responses
 * API Documentation: https://www.omdbapi.com/
 */

// Common types
export interface OMDbRating {
  Source: string
  Value: string
}

// Movie search result (brief)
export interface OMDbSearchResult {
  Title: string
  Year: string
  imdbID: string
  Type: "movie" | "series" | "episode"
  Poster: string
}

// Search response
export interface OMDbSearchResponse {
  Search: OMDbSearchResult[]
  totalResults: string
  Response: "True" | "False"
  Error?: string
}

// Full movie details
export interface OMDbMovieDetails {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: OMDbRating[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: "movie" | "series" | "episode"
  DVD?: string
  BoxOffice?: string
  Production?: string
  Website?: string
  Response: "True" | "False"
  Error?: string
}

// Episode details (for series)
export interface OMDbEpisode {
  Title: string
  Released: string
  Episode: string
  imdbRating: string
  imdbID: string
}

// Season details
export interface OMDbSeasonDetails {
  Title: string
  Season: string
  totalSeasons: string
  Episodes: OMDbEpisode[]
  Response: "True" | "False"
  Error?: string
}

// Search parameters
export interface OMDbSearchParams {
  s?: string // Search query
  i?: string // IMDb ID
  t?: string // Movie title
  type?: "movie" | "series" | "episode"
  y?: string // Year of release
  plot?: "short" | "full"
  page?: number
}

// Type guard for error responses
export function isOMDbError(
  response: OMDbMovieDetails | OMDbSearchResponse | OMDbSeasonDetails
): boolean {
  return response.Response === "False"
}

// Made with Bob
