"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, Star } from "lucide-react"
import type { MovieHistoryItem } from "@/lib/types/movie.types"
import { cn } from "@/lib/utils"

interface GalleryViewProps {
  movies: MovieHistoryItem[]
  className?: string
}

export function GalleryView({ movies, className }: GalleryViewProps) {
  return (
    <div
      className={cn(
        "grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        className
      )}
    >
      {movies.map((item) => (
        <MovieCard key={item.id} item={item} />
      ))}
    </div>
  )
}

interface MovieCardProps {
  item: MovieHistoryItem
}

function MovieCard({ item }: MovieCardProps) {
  const { movie, rating, date } = item
  const posterUrl = movie.posterPath
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : "/placeholder-movie.png"

  const watchedDate = new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  return (
    <Link
      href={`/dashboard/movies/${movie.tmdbId}`}
      className="group relative block overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
    >
      {/* Poster */}
      <div className="relative aspect-2/3 overflow-hidden bg-muted">
        <Image
          src={posterUrl}
          alt={movie.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
        />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="line-clamp-2 leading-tight font-semibold">
          {movie.title}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="size-3.5" />
          <span>{watchedDate}</span>
        </div>

        {rating !== null && (
          <div className="mt-2 flex items-center gap-1">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}/10</span>
          </div>
        )}

        {movie.averageRating > 0 && (
          <div className="mt-1 text-xs text-muted-foreground">
            Média: {movie.averageRating.toFixed(1)}/10
          </div>
        )}
      </div>
    </Link>
  )
}

// Loading skeleton for gallery view
export function GalleryViewSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border bg-card">
          <div className="aspect-2/3 animate-pulse bg-muted" />
          <div className="space-y-3 p-4">
            <div className="h-4 animate-pulse rounded bg-muted" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Made with Bob
