"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, History, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLogout } from "@/hooks/use-auth"

const navItems = [
  {
    title: "Painel",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Histórico",
    href: "/dashboard/history",
    icon: History,
  },
]

export function SidebarNav() {
  const pathname = usePathname()
  const logoutMutation = useLogout()

  return (
    <div className="flex h-full flex-col">
      <div className="mb-8">
        <h2 className="mb-2 px-4 text-lg font-semibold">WMDB</h2>
        <p className="px-4 text-sm text-muted-foreground">
          Seu gerenciador de filmes
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="size-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto border-t pt-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="mr-3 size-4" />
          {logoutMutation.isPending ? "Saindo..." : "Sair"}
        </Button>
      </div>
    </div>
  )
}

// Made with Bob
