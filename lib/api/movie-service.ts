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
  PeopleStatsResponse,
  PeopleStatsParams,
  PeopleRankingResponse,
  PeopleRankingParams,
  YearStatsResponse,
  CompanyStatsResponse,
  CompanyStatsParams,
  MovieHistoryDetail,
  AddMovieToHistoryPayload,
  AddMovieToHistoryResponse,
  PersonInsightsResponse,
  RetrospectiveResponse,
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

  /**
   * Get user people statistics and rankings
   */
  getPeopleInsights: async (
    params: PeopleStatsParams = {}
  ): Promise<PeopleStatsResponse> => {
    const response = await apiClient.get<PeopleStatsResponse>(
      apiEndpoints.user.peopleInsights,
      { params }
    )
    return response.data
  },

  /**
   * Get user people rankings with score
   */
  getPeopleRankings: async (
    params: PeopleRankingParams = {}
  ): Promise<PeopleRankingResponse> => {
    const response = await apiClient.get<PeopleRankingResponse>(
      apiEndpoints.user.peopleRankings,
      { params }
    )
    return response.data
  },

  /**
   * Get movies watched by year statistics
   */
  getWatchedYears: async (): Promise<YearStatsResponse> => {
    const response = await apiClient.get<YearStatsResponse>(
      apiEndpoints.user.watchedYears
    )
    return response.data
  },

  /**
   * Get movies by release year statistics
   */
  getReleaseYears: async (): Promise<YearStatsResponse> => {
    const response = await apiClient.get<YearStatsResponse>(
      apiEndpoints.user.releaseYears
    )
    return response.data
  },

  /**
   * Get company statistics and distribution
   */
  getCompanyInsights: async (
    params: CompanyStatsParams = {}
  ): Promise<CompanyStatsResponse> => {
    const response = await apiClient.get<CompanyStatsResponse>(
      apiEndpoints.user.companyInsights,
      { params }
    )
    return response.data
  },

  /**
   * Get user's history detail for a specific movie by TMDB ID
   */
  getMovieHistoryDetail: async (
    tmdbId: number
  ): Promise<MovieHistoryDetail> => {
    const response = await apiClient.get<MovieHistoryDetail>(
      apiEndpoints.movies.historyDetail(tmdbId)
    )
    return response.data
  },

  /**
   * Add a movie to user's history
   */
  addMovieToHistory: async (
    payload: AddMovieToHistoryPayload
  ): Promise<AddMovieToHistoryResponse> => {
    const response = await apiClient.post<AddMovieToHistoryResponse>(
      apiEndpoints.movies.addToHistory,
      payload
    )
    return response.data
  },

  /**
   * Get user's insights for a specific person by TMDB ID
   */
  getPersonInsights: async (
    tmdbId: number
  ): Promise<PersonInsightsResponse> => {
    const response = await apiClient.get<PersonInsightsResponse>(
      apiEndpoints.people.insights(tmdbId)
    )
    return response.data
  },

  /**
   * Get user's retrospective data for a specific year
   */
  getRetrospective: async (year: number): Promise<RetrospectiveResponse> => {
    const response = await apiClient.get<RetrospectiveResponse>(
      apiEndpoints.user.retrospective(year)
    )
    return response.data
  },
}

// Made with Bob
