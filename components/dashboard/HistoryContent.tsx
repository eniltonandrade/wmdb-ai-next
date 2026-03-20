"use client"

import { useState } from "react"
import { useMovieHistoryFlat } from "@/hooks/use-movie-history"
import { useDebounce } from "@/hooks/use-debounce"
import { useHistoryState } from "@/hooks/use-history-state"
import { useInfiniteScrollTrigger } from "@/hooks/use-infinite-scroll-trigger"
import { GalleryView } from "@/components/movie-history/gallery-view"
import { TableView } from "@/components/movie-history/table-view"
import { PageHeader } from "@/components/movie-history/page-header"
import { ViewModeToggle } from "@/components/movie-history/view-mode-toggle"
import { SearchControlsBar } from "@/components/movie-history/search-controls-bar"
import { InfiniteScrollSentinel } from "@/components/movie-history/infinite-scroll-sentinel"
import { HistoryStatusRenderer } from "@/components/movie-history/history-status-renderer"
import { FilterSidebar } from "@/components/movie-history/FilterSidebar"
import { FilterButton } from "@/components/movie-history/FilterButton"

export function HistoryContent() {
  // Filter sidebar state
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Consolidated state management
  const { state, setViewMode, setSearch, setSort, setGenre, clearSearch } =
    useHistoryState()
  const { viewMode, searchQuery, sortBy, genre } = state

  const debouncedSearch = useDebounce(searchQuery, 500)

  const {
    movies,
    total,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useMovieHistoryFlat({
    sort_by: sortBy,
    query: debouncedSearch || undefined,
    genre_id: genre || undefined,
  })

  // Infinite scroll trigger
  const sentinelRef = useInfiniteScrollTrigger(
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  )

  // Render view based on mode
  const renderView = () => {
    return viewMode === "gallery" ? (
      <GalleryView movies={movies} />
    ) : (
      <TableView movies={movies} />
    )
  }

  return (
    <HistoryStatusRenderer
      isLoading={isLoading}
      error={error}
      movies={movies}
      total={total}
      debouncedSearch={debouncedSearch}
      searchQuery={searchQuery}
      viewMode={viewMode}
      onSearchChange={setSearch}
      onClearSearch={clearSearch}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader
            total={total}
            searchResults={debouncedSearch ? movies.length : undefined}
            isSearching={!!debouncedSearch}
          />

          {/* View Toggle */}
          <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>

        {/* Search, Sort, and Filter Controls */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <SearchControlsBar
            searchQuery={searchQuery}
            debouncedSearch={debouncedSearch}
            sortBy={sortBy}
            onSearchChange={setSearch}
            onSortChange={setSort}
            onClearSearch={clearSearch}
          />
          <FilterButton
            onClick={() => setIsFilterOpen(true)}
            hasActiveFilters={!!genre}
          />
        </div>

        {/* Content */}
        {renderView()}

        {/* Infinite Scroll Sentinel */}
        <InfiniteScrollSentinel
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          moviesCount={movies.length}
          sentinelRef={sentinelRef}
        />

        {/* Filter Sidebar */}
        <FilterSidebar
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          selectedGenre={genre}
          onGenreChange={setGenre}
        />
      </div>
    </HistoryStatusRenderer>
  )
}
