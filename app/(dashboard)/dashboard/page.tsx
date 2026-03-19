"use client"

import Image from "next/image"
import { useUser, useLogout } from "@/hooks/use-auth"
import { useInsights } from "@/hooks/useInsights"
import { LoadingPage } from "@/components/ui/loading"
import { ErrorMessage } from "@/components/error-boundary"
import { Button } from "@/components/ui/button"
import { InsightsStats } from "@/components/dashboard/InsightsStats"
import { ActivityChart } from "@/components/dashboard/ActivityChart"
import { LogOut, User as UserIcon } from "lucide-react"

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

      {/* User Info Card */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
            {user?.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name || "User avatar"}
                width={64}
                height={64}
                className="size-16 rounded-full object-cover"
              />
            ) : (
              <UserIcon className="size-8 text-primary" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            {user?.username && (
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            )}
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Avaliação preferida: {user?.preferredRating}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      {insightsError ? (
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar as estatísticas.
          </p>
        </div>
      ) : insights ? (
        <>
          <InsightsStats insights={insights} />

          {/* Activity Chart */}
          <ActivityChart activityByDayOfWeek={insights.activityByDayOfWeek} />
        </>
      ) : null}
    </div>
  )
}
