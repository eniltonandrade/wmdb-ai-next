"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { useMovieDetails, useMovieCredits } from "@/hooks/useTMDB"
import { useMovieHistoryDetail } from "@/hooks/useMovieHistoryDetail"
import { tmdbService } from "@/lib/api/tmdb-service"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AddToListDialog } from "@/components/movie-history/AddToListDialog"
import { ArrowLeft, Star, Users, Plus } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function MovieDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const tmdbId = Number(params.tmdbId)
  const [showCastModal, setShowCastModal] = useState(false)
  const [showAddToListDialog, setShowAddToListDialog] = useState(false)

  const {
    data: movie,
    isLoading: isLoadingMovie,
    error: movieError,
  } = useMovieDetails(tmdbId)

  const { data: credits } = useMovieCredits(tmdbId)

  const { data: historyDetail, isLoading: isLoadingHistory } =
    useMovieHistoryDetail(tmdbId)

  const isLoading = isLoadingMovie || isLoadingHistory

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

  if (movieError || !movie) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="mb-4 text-destructive">
            Falha ao carregar detalhes do filme
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

  const backdropUrl = tmdbService.getBackdropUrl(
    movie.backdrop_path,
    "original"
  )
  const posterUrl = tmdbService.getPosterUrl(movie.poster_path, "w500")
  const directors =
    credits?.crew.filter((person) => person.job === "Director") || []
  const mainCast = credits?.cast.slice(0, 10) || []
  const remainingCast = credits?.cast.slice(10) || []

  return (
    <div className="-m-4 min-h-screen bg-background text-white lg:-m-8">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[40vh] overflow-hidden sm:h-[50vh] md:h-[60vh]">
        {backdropUrl && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${backdropUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0e0e0e]/60 to-[#0e0e0e]" />
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="relative -mt-32 px-4 pb-8 sm:-mt-48 sm:px-6 md:-mt-64 md:px-8 md:pb-16">
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

          <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:gap-12">
            {/* Poster */}
            <div className="flex-shrink-0">
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt={movie.title}
                  width={280}
                  height={420}
                  className="w-full rounded-lg shadow-2xl sm:w-[200px] lg:w-[280px]"
                  priority
                />
              ) : (
                <div className="flex aspect-[2/3] w-full items-center justify-center rounded-lg bg-[#1c1b1b] sm:w-[200px] lg:w-[280px]">
                  <span className="text-muted-foreground">Sem pôster</span>
                </div>
              )}
            </div>

            {/* Movie Info */}
            <div className="flex-1 pt-0 sm:pt-4 lg:pt-8">
              {/* Genres & Year */}
              <div className="mb-4 flex items-center gap-3">
                <span className="text-sm font-medium tracking-widest text-primary uppercase">
                  {movie.genres.map((g) => g.name).join(" / ")}
                </span>
                {movie.release_date && (
                  <>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-sm tracking-widest text-muted-foreground uppercase">
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                  </>
                )}
              </div>

              {/* Title */}
              <h1 className="mb-4 font-serif text-3xl leading-tight italic sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
                {movie.title}
              </h1>

              {/* Director(s) with photo - Discrete */}
              {directors.length > 0 && (
                <div className="mb-6 flex items-center gap-4">
                  {directors.map((director) => (
                    <div key={director.id} className="flex items-center gap-3">
                      {director.profile_path ? (
                        <Image
                          src={
                            tmdbService.getProfileUrl(
                              director.profile_path,
                              "w185"
                            ) || ""
                          }
                          alt={director.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full border-2 border-primary/30 object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary/30 bg-[#1c1b1b]">
                          <span className="text-lg">👤</span>
                        </div>
                      )}
                      <div>
                        <div className="text-xs tracking-wider text-muted-foreground uppercase">
                          Direção
                        </div>
                        <div className="text-sm font-medium">
                          {director.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Overview */}
              <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mb-8 sm:text-base lg:text-lg">
                {movie.overview}
              </p>

              {/* Meta Info */}
              <div className="mb-6 flex flex-wrap items-center gap-4 sm:mb-8 sm:gap-6">
                {movie.runtime && (
                  <div className="text-sm">
                    <span className="tracking-wider text-muted-foreground uppercase">
                      Duração
                    </span>
                    <span className="ml-2 text-white">{movie.runtime} Min</span>
                  </div>
                )}
                {movie.vote_average > 0 && (
                  <div className="text-sm">
                    <span className="tracking-wider text-muted-foreground uppercase">
                      TMDB
                    </span>
                    <span className="ml-2 text-white">
                      {movie.vote_average.toFixed(1)}/10
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Personal Archive Sidebar or Add to List Button */}
            {historyDetail ? (
              <div className="w-full self-start rounded-lg bg-[#131313] p-4 sm:p-6 lg:w-80">
                <h3 className="mb-6 text-sm font-medium tracking-widest text-primary uppercase">
                  Arquivo Pessoal
                </h3>

                {/* Last Screened */}
                <div className="mb-6">
                  <div className="mb-2 text-xs tracking-wider text-muted-foreground uppercase">
                    Assistido em
                  </div>
                  <div className="text-white">
                    {format(
                      new Date(historyDetail.date),
                      "d 'de' MMMM 'de' yyyy",
                      { locale: ptBR }
                    )}
                  </div>
                </div>

                {/* Curator Rating */}
                {historyDetail.rating !== null && (
                  <div className="mb-6">
                    <div className="mb-2 text-xs tracking-wider text-muted-foreground uppercase">
                      Minha Avaliação
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-light text-primary">
                        {historyDetail.rating}
                      </span>
                      <span className="text-lg text-muted-foreground">/10</span>
                      <div className="ml-2 flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(historyDetail.rating! / 2)
                                ? "fill-primary text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Curator Notes */}
                {historyDetail.review && (
                  <div className="mb-6">
                    <div className="mb-2 text-xs tracking-wider text-muted-foreground uppercase">
                      Minhas Notas
                    </div>
                    <div className="border-l-2 border-primary pl-4">
                      <p className="text-sm leading-relaxed text-muted-foreground italic">
                        &ldquo;{historyDetail.review}&rdquo;
                      </p>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {historyDetail.tags.length > 0 && (
                  <div>
                    <div className="mb-3 text-xs tracking-wider text-muted-foreground uppercase">
                      Tags
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {historyDetail.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full px-3 py-1 text-xs text-white"
                          style={{ backgroundColor: tag.colorHex }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full self-start rounded-lg bg-[#131313] p-4 sm:p-6 lg:w-80">
                <h3 className="mb-6 text-sm font-medium tracking-widest text-primary uppercase">
                  Arquivo Pessoal
                </h3>
                <p className="mb-6 text-sm text-muted-foreground">
                  Este filme ainda não está no seu histórico.
                </p>
                <Button
                  onClick={() => setShowAddToListDialog(true)}
                  className="w-full gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar à Lista
                </Button>
              </div>
            )}
          </div>

          {/* The Ensemble - Smaller */}
          {mainCast.length > 0 && (
            <div className="mt-8 sm:mt-12 lg:mt-16">
              <div className="mb-4 flex items-center justify-between sm:mb-6">
                <h2 className="text-xl font-bold sm:text-2xl">
                  Elenco Principal
                </h2>
                {remainingCast.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCastModal(true)}
                    className="gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Ver Mais ({remainingCast.length})
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
                {mainCast.map((person) => (
                  <div
                    key={person.id}
                    className="group flex cursor-pointer flex-col transition-transform hover:scale-105"
                    onClick={() =>
                      router.push(`/dashboard/people/${person.id}`)
                    }
                  >
                    {person.profile_path ? (
                      <Image
                        src={
                          tmdbService.getProfileUrl(
                            person.profile_path,
                            "w185"
                          ) || ""
                        }
                        alt={person.name}
                        width={185}
                        height={278}
                        className="mb-2 aspect-[2/3] w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="mb-2 flex aspect-[2/3] w-full items-center justify-center rounded-lg bg-[#1c1b1b]">
                        <span className="text-3xl">👤</span>
                      </div>
                    )}
                    <div className="line-clamp-2 text-sm font-medium text-white group-hover:text-primary">
                      {person.name}
                    </div>
                    <div className="line-clamp-1 text-xs tracking-wider text-muted-foreground uppercase">
                      {person.character}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Production Houses */}
          {movie.production_companies.length > 0 && (
            <div className="mt-8 sm:mt-12 lg:mt-16">
              <h3 className="mb-6 text-sm font-medium tracking-widest text-primary uppercase">
                Produtoras
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {movie.production_companies.slice(0, 4).map((company) => (
                  <div
                    key={company.id}
                    className="flex items-center rounded-lg bg-[#131313] p-4"
                  >
                    <span className="font-medium text-white">
                      {company.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Archive Specs */}
          <div className="mt-8 rounded-lg bg-[#131313] p-4 sm:mt-12 sm:p-6 lg:mt-16">
            <h3 className="mb-6 text-sm font-medium tracking-widest text-primary uppercase">
              Especificações
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
              {movie.runtime && (
                <div>
                  <div className="mb-2 text-xs tracking-wider text-muted-foreground uppercase">
                    Duração
                  </div>
                  <div className="text-white">{movie.runtime} Min</div>
                </div>
              )}
              {movie.vote_average > 0 && (
                <div>
                  <div className="mb-2 text-xs tracking-wider text-muted-foreground uppercase">
                    Avaliação
                  </div>
                  <div className="text-white">
                    {movie.vote_average.toFixed(1)}/10
                  </div>
                </div>
              )}
              {movie.original_language && (
                <div>
                  <div className="mb-2 text-xs tracking-wider text-muted-foreground uppercase">
                    Idioma
                  </div>
                  <div className="text-white uppercase">
                    {movie.original_language}
                  </div>
                </div>
              )}
              {movie.status && (
                <div>
                  <div className="mb-2 text-xs tracking-wider text-muted-foreground uppercase">
                    Status
                  </div>
                  <div className="text-primary">
                    {movie.status === "Released" ? "Lançado" : movie.status}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Credits */}
          <div className="mt-8 flex flex-col gap-4 border-t border-[#1c1b1b] pt-6 text-sm sm:mt-12 sm:flex-row sm:justify-between sm:pt-8 lg:mt-16">
            {directors.length > 0 && (
              <div>
                <span className="tracking-wider text-muted-foreground uppercase">
                  Direção
                </span>
                <span className="ml-3 text-white">
                  {directors.map((d) => d.name).join(", ")}
                </span>
              </div>
            )}
            {movie.vote_average > 0 && (
              <div>
                <span className="tracking-wider text-muted-foreground uppercase">
                  Nota
                </span>
                <span className="ml-3 text-white">
                  {movie.vote_average.toFixed(1)}/10
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cast Dialog - Remaining Cast as List */}
      <Dialog open={showCastModal} onOpenChange={setShowCastModal}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-hidden bg-[#131313]">
          <DialogHeader>
            <DialogTitle className="text-xl">Elenco Adicional</DialogTitle>
          </DialogHeader>
          <div className="max-h-[calc(80vh-120px)] overflow-y-auto pr-2">
            <div className="space-y-3">
              {remainingCast.map((person) => (
                <div
                  key={person.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-[#1c1b1b]"
                  onClick={() => {
                    setShowCastModal(false)
                    router.push(`/dashboard/people/${person.id}`)
                  }}
                >
                  {person.profile_path ? (
                    <Image
                      src={
                        tmdbService.getProfileUrl(
                          person.profile_path,
                          "w185"
                        ) || ""
                      }
                      alt={person.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#1c1b1b]">
                      <span className="text-lg">👤</span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-white hover:text-primary">
                      {person.name}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {person.character}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add to List Dialog */}
      <AddToListDialog
        isOpen={showAddToListDialog}
        onClose={() => setShowAddToListDialog(false)}
        movieId={String(tmdbId)}
        movieTitle={movie.title}
      />
    </div>
  )
}

// Made with Bob
