"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useSearchMovies } from "@/hooks/useTMDB"
import { useDebounce } from "@/hooks/use-debounce"
import { tmdbService } from "@/lib/api/tmdb-service"
import { Input } from "@/components/ui/input"
import { Search, Calendar, Star, Clock, X } from "lucide-react"

const RECENT_SEARCHES_KEY = "wmdb-recent-searches"
const MAX_RECENT_SEARCHES = 5

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveRecentSearch(query: string) {
  if (typeof window === "undefined" || !query.trim()) return

  try {
    const recent = getRecentSearches()
    // Remove if already exists
    const filtered = recent.filter(
      (q) => q.toLowerCase() !== query.toLowerCase()
    )
    // Add to beginning
    const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  } catch {
    // Ignore localStorage errors
  }
}

function removeRecentSearch(query: string) {
  if (typeof window === "undefined") return

  try {
    const recent = getRecentSearches()
    const filtered = recent.filter((q) => q !== query)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(filtered))
  } catch {
    // Ignore localStorage errors
  }
}

export default function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryParam = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(queryParam)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [showRecent, setShowRecent] = useState(false)
  const debouncedQuery = useDebounce(searchQuery, 500)

  const { data, isLoading, error } = useSearchMovies(debouncedQuery)

  // Load recent searches on mount
  useEffect(() => {
    const loadRecent = () => {
      const recent = getRecentSearches()
      setRecentSearches(recent)
    }
    loadRecent()
  }, [])

  // Update URL when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      router.replace(
        `/dashboard/search?q=${encodeURIComponent(debouncedQuery)}`,
        {
          scroll: false,
        }
      )
      // Save to recent searches when user has typed something meaningful
      if (debouncedQuery.length >= 2) {
        saveRecentSearch(debouncedQuery)
      }
    } else if (searchQuery === "") {
      router.replace("/dashboard/search", { scroll: false })
    }
  }, [debouncedQuery, searchQuery, router])

  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query)
    setShowRecent(false)
  }

  const handleRemoveRecentSearch = (query: string, e: React.MouseEvent) => {
    e.stopPropagation()
    removeRecentSearch(query)
    setRecentSearches(getRecentSearches())
  }

  const handleInputFocus = () => {
    setShowRecent(true)
    // Refresh recent searches when focusing
    setRecentSearches(getRecentSearches())
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Buscar Filmes
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Pesquise filmes no banco de dados do TMDB
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Digite o nome do filme..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={() => setTimeout(() => setShowRecent(false), 200)}
          className="pr-10 pl-10"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Limpar busca"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Recent Searches Dropdown */}
        {showRecent && recentSearches.length > 0 && !searchQuery && (
          <div className="absolute top-full z-10 mt-2 w-full rounded-lg border bg-card shadow-lg">
            <div className="p-2">
              <div className="mb-2 flex items-center gap-2 px-2 text-xs font-medium text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Buscas Recentes</span>
              </div>
              {recentSearches.map((query) => (
                <div
                  key={query}
                  className="flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-accent"
                  onClick={() => handleRecentSearchClick(query)}
                >
                  <span className="truncate">{query}</span>
                  <button
                    onClick={(e) => handleRemoveRecentSearch(query, e)}
                    className="ml-2 rounded p-1 hover:bg-muted"
                    aria-label="Remove search"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div>
        {isLoading && debouncedQuery && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
              <p className="text-sm text-muted-foreground">Buscando...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
            <p className="text-sm text-destructive">
              Erro ao buscar filmes. Tente novamente.
            </p>
          </div>
        )}

        {!debouncedQuery && !isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Digite algo para começar a buscar
              </p>
            </div>
          </div>
        )}

        {debouncedQuery && !isLoading && data?.results.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Nenhum resultado encontrado para &ldquo;{debouncedQuery}&rdquo;
              </p>
            </div>
          </div>
        )}

        {data && data.results.length > 0 && (
          <div>
            <p className="mb-3 text-xs text-muted-foreground sm:mb-4 sm:text-sm">
              {data.total_results} resultado(s) encontrado(s)
            </p>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {data.results.map((movie) => {
                const posterUrl = tmdbService.getPosterUrl(
                  movie.poster_path,
                  "w500"
                )
                const year = movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : null

                return (
                  <Link
                    key={movie.id}
                    href={`/dashboard/movies/${movie.id}`}
                    className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
                  >
                    <div className="aspect-[2/3] overflow-hidden bg-muted">
                      {posterUrl ? (
                        <img
                          src={posterUrl}
                          alt={movie.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-4xl">🎬</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="mb-1.5 line-clamp-2 text-sm leading-tight font-semibold sm:mb-2 sm:text-base">
                        {movie.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground sm:gap-3">
                        {year && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{year}</span>
                          </div>
                        )}
                        {movie.vote_average > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-primary text-primary" />
                            <span>{movie.vote_average.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Made with Bob
