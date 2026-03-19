/**
 * User Insights Hook using TanStack Query
 * Provides reactive user statistics and insights
 */

import { useQuery } from "@tanstack/react-query"
import { movieService } from "@/lib/api/movie-service"

const INSIGHTS_QUERY_KEY = ["user", "insights"] as const

/**
 * Hook to fetch user insights and statistics
 * Uses React Query for caching and automatic refetching
 *
 * @returns Query result with insights data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useInsights()
 *
 * if (isLoading) return <Skeleton />
 * if (error) return <Error />
 *
 * console.log(data?.movieCount, data?.averageRating)
 * ```
 */
export function useInsights() {
  return useQuery({
    queryKey: INSIGHTS_QUERY_KEY,
    queryFn: () => movieService.getUserInsights(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}

// Made with Bob
