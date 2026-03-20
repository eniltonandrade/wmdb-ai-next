"use client"

import { useState } from "react"
import { useRetrospective } from "@/hooks/useRetrospective"
import { LoadingPage } from "@/components/ui/loading"
import { ErrorMessage } from "@/components/error-boundary"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { RetrospectiveStats } from "@/components/retrospective/RetrospectiveStats"
import { RetrospectiveMovieHighlights } from "@/components/retrospective/RetrospectiveMovieHighlights"
import { RetrospectiveActivityCharts } from "@/components/retrospective/RetrospectiveActivityCharts"
import { RetrospectiveTopLists } from "@/components/retrospective/RetrospectiveTopLists"

export default function RetrospectivePage() {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)

  const {
    data: retrospective,
    isLoading,
    error,
  } = useRetrospective(selectedYear)

  const handlePreviousYear = () => {
    setSelectedYear((prev) => prev - 1)
  }

  const handleNextYear = () => {
    if (selectedYear < currentYear) {
      setSelectedYear((prev) => prev + 1)
    }
  }

  if (isLoading) {
    return <LoadingPage message="Carregando retrospectiva..." />
  }

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar retrospectiva"
        message="Não foi possível carregar os dados da retrospectiva."
      />
    )
  }

  if (!retrospective) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Calendar className="mx-auto mb-4 size-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">Nenhum dado disponível</h3>
          <p className="text-sm text-muted-foreground">
            Não há dados de retrospectiva para {selectedYear}.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Year Selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Retrospectiva</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Reveja seus filmes assistidos em {selectedYear}
          </p>
        </div>

        {/* Year Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousYear}
            aria-label="Ano anterior"
          >
            <ChevronLeft className="size-4" />
          </Button>

          <div className="flex min-w-[100px] items-center justify-center rounded-lg border bg-card px-4 py-2">
            <span className="text-lg font-semibold">{selectedYear}</span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextYear}
            disabled={selectedYear >= currentYear}
            aria-label="Próximo ano"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <RetrospectiveStats movieData={retrospective.movieData} />

      {/* Movie Highlights */}
      <RetrospectiveMovieHighlights
        firstMovie={retrospective.firstMovie}
        lastMovie={retrospective.lastMovie}
        bestRated={retrospective.bestRated}
        worstRated={retrospective.worstRated}
      />

      {/* Activity Charts */}
      <RetrospectiveActivityCharts
        activityByMonth={retrospective.activityByMonth}
        activityByDayOfWeek={retrospective.activityByDayOfWeek}
      />

      {/* Top Lists */}
      <RetrospectiveTopLists
        activityByGenre={retrospective.activityByGenre}
        mostWatchedPerson={retrospective.mostWatchedPerson}
        mostWatchedCompany={retrospective.mostWatchedCompany}
      />
    </div>
  )
}

// Made with Bob
