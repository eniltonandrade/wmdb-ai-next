"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { usePeopleRankings } from "@/hooks/usePeopleRankings"
import { Users, Star } from "lucide-react"
import { tmdbService } from "@/lib/api/tmdb-service"

export function FavoriteActors() {
  const router = useRouter()
  const { data, isLoading, error } = usePeopleRankings({
    role: "cast",
  })

  const topActors = data?.results.slice(0, 5) ?? []

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <div className="mb-4 h-6 w-32 animate-pulse rounded bg-muted" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="size-12 shrink-0 animate-pulse rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || topActors.length === 0) {
    return null
  }

  return (
    <div className="rounded-lg border bg-card p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">Atores Favoritos</h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Seus atores mais assistidos
          </p>
        </div>
        <Users className="size-5 text-primary" />
      </div>

      <div className="space-y-3">
        {topActors.map((actor, index) => (
          <div
            key={actor.id}
            onClick={() => router.push(`/dashboard/people/${actor.tmdbId}`)}
            className="group flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
          >
            {/* Rank Badge */}
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {index + 1}
            </div>

            {/* Profile Image */}
            {actor.profilePath ? (
              <Image
                src={tmdbService.getProfileUrl(actor.profilePath, "w185") || ""}
                alt={actor.name}
                width={48}
                height={48}
                className="size-12 shrink-0 rounded-full object-cover ring-2 ring-primary/20 transition-all group-hover:ring-primary"
              />
            ) : (
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted ring-2 ring-primary/20 transition-all group-hover:ring-primary">
                <span className="text-lg">👤</span>
              </div>
            )}

            {/* Actor Info */}
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-medium transition-colors group-hover:text-primary">
                {actor.name}
              </h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{actor.appearances} filmes</span>
                <div className="flex items-center gap-1">
                  <Star className="size-3 fill-yellow-400 text-yellow-400" />
                  <span>{actor.avgRating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* Score Badge */}
            <div className="shrink-0 rounded-lg bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
              {actor.score.toFixed(0)}
            </div>
          </div>
        ))}
      </div>

      {data && data.total > 5 && (
        <button
          onClick={() => router.push("/dashboard/statistics")}
          className="mt-4 w-full text-center text-sm text-primary hover:underline"
        >
          Ver todos os {data.total} atores →
        </button>
      )}
    </div>
  )
}

// Made with Bob
