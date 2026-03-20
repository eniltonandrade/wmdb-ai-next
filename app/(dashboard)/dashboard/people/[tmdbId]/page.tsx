"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { usePersonDetails } from "@/hooks/useTMDB"
import { usePersonInsights } from "@/hooks/usePersonInsights"
import { useMovieHistoryFlat } from "@/hooks/use-movie-history"
import { tmdbService } from "@/lib/api/tmdb-service"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Star,
  Film,
  TrendingUp,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function PersonDetailsPage() {
  const [isBioExpanded, setIsBioExpanded] = useState(false)
  const params = useParams()
  const router = useRouter()
  const tmdbId = Number(params.tmdbId)

  const {
    data: person,
    isLoading: isLoadingPerson,
    error: personError,
  } = usePersonDetails(tmdbId)

  const {
    data: insights,
    isLoading: isLoadingInsights,
    error: insightsError,
  } = usePersonInsights(tmdbId)

  // Get movie history filtered by this person - only if we have insights
  const {
    movies: personMovies,
    total: totalMovies,
    isLoading: isLoadingHistory,
  } = useMovieHistoryFlat(
    insights?.person.id ? { person_id: insights.person.id } : {}
  )

  const isLoading = isLoadingPerson || isLoadingInsights
  const hasPersonInHistory = insights && !insightsError

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (personError || !person) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="mb-4 text-destructive">
            Falha ao carregar detalhes da pessoa
          </p>
          <Button
            onClick={() => router.back()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  const profileUrl = tmdbService.getProfileUrl(person.profile_path, "h632")
  const age =
    person.birthday && !person.deathday
      ? new Date().getFullYear() - new Date(person.birthday).getFullYear()
      : null

  // Deduplicate movies by tmdbId (person might have multiple roles in same movie)
  const deduplicateMovies = <T extends { tmdbId: number }>(
    movies: T[]
  ): T[] => {
    const seen = new Set<number>()
    return movies.filter((movie) => {
      if (seen.has(movie.tmdbId)) {
        return false
      }
      seen.add(movie.tmdbId)
      return true
    })
  }

  const uniqueHighestRated = insights
    ? deduplicateMovies(insights.highestRatedMovies)
    : []
  const uniqueLowestRated = insights
    ? deduplicateMovies(insights.lowestRatedMovies)
    : []

  return (
    <div className="-m-4 min-h-screen bg-background text-white lg:-m-8">
      {/* Hero Section */}
      <div className="relative h-[30vh] overflow-hidden bg-gradient-to-b from-[#1c1b1b] to-[#0e0e0e] sm:h-[35vh] md:h-[40vh]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0e0e0e]/60 to-[#0e0e0e]" />
      </div>

      {/* Main Content */}
      <div className="relative -mt-32 px-4 pb-8 sm:-mt-40 sm:px-6 md:-mt-48 md:px-8 md:pb-16 lg:-mt-64">
        <div className="mx-auto max-w-7xl">
          {/* Back Button */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm tracking-wider uppercase">Voltar</span>
            </button>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              {profileUrl ? (
                <img
                  src={profileUrl}
                  alt={person.name}
                  className="w-full rounded-lg shadow-2xl sm:w-[280px]"
                />
              ) : (
                <div className="flex aspect-[2/3] w-full items-center justify-center rounded-lg bg-[#1c1b1b] sm:w-[280px]">
                  <span className="text-6xl">👤</span>
                </div>
              )}
            </div>

            {/* Person Info */}
            <div className="flex-1 lg:pt-8">
              {/* Department */}
              {person.known_for_department && (
                <div className="mb-4">
                  <span className="text-sm font-medium tracking-widest text-primary uppercase">
                    {person.known_for_department === "Acting"
                      ? "Atuação"
                      : person.known_for_department === "Directing"
                        ? "Direção"
                        : person.known_for_department}
                  </span>
                </div>
              )}

              {/* Name */}
              <h1 className="mb-4 font-serif text-3xl leading-tight italic sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
                {person.name}
              </h1>

              {/* Biography */}
              {person.biography && (
                <div className="mb-8 max-w-2xl">
                  <p
                    className={`text-base leading-relaxed text-muted-foreground sm:text-lg ${
                      !isBioExpanded && person.biography.length > 300
                        ? "line-clamp-3"
                        : ""
                    }`}
                  >
                    {person.biography}
                  </p>
                  {person.biography.length > 300 && (
                    <button
                      onClick={() => setIsBioExpanded(!isBioExpanded)}
                      className="mt-2 flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80"
                    >
                      {isBioExpanded ? (
                        <>
                          Ver menos <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Ver mais <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Personal Info */}
              <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4 md:gap-6">
                {person.birthday && (
                  <div className="text-sm">
                    <span className="tracking-wider text-muted-foreground uppercase">
                      Nascimento
                    </span>
                    <div className="mt-1 text-white">
                      {format(
                        new Date(person.birthday),
                        "d 'de' MMMM 'de' yyyy",
                        {
                          locale: ptBR,
                        }
                      )}
                      {age && (
                        <span className="ml-2 text-muted-foreground">
                          ({age} anos)
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {person.place_of_birth && (
                  <div className="text-sm">
                    <span className="tracking-wider text-muted-foreground uppercase">
                      Local de Nascimento
                    </span>
                    <div className="mt-1 text-white">
                      {person.place_of_birth}
                    </div>
                  </div>
                )}
                {person.deathday && (
                  <div className="text-sm">
                    <span className="tracking-wider text-muted-foreground uppercase">
                      Falecimento
                    </span>
                    <div className="mt-1 text-white">
                      {format(
                        new Date(person.deathday),
                        "d 'de' MMMM 'de' yyyy",
                        {
                          locale: ptBR,
                        }
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Also Known As */}
              {person.also_known_as && person.also_known_as.length > 0 && (
                <div className="mb-8">
                  <div className="mb-2 text-xs tracking-wider text-muted-foreground uppercase">
                    Também Conhecido Como
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {person.also_known_as.slice(0, 5).map((name, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-[#1c1b1b] px-3 py-1 text-xs text-white sm:text-sm"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Personal Stats Sidebar */}
            {insights && (
              <div className="w-full self-start rounded-lg bg-[#131313] p-4 sm:p-6 lg:w-80">
                <h3 className="mb-6 text-sm font-medium tracking-widest text-primary uppercase">
                  Estatísticas Pessoais
                </h3>

                {/* Movie Count */}
                <div className="mb-6">
                  <div className="mb-2 flex items-center gap-2 text-xs tracking-wider text-muted-foreground uppercase">
                    <Film className="h-4 w-4" />
                    Filmes Assistidos
                  </div>
                  <div className="text-3xl font-light text-white">
                    {insights.movieCount}
                  </div>
                </div>

                {/* Average Rating */}
                <div className="mb-6">
                  <div className="mb-2 flex items-center gap-2 text-xs tracking-wider text-muted-foreground uppercase">
                    <Star className="h-4 w-4" />
                    Avaliação Média
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-light text-primary">
                      {insights.averageRating.toFixed(1)}
                    </span>
                    <span className="text-lg text-muted-foreground">/10</span>
                  </div>
                </div>

                {/* Total Runtime */}
                <div className="mb-6">
                  <div className="mb-2 flex items-center gap-2 text-xs tracking-wider text-muted-foreground uppercase">
                    <TrendingUp className="h-4 w-4" />
                    Tempo Total
                  </div>
                  <div className="text-white">
                    {Math.floor(insights.totalRuntime / 60)}h{" "}
                    {insights.totalRuntime % 60}min
                  </div>
                </div>

                {/* Roles */}
                {insights.moviesCountByRoles.length > 0 && (
                  <div>
                    <div className="mb-3 text-xs tracking-wider text-muted-foreground uppercase">
                      Funções
                    </div>
                    <div className="space-y-2">
                      {insights.moviesCountByRoles.map((roleCount) => (
                        <div
                          key={roleCount.role}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-muted-foreground">
                            {roleCount.role === "ACTOR"
                              ? "Ator"
                              : roleCount.role === "ACTRESS"
                                ? "Atriz"
                                : roleCount.role === "DIRECTOR"
                                  ? "Diretor"
                                  : roleCount.role === "WRITER"
                                    ? "Roteirista"
                                    : "Produtor"}
                          </span>
                          <span className="text-white">{roleCount.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Movie History - Primary Focus */}
          {hasPersonInHistory && (
            <div className="mt-8 sm:mt-12 lg:mt-16">
              <div className="mb-4 flex items-center justify-between sm:mb-6">
                <div>
                  <h2 className="text-xl font-bold sm:text-2xl">
                    Filmes Assistidos
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {totalMovies > 0
                      ? `${totalMovies} ${totalMovies === 1 ? "filme" : "filmes"} no seu histórico`
                      : "Nenhum filme assistido com esta pessoa"}
                  </p>
                </div>
              </div>
              {personMovies.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-6">
                  {personMovies.map((historyItem) => (
                    <div
                      key={historyItem.id}
                      className="group cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/dashboard/movies/${historyItem.movie.tmdbId}`
                        )
                      }
                    >
                      {historyItem.movie.posterPath ? (
                        <img
                          src={
                            tmdbService.getPosterUrl(
                              historyItem.movie.posterPath,
                              "w500"
                            ) || ""
                          }
                          alt={historyItem.movie.title}
                          className="mb-3 aspect-[2/3] w-full rounded-lg object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="mb-3 flex aspect-[2/3] w-full items-center justify-center rounded-lg bg-[#1c1b1b]">
                          <span className="text-4xl">🎬</span>
                        </div>
                      )}
                      <div className="line-clamp-2 text-sm font-medium text-white">
                        {historyItem.movie.title}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        {historyItem.rating !== null && (
                          <>
                            <Star className="h-3 w-3 fill-primary text-primary" />
                            <span>{historyItem.rating.toFixed(1)}</span>
                          </>
                        )}
                        {historyItem.date && (
                          <>
                            {historyItem.rating !== null && <span>•</span>}
                            <Calendar className="h-3 w-3" />
                            <span>
                              {format(new Date(historyItem.date), "dd/MM/yy")}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted py-16 text-center">
                  <Film className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-lg font-medium text-muted-foreground">
                    Nenhum filme assistido
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Você ainda não assistiu nenhum filme com {person.name}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Empty State - No History with this Person */}
          {!hasPersonInHistory && !isLoadingInsights && (
            <div className="mt-8 sm:mt-12 lg:mt-16">
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted py-16 text-center">
                <Film className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium text-muted-foreground">
                  Nenhum filme assistido
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Você ainda não assistiu nenhum filme com {person.name}
                </p>
              </div>
            </div>
          )}

          {/* Insights Sections - Secondary */}
          {insights && (
            <>
              {/* Highest and Lowest Rated Movies - Side by Side */}
              {(uniqueHighestRated.length > 0 ||
                uniqueLowestRated.length > 0) && (
                <div className="mt-8 grid gap-6 sm:mt-12 sm:gap-8 lg:mt-16 lg:grid-cols-2">
                  {/* Highest Rated Movies */}
                  {uniqueHighestRated.length > 0 && (
                    <div>
                      <h2 className="mb-4 text-xl font-bold sm:mb-6 sm:text-2xl">
                        Filmes Mais Bem Avaliados
                      </h2>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
                        {uniqueHighestRated.map((movie) => (
                          <div
                            key={movie.tmdbId}
                            className="group cursor-pointer"
                            onClick={() =>
                              router.push(`/dashboard/movies/${movie.tmdbId}`)
                            }
                          >
                            {movie.posterPath ? (
                              <img
                                src={
                                  tmdbService.getPosterUrl(
                                    movie.posterPath,
                                    "w500"
                                  ) || ""
                                }
                                alt={movie.title}
                                className="mb-3 aspect-[2/3] w-full rounded-lg object-cover transition-transform group-hover:scale-105"
                              />
                            ) : (
                              <div className="mb-3 flex aspect-[2/3] w-full items-center justify-center rounded-lg bg-[#1c1b1b]">
                                <span className="text-4xl">🎬</span>
                              </div>
                            )}
                            <div className="line-clamp-2 text-sm font-medium text-white">
                              {movie.title}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                              <Star className="h-3 w-3 fill-primary text-primary" />
                              <span>{movie.averageRating.toFixed(1)}</span>
                              {movie.character && (
                                <>
                                  <span>•</span>
                                  <span className="line-clamp-1">
                                    {movie.character}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lowest Rated Movies */}
                  {uniqueLowestRated.length > 0 && (
                    <div>
                      <h2 className="mb-4 text-xl font-bold sm:mb-6 sm:text-2xl">
                        Filmes Menos Bem Avaliados
                      </h2>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
                        {uniqueLowestRated.map((movie) => (
                          <div
                            key={movie.tmdbId}
                            className="group cursor-pointer"
                            onClick={() =>
                              router.push(`/dashboard/movies/${movie.tmdbId}`)
                            }
                          >
                            {movie.posterPath ? (
                              <img
                                src={
                                  tmdbService.getPosterUrl(
                                    movie.posterPath,
                                    "w500"
                                  ) || ""
                                }
                                alt={movie.title}
                                className="mb-3 aspect-[2/3] w-full rounded-lg object-cover transition-transform group-hover:scale-105"
                              />
                            ) : (
                              <div className="mb-3 flex aspect-[2/3] w-full items-center justify-center rounded-lg bg-[#1c1b1b]">
                                <span className="text-4xl">🎬</span>
                              </div>
                            )}
                            <div className="line-clamp-2 text-sm font-medium text-white">
                              {movie.title}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                              <Star className="h-3 w-3 fill-primary text-primary" />
                              <span>{movie.averageRating.toFixed(1)}</span>
                              {movie.character && (
                                <>
                                  <span>•</span>
                                  <span className="line-clamp-1">
                                    {movie.character}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Frequent Collaborators */}
              {insights.frequentCollaborators.length > 0 && (
                <div className="mt-8 sm:mt-12 lg:mt-16">
                  <div className="mb-4 flex items-center gap-2 sm:mb-6">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                    <h2 className="text-xl font-bold sm:text-2xl">
                      Colaboradores Frequentes
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {insights.frequentCollaborators.map((collaborator) => (
                      <div
                        key={collaborator.id}
                        className="group cursor-pointer rounded-lg bg-[#131313] p-4 transition-colors hover:bg-[#1c1b1b]"
                        onClick={() =>
                          router.push(
                            `/dashboard/people/${collaborator.tmdbId}`
                          )
                        }
                      >
                        {collaborator.profilePath ? (
                          <img
                            src={
                              tmdbService.getProfileUrl(
                                collaborator.profilePath,
                                "w185"
                              ) || ""
                            }
                            alt={collaborator.name}
                            className="mb-3 aspect-square w-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="mb-3 flex aspect-square w-full items-center justify-center rounded-full bg-[#1c1b1b]">
                            <span className="text-4xl">👤</span>
                          </div>
                        )}
                        <div className="line-clamp-2 text-sm font-medium text-white">
                          {collaborator.name}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {collaborator.count}{" "}
                          {collaborator.count === 1 ? "filme" : "filmes"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Favorite Genre & Company */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:mt-16">
                {/* Favorite Genre */}
                {insights.favoriteGenre && (
                  <div className="rounded-lg bg-[#131313] p-6">
                    <h3 className="mb-4 text-sm font-medium tracking-widest text-primary uppercase">
                      Gênero Favorito
                    </h3>
                    <div className="text-2xl font-bold text-white">
                      {insights.favoriteGenre.name}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {insights.favoriteGenre.count}{" "}
                      {insights.favoriteGenre.count === 1 ? "filme" : "filmes"}
                    </div>
                  </div>
                )}

                {/* Favorite Company */}
                {insights.favoriteCompany && (
                  <div className="rounded-lg bg-[#131313] p-6">
                    <h3 className="mb-4 text-sm font-medium tracking-widest text-primary uppercase">
                      Produtora Favorita
                    </h3>
                    <div className="text-2xl font-bold text-white">
                      {insights.favoriteCompany.name}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {insights.favoriteCompany.count}{" "}
                      {insights.favoriteCompany.count === 1
                        ? "filme"
                        : "filmes"}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Made with Bob
