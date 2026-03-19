"use client"

import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterButtonProps {
  onClick: () => void
  hasActiveFilters?: boolean
  className?: string
}

export function FilterButton({
  onClick,
  hasActiveFilters = false,
  className,
}: FilterButtonProps) {
  return (
    <Button
      variant="outline"
      size="default"
      onClick={onClick}
      className={cn("relative gap-2", className)}
    >
      <SlidersHorizontal className="size-4" />
      <span>Filtros</span>
      {hasActiveFilters && (
        <span className="absolute -top-1 -right-1 flex size-2 items-center justify-center rounded-full bg-primary" />
      )}
    </Button>
  )
}

// Made with Bob
