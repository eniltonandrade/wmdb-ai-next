/**
 * Hook for fetching user's history detail for a specific movie
 */

import { useQuery } from "@tanstack/react-query"
import { movieService } from "@/lib/api/movie-service"
import type { MovieHistoryDetail } from "@/lib/types/movie.types"

/**
 * Fetch user's history detail for a specific movie by TMDB ID
 */
export function useMovieHistoryDetail(tmdbId: number) {
  return useQuery<MovieHistoryDetail>({
    queryKey: ["movie-history-detail", tmdbId],
    queryFn: () => movieService.getMovieHistoryDetail(tmdbId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Made with Bob
