import type { Metadata } from "next"
import Link from "next/link"

import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Entrar",
  description: "Entre na sua conta",
}

export default function LoginPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Bem-vindo de volta</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Entre na sua conta para continuar
        </p>
      </div>

      <LoginForm />

      <div className="text-center text-sm text-muted-foreground">
        Não tem uma conta?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground hover:underline"
        >
          Cadastre-se
        </Link>
      </div>
    </div>
  )
}
