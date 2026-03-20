interface PageHeaderProps {
  total: number
  searchResults?: number
  isSearching: boolean
}

export function PageHeader({
  total,
  searchResults,
  isSearching,
}: PageHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">Histórico de Filmes</h1>
      <p className="text-sm text-muted-foreground sm:text-base">
        {isSearching && searchResults !== undefined
          ? `${searchResults} resultado${searchResults !== 1 ? "s" : ""} encontrado${searchResults !== 1 ? "s" : ""}`
          : `${total} ${total === 1 ? "filme assistido" : "filmes assistidos"}`}
      </p>
    </div>
  )
}

// Made with Bob
