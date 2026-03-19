import type { Metadata } from "next"

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
      {/* Navigation/Sidebar will be added here later */}
      <div className="flex">
        <aside className="min-h-screen w-64 border-r p-4">
          <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
            Sidebar navigation will be added here
          </div>
        </aside>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}

// Made with Bob
