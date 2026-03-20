"use client"

import { useMovieHistory } from "@/hooks/use-movie-history"
import { Star, BarChart } from "lucide-react"
import { useMemo } from "react"

export function RatingDistribution() {
  const { data, isLoading, error } = useMovieHistory({
    sort_by: "watched_date.desc",
  })

  const distribution = useMemo(() => {
    if (!data?.pages[0]?.results) return null

    const allMovies = data.pages.flatMap((page) => page.results)
    const ratedMovies = allMovies.filter((item) => item.rating !== null)

    // Count movies by rating (1-10)
    const counts: Record<number, number> = {}
    for (let i = 1; i <= 10; i++) {
      counts[i] = 0
    }

    ratedMovies.forEach((item) => {
      if (item.rating) {
        const rating = Math.floor(item.rating)
        counts[rating] = (counts[rating] || 0) + 1
      }
    })

    const maxCount = Math.max(...Object.values(counts), 1)
    const totalRated = ratedMovies.length
    const averageRating =
      totalRated > 0
        ? ratedMovies.reduce((sum, item) => sum + (item.rating || 0), 0) /
          totalRated
        : 0

    return {
      counts,
      maxCount,
      totalRated,
      averageRating,
      totalMovies: allMovies.length,
    }
  }, [data])

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <div className="mb-4 h-6 w-32 animate-pulse rounded bg-muted" />
        <div className="h-48 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (error || !distribution || distribution.totalRated === 0) {
    return null
  }

  return (
    <div className="rounded-lg border bg-card p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">
            Distribuição de Avaliações
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Como você avalia seus filmes
          </p>
        </div>
        <BarChart className="size-5 text-primary" />
      </div>

      {/* Average Rating Card */}
      <div className="mb-6 rounded-lg bg-primary/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-muted-foreground uppercase">
              Avaliação Média
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">
                {distribution.averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">/10</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="size-6 fill-primary text-primary" />
          </div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {distribution.totalRated} de {distribution.totalMovies} filmes
          avaliados
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-2">
        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((rating) => {
          const count = distribution.counts[rating] || 0
          const percentage = (count / distribution.maxCount) * 100

          return (
            <div key={rating} className="flex items-center gap-3">
              {/* Rating Label */}
              <div className="flex w-8 items-center justify-center">
                <span className="text-sm font-medium">{rating}</span>
                <Star className="ml-0.5 size-3 fill-yellow-400 text-yellow-400" />
              </div>

              {/* Bar */}
              <div className="flex-1">
                <div className="h-6 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Count */}
              <div className="w-12 text-right text-sm text-muted-foreground">
                {count > 0 ? count : ""}
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 border-t pt-4">
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Mais Comum</div>
          <div className="mt-1 flex items-center justify-center gap-1 text-lg font-bold">
            {
              Object.entries(distribution.counts).reduce((a, b) =>
                b[1] > a[1] ? b : a
              )[0]
            }
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Avaliados</div>
          <div className="mt-1 text-lg font-bold">
            {distribution.totalRated}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Sem Avaliação</div>
          <div className="mt-1 text-lg font-bold">
            {distribution.totalMovies - distribution.totalRated}
          </div>
        </div>
      </div>
    </div>
  )
}

// Made with Bob
