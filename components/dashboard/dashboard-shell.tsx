"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarNav } from "./sidebar-nav"
import { cn } from "@/lib/utils"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden lg:flex-row">
      {/* Mobile Header with Hamburger */}
      <header className="sticky top-0 z-40 border-b bg-background lg:hidden">
        <div className="flex h-16 items-center gap-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
          <h1 className="text-lg font-semibold">WMDB</h1>
        </div>
      </header>

      {/* Sidebar - Desktop: always visible, Mobile: toggleable */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r bg-background p-4 transition-transform duration-300 lg:static lg:block lg:min-h-screen lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarNav onNavigate={() => setSidebarOpen(false)} />
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <main className="min-w-0 flex-1 overflow-x-hidden p-4 lg:p-8">
        {children}
      </main>
    </div>
  )
}

// Made with Bob
