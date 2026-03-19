/**
 * useCompanyInsights Hook
 * Fetches company statistics and distribution from the API
 */

import { useQuery } from "@tanstack/react-query"
import { movieService } from "@/lib/api/movie-service"
import type { CompanyStatsParams } from "@/lib/types/movie.types"

export function useCompanyInsights(params: CompanyStatsParams = {}) {
  return useQuery({
    queryKey: ["company-insights", params],
    queryFn: () => movieService.getCompanyInsights(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Made with Bob
