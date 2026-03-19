/**
 * Genres Hook using TanStack Query
 * Provides reactive genres state with caching
 */

import { useQuery } from "@tanstack/react-query"
import { movieService } from "@/lib/api/movie-service"

const GENRES_QUERY_KEY = ["genres"] as const

/**
 * Hook to fetch all available genres
 * Uses React Query for caching and automatic refetching
 *
 * @returns Query result with genres data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useGenres()
 *
 * if (isLoading) return <Skeleton />
 * if (error) return <Error />
 *
 * const genres = data?.results ?? []
 * ```
 */
export function useGenres() {
  return useQuery({
    queryKey: GENRES_QUERY_KEY,
    queryFn: () => movieService.getGenres(),
    staleTime: 30 * 60 * 1000, // 30 minutes (genres rarely change)
    retry: 1,
  })
}

// Made with Bob
