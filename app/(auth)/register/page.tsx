import type { Metadata } from "next"
import Link from "next/link"

import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie sua conta para começar",
}

export default function RegisterPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Criar conta</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Preencha os dados abaixo para criar sua conta
        </p>
      </div>

      <RegisterForm />

      <div className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground hover:underline"
        >
          Entrar
        </Link>
      </div>
    </div>
  )
}
