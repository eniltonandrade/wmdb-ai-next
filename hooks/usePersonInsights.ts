/**
 * Hook for fetching user's insights for a specific person
 */

import { useQuery } from "@tanstack/react-query"
import { movieService } from "@/lib/api/movie-service"
import type { PersonInsightsResponse } from "@/lib/types/movie.types"

/**
 * Fetch user's insights for a specific person by TMDB ID
 */
export function usePersonInsights(tmdbId: number) {
  return useQuery<PersonInsightsResponse>({
    queryKey: ["person-insights", tmdbId],
    queryFn: () => movieService.getPersonInsights(tmdbId),
    enabled: tmdbId > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Made with Bob
