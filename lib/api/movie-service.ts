/**
 * Movie Service
 * Handles all movie-related API calls
 */

import { apiClient } from "./client"
import { apiEndpoints } from "@/lib/config/env"
import type {
  MovieHistoryResponse,
  MovieHistoryParams,
  GenreResponse,
  UserInsights,
  GenreStatsResponse,
  GenreStatsParams,
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

  /**
   * Get all available genres
   */
  getGenres: async (): Promise<GenreResponse> => {
    const response = await apiClient.get<GenreResponse>(
      apiEndpoints.movies.genres
    )
    return response.data
  },

  /**
   * Get user insights and statistics
   */
  getUserInsights: async (): Promise<UserInsights> => {
    const response = await apiClient.get<UserInsights>(
      apiEndpoints.user.insights
    )
    return response.data
  },

  /**
   * Get user genre statistics and distribution
   */
  getGenreInsights: async (
    params: GenreStatsParams = {}
  ): Promise<GenreStatsResponse> => {
    const response = await apiClient.get<GenreStatsResponse>(
      apiEndpoints.user.genreInsights,
      { params }
    )
    return response.data
  },
}

// Made with Bob
