"use client"

/**
 * YearProgressionChart Component
 * Displays year-over-year progression with count and average rating using Recharts
 */

import { useState } from "react"
import type { YearStats } from "@/lib/types/movie.types"
import { Hash, Star } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface YearProgressionChartProps {
  title: string
  data: YearStats[]
  isLoading: boolean
}

type MetricType = "count" | "rating" | "both"

export function YearProgressionChart({
  title,
  data,
  isLoading,
}: YearProgressionChartProps) {
  const [metric, setMetric] = useState<MetricType>("both")

  // Sort data by year
  const sortedData = [...data].sort((a, b) => a.year - b.year)

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 h-6 w-48 animate-pulse rounded bg-muted" />
        <div className="h-80 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (sortedData.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">{title}</h2>
        <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">
          Nenhum dado disponível
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>

        {/* Metric Toggle */}
        <div className="flex gap-1">
          <button
            onClick={() => setMetric(metric === "count" ? "both" : "count")}
            className={`rounded-md p-1.5 transition-colors ${
              metric === "count" || metric === "both"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
            title="Mostrar quantidade"
          >
            <Hash className="h-4 w-4" />
          </button>
          <button
            onClick={() => setMetric(metric === "rating" ? "both" : "rating")}
            className={`rounded-md p-1.5 transition-colors ${
              metric === "rating" || metric === "both"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
            title="Mostrar avaliação média"
          >
            <Star className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={sortedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="year"
            stroke="#9ca3af"
            tick={{ fill: "#9ca3af" }}
            style={{ fontSize: "12px" }}
          />
          <YAxis
            yAxisId="left"
            stroke="#9ca3af"
            tick={{ fill: "#9ca3af" }}
            style={{ fontSize: "12px" }}
            hide={metric === "rating"}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 10]}
            stroke="#9ca3af"
            tick={{ fill: "#9ca3af" }}
            style={{ fontSize: "12px" }}
            hide={metric === "count"}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#f9fafb",
            }}
            labelStyle={{ color: "#f9fafb", fontWeight: "bold" }}
          />
          <Legend
            wrapperStyle={{ color: "#9ca3af", fontSize: "14px" }}
            iconType="line"
          />
          {(metric === "count" || metric === "both") && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="count"
              stroke="#84cc16"
              strokeWidth={3}
              dot={{ fill: "#84cc16", r: 5 }}
              activeDot={{ r: 7 }}
              name="Quantidade"
            />
          )}
          {(metric === "rating" || metric === "both") && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgRating"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ fill: "#f59e0b", r: 5 }}
              activeDot={{ r: 7 }}
              name="Avaliação Média"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// Made with Bob
