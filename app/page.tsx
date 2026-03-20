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
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6 text-center sm:space-y-8">
        <div className="flex justify-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 sm:size-16">
            <Film className="size-6 text-primary sm:size-8" />
          </div>
        </div>

        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-3xl font-bold sm:text-4xl">WMDB</h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Watch Movie Database
          </p>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Seu banco de dados pessoal de filmes
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <Button asChild size="default" className="sm:text-base">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="default"
            className="sm:text-base"
          >
            <Link href="/register">Criar conta</Link>
          </Button>
        </div>

        <div className="pt-6 text-xs text-muted-foreground sm:pt-8">
          <p>Organize, avalie e descubra seus filmes favoritos</p>
        </div>
      </div>
    </div>
  )
}
