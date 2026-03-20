"use client"

import { Film, Clock, Star } from "lucide-react"
import type { RetrospectiveMovieData } from "@/lib/types/movie.types"

interface RetrospectiveStatsProps {
  movieData: RetrospectiveMovieData
}

export function RetrospectiveStats({ movieData }: RetrospectiveStatsProps) {
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const stats = [
    {
      label: "Filmes Assistidos",
      value: movieData.totalWatched,
      icon: Film,
      color: "text-blue-500",
    },
    {
      label: "Tempo Total",
      value: formatRuntime(movieData.totalRuntime),
      icon: Clock,
      color: "text-green-500",
    },
    {
      label: "Nota Média",
      value: movieData.averageRating.toFixed(1),
      icon: Star,
      color: "text-yellow-500",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="rounded-lg border bg-card p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-full bg-muted p-3 ${stat.color}`}>
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Made with Bob
