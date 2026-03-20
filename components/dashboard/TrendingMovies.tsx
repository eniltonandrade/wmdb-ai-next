"use client"

import Image from "next/image"
import Link from "next/link"
import { usePopularMovies } from "@/hooks/useTMDB"
import { tmdbService } from "@/lib/api/tmdb-service"
import { TrendingUp, Star } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function TrendingMovies() {
  const { data, isLoading, error } = usePopularMovies(1)

  const trendingMovies = data?.results.slice(0, 10) ?? []

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <div className="mb-4 h-6 w-32 animate-pulse rounded bg-muted" />
        <div className="flex gap-3 overflow-hidden sm:gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-48 w-32 shrink-0 animate-pulse rounded-lg bg-muted sm:h-64 sm:w-44"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error || trendingMovies.length === 0) {
    return null
  }

  return (
    <div className="rounded-lg border bg-card p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">Filmes em Alta</h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Populares no momento
          </p>
        </div>
        <TrendingUp className="size-5 text-primary" />
      </div>

      {/* Carousel with controls inside */}
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full overflow-hidden"
      >
        <CarouselContent className="-ml-1.5 sm:-ml-2 md:-ml-3 lg:-ml-4">
          {trendingMovies.map((movie) => {
            const posterUrl = tmdbService.getPosterUrl(
              movie.poster_path,
              "w342"
            )

            return (
              <CarouselItem
                key={movie.id}
                className="basis-[45%] pl-1.5 sm:basis-1/3 sm:pl-2 md:basis-1/4 md:pl-3 lg:basis-1/5 lg:pl-4"
              >
                <Link
                  href={`/dashboard/movies/${movie.id}`}
                  className="block space-y-1 sm:space-y-2"
                >
                  {/* Movie Poster */}
                  <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg bg-muted transition-transform hover:scale-105">
                    {posterUrl ? (
                      <Image
                        src={posterUrl}
                        alt={movie.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground">
                        <span className="text-center text-sm">Sem poster</span>
                      </div>
                    )}
                  </div>

                  {/* Movie Info */}
                  <div className="space-y-0.5 sm:space-y-1">
                    <h3 className="line-clamp-2 text-xs font-semibold sm:text-sm">
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground sm:gap-2 sm:text-xs">
                      <span>
                        {movie.release_date
                          ? new Date(movie.release_date).getFullYear()
                          : "N/A"}
                      </span>
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <Star className="size-2.5 fill-yellow-400 text-yellow-400 sm:size-3" />
                        <span>{movie.vote_average.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselPrevious
          className="left-0 sm:left-1 md:left-2"
          variant="default"
        />
        <CarouselNext
          className="right-0 sm:right-1 md:right-2"
          variant="default"
        />
      </Carousel>

      <Link
        href="/dashboard/search"
        className="mt-4 block text-center text-sm text-primary hover:underline"
      >
        Explorar mais filmes →
      </Link>
    </div>
  )
}

// Made with Bob
