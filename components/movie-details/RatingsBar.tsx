"use client"

import Image from "next/image"
import { OMDbRating } from "@/lib/types/omdb.types"

interface RatingsBarProps {
  tmdbRating?: number
  tmdbVoteCount?: number
  omdbRatings?: OMDbRating[]
  imdbRating?: string
  metascore?: string
}

interface RatingItem {
  source: string
  value: string
  icon: string
  color: string
  maxValue: number
}

export function RatingsBar({
  tmdbRating,
  tmdbVoteCount,
  omdbRatings,
  imdbRating,
  metascore,
}: RatingsBarProps) {
  const ratings: RatingItem[] = []

  // Add TMDB rating
  if (tmdbRating && tmdbRating > 0) {
    ratings.push({
      source: "TMDB",
      value: `${tmdbRating.toFixed(1)}/10`,
      icon: "/icons/tmdb_logo.svg",
      color: "#01b4e4",
      maxValue: 10,
    })
  }

  // Add IMDb rating
  if (imdbRating && imdbRating !== "N/A") {
    ratings.push({
      source: "IMDb",
      value: `${imdbRating}/10`,
      icon: "/icons/imdb_logo.svg",
      color: "#f5c518",
      maxValue: 10,
    })
  }

  // Add Metascore
  if (metascore && metascore !== "N/A") {
    const score = parseInt(metascore)
    ratings.push({
      source: "Metacritic",
      value: `${metascore}/100`,
      icon: "/icons/metacritic_logo.svg",
      color: score >= 61 ? "#66cc33" : score >= 40 ? "#ffcc33" : "#ff6666",
      maxValue: 100,
    })
  }

  // Add Rotten Tomatoes ratings from OMDb
  if (omdbRatings) {
    const rtRating = omdbRatings.find((r) =>
      r.Source.includes("Rotten Tomatoes")
    )
    if (rtRating) {
      ratings.push({
        source: "Rotten Tomatoes",
        value: rtRating.Value,
        icon: "/icons/tomatometer-aud_score-fresh.svg",
        color: "#fa320a",
        maxValue: 100,
      })
    }
  }

  if (ratings.length === 0) {
    return null
  }

  return (
    <div>
      <h3 className="mb-4 text-sm font-medium tracking-widest text-primary uppercase">
        Avaliações
      </h3>
      <div className="space-y-4">
        {ratings.map((rating, index) => {
          // Calculate percentage for progress bar
          const numericValue = parseFloat(rating.value)
          const percentage = (numericValue / rating.maxValue) * 100

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative h-8 w-8 flex-shrink-0">
                    <Image
                      src={rating.icon}
                      alt={rating.source}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium text-white">
                    {rating.source}
                  </span>
                </div>
                <span className="text-sm font-bold text-white">
                  {rating.value}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#1c1b1b]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: rating.color,
                  }}
                />
              </div>
              {rating.source === "TMDB" && tmdbVoteCount && (
                <div className="text-xs text-muted-foreground">
                  {tmdbVoteCount.toLocaleString("pt-BR")} votos
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Made with Bob
