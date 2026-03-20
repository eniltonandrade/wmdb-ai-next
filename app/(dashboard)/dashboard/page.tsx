"use client"

import { useUser, useLogout } from "@/hooks/use-auth"
import { useInsights } from "@/hooks/useInsights"
import { LoadingPage } from "@/components/ui/loading"
import { ErrorMessage } from "@/components/error-boundary"
import { Button } from "@/components/ui/button"
import { InsightsStats } from "@/components/dashboard/InsightsStats"
import { RecentMoviesCarousel } from "@/components/dashboard/RecentMoviesCarousel"
import { FavoritePeople } from "@/components/dashboard/FavoritePeople"
import { FavoriteActors } from "@/components/dashboard/FavoriteActors"
import { ViewingTrends } from "@/components/dashboard/ViewingTrends"
import { TrendingMovies } from "@/components/dashboard/TrendingMovies"
import { LogOut } from "lucide-react"

export default function DashboardPage() {
  const { data: user, isLoading: isLoadingUser, error: userError } = useUser()
  const {
    data: insights,
    isLoading: isLoadingInsights,
    error: insightsError,
  } = useInsights()
  const logoutMutation = useLogout()

  if (isLoadingUser || isLoadingInsights) {
    return <LoadingPage message="Carregando informações..." />
  }

  if (userError) {
    return (
      <ErrorMessage
        title="Erro ao carregar dados"
        message="Não foi possível carregar as informações do usuário."
      />
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Painel</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Bem-vindo de volta, {user?.name}!
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="w-full sm:w-auto"
        >
          <LogOut className="mr-2 size-4" />
          {logoutMutation.isPending ? "Saindo..." : "Sair"}
        </Button>
      </div>

      {/* Dashboard Stats */}
      {insightsError ? (
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar as estatísticas.
          </p>
        </div>
      ) : insights ? (
        <InsightsStats insights={insights} />
      ) : null}

      {/* Trending Movies - Full Width */}
      <TrendingMovies />

      {/* Recent Movies Carousel */}
      <RecentMoviesCarousel />

      {/* Viewing Trends */}
      <ViewingTrends />

      {/* Favorite People - Directors and Actors */}
      <div className="grid gap-6 lg:grid-cols-2">
        <FavoritePeople />
        <FavoriteActors />
      </div>
    </div>
  )
}
