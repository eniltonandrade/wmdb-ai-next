/**
 * Movie and History Types
 * Based on the API responses and query parameters
 */

export type RatingSource = "TMDB" | "IMDB" | "ROTTEN_TOMATOES" | "METACRITIC"

export interface Genre {
  id: string
  name: string
  tmdbId: number
}

export interface GenreResponse {
  total: number
  results: Genre[]
}

export type SortByOption =
  | "release_date.asc"
  | "release_date.desc"
  | "watched_date.asc"
  | "watched_date.desc"
  | "rating_imdb.asc"
  | "rating_imdb.desc"
  | "rating_tmdb.asc"
  | "rating_tmdb.desc"
  | "rating_metacritic.asc"
  | "rating_metacritic.desc"
  | "rating_rotten.asc"
  | "rating_rotten.desc"
  | "rating_user.asc"
  | "rating_user.desc"
  | "average_rating.desc"
  | "average_rating.asc"

export interface MovieRating {
  ratingSource: RatingSource
  value: number
}

export interface Movie {
  id: string
  title: string
  originalTitle: string
  posterPath: string | null
  backdropPath: string | null
  releaseDate: string
  runtime: number
  imdbId: string | null
  tmdbId: number
  createdAt: string
  updatedAt: string
  averageRating: number
  ratings: MovieRating[]
}

export interface MovieHistoryItem {
  id: string
  date: string
  rating: number | null
  review: string | null
  releaseDate: string
  value: number
  movie: Movie
}

export interface MovieHistoryResponse {
  total: number
  results: MovieHistoryItem[]
}

export interface MovieHistoryParams {
  page?: number
  genre_id?: string
  person_id?: string
  company_id?: string
  tag_id?: string
  release_year?: string
  watched_year?: string
  query?: string
  sort_by?: SortByOption
}

export interface ActivityByDayOfWeek {
  weekday: number // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  count: number
}

export interface UserInsights {
  averageRating: number
  movieCount: number
  totalRuntime: number // in minutes
  activityByDayOfWeek: ActivityByDayOfWeek[]
}

// Made with Bob
