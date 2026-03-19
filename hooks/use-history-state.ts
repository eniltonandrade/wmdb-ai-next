import { useReducer, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import type { SortByOption } from "@/lib/types/movie.types"

type ViewMode = "gallery" | "table"

export interface HistoryState {
  viewMode: ViewMode
  searchQuery: string
  sortBy: SortByOption
  genre: string | null
}

type HistoryAction =
  | { type: "SET_VIEW_MODE"; payload: ViewMode }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_SORT"; payload: SortByOption }
  | { type: "SET_GENRE"; payload: string | null }
  | { type: "CLEAR_SEARCH" }
  | { type: "CLEAR_GENRE" }

function historyReducer(
  state: HistoryState,
  action: HistoryAction
): HistoryState {
  switch (action.type) {
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload }
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload }
    case "SET_SORT":
      return { ...state, sortBy: action.payload }
    case "SET_GENRE":
      return { ...state, genre: action.payload }
    case "CLEAR_SEARCH":
      return { ...state, searchQuery: "" }
    case "CLEAR_GENRE":
      return { ...state, genre: null }
    default:
      return state
  }
}

/**
 * Custom hook to manage history page state with reducer pattern
 * Consolidates related UI state (view mode, search, sort, genre) into a single state object
 * Genre filter is synced with URL search params for shareability
 *
 * @returns state and dispatch actions
 *
 * @example
 * ```tsx
 * const { state, setViewMode, setSearch, setSort, setGenre, clearSearch } = useHistoryState()
 *
 * // Use state
 * console.log(state.viewMode, state.searchQuery, state.sortBy, state.genre)
 *
 * // Update state
 * setViewMode("table")
 * setSearch("inception")
 * setSort("rating_imdb.desc")
 * setGenre("genre-id")
 * clearSearch()
 * ```
 */
export function useHistoryState() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Initialize state from URL params
  const initialStateFromUrl: HistoryState = {
    viewMode: "gallery",
    searchQuery: "",
    sortBy: "watched_date.desc",
    genre: searchParams.get("genre") || null,
  }

  const [state, dispatch] = useReducer(historyReducer, initialStateFromUrl)

  // Track previous genre to avoid unnecessary URL updates
  const prevGenreRef = useRef<string | null>(state.genre)

  // Sync genre changes to URL (only when genre actually changes)
  useEffect(() => {
    // Only update if genre changed from previous value
    if (state.genre !== prevGenreRef.current) {
      prevGenreRef.current = state.genre

      const params = new URLSearchParams(searchParams.toString())

      if (state.genre) {
        params.set("genre", state.genre)
      } else {
        params.delete("genre")
      }

      // Navigate to the new URL (with or without query params)
      const queryString = params.toString()
      const newPath = queryString ? `?${queryString}` : window.location.pathname
      router.replace(newPath, { scroll: false })
    }
  }, [state.genre, router, searchParams])

  return {
    state,
    setViewMode: (mode: ViewMode) =>
      dispatch({ type: "SET_VIEW_MODE", payload: mode }),
    setSearch: (query: string) =>
      dispatch({ type: "SET_SEARCH", payload: query }),
    setSort: (sortBy: SortByOption) =>
      dispatch({ type: "SET_SORT", payload: sortBy }),
    setGenre: (genre: string | null) =>
      dispatch({ type: "SET_GENRE", payload: genre }),
    clearSearch: () => dispatch({ type: "CLEAR_SEARCH" }),
    clearGenre: () => dispatch({ type: "CLEAR_GENRE" }),
  }
}

// Made with Bob
