"use client"

import type { ActivityByDayOfWeek } from "@/lib/types/movie.types"
import { cn } from "@/lib/utils"

interface ActivityChartProps {
  activityByDayOfWeek: ActivityByDayOfWeek[]
}

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export function ActivityChart({ activityByDayOfWeek }: ActivityChartProps) {
  // Find the maximum count to calculate bar heights
  const maxCount = Math.max(...activityByDayOfWeek.map((day) => day.count), 1)

  // Sort by weekday to ensure correct order
  const sortedActivity = [...activityByDayOfWeek].sort(
    (a, b) => a.weekday - b.weekday
  )

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="mb-6 text-xl font-semibold">
        Atividade por Dia da Semana
      </h2>

      <div className="space-y-4">
        {/* Bar Chart */}
        <div className="flex h-48 items-end justify-between gap-2">
          {sortedActivity.map((day) => {
            const heightPercentage = (day.count / maxCount) * 100

            return (
              <div
                key={day.weekday}
                className="flex flex-1 flex-col items-center gap-2"
              >
                {/* Bar */}
                <div className="relative flex h-40 w-full flex-col justify-end">
                  <div
                    className={cn(
                      "w-full rounded-t-lg bg-primary transition-all hover:opacity-80",
                      day.count === 0 && "bg-muted"
                    )}
                    style={{ height: `${heightPercentage}%` }}
                  >
                    {/* Count label on top of bar */}
                    {day.count > 0 && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-foreground">
                        {day.count}
                      </div>
                    )}
                  </div>
                </div>

                {/* Day label */}
                <span className="text-xs font-medium text-muted-foreground">
                  {WEEKDAY_LABELS[day.weekday]}
                </span>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
          <span>Total de filmes assistidos</span>
          <span className="font-semibold text-foreground">
            {sortedActivity.reduce((sum, day) => sum + day.count, 0)}
          </span>
        </div>
      </div>
    </div>
  )
}

// Made with Bob
