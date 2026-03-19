import type { Metadata } from "next"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Dashboard",
  },
  description: "Manage your account and settings",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <div className="flex">
        <aside className="min-h-screen w-64 border-r p-4">
          <SidebarNav />
        </aside>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}

// Made with Bob
