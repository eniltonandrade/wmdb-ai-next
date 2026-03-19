"use client"

import { Film } from "lucide-react"
import type { MovieHistoryItem } from "@/lib/types/movie.types"
import { PageHeader } from "./page-header"
import { SearchBar } from "./search-bar"
import { GalleryViewSkeleton } from "./gallery-view"
import { TableViewSkeleton } from "./table-view"
import { ErrorMessage } from "@/components/error-boundary"
import { Button } from "@/components/ui/button"

type ViewMode = "gallery" | "table"

interface HistoryStatusRendererProps {
  isLoading: boolean
  error: Error | null
  movies: MovieHistoryItem[]
  total: number
  debouncedSearch: string
  searchQuery: string
  viewMode: ViewMode
  onSearchChange: (value: string) => void
  onClearSearch: () => void
  children: React.ReactNode
}

export function HistoryStatusRenderer({
  isLoading,
  error,
  movies,
  total,
  debouncedSearch,
  searchQuery,
  viewMode,
  onSearchChange,
  onClearSearch,
  children,
}: HistoryStatusRendererProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <PageHeader total={0} isSearching={false} />
        </div>
        {viewMode === "gallery" ? (
          <GalleryViewSkeleton />
        ) : (
          <TableViewSkeleton />
        )}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader total={0} isSearching={false} />
        <ErrorMessage
          title="Erro ao carregar histórico"
          message="Não foi possível carregar seu histórico de filmes. Tente novamente mais tarde."
        />
      </div>
    )
  }

  // Empty state - differentiate between no results and no search results
  if (movies.length === 0) {
    const isSearching = debouncedSearch.length > 0

    return (
      <div className="space-y-6">
        <PageHeader total={total} isSearching={false} />

        {/* Search Bar */}
        <SearchBar value={searchQuery} onChange={onSearchChange} />

        <div className="flex min-h-100 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Film className="mb-4 size-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">
            {isSearching
              ? "Nenhum resultado encontrado"
              : "Nenhum filme assistido ainda"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isSearching ? (
              <>
                Não encontramos filmes com &ldquo;{debouncedSearch}&rdquo;.
                Tente outra busca.
              </>
            ) : (
              "Comece a adicionar filmes ao seu histórico para vê-los aqui!"
            )}
          </p>
          {isSearching && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSearch}
              className="mt-4"
            >
              Limpar busca
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Render children when we have movies
  return <>{children}</>
}

// Made with Bob
