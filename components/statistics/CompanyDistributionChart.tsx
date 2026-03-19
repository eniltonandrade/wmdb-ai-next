"use client"

import { useState } from "react"
import type { CompanyStats } from "@/lib/types/movie.types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { X, Hash, Star } from "lucide-react"

interface CompanyDistributionChartProps {
  companies: CompanyStats[]
  limit?: number
}

export function CompanyDistributionChart({
  companies,
  limit = 5,
}: CompanyDistributionChartProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sortBy, setSortBy] = useState<"quantity" | "rating">("quantity")

  // Get top companies by selected sort
  const topCompanies = companies
    .sort((a, b) =>
      sortBy === "quantity"
        ? b.appearances - a.appearances
        : b.avgRating - a.avgRating
    )
    .slice(0, limit)

  // Find the maximum value for bar width calculation
  const maxValue =
    sortBy === "quantity"
      ? Math.max(...topCompanies.map((c) => c.appearances), 1)
      : Math.max(...topCompanies.map((c) => c.avgRating), 1)

  // Calculate total for percentage (only for quantity mode)
  const totalAppearances = topCompanies.reduce(
    (sum, company) => sum + company.appearances,
    0
  )

  return (
    <>
      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Distribuição de Produtoras</h2>

          {/* Sort Toggle */}
          <div className="flex gap-1">
            <button
              onClick={() => setSortBy("quantity")}
              className={cn(
                "rounded-lg p-2 transition-colors",
                sortBy === "quantity"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
              title="Ordenar por quantidade"
            >
              <Hash className="size-4" />
            </button>
            <button
              onClick={() => setSortBy("rating")}
              className={cn(
                "rounded-lg p-2 transition-colors",
                sortBy === "rating"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
              title="Ordenar por avaliação"
            >
              <Star className="size-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {topCompanies.map((company) => {
            const value =
              sortBy === "quantity" ? company.appearances : company.avgRating
            const percentage =
              sortBy === "quantity"
                ? (company.appearances / totalAppearances) * 100
                : (company.avgRating / 10) * 100
            const barWidth = (value / maxValue) * 100

            return (
              <div key={company.id} className="space-y-1.5">
                {/* Company name and value */}
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium tracking-wide text-foreground uppercase">
                    {company.name}
                  </span>
                  <span className="font-semibold text-foreground">
                    {sortBy === "quantity"
                      ? `${percentage.toFixed(0)}%`
                      : `★ ${value.toFixed(1)}`}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full bg-primary transition-all duration-500"
                    )}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* View All Button */}
        {companies.length > limit && (
          <div className="mt-4 border-t pt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsModalOpen(true)}
            >
              Ver Todas as Produtoras ({companies.length})
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <CompanyModal
          companies={companies}
          onClose={() => setIsModalOpen(false)}
          initialSortBy={sortBy}
        />
      )}
    </>
  )
}

interface CompanyModalProps {
  companies: CompanyStats[]
  onClose: () => void
  initialSortBy?: "quantity" | "rating"
}

function CompanyModal({
  companies,
  onClose,
  initialSortBy = "quantity",
}: CompanyModalProps) {
  const [sortBy, setSortBy] = useState<"quantity" | "rating">(initialSortBy)

  const sortedCompanies = [...companies].sort((a, b) =>
    sortBy === "quantity"
      ? b.appearances - a.appearances
      : b.avgRating - a.avgRating
  )

  const maxValue =
    sortBy === "quantity"
      ? Math.max(...sortedCompanies.map((c) => c.appearances), 1)
      : Math.max(...sortedCompanies.map((c) => c.avgRating), 1)

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Todas as Produtoras</h2>

          <div className="flex items-center gap-2">
            {/* Sort Toggle */}
            <div className="flex gap-1">
              <button
                onClick={() => setSortBy("quantity")}
                className={cn(
                  "rounded-lg p-2 transition-colors",
                  sortBy === "quantity"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
                title="Ordenar por quantidade"
              >
                <Hash className="size-4" />
              </button>
              <button
                onClick={() => setSortBy("rating")}
                className={cn(
                  "rounded-lg p-2 transition-colors",
                  sortBy === "rating"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
                title="Ordenar por avaliação"
              >
                <Star className="size-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-2">
          {sortedCompanies.map((company) => {
            const value =
              sortBy === "quantity" ? company.appearances : company.avgRating
            const barWidth = (value / maxValue) * 100

            return (
              <div key={company.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium tracking-wide uppercase">
                    {company.name}
                  </span>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{company.appearances} filmes</span>
                    <span>★ {company.avgRating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

// Made with Bob
