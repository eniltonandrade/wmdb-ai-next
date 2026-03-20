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
      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 h-6 w-48 animate-pulse rounded bg-muted" />
        <div className="flex gap-4 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-64 w-44 shrink-0 animate-pulse rounded-lg bg-muted"
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
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Assistidos Recentemente</h2>
          <p className="text-sm text-muted-foreground">
            Últimos {recentMovies.length} filmes assistidos
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
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
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {recentMovies.map((item) => (
            <CarouselItem
              key={item.id}
              className="basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 md:pl-4 lg:basis-1/5"
            >
              <Link
                href={`/dashboard/movies/${item.movie.tmdbId}`}
                className="block space-y-2"
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
                <div className="space-y-1">
                  <h3 className="line-clamp-2 text-sm font-semibold">
                    {item.movie.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      <span>
                        {new Date(item.date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </span>
                    </div>
                    {item.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="size-3 fill-yellow-400 text-yellow-400" />
                        <span>{item.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" variant="default" />
        <CarouselNext className="right-2" variant="default" />
      </Carousel>
    </div>
  )
}

// Made with Bob
