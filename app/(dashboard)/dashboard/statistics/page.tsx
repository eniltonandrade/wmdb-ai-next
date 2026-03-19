"use client"

import { useGenreInsights } from "@/hooks/useGenreInsights"
import { LoadingPage } from "@/components/ui/loading"
import { ErrorMessage } from "@/components/error-boundary"
import { GenreDistributionChart } from "@/components/statistics/GenreDistributionChart"

export default function StatisticsPage() {
  const { data, isLoading, error } = useGenreInsights({
    sort_by: "count.desc",
  })

  if (isLoading) {
    return <LoadingPage message="Carregando estatísticas..." />
  }

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar estatísticas"
        message="Não foi possível carregar as estatísticas de gêneros."
      />
    )
  }

  const genres = data?.results ?? []

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
      <div className="grid gap-4 md:grid-cols-2">
        {/* Genre Distribution */}
        {genres.length > 0 ? (
          <GenreDistributionChart genres={genres} limit={5} />
        ) : (
          <div className="rounded-lg border bg-card p-8">
            <p className="text-center text-sm text-muted-foreground">
              Nenhum dado de gênero disponível ainda. Comece assistindo filmes!
            </p>
          </div>
        )}

        {/* Placeholder for future statistics */}
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-2 text-lg font-semibold">Mais Estatísticas</h3>
            <p className="text-sm text-muted-foreground">
              Em breve: análise por ano, diretores favoritos, e muito mais...
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-2 text-lg font-semibold">Tendências</h3>
            <p className="text-sm text-muted-foreground">
              Em breve: gráficos de tendências ao longo do tempo...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Made with Bob
