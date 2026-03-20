"use client"

/**
 * ActivityByDayChart Component
 * Displays activity by day of the week using Recharts
 */

import type { ActivityByDayOfWeek } from "@/lib/types/movie.types"
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface ActivityByDayChartProps {
  activityByDayOfWeek: ActivityByDayOfWeek[]
  isLoading?: boolean
}

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

// Color for each day - using a gradient from primary to accent
const DAY_COLORS = [
  "#84cc16", // Sunday - lime
  "#a3e635", // Monday
  "#bef264", // Tuesday
  "#d9f99d", // Wednesday
  "#ecfccb", // Thursday
  "#f7fee7", // Friday
  "#fefce8", // Saturday - yellow
]

export function ActivityByDayChart({
  activityByDayOfWeek,
  isLoading,
}: ActivityByDayChartProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <div className="mb-4 h-6 w-48 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded bg-muted sm:h-80" />
      </div>
    )
  }

  // Sort by weekday and add labels
  const chartData = [...activityByDayOfWeek]
    .sort((a, b) => a.weekday - b.weekday)
    .map((day) => ({
      ...day,
      name: WEEKDAY_LABELS[day.weekday],
    }))

  const totalMovies = chartData.reduce((sum, day) => sum + day.count, 0)

  return (
    <div className="rounded-lg border bg-card p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold sm:text-xl">
          Atividade por Dia da Semana
        </h2>
        <div className="text-xs text-muted-foreground sm:text-sm">
          Total:{" "}
          <span className="font-semibold text-foreground">{totalMovies}</span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={240} className="sm:!h-[280px]">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
        >
          <XAxis
            dataKey="name"
            stroke="#9ca3af"
            tick={{ fill: "#9ca3af" }}
            style={{ fontSize: "12px" }}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#f9fafb",
            }}
            labelStyle={{ color: "#f9fafb", fontWeight: "bold" }}
            itemStyle={{ color: "#f9fafb" }}
            cursor={{ fill: "rgba(132, 204, 22, 0.1)" }}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={DAY_COLORS[entry.weekday]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Made with Bob
