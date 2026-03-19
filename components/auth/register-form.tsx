"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AlertCircle, CheckCircle2 } from "lucide-react"
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
import { useRegister } from "@/hooks/use-auth"

// Validation schema using Zod
const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z
      .string()
      .min(1, "E-mail é obrigatório")
      .email("Por favor, insira um endereço de e-mail válido"),
    password: z
      .string()
      .min(1, "Senha é obrigatória")
      .min(8, "A senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const registerMutation = useRegister()
  const [showSuccess, setShowSuccess] = React.useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: RegisterFormValues) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registerData } = data
    registerMutation.mutate(registerData, {
      onSuccess: () => {
        setShowSuccess(true)
        form.reset()
      },
    })
  }

  // Get error message from mutation
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
      return (
        error.response?.data?.message || error.message || "Erro ao criar conta"
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
        {/* Success message */}
        {showSuccess && (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-start gap-3 rounded-md border border-green-500/50 bg-green-500/10 p-3 text-sm text-green-600 dark:border-green-500 dark:bg-green-500/20 dark:text-green-400"
          >
            <CheckCircle2
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            <div className="flex-1">
              <p className="font-medium">Conta criada com sucesso!</p>
              <p className="mt-1 text-xs opacity-90">
                Redirecionando para o login...
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {registerMutation.error && (
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
              <p className="font-medium">Erro ao criar conta</p>
              <p className="mt-1 text-xs opacity-90">
                {getErrorMessage(registerMutation.error)}
              </p>
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Seu nome"
                  autoComplete="name"
                  disabled={registerMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  disabled={registerMutation.isPending}
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
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Crie uma senha"
                  autoComplete="new-password"
                  disabled={registerMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirme sua senha"
                  autoComplete="new-password"
                  disabled={registerMutation.isPending}
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
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>
    </Form>
  )
}

// Made with Bob
