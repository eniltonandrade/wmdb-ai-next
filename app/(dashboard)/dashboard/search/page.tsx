import SearchContent from "@/components/dashboard/SearchContent"
import { Suspense } from "react"

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}

// Made with Bob
