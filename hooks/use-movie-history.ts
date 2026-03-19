/**
 * Movie History Hooks using TanStack Query
 * Provides reactive movie history state with infinite scroll support
 */

import { useInfiniteQuery } from "@tanstack/react-query"
import { movieService } from "@/lib/api/movie-service"
import type { MovieHistoryParams } from "@/lib/types/movie.types"

const MOVIE_HISTORY_QUERY_KEY = ["movies", "history"] as const

/**
 * Hook to get user's movie history with infinite scroll pagination
 *
 * @param filters - Optional filters for the movie history (genre, year, sort, etc.)
 * @returns Infinite query result with movie history data and pagination controls
 *
 * @example
 * ```tsx
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useMovieHistory({
 *   sort_by: 'watched_date.desc',
 *   watched_year: '2024'
 * })
 *
 * // Access all pages
 * const allMovies = data?.pages.flatMap(page => page.results) ?? []
 *
 * // Load more
 * <button onClick={() => fetchNextPage()} disabled={!hasNextPage}>
 *   {isFetchingNextPage ? 'Loading...' : 'Load More'}
 * </button>
 * ```
 */
export function useMovieHistory(
  filters: Omit<MovieHistoryParams, "page"> = {}
) {
  return useInfiniteQuery({
    queryKey: [...MOVIE_HISTORY_QUERY_KEY, filters],
    queryFn: ({ pageParam = 1 }) =>
      movieService.getMovieHistory({
        ...filters,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Calculate if there are more pages
      const totalFetched = allPages.reduce(
        (sum, page) => sum + page.results.length,
        0
      )

      // If we've fetched all items, return undefined (no more pages)
      if (totalFetched >= lastPage.total) {
        return undefined
      }

      // Return next page number
      return allPages.length + 1
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  })
}

/**
 * Helper hook to get flattened movie history results
 * Useful when you just want all movies without dealing with pages
 *
 * @example
 * ```tsx
 * const { movies, total, ...queryState } = useMovieHistoryFlat()
 * ```
 */
export function useMovieHistoryFlat(
  filters: Omit<MovieHistoryParams, "page"> = {}
) {
  const query = useMovieHistory(filters)

  const movies = query.data?.pages.flatMap((page) => page.results) ?? []
  const total = query.data?.pages[0]?.total ?? 0

  return {
    ...query,
    movies,
    total,
  }
}

// Made with Bob
