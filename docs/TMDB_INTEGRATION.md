# TMDB API Integration Guide

This document provides a comprehensive guide for integrating and using The Movie Database (TMDB) API in this project.

## Table of Contents

- [Setup](#setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [Available Hooks](#available-hooks)
- [Service Methods](#service-methods)
- [Image Handling](#image-handling)
- [Examples](#examples)
- [Best Practices](#best-practices)

## Setup

### 1. Get TMDB API Key

1. Create an account at [The Movie Database](https://www.themoviedb.org/)
2. Go to Settings → API
3. Request an API key (choose "Developer" option)
4. Copy your API key

### 2. Configure Environment Variables

Add your TMDB API key to your `.env.local` file:

```bash
# TMDB API Configuration
NEXT_PUBLIC_TMDB_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_TMDB_API_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

**Note:** The `.env.example` file contains template values. Never commit your actual API key to version control.

## Configuration

The TMDB configuration is centralized in `lib/config/env.ts`:

```typescript
export const env = {
  // ... other config
  tmdb: {
    apiKey: process.env.NEXT_PUBLIC_TMDB_API_KEY || "",
    apiUrl: process.env.NEXT_PUBLIC_TMDB_API_URL || "https://api.themoviedb.org/3",
    imageBaseUrl: process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p",
  },
}
```

## Usage

### Basic Example

```typescript
import { useSearchMovies } from "@/hooks/useTMDB"

function MovieSearch() {
  const [query, setQuery] = useState("")
  const { data, isLoading, error } = useSearchMovies(query)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies..."
      />
      {data?.results.map((movie) => (
        <div key={movie.id}>{movie.title}</div>
      ))}
    </div>
  )
}
```

## Available Hooks

All hooks are located in `hooks/useTMDB.ts` and use React Query for caching and state management.

### Movie Hooks

#### `useSearchMovies(query, page, options)`

Search for movies by title.

```typescript
const { data, isLoading, error } = useSearchMovies("Inception", 1)
```

#### `useMovieDetails(movieId, options)`

Get detailed information about a specific movie.

```typescript
const { data: movie } = useMovieDetails(550) // Fight Club
```

#### `useMovieCredits(movieId, options)`

Get cast and crew information for a movie.

```typescript
const { data: credits } = useMovieCredits(550)
```

#### `usePopularMovies(page, options)`

Get currently popular movies.

```typescript
const { data: popular } = usePopularMovies(1)
```

#### `useTopRatedMovies(page, options)`

Get top-rated movies of all time.

```typescript
const { data: topRated } = useTopRatedMovies(1)
```

#### `useNowPlayingMovies(page, options)`

Get movies currently in theaters.

```typescript
const { data: nowPlaying } = useNowPlayingMovies(1)
```

#### `useUpcomingMovies(page, options)`

Get upcoming movie releases.

```typescript
const { data: upcoming } = useUpcomingMovies(1)
```

### Person Hooks

#### `usePersonDetails(personId, options)`

Get detailed information about a person (actor, director, etc.).

```typescript
const { data: person } = usePersonDetails(287) // Brad Pitt
```

### Configuration Hook

#### `useTMDBConfiguration(options)`

Get TMDB API configuration (image sizes, base URLs, etc.).

```typescript
const { data: config } = useTMDBConfiguration()
```

## Service Methods

The `tmdbService` provides direct access to API methods. Located in `lib/api/tmdb-service.ts`.

### Direct Service Usage

```typescript
import { tmdbService } from "@/lib/api/tmdb-service"

// Search movies
const results = await tmdbService.searchMovies("Inception")

// Get movie details
const movie = await tmdbService.getMovieDetails(550)

// Get movie credits
const credits = await tmdbService.getMovieCredits(550)
```

## Image Handling

TMDB provides various image sizes. The service includes helper methods for generating image URLs.

### Image Size Options

**Poster Sizes:**

- `w92`, `w154`, `w185`, `w342`, `w500`, `w780`, `original`

**Backdrop Sizes:**

- `w300`, `w780`, `w1280`, `original`

**Profile Sizes:**

- `w45`, `w185`, `h632`, `original`

### Using Image Helpers

```typescript
import { tmdbService } from "@/lib/api/tmdb-service"

// Get poster URL
const posterUrl = tmdbService.getPosterUrl(movie.poster_path, "w500")

// Get backdrop URL
const backdropUrl = tmdbService.getBackdropUrl(movie.backdrop_path, "w1280")

// Get profile image URL
const profileUrl = tmdbService.getProfileUrl(person.profile_path, "w185")

// Generic image URL
const imageUrl = tmdbService.getImageUrl({
  path: movie.poster_path,
  size: "w342"
})
```

### Image Component Example

```typescript
import Image from "next/image"
import { tmdbService } from "@/lib/api/tmdb-service"

function MoviePoster({ movie }) {
  const posterUrl = tmdbService.getPosterUrl(movie.poster_path, "w500")

  if (!posterUrl) {
    return <div>No poster available</div>
  }

  return (
    <Image
      src={posterUrl}
      alt={movie.title}
      width={500}
      height={750}
      className="rounded-lg"
    />
  )
}
```

## Examples

### Movie Search with Pagination

```typescript
function MovieSearchWithPagination() {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const { data, isLoading } = useSearchMovies(query, page)

  return (
    <div>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setPage(1) // Reset to first page on new search
        }}
      />

      {data?.results.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}

      <div>
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page} of {data?.total_pages}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page === data?.total_pages}
        >
          Next
        </button>
      </div>
    </div>
  )
}
```

### Movie Details Page

```typescript
function MovieDetailsPage({ movieId }: { movieId: number }) {
  const { data: movie, isLoading } = useMovieDetails(movieId)
  const { data: credits } = useMovieCredits(movieId)

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <h1>{movie.title}</h1>
      <p>{movie.overview}</p>

      <div>
        <h2>Cast</h2>
        {credits?.cast.slice(0, 10).map((actor) => (
          <div key={actor.id}>
            {actor.name} as {actor.character}
          </div>
        ))}
      </div>

      <div>
        <h2>Details</h2>
        <p>Release Date: {movie.release_date}</p>
        <p>Runtime: {movie.runtime} minutes</p>
        <p>Rating: {movie.vote_average}/10</p>
      </div>
    </div>
  )
}
```

## Best Practices

### 1. Error Handling

Always handle errors gracefully:

```typescript
const { data, error, isLoading } = useSearchMovies(query)

