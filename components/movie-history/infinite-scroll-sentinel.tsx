"use client"

interface InfiniteScrollSentinelProps {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  moviesCount: number
  sentinelRef: (node?: Element | null) => void
}

export function InfiniteScrollSentinel({
  hasNextPage,
  isFetchingNextPage,
  moviesCount,
  sentinelRef,
}: InfiniteScrollSentinelProps) {
  return (
    <>
      {/* Infinite Scroll Sentinel */}
      {hasNextPage && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          {isFetchingNextPage && (
            <div className="text-sm text-muted-foreground">
              Carregando mais filmes...
            </div>
          )}
        </div>
      )}

      {/* End of list message */}
      {!hasNextPage && moviesCount > 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Você chegou ao fim da lista
        </div>
      )}
    </>
  )
}

// Made with Bob
