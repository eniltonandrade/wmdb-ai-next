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
      <h1 className="text-3xl font-bold">Histórico de Filmes</h1>
      <p className="text-muted-foreground">
        {isSearching && searchResults !== undefined
          ? `${searchResults} resultado${searchResults !== 1 ? "s" : ""} encontrado${searchResults !== 1 ? "s" : ""}`
          : `${total} ${total === 1 ? "filme assistido" : "filmes assistidos"}`}
      </p>
    </div>
  )
}

// Made with Bob