if (error) {
  return <ErrorMessage message="Failed to load movies. Please try again." />
}
```

### 2. Loading States

Provide feedback during data fetching:

```typescript
if (isLoading) {
  return <LoadingSpinner />
}
```

### 3. Caching

React Query automatically caches responses. Configure stale times based on data volatility:

```typescript
// Popular movies change frequently
usePopularMovies(1, { staleTime: 30 * 60 * 1000 }) // 30 minutes

// Movie details rarely change
useMovieDetails(movieId, { staleTime: 24 * 60 * 60 * 1000 }) // 24 hours
```

### 4. Image Optimization

Use appropriate image sizes for different contexts:

```typescript
// Thumbnail
tmdbService.getPosterUrl(path, "w185")

// Card view
tmdbService.getPosterUrl(path, "w342")

// Detail page
tmdbService.getPosterUrl(path, "w500")

// Full screen
tmdbService.getPosterUrl(path, "original")
```

### 5. API Key Security

- Never commit API keys to version control
- Use environment variables
- Validate API key presence before making requests

### 6. Rate Limiting

TMDB has rate limits. Implement:

- Debouncing for search inputs
- Pagination instead of loading all results
- Caching to reduce API calls

## TypeScript Types

All TMDB types are defined in `lib/types/tmdb.types.ts`:

- `TMDBMovie` - Basic movie information
- `TMDBMovieDetails` - Detailed movie information
- `TMDBCredits` - Cast and crew information
- `TMDBPerson` - Person information
- `TMDBSearchMoviesResponse` - Search results with pagination

## Resources

- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [TMDB API Terms of Use](https://www.themoviedb.org/documentation/api/terms-of-use)
- [React Query Documentation](https://tanstack.com/query/latest)

## Support

For issues related to:

- **TMDB API**: Check [TMDB Support](https://www.themoviedb.org/talk)
- **This Integration**: Open an issue in the project repository

---

Made with Bob
