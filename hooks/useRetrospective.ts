/**
 * Retrospective Hook using TanStack Query
 * Provides reactive retrospective data for a specific year
 */

import { useQuery } from "@tanstack/react-query"
import { movieService } from "@/lib/api/movie-service"

/**
 * Hook to fetch retrospective data for a specific year
 * Uses React Query for caching and automatic refetching
 *
 * @param year - The year to fetch retrospective data for
 * @returns Query result with retrospective data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useRetrospective(2024)
 *
 * if (isLoading) return <Skeleton />
 * if (error) return <Error />
 *
 * console.log(data?.movieData.totalWatched)
 * ```
 */
export function useRetrospective(year: number) {
  return useQuery({
    queryKey: ["retrospective", year] as const,
    queryFn: () => movieService.getRetrospective(year),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: year > 0, // Only fetch if year is valid
  })
}

// Made with Bob
