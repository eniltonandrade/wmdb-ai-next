"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authService } from "@/lib/api/auth-service"
import { Button } from "@/components/ui/button"
import { Film } from "lucide-react"

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (authService.isAuthenticated()) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Film className="size-8 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold">WMDB</h1>
          <p className="text-xl text-muted-foreground">Watch Movie Database</p>
          <p className="text-sm text-muted-foreground">
            Seu banco de dados pessoal de filmes
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/register">Criar conta</Link>
          </Button>
        </div>

        <div className="pt-8 text-xs text-muted-foreground">
          <p>Organize, avalie e descubra seus filmes favoritos</p>
        </div>
      </div>
    </div>
  )
}
