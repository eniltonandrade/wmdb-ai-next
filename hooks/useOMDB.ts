/**
 * OMDb React Query Hooks
 * Custom hooks for fetching data from the Open Movie Database (OMDb) API
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { omdbService } from "@/lib/api/omdb-service"
import type {
  OMDbSearchResponse,
  OMDbMovieDetails,
  OMDbSeasonDetails,
} from "@/lib/types/omdb.types"

// Query keys for caching
export const omdbKeys = {
  all: ["omdb"] as const,
  searches: () => [...omdbKeys.all, "searches"] as const,
  search: (query: string, page: number, type?: string, year?: string) =>
    [...omdbKeys.searches(), query, page, type, year] as const,
  movies: () => [...omdbKeys.all, "movies"] as const,
  movieByImdbId: (imdbId: string, plot?: string) =>
    [...omdbKeys.movies(), "imdb", imdbId, plot] as const,
  movieByTitle: (title: string, year?: string, plot?: string) =>
    [...omdbKeys.movies(), "title", title, year, plot] as const,
  searchWithDetails: (query: string, page: number) =>
    [...omdbKeys.searches(), "details", query, page] as const,
  seasons: () => [...omdbKeys.all, "seasons"] as const,
  season: (imdbId: string, season: number) =>
    [...omdbKeys.seasons(), imdbId, season] as const,
} as const

/**
 * Hook to search for movies
 */
export function useOMDbSearch(
  query: string,
  page = 1,
  type?: "movie" | "series" | "episode",
  year?: string,
  options?: Omit<UseQueryOptions<OMDbSearchResponse>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: omdbKeys.search(query, page, type, year),
    queryFn: () => omdbService.searchMovies(query, page, type, year),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

/**
 * Hook to get movie details by IMDb ID
 */
export function useOMDbMovieByImdbId(
  imdbId: string,
  plot: "short" | "full" = "short",
  options?: Omit<UseQueryOptions<OMDbMovieDetails>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: omdbKeys.movieByImdbId(imdbId, plot),
    queryFn: () => omdbService.getMovieByImdbId(imdbId, plot),
    enabled: imdbId.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  })
}

/**
 * Hook to get movie details by title
 */
export function useOMDbMovieByTitle(
  title: string,
  year?: string,
  plot: "short" | "full" = "short",
  options?: Omit<UseQueryOptions<OMDbMovieDetails>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: omdbKeys.movieByTitle(title, year, plot),
    queryFn: () => omdbService.getMovieByTitle(title, year, plot),
    enabled: title.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  })
}

/**
 * Hook to search for movies with full details
 * This fetches search results and then gets full details for each movie
 */
export function useOMDbSearchWithDetails(
  query: string,
  page = 1,
  options?: Omit<UseQueryOptions<OMDbMovieDetails[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: omdbKeys.searchWithDetails(query, page),
    queryFn: () => omdbService.searchMoviesWithDetails(query, page),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

/**
 * Hook to get season details for a series
 */
export function useOMDbSeasonDetails(
  imdbId: string,
  season: number,
  options?: Omit<UseQueryOptions<OMDbSeasonDetails>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: omdbKeys.season(imdbId, season),
    queryFn: () => omdbService.getSeasonDetails(imdbId, season),
    enabled: imdbId.length > 0 && season > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  })
}

/**
 * Helper hook to get OMDb data for a movie using IMDb ID
 * Useful for enriching TMDB data with OMDb ratings and additional info
 */
export function useEnrichedMovieData(
  imdbId?: string,
  options?: Omit<UseQueryOptions<OMDbMovieDetails>, "queryKey" | "queryFn">
) {
  const omdbQuery = useOMDbMovieByImdbId(imdbId || "", "full", {
    enabled: !!imdbId,
    ...options,
  })

  return omdbQuery
}

// Made with Bob
