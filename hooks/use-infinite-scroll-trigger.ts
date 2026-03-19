import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

/**
 * Custom hook to trigger infinite scroll when sentinel comes into view
 *
 * @param hasNextPage - Whether there are more pages to load
 * @param isFetchingNextPage - Whether currently fetching next page
 * @param fetchNextPage - Function to fetch the next page
 * @returns ref - Reference to attach to the sentinel element
 *
 * @example
 * ```tsx
 * const sentinelRef = useInfiniteScrollTrigger(
 *   hasNextPage,
 *   isFetchingNextPage,
 *   fetchNextPage
 * )
 *
 * return <div ref={sentinelRef}>Loading...</div>
 * ```
 */
export function useInfiniteScrollTrigger(
  hasNextPage: boolean,
  isFetchingNextPage: boolean,
  fetchNextPage: () => void
) {
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  return ref
}

// Made with Bob
