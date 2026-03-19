"use client"

import { useEffect, useState } from "react"
import { useUser, useLogout } from "@/hooks/use-auth"
import { LoadingPage } from "@/components/ui/loading"
import { ErrorMessage } from "@/components/error-boundary"
import { Button } from "@/components/ui/button"
import { LogOut, User as UserIcon } from "lucide-react"

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const { data: user, isLoading, error } = useUser()
  const logoutMutation = useLogout()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <LoadingPage message="Carregando..." />
  }

  if (isLoading) {
    return <LoadingPage message="Carregando informações do usuário..." />
  }

  if (error) {
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
              <img
                src={user.avatarUrl}
                alt={user.name}
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Filmes Assistidos
          </h3>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Lista de Desejos
          </h3>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Avaliações
          </h3>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="rounded-lg border bg-card p-8">
        <h2 className="mb-4 text-xl font-semibold">Atividade Recente</h2>
        <p className="text-center text-sm text-muted-foreground">
          Nenhuma atividade recente ainda. Comece adicionando filmes à sua
          lista!
        </p>
      </div>
    </div>
  )
}
