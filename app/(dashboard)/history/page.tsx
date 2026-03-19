"use client"

import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { LayoutGrid, Table, Film } from "lucide-react"
import { useMovieHistory } from "@/hooks/use-movie-history"
import {
  GalleryView,
  GalleryViewSkeleton,
} from "@/components/movie-history/gallery-view"
import {
  TableView,
  TableViewSkeleton,
} from "@/components/movie-history/table-view"
import { Button } from "@/components/ui/button"
import { ErrorMessage } from "@/components/error-boundary"

type ViewMode = "gallery" | "table"

export default function HistoryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("gallery")
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

  // Empty state
  if (allMovies.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Histórico de Filmes</h1>
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Film className="mb-4 size-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">
            Nenhum filme assistido ainda
          </h2>
          <p className="text-sm text-muted-foreground">
            Comece a adicionar filmes ao seu histórico para vê-los aqui!
          </p>
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
            {total} {total === 1 ? "filme assistido" : "filmes assistidos"}
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
