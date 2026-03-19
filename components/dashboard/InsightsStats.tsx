"use client"

import { Film, Star, Clock } from "lucide-react"
import type { UserInsights } from "@/lib/types/movie.types"

interface InsightsStatsProps {
  insights: UserInsights
}

export function InsightsStats({ insights }: InsightsStatsProps) {
  // Convert total runtime from minutes to hours
  const totalHours = Math.floor(insights.totalRuntime / 60)
  const remainingMinutes = insights.totalRuntime % 60

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Movies Watched */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Film className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Filmes Assistidos
            </h3>
            <p className="mt-1 text-2xl font-bold">{insights.movieCount}</p>
          </div>
        </div>
      </div>

      {/* Average Rating */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Star className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Avaliação Média
            </h3>
            <p className="mt-1 text-2xl font-bold">
              {insights.averageRating.toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      {/* Total Runtime */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Clock className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Tempo Total
            </h3>
            <p className="mt-1 text-2xl font-bold">
              {totalHours}h {remainingMinutes}m
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Made with Bob
