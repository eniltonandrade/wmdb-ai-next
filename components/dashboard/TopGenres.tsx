"use client"

import Link from "next/link"
import { useGenreInsights } from "@/hooks/useGenreInsights"
import { Film, TrendingUp } from "lucide-react"

export function TopGenres() {
  const { data, isLoading, error } = useGenreInsights({
    sort_by: "count.desc",
  })

  const topGenres = data?.results.slice(0, 5) ?? []

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <div className="mb-4 h-6 w-32 animate-pulse rounded bg-muted" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  if (error || topGenres.length === 0) {
    return null
  }

  // Find max count for scaling bars
  const maxCount = Math.max(...topGenres.map((g) => g.appearances))

  return (
    <div className="rounded-lg border bg-card p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">
            Gêneros Favoritos
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Seus gêneros mais assistidos
          </p>
        </div>
        <TrendingUp className="size-5 text-primary" />
      </div>

      <div className="space-y-3">
        {topGenres.map((genre, index) => {
          const percentage = (genre.appearances / maxCount) * 100

          return (
            <Link
              key={genre.id}
              href={`/dashboard/history?genre_id=${genre.id}`}
              className="group block"
            >
              <div className="flex items-center gap-3">
                {/* Rank */}
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </div>

                {/* Genre Info and Bar */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium transition-colors group-hover:text-primary">
                      {genre.name}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Film className="size-3" />
                      <span>{genre.appearances}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500 group-hover:opacity-80"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {data && data.total > 5 && (
        <Link
          href="/dashboard/statistics"
          className="mt-4 block text-center text-sm text-primary hover:underline"
        >
          Ver todos os {data.total} gêneros →
        </Link>
      )}
    </div>
  )
}

// Made with Bob
