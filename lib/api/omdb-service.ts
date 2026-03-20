/**
 * OMDb API Service
 * Service layer for interacting with the Open Movie Database (OMDb) API
 * API Documentation: https://www.omdbapi.com/
 */

import { env } from "@/lib/config/env"
import type {
  OMDbSearchResponse,
  OMDbMovieDetails,
  OMDbSeasonDetails,
  OMDbSearchParams,
  isOMDbError,
} from "@/lib/types/omdb.types"

/**
 * OMDb API Client
 * Handles all requests to the OMDb API with proper authentication
 */
class OMDbService {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = env.omdb.apiUrl
    this.apiKey = env.omdb.apiKey
  }

  /**
   * Make a request to the OMDb API
   */
  private async request<T>(params: OMDbSearchParams): Promise<T> {
    if (!this.apiKey) {
      throw new Error(
        "OMDb API key is not configured. Please set NEXT_PUBLIC_OMDB_API_KEY in your environment variables."
      )
    }

    const url = new URL(this.baseUrl)

    // Add API key
    url.searchParams.append("apikey", this.apiKey)

    // Add all other parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString())
      }
    })

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(
        `OMDb API error: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()

    // Check for API-level errors
    if (data.Response === "False") {
      throw new Error(`OMDb API error: ${data.Error || "Unknown error"}`)
    }

    return data
  }

  /**
   * Search for movies by title
   * @param query - Search query string
   * @param page - Page number (default: 1)
   * @param type - Filter by type (movie, series, episode)
   * @param year - Filter by year
   */
  async searchMovies(
    query: string,
    page = 1,
    type?: "movie" | "series" | "episode",
    year?: string
  ): Promise<OMDbSearchResponse> {
    return this.request<OMDbSearchResponse>({
      s: query,
      page,
      type,
      y: year,
    })
  }

  /**
   * Get movie details by IMDb ID
   * @param imdbId - IMDb ID (e.g., "tt1285016")
   * @param plot - Plot length (short or full)
   */
  async getMovieByImdbId(
    imdbId: string,
    plot: "short" | "full" = "short"
  ): Promise<OMDbMovieDetails> {
    return this.request<OMDbMovieDetails>({
      i: imdbId,
      plot,
    })
  }

  /**
   * Get movie details by title
   * @param title - Movie title
   * @param year - Year of release (optional)
   * @param plot - Plot length (short or full)
   */
  async getMovieByTitle(
    title: string,
    year?: string,
    plot: "short" | "full" = "short"
  ): Promise<OMDbMovieDetails> {
    return this.request<OMDbMovieDetails>({
      t: title,
      y: year,
      plot,
    })
  }

  /**
   * Get season details for a series
   * @param imdbId - IMDb ID of the series
   * @param season - Season number
   */
  async getSeasonDetails(
    imdbId: string,
    season: number
  ): Promise<OMDbSeasonDetails> {
    return this.request<OMDbSeasonDetails>({
      i: imdbId,
      // @ts-expect-error - Season parameter is valid but not in our type
      Season: season.toString(),
    })
  }

  /**
   * Search for movies with full details
   * This is a convenience method that searches and then fetches full details
   * @param query - Search query
   * @param page - Page number
   */
  async searchMoviesWithDetails(
    query: string,
    page = 1
  ): Promise<OMDbMovieDetails[]> {
    const searchResults = await this.searchMovies(query, page, "movie")

    if (!searchResults.Search || searchResults.Search.length === 0) {
      return []
    }

    // Fetch full details for each result
    const detailsPromises = searchResults.Search.map((result) =>
      this.getMovieByImdbId(result.imdbID)
    )

    return Promise.all(detailsPromises)
  }

  /**
   * Get movie poster URL
   * @param posterPath - Poster path from OMDb
   * @returns Poster URL or null if not available
   */
  getPosterUrl(posterPath: string | null | undefined): string | null {
    if (!posterPath || posterPath === "N/A") {
      return null
    }
    return posterPath
  }

  /**
   * Parse genre string into array
   * @param genreString - Comma-separated genre string from OMDb
   */
  parseGenres(genreString: string): string[] {
    if (!genreString || genreString === "N/A") {
      return []
    }
    return genreString.split(",").map((genre) => genre.trim())
  }

  /**
   * Parse actors string into array
   * @param actorsString - Comma-separated actors string from OMDb
   */
  parseActors(actorsString: string): string[] {
    if (!actorsString || actorsString === "N/A") {
      return []
    }
    return actorsString.split(",").map((actor) => actor.trim())
  }

  /**
   * Parse directors string into array
   * @param directorsString - Comma-separated directors string from OMDb
   */
  parseDirectors(directorsString: string): string[] {
    if (!directorsString || directorsString === "N/A") {
      return []
    }
    return directorsString.split(",").map((director) => director.trim())
  }

  /**
   * Parse runtime string to minutes
   * @param runtimeString - Runtime string (e.g., "142 min")
   */
  parseRuntime(runtimeString: string): number | null {
    if (!runtimeString || runtimeString === "N/A") {
      return null
    }
    const match = runtimeString.match(/(\d+)/)
    return match ? parseInt(match[1], 10) : null
  }

  /**
   * Parse IMDb rating to number
   * @param ratingString - Rating string (e.g., "8.5")
   */
  parseRating(ratingString: string): number | null {
    if (!ratingString || ratingString === "N/A") {
      return null
    }
    const rating = parseFloat(ratingString)
    return isNaN(rating) ? null : rating
  }
}

// Export singleton instance
export const omdbService = new OMDbService()

// Made with Bob
