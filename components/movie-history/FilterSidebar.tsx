"use client"

import { X, SlidersHorizontal } from "lucide-react"
import { useGenres } from "@/hooks/useGenres"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
  selectedGenre: string | null
  onGenreChange: (genreId: string | null) => void
}

export function FilterSidebar({
  isOpen,
  onClose,
  selectedGenre,
  onGenreChange,
}: FilterSidebarProps) {
  const { data, isLoading, error } = useGenres()

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const genres = data?.results ?? []

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 top-0 right-0 bottom-0 left-0 z-40 h-screen w-screen bg-black/50 transition-opacity",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        style={{ position: "fixed" }}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-screen w-full bg-background shadow-xl transition-transform duration-300 ease-in-out sm:w-96",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ position: "fixed" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Filtros</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Fechar filtros"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-73px)] overflow-y-auto p-4">
          {/* Genre Filter Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Gênero</h3>

            {isLoading ? (
              <GenreFilterSkeleton />
            ) : error ? (
              <p className="text-sm text-muted-foreground">
                Erro ao carregar gêneros
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {/* "All" option */}
                <button
                  onClick={() => {
                    onGenreChange(null)
                    onClose()
                  }}
                  className={cn(
                    "h-8 shrink-0 rounded-full px-3 text-sm font-medium transition-colors",
                    selectedGenre === null
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  Todos
                </button>

                {/* Genre pills */}
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => {
                      onGenreChange(genre.id)
                      onClose()
                    }}
                    className={cn(
                      "h-8 shrink-0 rounded-full px-3 text-sm font-medium transition-colors",
                      selectedGenre === genre.id
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Placeholder for future filters */}
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Mais filtros em breve...
            </h3>
          </div>
        </div>
      </div>
    </>
  )
}

function GenreFilterSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="h-8 w-20 shrink-0 animate-pulse rounded-full bg-muted"
        />
      ))}
    </div>
  )
}

// Made with Bob
