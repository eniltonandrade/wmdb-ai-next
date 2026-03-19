"use client"

import Image from "next/image"
import { Calendar, Clock, Star } from "lucide-react"
import type { MovieHistoryItem } from "@/lib/types/movie.types"
import { cn } from "@/lib/utils"

interface TableViewProps {
  movies: MovieHistoryItem[]
  className?: string
}

export function TableView({ movies, className }: TableViewProps) {
  return (
    <div className={cn("overflow-x-auto rounded-lg border", className)}>
      <table className="w-full">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="p-4 text-left text-sm font-medium">Poster</th>
            <th className="p-4 text-left text-sm font-medium">Título</th>
            <th className="p-4 text-left text-sm font-medium">
              Título Original
            </th>
            <th className="p-4 text-left text-sm font-medium">Lançamento</th>
            <th className="p-4 text-left text-sm font-medium">Assistido em</th>
            <th className="p-4 text-left text-sm font-medium">Duração</th>
            <th className="p-4 text-left text-sm font-medium">
              Minha Avaliação
            </th>
            <th className="p-4 text-left text-sm font-medium">Média</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((item) => (
            <MovieRow key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface MovieRowProps {
  item: MovieHistoryItem
}

function MovieRow({ item }: MovieRowProps) {
  const { movie, rating, date } = item
  const posterUrl = movie.posterPath
    ? `https://image.tmdb.org/t/p/w92${movie.posterPath}`
    : "/placeholder-movie.png"

  const releaseYear = new Date(movie.releaseDate).getFullYear()
  const watchedDate = new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}min`
    : "N/A"

  return (
    <tr className="border-b transition-colors hover:bg-muted/50">
      {/* Poster */}
      <td className="p-4">
        <div className="relative h-16 w-11 overflow-hidden rounded">
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="44px"
          />
        </div>
      </td>

      {/* Title */}
      <td className="p-4">
        <div className="font-medium">{movie.title}</div>
      </td>

      {/* Original Title */}
      <td className="p-4">
        <div className="text-sm text-muted-foreground">
          {movie.originalTitle}
        </div>
      </td>

      {/* Release Date */}
      <td className="p-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="size-3.5 text-muted-foreground" />
          {releaseYear}
        </div>
      </td>

      {/* Watched Date */}
      <td className="p-4">
        <div className="text-sm">{watchedDate}</div>
      </td>

      {/* Runtime */}
      <td className="p-4">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="size-3.5 text-muted-foreground" />
          {runtime}
        </div>
      </td>

      {/* User Rating */}
      <td className="p-4">
        {rating !== null ? (
          <div className="flex items-center gap-1">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}/10</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )}
      </td>

      {/* Average Rating */}
      <td className="p-4">
        {movie.averageRating > 0 ? (
          <div className="flex items-center gap-1">
            <Star className="size-4 text-muted-foreground" />
            <span className="font-medium">
              {movie.averageRating.toFixed(1)}/10
            </span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )}
      </td>
    </tr>
  )
}

// Loading skeleton for table view
export function TableViewSkeleton() {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="p-4 text-left text-sm font-medium">Poster</th>
            <th className="p-4 text-left text-sm font-medium">Título</th>
            <th className="p-4 text-left text-sm font-medium">
              Título Original
            </th>
            <th className="p-4 text-left text-sm font-medium">Lançamento</th>
            <th className="p-4 text-left text-sm font-medium">Assistido em</th>
            <th className="p-4 text-left text-sm font-medium">Duração</th>
            <th className="p-4 text-left text-sm font-medium">
              Minha Avaliação
            </th>
            <th className="p-4 text-left text-sm font-medium">Média</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b">
              <td className="p-4">
                <div className="h-16 w-11 animate-pulse rounded bg-muted" />
              </td>
              <td className="p-4">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              </td>
              <td className="p-4">
                <div className="h-4 w-40 animate-pulse rounded bg-muted" />
              </td>
              <td className="p-4">
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
              </td>
              <td className="p-4">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              </td>
              <td className="p-4">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              </td>
              <td className="p-4">
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
              </td>
              <td className="p-4">
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Made with Bob
