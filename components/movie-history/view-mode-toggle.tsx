"use client"

import { LayoutGrid, Table } from "lucide-react"
import { Button } from "@/components/ui/button"

type ViewMode = "gallery" | "table"

interface ViewModeToggleProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function ViewModeToggle({
  viewMode,
  onViewModeChange,
}: ViewModeToggleProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={viewMode === "gallery" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewModeChange("gallery")}
      >
        <LayoutGrid className="mr-2 size-4" />
        Galeria
      </Button>
      <Button
        variant={viewMode === "table" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewModeChange("table")}
      >
        <Table className="mr-2 size-4" />
        Tabela
      </Button>
    </div>
  )
}

// Made with Bob
