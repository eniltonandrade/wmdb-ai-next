import { HistoryContent } from "@/components/dashboard/HistoryContent"
import { Suspense } from "react"

export default function HistoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HistoryContent />
    </Suspense>
  )
}
