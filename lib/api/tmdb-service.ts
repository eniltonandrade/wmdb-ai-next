/**
 * TMDB API Service
 * Service layer for interacting with The Movie Database (TMDB) API
 */

import { env } from "@/lib/config/env"
import type {
  TMDBMovieDetails,
  TMDBSearchMoviesResponse,
  TMDBCredits,
  TMDBPersonDetails,
  TMDBConfiguration,
  TMDBImageOptions,
  TMDBImageSize,
  TMDBBackdropSize,
  TMDBProfileSize,
} from "@/lib/types/tmdb.types"

/**
 * TMDB API Client
 * Handles all requests to the TMDB API with proper authentication
 */
class TMDBService {
  private baseUrl: string
  private apiKey: string
  private imageBaseUrl: string

  constructor() {
    this.baseUrl = env.tmdb.apiUrl
    this.apiKey = env.tmdb.apiKey
    this.imageBaseUrl = env.tmdb.imageBaseUrl
  }

  /**
   * Make a request to the TMDB API
   */
  private async request<T>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<T> {
    if (!this.apiKey) {
      throw new Error(
        "TMDB API key is not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in your environment variables."
      )
    }

    const url = new URL(`${this.baseUrl}${endpoint}`)
    url.searchParams.append("api_key", this.apiKey)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(
        `TMDB API error: ${response.status} ${response.statusText}`
      )
    }

    return response.json()
  }

  /**
   * Search for movies by title
   */
  async searchMovies(
    query: string,
    page = 1
  ): Promise<TMDBSearchMoviesResponse> {
    return this.request<TMDBSearchMoviesResponse>("/search/movie", {
      query,
      page: page.toString(),
      include_adult: "false",
    })
  }

  /**
   * Get movie details by ID
   */
  async getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
    return this.request<TMDBMovieDetails>(`/movie/${movieId}`)
  }

  /**
   * Get movie credits (cast and crew)
   */
  async getMovieCredits(movieId: number): Promise<TMDBCredits> {
    return this.request<TMDBCredits>(`/movie/${movieId}/credits`)
  }

  /**
   * Get popular movies
   */
  async getPopularMovies(page = 1): Promise<TMDBSearchMoviesResponse> {
    return this.request<TMDBSearchMoviesResponse>("/movie/popular", {
      page: page.toString(),
    })
  }

  /**
   * Get top rated movies
   */
  async getTopRatedMovies(page = 1): Promise<TMDBSearchMoviesResponse> {
    return this.request<TMDBSearchMoviesResponse>("/movie/top_rated", {
      page: page.toString(),
    })
  }

  /**
   * Get now playing movies
   */
  async getNowPlayingMovies(page = 1): Promise<TMDBSearchMoviesResponse> {
    return this.request<TMDBSearchMoviesResponse>("/movie/now_playing", {
      page: page.toString(),
    })
  }

  /**
   * Get upcoming movies
   */
  async getUpcomingMovies(page = 1): Promise<TMDBSearchMoviesResponse> {
    return this.request<TMDBSearchMoviesResponse>("/movie/upcoming", {
      page: page.toString(),
    })
  }

  /**
   * Get person details by ID
   */
  async getPersonDetails(personId: number): Promise<TMDBPersonDetails> {
    return this.request<TMDBPersonDetails>(`/person/${personId}`)
  }

  /**
   * Get TMDB configuration (includes image sizes and base URLs)
   */
  async getConfiguration(): Promise<TMDBConfiguration> {
    return this.request<TMDBConfiguration>("/configuration")
  }

  /**
   * Get full image URL from TMDB path
   * @param options - Image path and optional size
   * @returns Full image URL or null if path is null
   */
  getImageUrl(options: TMDBImageOptions): string | null {
    const { path, size = "original" } = options

    if (!path) {
      return null
    }

    return `${this.imageBaseUrl}/${size}${path}`
  }

  /**
   * Get poster URL with specific size
   */
  getPosterUrl(
    path: string | null,
    size: TMDBImageSize = "w500"
  ): string | null {
    return this.getImageUrl({ path, size })
  }

  /**
   * Get backdrop URL with specific size
   */
  getBackdropUrl(
    path: string | null,
    size: TMDBBackdropSize = "w1280"
  ): string | null {
    return this.getImageUrl({ path, size })
  }

  /**
   * Get profile image URL with specific size
   */
  getProfileUrl(
    path: string | null,
    size: TMDBProfileSize = "w185"
  ): string | null {
    return this.getImageUrl({ path, size })
  }
}

// Export singleton instance
export const tmdbService = new TMDBService()

// Made with Bob
