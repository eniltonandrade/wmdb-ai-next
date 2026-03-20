"use client"

import Image from "next/image"
import Link from "next/link"
import { usePopularMovies } from "@/hooks/useTMDB"
import { tmdbService } from "@/lib/api/tmdb-service"
import { TrendingUp, Star } from "lucide-react"

export function TrendingMovies() {
  const { data, isLoading, error } = usePopularMovies(1)

  const trendingMovies = data?.results.slice(0, 6) ?? []

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <div className="mb-4 h-6 w-32 animate-pulse rounded bg-muted" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  if (error || trendingMovies.length === 0) {
    return null
  }

  return (
    <div className="rounded-lg border bg-card p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">Filmes em Alta</h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Populares no momento
          </p>
        </div>
        <TrendingUp className="size-5 text-primary" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {trendingMovies.map((movie) => {
          const posterUrl = tmdbService.getPosterUrl(movie.poster_path, "w342")

          return (
            <Link
              key={movie.id}
              href={`/dashboard/movies/${movie.id}`}
              className="group flex gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50"
            >
              {/* Poster */}
              <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-muted text-xs text-muted-foreground">
                    N/A
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <h3 className="line-clamp-2 text-sm font-medium transition-colors group-hover:text-primary">
                    {movie.title}
                  </h3>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : "N/A"}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 text-xs">
                  <Star className="size-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    ({movie.vote_count})
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <Link
        href="/dashboard/search"
        className="mt-4 block text-center text-sm text-primary hover:underline"
      >
        Explorar mais filmes →
      </Link>
    </div>
  )
}

// Made with Bob
