"use client"

import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { LayoutGrid, Table, Film, Search, X } from "lucide-react"
import { useMovieHistory } from "@/hooks/use-movie-history"
import { useDebounce } from "@/hooks/use-debounce"
import {
  GalleryView,
  GalleryViewSkeleton,
} from "@/components/movie-history/gallery-view"
import {
  TableView,
  TableViewSkeleton,
} from "@/components/movie-history/table-view"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ErrorMessage } from "@/components/error-boundary"

type ViewMode = "gallery" | "table"

export default function HistoryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("gallery")
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearch = useDebounce(searchQuery, 500)
  const { ref, inView } = useInView()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useMovieHistory({
    sort_by: "watched_date.desc",
    query: debouncedSearch || undefined,
  })

  // Trigger infinite scroll when the sentinel comes into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const allMovies = data?.pages.flatMap((page) => page.results) ?? []
  const total = data?.pages[0]?.total ?? 0

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Histórico de Filmes</h1>
            <p className="text-muted-foreground">Carregando seu histórico...</p>
          </div>
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
        <h1 className="text-3xl font-bold">Histórico de Filmes</h1>
        <ErrorMessage
          title="Erro ao carregar histórico"
          message="Não foi possível carregar seu histórico de filmes. Tente novamente mais tarde."
        />
      </div>
    )
  }

  // Empty state - differentiate between no results and no search results
  if (allMovies.length === 0) {
    const isSearching = debouncedSearch.length > 0

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Histórico de Filmes</h1>
          <p className="text-muted-foreground">
            {total} {total === 1 ? "filme assistido" : "filmes assistidos"}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar filmes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
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
              onClick={() => setSearchQuery("")}
              className="mt-4"
            >
              Limpar busca
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Histórico de Filmes</h1>
          <p className="text-muted-foreground">
            {debouncedSearch
              ? `${allMovies.length} resultado${allMovies.length !== 1 ? "s" : ""} encontrado${allMovies.length !== 1 ? "s" : ""}`
              : `${total} ${total === 1 ? "filme assistido" : "filmes assistidos"}`}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === "gallery" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("gallery")}
          >
            <LayoutGrid className="mr-2 size-4" />
            Galeria
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <Table className="mr-2 size-4" />
            Tabela
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar filmes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10 pl-10"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Search indicator */}
      {debouncedSearch && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Buscando por: &ldquo;{debouncedSearch}&rdquo;</span>
          <button
            onClick={() => setSearchQuery("")}
            className="text-primary hover:underline"
          >
            Limpar
          </button>
        </div>
      )}

      {/* Content */}
      {viewMode === "gallery" ? (
        <GalleryView movies={allMovies} />
      ) : (
        <TableView movies={allMovies} />
      )}

      {/* Infinite Scroll Sentinel */}
      {hasNextPage && (
        <div ref={ref} className="flex justify-center py-8">
          {isFetchingNextPage && (
            <div className="text-sm text-muted-foreground">
              Carregando mais filmes...
            </div>
          )}
        </div>
      )}

      {/* End of list message */}
      {!hasNextPage && allMovies.length > 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Você chegou ao fim da lista
        </div>
      )}
    </div>
  )
}

// Made with Bob
