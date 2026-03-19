/**
 * Genre Insights Hook using TanStack Query
 * Provides reactive genre statistics and distribution data
 */

import { useQuery } from "@tanstack/react-query"
import { movieService } from "@/lib/api/movie-service"
import type { GenreStatsParams } from "@/lib/types/movie.types"

const GENRE_INSIGHTS_QUERY_KEY = ["user", "insights", "genres"] as const

/**
 * Hook to fetch user genre statistics and distribution
 * Uses React Query for caching and automatic refetching
 *
 * @param params - Optional parameters for sorting and filtering
 * @returns Query result with genre insights data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useGenreInsights({
 *   sort_by: 'count.desc',
 *   selected_rating: 'IMDB'
 * })
 *
 * if (isLoading) return <Skeleton />
 * if (error) return <Error />
 *
 * const genres = data?.results ?? []
 * ```
 */
export function useGenreInsights(params: GenreStatsParams = {}) {
  return useQuery({
    queryKey: [...GENRE_INSIGHTS_QUERY_KEY, params],
    queryFn: () => movieService.getGenreInsights(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}

// Made with Bob
