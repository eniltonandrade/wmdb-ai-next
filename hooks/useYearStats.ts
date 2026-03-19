/**
 * useYearStats Hooks
 * Fetches year statistics from the API
 */

import { useQuery } from "@tanstack/react-query"
import { movieService } from "@/lib/api/movie-service"

export function useWatchedYears() {
  return useQuery({
    queryKey: ["watched-years"],
    queryFn: () => movieService.getWatchedYears(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useReleaseYears() {
  return useQuery({
    queryKey: ["release-years"],
    queryFn: () => movieService.getReleaseYears(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Made with Bob
