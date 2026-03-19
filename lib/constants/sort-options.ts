import type { SortByOption } from "@/lib/types/movie.types"

export const sortOptions: { value: SortByOption; label: string }[] = [
  { value: "watched_date.desc", label: "Data assistido (mais recente)" },
  { value: "watched_date.asc", label: "Data assistido (mais antigo)" },
  { value: "release_date.desc", label: "Lançamento (mais recente)" },
  { value: "release_date.asc", label: "Lançamento (mais antigo)" },
  { value: "rating_user.desc", label: "Minha avaliação (maior)" },
  { value: "rating_user.asc", label: "Minha avaliação (menor)" },
  { value: "average_rating.desc", label: "Média geral (maior)" },
  { value: "average_rating.asc", label: "Média geral (menor)" },
  { value: "rating_imdb.desc", label: "IMDb (maior)" },
  { value: "rating_imdb.asc", label: "IMDb (menor)" },
  { value: "rating_tmdb.desc", label: "TMDB (maior)" },
  { value: "rating_tmdb.asc", label: "TMDB (menor)" },
  { value: "rating_rotten.desc", label: "Rotten Tomatoes (maior)" },
  { value: "rating_rotten.asc", label: "Rotten Tomatoes (menor)" },
  { value: "rating_metacritic.desc", label: "Metacritic (maior)" },
  { value: "rating_metacritic.asc", label: "Metacritic (menor)" },
]

// Made with Bob
