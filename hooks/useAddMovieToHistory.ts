/**
 * Add Movie to History Hook using TanStack Query
 * Provides mutation for adding a movie to user's history
 */

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { movieService } from "@/lib/api/movie-service"
import type { AddMovieToHistoryPayload } from "@/lib/types/movie.types"

/**
 * Hook to add a movie to user's history
 * Invalidates movie history queries on success
 *
 * @returns Mutation result with mutate function and state
 *
 * @example
 * ```tsx
 * const { mutate, isPending, isError } = useAddMovieToHistory()
 *
 * const handleAddMovie = () => {
 *   mutate({
 *     movieId: "123",
 *     watchedDate: new Date(),
 *     rating: 8.5
 *   }, {
 *     onSuccess: () => {
 *       console.log("Movie added successfully!")
 *     }
 *   })
 * }
 * ```
 */
export function useAddMovieToHistory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddMovieToHistoryPayload) =>
      movieService.addMovieToHistory(payload),
    onSuccess: () => {
      // Invalidate movie history queries to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ["movies", "history"] })
      // Invalidate insights to update statistics
      queryClient.invalidateQueries({ queryKey: ["insights"] })
    },
  })
}

// Made with Bob
