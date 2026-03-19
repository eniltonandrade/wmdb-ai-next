"use client"

import { useGenreInsights } from "@/hooks/useGenreInsights"
import { useWatchedYears, useReleaseYears } from "@/hooks/useYearStats"
import { LoadingPage } from "@/components/ui/loading"
import { ErrorMessage } from "@/components/error-boundary"
import { GenreDistributionChart } from "@/components/statistics/GenreDistributionChart"
import { PeopleRankingChart } from "@/components/statistics/PeopleRankingChart"
import { YearProgressionChart } from "@/components/statistics/YearProgressionChart"

export default function StatisticsPage() {
  const {
    data: genreData,
    isLoading: genreLoading,
    error: genreError,
  } = useGenreInsights({
    sort_by: "count.desc",
  })
  const { data: watchedYearsData, isLoading: watchedYearsLoading } =
    useWatchedYears()
  const { data: releaseYearsData, isLoading: releaseYearsLoading } =
    useReleaseYears()

  if (genreLoading) {
    return <LoadingPage message="Carregando estatísticas..." />
  }

  if (genreError) {
    return (
      <ErrorMessage
        title="Erro ao carregar estatísticas"
        message="Não foi possível carregar as estatísticas de gêneros."
      />
    )
  }

  const genres = genreData?.results ?? []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Estatísticas</h1>
        <p className="text-muted-foreground">
          Análise detalhada dos seus filmes assistidos
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="space-y-4">
        {/* Top Row: Genre Distribution and People Ranking */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Genre Distribution */}
          {genres.length > 0 ? (
            <GenreDistributionChart genres={genres} limit={5} />
          ) : (
            <div className="rounded-lg border bg-card p-8">
              <p className="text-center text-sm text-muted-foreground">
                Nenhum dado de gênero disponível ainda. Comece assistindo
                filmes!
              </p>
            </div>
          )}

          {/* People Ranking */}
          <PeopleRankingChart />
        </div>

        {/* Bottom Row: Year Progression Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Watched Years */}
          <YearProgressionChart
            title="Filmes Assistidos por Ano"
            data={watchedYearsData?.results ?? []}
            isLoading={watchedYearsLoading}
          />

          {/* Release Years */}
          <YearProgressionChart
            title="Filmes por Ano de Lançamento"
            data={releaseYearsData?.results ?? []}
            isLoading={releaseYearsLoading}
          />
        </div>
      </div>
    </div>
  )
}

// Made with Bob
