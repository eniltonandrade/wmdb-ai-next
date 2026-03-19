/**
 * usePeopleRankings Hook
 * Fetches people rankings with score from the API
 */

import { useQuery } from "@tanstack/react-query"
import { movieService } from "@/lib/api/movie-service"
import type { PeopleRankingParams } from "@/lib/types/movie.types"

export function usePeopleRankings(params: PeopleRankingParams = {}) {
  return useQuery({
    queryKey: ["people-rankings", params],
    queryFn: () => movieService.getPeopleRankings(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Made with Bob
