"use client"

import Image from "next/image"
import { Trophy, User, Building2 } from "lucide-react"
import { env } from "@/lib/config/env"
import type {
  RetrospectiveGenre,
  RetrospectivePerson,
  RetrospectiveCompany,
} from "@/lib/types/movie.types"

interface RetrospectiveTopListsProps {
  activityByGenre: RetrospectiveGenre[]
  mostWatchedPerson: RetrospectivePerson
  mostWatchedCompany: RetrospectiveCompany
}

export function RetrospectiveTopLists({
  activityByGenre,
  mostWatchedPerson,
  mostWatchedCompany,
}: RetrospectiveTopListsProps) {
  // Get top 5 genres
  const topGenres = activityByGenre.slice(0, 5)
  const maxGenreCount = Math.max(...topGenres.map((g) => g.count), 1)

  const companyLogoUrl = mostWatchedCompany.logoPath
    ? `${env.tmdb.imageBaseUrl}/w154${mostWatchedCompany.logoPath}`
    : null

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Top Listas</h2>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Top Genres */}
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Trophy className="size-5 text-yellow-500" />
            <h3 className="font-semibold">Top Gêneros</h3>
          </div>

          <div className="space-y-3">
            {topGenres.map((genre, index) => (
              <div key={genre.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{genre.name}</span>
                  </div>
                  <span className="font-medium">{genre.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-yellow-500 transition-all"
                    style={{
                      width: `${(genre.count / maxGenreCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Watched Person */}
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <User className="size-5 text-purple-500" />
            <h3 className="font-semibold">Pessoa Mais Assistida</h3>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex size-20 items-center justify-center rounded-full bg-muted">
              <User className="size-10 text-muted-foreground" />
            </div>
            <h4 className="mb-1 font-semibold">{mostWatchedPerson.name}</h4>
            <p className="text-sm text-muted-foreground">
              {mostWatchedPerson.count}{" "}
              {mostWatchedPerson.count === 1 ? "filme" : "filmes"}
            </p>
          </div>
        </div>

        {/* Most Watched Company */}
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="size-5 text-blue-500" />
            <h3 className="font-semibold">Produtora Mais Assistida</h3>
          </div>

          <div className="flex flex-col items-center text-center">
            {companyLogoUrl ? (
              <div className="relative mb-3 h-20 w-32">
                <Image
                  src={companyLogoUrl}
                  alt={mostWatchedCompany.name}
                  fill
                  className="object-contain"
                  sizes="128px"
                />
              </div>
            ) : (
              <div className="mb-3 flex size-20 items-center justify-center rounded-full bg-muted">
                <Building2 className="size-10 text-muted-foreground" />
              </div>
            )}
            <h4 className="mb-1 font-semibold">{mostWatchedCompany.name}</h4>
            <p className="text-sm text-muted-foreground">
              {mostWatchedCompany.count}{" "}
              {mostWatchedCompany.count === 1 ? "filme" : "filmes"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Made with Bob
