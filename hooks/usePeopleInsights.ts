/**
 * usePeopleInsights Hook
 * Fetches people statistics and rankings from the API
 */

import { useQuery } from "@tanstack/react-query"
import { movieService } from "@/lib/api/movie-service"
import type { PeopleStatsParams } from "@/lib/types/movie.types"

export function usePeopleInsights(params: PeopleStatsParams = {}) {
  return useQuery({
    queryKey: ["people-insights", params],
    queryFn: () => movieService.getPeopleInsights(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Made with Bob
