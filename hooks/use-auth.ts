/**
 * Authentication Hooks using TanStack Query
 * Provides reactive authentication state and mutations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/api/auth-service"
import type { LoginCredentials, RegisterCredentials } from "@/lib/types"

const AUTH_QUERY_KEY = ["auth", "user"] as const

/**
 * Hook to get current user
 */
export function useUser() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authService.getCurrentUser,
    enabled: authService.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })
}

/**
 * Hook for login mutation
 */
export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: async () => {
      // Fetch user data after successful login
      const user = await authService.getCurrentUser()
      queryClient.setQueryData(AUTH_QUERY_KEY, user)
      router.push("/dashboard")
    },
    onError: (error) => {
      console.error("Login error:", error)
    },
  })
}

/**
 * Hook for register mutation
 */
export function useRegister() {
  const router = useRouter()

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authService.register(credentials),
    onSuccess: () => {
      // Redirect to login after successful registration
      router.push("/login")
    },
    onError: (error) => {
      console.error("Registration error:", error)
    },
  })
}

/**
 * Hook for logout mutation
 */
export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      authService.logout()
      return Promise.resolve()
    },
    onSuccess: () => {
      // Clear user data from cache
      queryClient.setQueryData(AUTH_QUERY_KEY, null)
      queryClient.clear()
      router.push("/login")
    },
  })
}

/**
 * Combined hook for authentication state and actions
 */
export function useAuthState() {
  const { data: user, isLoading, error } = useUser()
  const loginMutation = useLogin()
  const logoutMutation = useLogout()
  const registerMutation = useRegister()

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user && authService.isAuthenticated(),
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    register: registerMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  }
}

// Made with Bob
