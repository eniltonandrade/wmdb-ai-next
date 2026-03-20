"use client"

import { useState } from "react"
import type { GenreStats } from "@/lib/types/movie.types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Hash, Star } from "lucide-react"

interface GenreDistributionChartProps {
  genres: GenreStats[]
  limit?: number
}

export function GenreDistributionChart({
  genres,
  limit = 5,
}: GenreDistributionChartProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sortBy, setSortBy] = useState<"quantity" | "rating">("quantity")

  // Get top genres by selected sort
  const topGenres = genres
    .sort((a, b) =>
      sortBy === "quantity"
        ? b.appearances - a.appearances
        : b.avgRating - a.avgRating
    )
    .slice(0, limit)

  // Find the maximum value for bar width calculation
  const maxValue =
    sortBy === "quantity"
      ? Math.max(...topGenres.map((g) => g.appearances), 1)
      : Math.max(...topGenres.map((g) => g.avgRating), 1)

  // Calculate total for percentage (only for quantity mode)
  const totalAppearances = topGenres.reduce(
    (sum, genre) => sum + genre.appearances,
    0
  )

  return (
    <>
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold sm:text-xl">
            Distribuição de Gêneros
          </h2>

          {/* Sort Toggle */}
          <div className="flex gap-1 self-start sm:self-auto">
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
          {topGenres.map((genre) => {
            const value =
              sortBy === "quantity" ? genre.appearances : genre.avgRating
            const percentage =
              sortBy === "quantity"
                ? (genre.appearances / totalAppearances) * 100
                : (genre.avgRating / 10) * 100
            const barWidth = (value / maxValue) * 100

            return (
              <div key={genre.id} className="space-y-1.5">
                {/* Genre name and value */}
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium tracking-wide text-foreground uppercase">
                    {genre.name}
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
        {genres.length > limit && (
          <div className="mt-3 border-t pt-3 sm:mt-4 sm:pt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setIsModalOpen(true)}
            >
              Ver Todos ({genres.length})
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <GenreModal
          genres={genres}
          onClose={() => setIsModalOpen(false)}
          initialSortBy={sortBy}
        />
      )}
    </>
  )
}

interface GenreModalProps {
  genres: GenreStats[]
  onClose: () => void
  initialSortBy?: "quantity" | "rating"
}

function GenreModal({
  genres,
  onClose,
  initialSortBy = "quantity",
}: GenreModalProps) {
  const [sortBy, setSortBy] = useState<"quantity" | "rating">(initialSortBy)

  const sortedGenres = [...genres].sort((a, b) =>
    sortBy === "quantity"
      ? b.appearances - a.appearances
      : b.avgRating - a.avgRating
  )

  const maxValue =
    sortBy === "quantity"
      ? Math.max(...sortedGenres.map((g) => g.appearances), 1)
      : Math.max(...sortedGenres.map((g) => g.avgRating), 1)

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl">
        <DialogHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <DialogTitle className="text-xl font-semibold sm:text-2xl">
              Todos os Gêneros
            </DialogTitle>
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
        </DialogHeader>

        {/* Content */}
        <div className="max-h-[50vh] space-y-3 overflow-y-auto pr-2 sm:max-h-[60vh]">
          {sortedGenres.map((genre) => {
            const value =
              sortBy === "quantity" ? genre.appearances : genre.avgRating
            const barWidth = (value / maxValue) * 100

            return (
              <div key={genre.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium tracking-wide uppercase">
                    {genre.name}
                  </span>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{genre.appearances} filmes</span>
                    <span>★ {genre.avgRating.toFixed(1)}</span>
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
      </DialogContent>
    </Dialog>
  )
}

// Made with Bob
