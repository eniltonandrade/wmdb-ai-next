"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AlertCircle } from "lucide-react"
import { AxiosError } from "axios"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useLogin } from "@/hooks/use-auth"

// Validation schema using Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("Por favor, insira um endereço de e-mail válido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(8, "A senha deve ter pelo menos 8 caracteres"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const loginMutation = useLogin()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    loginMutation.mutate(data)
  }

  // Get error message from mutation
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
      return (
        error.response?.data?.message ||
        error.message ||
        "E-mail ou senha inválidos"
      )
    }
    if (error instanceof Error) {
      return error.message
    }
    return "Ocorreu um erro inesperado. Por favor, tente novamente."
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Server-side error display */}
        {loginMutation.error && (
          <div
            role="alert"
            aria-live="assertive"
            className="flex items-start gap-3 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive dark:border-destructive dark:bg-destructive/20"
          >
            <AlertCircle
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            <div className="flex-1">
              <p className="font-medium">Falha na autenticação</p>
              <p className="mt-1 text-xs opacity-90">
                {getErrorMessage(loginMutation.error)}
              </p>
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  disabled={loginMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Senha</FormLabel>
                <a
                  href="/forgot-password"
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Esqueceu a senha?
                </a>
              </div>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  disabled={loginMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </Form>
  )
}
