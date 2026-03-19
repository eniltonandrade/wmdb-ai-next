import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication",
  description: "Sign in or create an account",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8">{children}</div>
    </div>
  )
}

// Made with Bob
