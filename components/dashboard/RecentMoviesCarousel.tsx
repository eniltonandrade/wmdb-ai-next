"use client"

import Image from "next/image"
import Link from "next/link"
import { useMovieHistory } from "@/hooks/use-movie-history"
import { Calendar, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function RecentMoviesCarousel() {
  const { data, isLoading, error } = useMovieHistory({
    sort_by: "watched_date.desc",
  })

  // Get the first 10 movies from the first page
  const recentMovies = data?.pages[0]?.results.slice(0, 10) ?? []

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <div className="mb-4 h-6 w-48 animate-pulse rounded bg-muted" />
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

  if (error || recentMovies.length === 0) {
    return null
  }

  return (
    <div className="rounded-lg border bg-card p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">
            Assistidos Recentemente
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Últimos {recentMovies.length} filmes assistidos
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="w-full sm:w-auto"
        >
          <Link href="/dashboard/history">
            Ver Todos
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
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
          {recentMovies.map((item) => (
            <CarouselItem
              key={item.id}
              className="basis-[45%] pl-1.5 sm:basis-1/3 sm:pl-2 md:basis-1/4 md:pl-3 lg:basis-1/5 lg:pl-4"
            >
              <Link
                href={`/dashboard/movies/${item.movie.tmdbId}`}
                className="block space-y-1 sm:space-y-2"
              >
                {/* Movie Poster */}
                <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg bg-muted transition-transform hover:scale-105">
                  {item.movie.posterPath ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w342${item.movie.posterPath}`}
                      alt={item.movie.title}
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
                    {item.movie.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground sm:gap-2 sm:text-xs">
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <Calendar className="size-2.5 sm:size-3" />
                      <span>
                        {new Date(item.date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </span>
                    </div>
                    {item.rating && (
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <Star className="size-2.5 fill-yellow-400 text-yellow-400 sm:size-3" />
                        <span>{item.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
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
    </div>
  )
}

// Made with Bob
