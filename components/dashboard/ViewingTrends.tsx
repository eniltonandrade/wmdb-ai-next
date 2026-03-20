"use client"

import { useMovieHistory } from "@/hooks/use-movie-history"
import { TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react"
import { useMemo } from "react"

export function ViewingTrends() {
  const { data, isLoading, error } = useMovieHistory({
    sort_by: "watched_date.desc",
  })

  const trends = useMemo(() => {
    if (!data?.pages[0]?.results) return null

    const allMovies = data.pages.flatMap((page) => page.results)
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // Current month movies
    const thisMonthMovies = allMovies.filter((item) => {
      const watchedDate = new Date(item.date)
      return (
        watchedDate.getMonth() === currentMonth &&
        watchedDate.getFullYear() === currentYear
      )
    })

    // Last month movies
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
    const lastMonthMovies = allMovies.filter((item) => {
      const watchedDate = new Date(item.date)
      return (
        watchedDate.getMonth() === lastMonth &&
        watchedDate.getFullYear() === lastMonthYear
      )
    })

    // Calculate trend
    const thisMonthCount = thisMonthMovies.length
    const lastMonthCount = lastMonthMovies.length
    const difference = thisMonthCount - lastMonthCount
    const percentageChange =
      lastMonthCount > 0 ? (difference / lastMonthCount) * 100 : 0

    // This week
    const oneWeekAgo = new Date(now)
    oneWeekAgo.setDate(now.getDate() - 7)
    const thisWeekMovies = allMovies.filter(
      (item) => new Date(item.date) >= oneWeekAgo
    )

    // Last 30 days
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(now.getDate() - 30)
    const last30DaysMovies = allMovies.filter(
      (item) => new Date(item.date) >= thirtyDaysAgo
    )

    return {
      thisMonth: thisMonthCount,
      lastMonth: lastMonthCount,
      difference,
      percentageChange,
      thisWeek: thisWeekMovies.length,
      last30Days: last30DaysMovies.length,
    }
  }, [data])

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <div className="mb-4 h-6 w-32 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !trends) {
    return null
  }

  const getTrendColor = () => {
    if (trends.difference > 0) return "text-green-500"
    if (trends.difference < 0) return "text-red-500"
    return "text-muted-foreground"
  }

  const trendColor = getTrendColor()

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const now = new Date()
  const currentMonthName = monthNames[now.getMonth()]
  const lastMonthName =
    monthNames[now.getMonth() === 0 ? 11 : now.getMonth() - 1]

  return (
    <div className="rounded-lg border bg-card p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">
            Tendências de Visualização
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Seu progresso de visualização
          </p>
        </div>
        <Calendar className="size-5 text-primary" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* This Month vs Last Month */}
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="mb-2 text-xs font-medium text-muted-foreground uppercase">
            Este Mês ({currentMonthName})
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{trends.thisMonth}</span>
            <span className="text-sm text-muted-foreground">filmes</span>
          </div>
          <div className={`mt-2 flex items-center gap-1 text-sm ${trendColor}`}>
            {trends.difference > 0 ? (
              <TrendingUp className="size-4" />
            ) : trends.difference < 0 ? (
              <TrendingDown className="size-4" />
            ) : (
              <Minus className="size-4" />
            )}
            <span>
              {trends.difference > 0 ? "+" : ""}
              {trends.difference} vs {lastMonthName}
            </span>
            {trends.percentageChange !== 0 && (
              <span className="text-xs">
                ({trends.percentageChange > 0 ? "+" : ""}
                {trends.percentageChange.toFixed(0)}%)
              </span>
            )}
          </div>
        </div>

        {/* This Week */}
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="mb-2 text-xs font-medium text-muted-foreground uppercase">
            Esta Semana
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{trends.thisWeek}</span>
            <span className="text-sm text-muted-foreground">filmes</span>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Últimos 7 dias
          </div>
        </div>

        {/* Last 30 Days */}
        <div className="rounded-lg bg-muted/50 p-4 sm:col-span-2">
          <div className="mb-2 text-xs font-medium text-muted-foreground uppercase">
            Últimos 30 Dias
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{trends.last30Days}</span>
            <span className="text-sm text-muted-foreground">filmes</span>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Média de {(trends.last30Days / 30).toFixed(1)} filmes por dia
          </div>
        </div>
      </div>
    </div>
  )
}

// Made with Bob
