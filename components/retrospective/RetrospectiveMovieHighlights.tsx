"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, Star, TrendingUp, TrendingDown } from "lucide-react"
import { env } from "@/lib/config/env"
import type { RetrospectiveMovie } from "@/lib/types/movie.types"

interface RetrospectiveMovieHighlightsProps {
  firstMovie: RetrospectiveMovie
  lastMovie: RetrospectiveMovie
  bestRated: RetrospectiveMovie
  worstRated: RetrospectiveMovie
}

interface MovieCardProps {
  movie: RetrospectiveMovie
  title: string
  icon: React.ElementType
  iconColor: string
  subtitle?: string
}

function MovieCard({
  movie,
  title,
  icon: Icon,
  iconColor,
  subtitle,
}: MovieCardProps) {
  const posterUrl = movie.posterPath
    ? `${env.tmdb.imageBaseUrl}/w342${movie.posterPath}`
    : "/icons/movie-icon.svg"

  return (
    <Link
      href={`/dashboard/movies/${movie.tmdbId}`}
      className="group rounded-lg border bg-card transition-all hover:shadow-lg"
    >
      <div className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <Icon className={`size-5 ${iconColor}`} />
          <h3 className="font-semibold">{title}</h3>
        </div>

        <div className="flex gap-4">
          <div className="relative h-[180px] w-[120px] flex-shrink-0 overflow-hidden rounded-md">
            <Image
              src={posterUrl}
              alt={movie.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="120px"
            />
          </div>

          <div className="flex flex-1 flex-col justify-between">
            <div>
              <h4 className="mb-1 line-clamp-2 font-semibold group-hover:text-primary">
                {movie.title}
              </h4>
              {movie.originalTitle !== movie.title && (
                <p className="mb-2 text-xs text-muted-foreground">
                  {movie.originalTitle}
                </p>
              )}
              {subtitle && (
                <p className="mb-2 text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              {movie.releaseDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  <span>
                    {new Date(movie.releaseDate).toLocaleDateString("pt-BR", {
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star className="size-3 fill-yellow-500 text-yellow-500" />
                <span className="font-medium">
                  {movie.averageRating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function RetrospectiveMovieHighlights({
  firstMovie,
  lastMovie,
  bestRated,
  worstRated,
}: RetrospectiveMovieHighlightsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Destaques do Ano</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <MovieCard
          movie={firstMovie}
          title="Primeiro Filme"
          icon={Calendar}
          iconColor="text-blue-500"
          subtitle={
            firstMovie.watchedDate
              ? `Assistido em ${new Date(firstMovie.watchedDate).toLocaleDateString("pt-BR")}`
              : undefined
          }
        />

        <MovieCard
          movie={lastMovie}
          title="Último Filme"
          icon={Calendar}
          iconColor="text-purple-500"
          subtitle={
            lastMovie.watchedDate
              ? `Assistido em ${new Date(lastMovie.watchedDate).toLocaleDateString("pt-BR")}`
              : undefined
          }
        />

        <MovieCard
          movie={bestRated}
          title="Melhor Avaliado"
          icon={TrendingUp}
          iconColor="text-green-500"
        />

        <MovieCard
          movie={worstRated}
          title="Pior Avaliado"
          icon={TrendingDown}
          iconColor="text-red-500"
        />
      </div>
    </div>
  )
}

// Made with Bob
