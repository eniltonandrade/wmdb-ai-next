"use client"

import { BarChart3 } from "lucide-react"
import type {
  RetrospectiveActivityByMonth,
  RetrospectiveActivityByDayOfWeek,
} from "@/lib/types/movie.types"

interface RetrospectiveActivityChartsProps {
  activityByMonth: RetrospectiveActivityByMonth[]
  activityByDayOfWeek: RetrospectiveActivityByDayOfWeek[]
}

const MONTHS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
]

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export function RetrospectiveActivityCharts({
  activityByMonth,
  activityByDayOfWeek,
}: RetrospectiveActivityChartsProps) {
  // Prepare month data (fill missing months with 0)
  const monthData = MONTHS.map((month, index) => {
    const data = activityByMonth.find((item) => item.month === index + 1)
    return {
      month,
      count: data?.count || 0,
    }
  })

  // Prepare weekday data (fill missing days with 0)
  const weekdayData = WEEKDAYS.map((day, index) => {
    const data = activityByDayOfWeek.find((item) => item.weekday === index)
    return {
      day,
      count: data?.count || 0,
    }
  })

  const maxMonthCount = Math.max(...monthData.map((d) => d.count), 1)
  const maxWeekdayCount = Math.max(...weekdayData.map((d) => d.count), 1)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Atividade</h2>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Activity by Month */}
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="size-5 text-blue-500" />
            <h3 className="font-semibold">Filmes por Mês</h3>
          </div>

          <div className="space-y-3">
            {monthData.map((item) => (
              <div key={item.month} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.month}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{
                      width: `${(item.count / maxMonthCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity by Day of Week */}
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="size-5 text-green-500" />
            <h3 className="font-semibold">Filmes por Dia da Semana</h3>
          </div>

          <div className="space-y-3">
            {weekdayData.map((item) => (
              <div key={item.day} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.day}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all"
                    style={{
                      width: `${(item.count / maxWeekdayCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Made with Bob
