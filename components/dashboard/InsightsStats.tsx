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
    <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Movies Watched */}
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 sm:size-10">
            <Film className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xs font-medium text-muted-foreground sm:text-sm">
              Filmes Assistidos
            </h3>
            <p className="mt-0.5 text-xl font-bold sm:mt-1 sm:text-2xl">
              {insights.movieCount}
            </p>
          </div>
        </div>
      </div>

      {/* Average Rating */}
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 sm:size-10">
            <Star className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xs font-medium text-muted-foreground sm:text-sm">
              Avaliação Média
            </h3>
            <p className="mt-0.5 text-xl font-bold sm:mt-1 sm:text-2xl">
              {insights.averageRating.toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      {/* Total Runtime */}
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 sm:size-10">
            <Clock className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xs font-medium text-muted-foreground sm:text-sm">
              Tempo Total
            </h3>
            <p className="mt-0.5 text-xl font-bold sm:mt-1 sm:text-2xl">
              {totalHours}h {remainingMinutes}m
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Made with Bob
