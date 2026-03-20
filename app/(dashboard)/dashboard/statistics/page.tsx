"use client"

import { useGenreInsights } from "@/hooks/useGenreInsights"
import { useWatchedYears, useReleaseYears } from "@/hooks/useYearStats"
import { useInsights } from "@/hooks/useInsights"
import { useCompanyInsights } from "@/hooks/useCompanyInsights"
import { LoadingPage } from "@/components/ui/loading"
import { ErrorMessage } from "@/components/error-boundary"
import { GenreDistributionChart } from "@/components/statistics/GenreDistributionChart"
import { PeopleRankingChart } from "@/components/statistics/PeopleRankingChart"
import { YearProgressionChart } from "@/components/statistics/YearProgressionChart"
import { ActivityByDayChart } from "@/components/statistics/ActivityByDayChart"
import { CompanyDistributionChart } from "@/components/statistics/CompanyDistributionChart"

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
  const { data: insights, isLoading: insightsLoading } = useInsights()
  const { data: companyData } = useCompanyInsights({
    sort_by: "count.desc",
  })

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
  const companies = companyData?.results ?? []

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Estatísticas</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Análise detalhada dos seus filmes assistidos
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="space-y-4 sm:space-y-6">
        {/* Top Row: Genre Distribution and Company Distribution */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
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

          {/* Company Distribution */}
          {companies.length > 0 ? (
            <CompanyDistributionChart companies={companies} limit={5} />
          ) : (
            <div className="rounded-lg border bg-card p-8">
              <p className="text-center text-sm text-muted-foreground">
                Nenhum dado de produtora disponível ainda. Comece assistindo
                filmes!
              </p>
            </div>
          )}
        </div>

        {/* Second Row: People Ranking and Activity by Day */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <PeopleRankingChart />

          {/* Activity by Day of Week */}
          <ActivityByDayChart
            activityByDayOfWeek={insights?.activityByDayOfWeek ?? []}
            isLoading={insightsLoading}
          />
        </div>

        {/* Third Row: Year Progression Charts */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
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
