/**
 * TMDB React Query Hooks
 * Custom hooks for fetching data from The Movie Database (TMDB) API
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { tmdbService } from "@/lib/api/tmdb-service"
import type {
  TMDBSearchMoviesResponse,
  TMDBMovieDetails,
  TMDBCredits,
  TMDBPersonDetails,
  TMDBConfiguration,
} from "@/lib/types/tmdb.types"

// Query keys for caching
export const tmdbKeys = {
  all: ["tmdb"] as const,
  movies: () => [...tmdbKeys.all, "movies"] as const,
  movie: (id: number) => [...tmdbKeys.movies(), id] as const,
  movieCredits: (id: number) => [...tmdbKeys.movie(id), "credits"] as const,
  search: (query: string, page: number) =>
    [...tmdbKeys.movies(), "search", query, page] as const,
  popular: (page: number) => [...tmdbKeys.movies(), "popular", page] as const,
  topRated: (page: number) =>
    [...tmdbKeys.movies(), "top-rated", page] as const,
  nowPlaying: (page: number) =>
    [...tmdbKeys.movies(), "now-playing", page] as const,
  upcoming: (page: number) => [...tmdbKeys.movies(), "upcoming", page] as const,
  person: (id: number) => [...tmdbKeys.all, "person", id] as const,
  configuration: () => [...tmdbKeys.all, "configuration"] as const,
} as const

/**
 * Hook to search for movies
 */
export function useSearchMovies(
  query: string,
  page = 1,
  options?: Omit<
    UseQueryOptions<TMDBSearchMoviesResponse>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: tmdbKeys.search(query, page),
    queryFn: () => tmdbService.searchMovies(query, page),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

/**
 * Hook to get movie details
 */
export function useMovieDetails(
  movieId: number,
  options?: Omit<UseQueryOptions<TMDBMovieDetails>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: tmdbKeys.movie(movieId),
    queryFn: () => tmdbService.getMovieDetails(movieId),
    enabled: movieId > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  })
}

/**
 * Hook to get movie credits (cast and crew)
 */
export function useMovieCredits(
  movieId: number,
  options?: Omit<UseQueryOptions<TMDBCredits>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: tmdbKeys.movieCredits(movieId),
    queryFn: () => tmdbService.getMovieCredits(movieId),
    enabled: movieId > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  })
}

/**
 * Hook to get popular movies
 */
export function usePopularMovies(
  page = 1,
  options?: Omit<
    UseQueryOptions<TMDBSearchMoviesResponse>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: tmdbKeys.popular(page),
    queryFn: () => tmdbService.getPopularMovies(page),
    staleTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  })
}

/**
 * Hook to get top rated movies
 */
export function useTopRatedMovies(
  page = 1,
  options?: Omit<
    UseQueryOptions<TMDBSearchMoviesResponse>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: tmdbKeys.topRated(page),
    queryFn: () => tmdbService.getTopRatedMovies(page),
    staleTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  })
}

/**
 * Hook to get now playing movies
 */
export function useNowPlayingMovies(
  page = 1,
  options?: Omit<
    UseQueryOptions<TMDBSearchMoviesResponse>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: tmdbKeys.nowPlaying(page),
    queryFn: () => tmdbService.getNowPlayingMovies(page),
    staleTime: 60 * 60 * 1000, // 1 hour
    ...options,
  })
}

/**
 * Hook to get upcoming movies
 */
export function useUpcomingMovies(
  page = 1,
  options?: Omit<
    UseQueryOptions<TMDBSearchMoviesResponse>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: tmdbKeys.upcoming(page),
    queryFn: () => tmdbService.getUpcomingMovies(page),
    staleTime: 60 * 60 * 1000, // 1 hour
    ...options,
  })
}

/**
 * Hook to get person details
 */
export function usePersonDetails(
  personId: number,
  options?: Omit<UseQueryOptions<TMDBPersonDetails>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: tmdbKeys.person(personId),
    queryFn: () => tmdbService.getPersonDetails(personId),
    enabled: personId > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  })
}

/**
 * Hook to get TMDB configuration
 */
export function useTMDBConfiguration(
  options?: Omit<UseQueryOptions<TMDBConfiguration>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: tmdbKeys.configuration(),
    queryFn: () => tmdbService.getConfiguration(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    ...options,
  })
}

// Made with Bob
