"use client"

import { useUser, useLogout } from "@/hooks/use-auth"
import { useInsights } from "@/hooks/useInsights"
import { LoadingPage } from "@/components/ui/loading"
import { ErrorMessage } from "@/components/error-boundary"
import { Button } from "@/components/ui/button"
import { InsightsStats } from "@/components/dashboard/InsightsStats"
import { RecentMoviesCarousel } from "@/components/dashboard/RecentMoviesCarousel"
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Painel</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta, {user?.name}!
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
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

      {/* Recent Movies Carousel */}
      <RecentMoviesCarousel />
    </div>
  )
}
