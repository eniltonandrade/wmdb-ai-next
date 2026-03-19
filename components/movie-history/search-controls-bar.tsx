"use client"

import type { SortByOption } from "@/lib/types/movie.types"
import { SearchBar } from "./search-bar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { sortOptions } from "@/lib/constants/sort-options"

interface SearchControlsBarProps {
  searchQuery: string
  debouncedSearch: string
  sortBy: SortByOption
  onSearchChange: (value: string) => void
  onSortChange: (value: SortByOption) => void
  onClearSearch: () => void
}

export function SearchControlsBar({
  searchQuery,
  debouncedSearch,
  sortBy,
  onSearchChange,
  onSortChange,
  onClearSearch,
}: SearchControlsBarProps) {
  return (
    <>
      {/* Search and Sort Bar */}
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          className="flex-1"
        />

        {/* Sort */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-[280px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Search indicator */}
      {debouncedSearch && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Buscando por: &ldquo;{debouncedSearch}&rdquo;</span>
          <button
            onClick={onClearSearch}
            className="text-primary hover:underline"
          >
            Limpar
          </button>
        </div>
      )}
    </>
  )
}

// Made with Bob
