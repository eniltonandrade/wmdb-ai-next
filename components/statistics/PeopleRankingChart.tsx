"use client"

/**
 * PeopleRankingChart Component
 * Displays top people (actors, directors, etc.) with filter options for gender and role
 */

import { useState } from "react"
import { useRouter } from "next/navigation"
import { usePeopleRankings } from "@/hooks/usePeopleRankings"
import type { PeopleRole } from "@/lib/types/movie.types"
import { Users, Star, Trophy } from "lucide-react"
import Image from "next/image"

const ROLE_OPTIONS: { value: PeopleRole; label: string }[] = [
  { value: "cast", label: "Elenco" },
  { value: "director", label: "Diretor" },
  { value: "writer", label: "Roteirista" },
  { value: "producer", label: "Produtor" },
]

const GENDER_OPTIONS = [
  { value: undefined, label: "Todos" },
  { value: 1, label: "Feminino" },
  { value: 2, label: "Masculino" },
  { value: 0, label: "Não especificado" },
]

export function PeopleRankingChart() {
  const router = useRouter()
  const [role, setRole] = useState<PeopleRole | undefined>(undefined)
  const [gender, setGender] = useState<number | undefined>(undefined)

  const { data, isLoading, error } = usePeopleRankings({
    role,
    gender,
    page: 1,
  })

  const topPeople = data?.results.slice(0, 10) || []

  if (error) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Erro ao carregar ranking de pessoas
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold sm:text-xl">Ranking de Pessoas</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
          {/* Role Filter */}
          <select
            value={role || ""}
            onChange={(e) =>
              setRole((e.target.value as PeopleRole | undefined) || undefined)
            }
            className="rounded-md border bg-background px-3 py-1.5 text-sm transition-colors hover:bg-accent focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="">Todos os papéis</option>
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Gender Filter */}
          <select
            value={gender ?? ""}
            onChange={(e) =>
              setGender(
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
            className="rounded-md border bg-background px-3 py-1.5 text-sm transition-colors hover:bg-accent focus:ring-2 focus:ring-primary focus:outline-none"
          >
            {GENDER_OPTIONS.map((option) => (
              <option key={option.label} value={option.value ?? ""}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      )}

      {/* People List - Two Column Grid */}
      {!isLoading && topPeople.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          {topPeople.map((person, index) => {
            const profileUrl = person.profilePath
              ? `https://image.tmdb.org/t/p/w185${person.profilePath}`
              : null

            return (
              <div
                key={person.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-xs transition-colors hover:bg-accent sm:gap-3 sm:text-sm"
                onClick={() =>
                  router.push(`/dashboard/people/${person.tmdbId}`)
                }
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium sm:h-6 sm:w-6">
                  {index + 1}
                </span>
                {profileUrl ? (
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-muted sm:h-10 sm:w-10">
                    <Image
                      src={profileUrl}
                      alt={person.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted sm:h-10 sm:w-10">
                    <Users className="h-4 w-4 text-muted-foreground sm:h-5 sm:w-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium group-hover:text-primary">
                    {person.name}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      <span>{person.score.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{person.appearances}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      <span>{person.avgRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && topPeople.length === 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Nenhuma pessoa encontrada com os filtros selecionados
        </div>
      )}
    </div>
  )
}

// Made with Bob
