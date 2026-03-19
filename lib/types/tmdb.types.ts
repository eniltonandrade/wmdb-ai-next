/**
 * TMDB API Types
 * Type definitions for The Movie Database (TMDB) API responses
 * API Documentation: https://developers.themoviedb.org/3
 */

// Common types
export interface TMDBImage {
  aspect_ratio: number
  height: number
  iso_639_1: string | null
  file_path: string
  vote_average: number
  vote_count: number
  width: number
}

export interface TMDBGenre {
  id: number
  name: string
}

export interface TMDBProductionCompany {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface TMDBProductionCountry {
  iso_3166_1: string
  name: string
}

export interface TMDBSpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

// Movie types
export interface TMDBMovie {
  adult: boolean
  backdrop_path: string | null
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string | null
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export interface TMDBMovieDetails extends TMDBMovie {
  belongs_to_collection: {
    id: number
    name: string
    poster_path: string | null
    backdrop_path: string | null
  } | null
  budget: number
  genres: TMDBGenre[]
  homepage: string | null
  imdb_id: string | null
  production_companies: TMDBProductionCompany[]
  production_countries: TMDBProductionCountry[]
  revenue: number
  runtime: number | null
  spoken_languages: TMDBSpokenLanguage[]
  status: string
  tagline: string | null
}

// Search results
export interface TMDBSearchMoviesResponse {
  page: number
  results: TMDBMovie[]
  total_pages: number
  total_results: number
}

// Credits types
export interface TMDBCast {
  adult: boolean
  gender: number | null
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string | null
  cast_id: number
  character: string
  credit_id: string
  order: number
}

export interface TMDBCrew {
  adult: boolean
  gender: number | null
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string | null
  credit_id: string
  department: string
  job: string
}

export interface TMDBCredits {
  id: number
  cast: TMDBCast[]
  crew: TMDBCrew[]
}

// Person types
export interface TMDBPerson {
  adult: boolean
  gender: number | null
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string | null
  known_for: TMDBMovie[]
}

export interface TMDBPersonDetails extends TMDBPerson {
  also_known_as: string[]
  biography: string
  birthday: string | null
  deathday: string | null
  homepage: string | null
  imdb_id: string | null
  place_of_birth: string | null
}

// Configuration types
export interface TMDBConfiguration {
  images: {
    base_url: string
    secure_base_url: string
    backdrop_sizes: string[]
    logo_sizes: string[]
    poster_sizes: string[]
    profile_sizes: string[]
    still_sizes: string[]
  }
  change_keys: string[]
}

// Image size helpers
export type TMDBImageSize =
  | "w92"
  | "w154"
  | "w185"
  | "w342"
  | "w500"
  | "w780"
  | "original"

export type TMDBBackdropSize = "w300" | "w780" | "w1280" | "original"

export type TMDBProfileSize = "w45" | "w185" | "h632" | "original"

// Helper function types
export interface TMDBImageOptions {
  path: string | null
  size?: TMDBImageSize | TMDBBackdropSize | TMDBProfileSize
}

// Made with Bob
