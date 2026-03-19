import { useReducer } from "react"
import type { SortByOption } from "@/lib/types/movie.types"

type ViewMode = "gallery" | "table"

export interface HistoryState {
  viewMode: ViewMode
  searchQuery: string
  sortBy: SortByOption
}

type HistoryAction =
  | { type: "SET_VIEW_MODE"; payload: ViewMode }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_SORT"; payload: SortByOption }
  | { type: "CLEAR_SEARCH" }

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
    case "CLEAR_SEARCH":
      return { ...state, searchQuery: "" }
    default:
      return state
  }
}

const initialState: HistoryState = {
  viewMode: "gallery",
  searchQuery: "",
  sortBy: "watched_date.desc",
}

/**
 * Custom hook to manage history page state with reducer pattern
 * Consolidates related UI state (view mode, search, sort) into a single state object
 *
 * @returns state and dispatch actions
 *
 * @example
 * ```tsx
 * const { state, setViewMode, setSearch, setSort, clearSearch } = useHistoryState()
 *
 * // Use state
 * console.log(state.viewMode, state.searchQuery, state.sortBy)
 *
 * // Update state
 * setViewMode("table")
 * setSearch("inception")
 * setSort("rating_imdb.desc")
 * clearSearch()
 * ```
 */
export function useHistoryState() {
  const [state, dispatch] = useReducer(historyReducer, initialState)

  return {
    state,
    setViewMode: (mode: ViewMode) =>
      dispatch({ type: "SET_VIEW_MODE", payload: mode }),
    setSearch: (query: string) =>
      dispatch({ type: "SET_SEARCH", payload: query }),
    setSort: (sortBy: SortByOption) =>
      dispatch({ type: "SET_SORT", payload: sortBy }),
    clearSearch: () => dispatch({ type: "CLEAR_SEARCH" }),
  }
}

// Made with Bob
