/**
 * Movie Service
 * Handles all movie-related API calls
 */

import { apiClient } from "./client"
import { apiEndpoints } from "@/lib/config/env"
import type {
  MovieHistoryResponse,
  MovieHistoryParams,
} from "@/lib/types/movie.types"

export const movieService = {
  /**
   * Get user's movie history with pagination and filters
   */
  getMovieHistory: async (
    params: MovieHistoryParams = {}
  ): Promise<MovieHistoryResponse> => {
    const response = await apiClient.get<MovieHistoryResponse>(
      apiEndpoints.movies.history,
      { params }
    )
    return response.data
  },
}

// Made with Bob
