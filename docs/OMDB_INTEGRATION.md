# OMDb API Integration

This document describes the integration with the Open Movie Database (OMDb) API in the WMDB application.

## Overview

The OMDb API provides additional movie data including IMDb ratings, Rotten Tomatoes scores, and other metadata that complements the TMDB integration. This integration allows the application to enrich movie information with data from multiple sources.

## API Documentation

- **Official Documentation**: https://www.omdbapi.com/
- **API Key**: Required (free tier available)
- **Base URL**: `https://www.omdbapi.com/`

## Getting Started

### 1. Obtain an API Key

1. Visit https://www.omdbapi.com/apikey.aspx
2. Choose a plan (free tier includes 1,000 daily requests)
3. Verify your email address
4. Copy your API key

### 2. Configure Environment Variables

Add your OMDb API key to your `.env.local` file:

```bash
NEXT_PUBLIC_OMDB_API_KEY=your_omdb_api_key_here
NEXT_PUBLIC_OMDB_API_URL=https://www.omdbapi.com/
```

## Architecture

### File Structure

```
lib/
├── api/
│   └── omdb-service.ts          # OMDb API service layer
├── config/
│   └── env.ts                   # Environment configuration (includes OMDb)
└── types/
    └── omdb.types.ts            # TypeScript types for OMDb API

hooks/
└── useOMDB.ts                   # React Query hooks for OMDb
```

### Components

#### 1. Types (`lib/types/omdb.types.ts`)

Defines TypeScript interfaces for OMDb API responses:

- `OMDbSearchResult` - Brief movie information from search
- `OMDbSearchResponse` - Search results with pagination
- `OMDbMovieDetails` - Full movie details
- `OMDbSeasonDetails` - TV series season information
- `OMDbRating` - Rating from various sources (IMDb, Rotten Tomatoes, etc.)

#### 2. Service Layer (`lib/api/omdb-service.ts`)

The `OMDbService` class provides methods to interact with the OMDb API:

**Search Methods:**

- `searchMovies(query, page, type?, year?)` - Search for movies/series
- `searchMoviesWithDetails(query, page)` - Search and fetch full details

**Details Methods:**

- `getMovieByImdbId(imdbId, plot?)` - Get movie by IMDb ID
- `getMovieByTitle(title, year?, plot?)` - Get movie by title
- `getSeasonDetails(imdbId, season)` - Get TV series season details

**Utility Methods:**

- `getPosterUrl(posterPath)` - Get poster URL
- `parseGenres(genreString)` - Parse comma-separated genres
- `parseActors(actorsString)` - Parse comma-separated actors
- `parseDirectors(directorsString)` - Parse comma-separated directors
- `parseRuntime(runtimeString)` - Convert runtime string to minutes
- `parseRating(ratingString)` - Convert rating string to number

#### 3. React Query Hooks (`hooks/useOMDB.ts`)

Custom hooks for data fetching with caching:

- `useOMDbSearch(query, page, type?, year?)` - Search movies
- `useOMDbMovieByImdbId(imdbId, plot?)` - Get movie by IMDb ID
- `useOMDbMovieByTitle(title, year?, plot?)` - Get movie by title
- `useOMDbSearchWithDetails(query, page)` - Search with full details
- `useOMDbSeasonDetails(imdbId, season)` - Get season details
- `useEnrichedMovieData(imdbId)` - Helper for enriching data

## Usage Examples

### Basic Search

```typescript
import { useOMDbSearch } from '@/hooks/useOMDB'

function MovieSearch() {
  const { data, isLoading, error } = useOMDbSearch('Inception', 1, 'movie')

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data?.Search?.map((movie) => (
        <div key={movie.imdbID}>
          <h3>{movie.Title} ({movie.Year})</h3>
          <img src={movie.Poster} alt={movie.Title} />
        </div>
      ))}
    </div>
  )
}
```

### Get Movie Details by IMDb ID

```typescript
import { useOMDbMovieByImdbId } from '@/hooks/useOMDB'

function MovieDetails({ imdbId }: { imdbId: string }) {
  const { data: movie, isLoading } = useOMDbMovieByImdbId(imdbId, 'full')

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h1>{movie?.Title}</h1>
      <p>{movie?.Plot}</p>
      <div>
        <strong>IMDb Rating:</strong> {movie?.imdbRating}/10
      </div>
      <div>
        <strong>Ratings:</strong>
        {movie?.Ratings.map((rating) => (
          <div key={rating.Source}>
            {rating.Source}: {rating.Value}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Enrich TMDB Data with OMDb

```typescript
import { useMovieDetails } from '@/hooks/useTMDB'
import { useOMDbMovieByImdbId } from '@/hooks/useOMDB'

function EnrichedMovieDetails({ tmdbId }: { tmdbId: number }) {
  const { data: tmdbData } = useMovieDetails(tmdbId)
  const { data: omdbData } = useOMDbMovieByImdbId(
    tmdbData?.imdb_id || '',
    'full'
  )

  return (
    <div>
      <h1>{tmdbData?.title}</h1>

      {/* TMDB Data */}
      <div>
        <strong>TMDB Rating:</strong> {tmdbData?.vote_average}/10
      </div>

      {/* OMDb Data */}
      {omdbData && (
        <>
          <div>
            <strong>IMDb Rating:</strong> {omdbData.imdbRating}/10
          </div>
          <div>
            <strong>Metascore:</strong> {omdbData.Metascore}
          </div>
          <div>
            <strong>Awards:</strong> {omdbData.Awards}
          </div>
          {omdbData.Ratings.map((rating) => (
            <div key={rating.Source}>
              {rating.Source}: {rating.Value}
            </div>
          ))}
        </>
      )}
    </div>
  )
}
```

### Using Service Directly

```typescript
import { omdbService } from '@/lib/api/omdb-service'

async function searchMovies() {
  try {
    const results = await omdbService.searchMovies('Matrix', 1, 'movie')
    console.log(results.Search)
  } catch (error) {
    console.error('Search failed:', error)
  }
}

async function getMovieDetails() {
  try {
    const movie = await omdbService.getMovieByImdbId('tt0133093', 'full')
    console.log(movie.Title, movie.imdbRating)

    // Parse utilities
    const genres = omdbService.parseGenres(movie.Genre)
    const actors = omdbService.parseActors(movie.Actors)
    const runtime = omdbService.parseRuntime(movie.Runtime)
  } catch (error) {
    console.error('Failed to get movie:', error)
  }
}
```

## Data Mapping

### OMDb to TMDB Correlation

When using both APIs together, you can correlate data using the IMDb ID:

```typescript
// TMDB provides imdb_id in movie details
const tmdbMovie = await tmdbService.getMovieDetails(550)
const imdbId = tmdbMovie.imdb_id // "tt0137523"

// Use IMDb ID to fetch OMDb data
const omdbMovie = await omdbService.getMovieByImdbId(imdbId)
```

### Rating Sources

OMDb provides ratings from multiple sources:

- **Internet Movie Database** - IMDb rating (0-10)
- **Rotten Tomatoes** - Tomatometer percentage
- **Metacritic** - Metascore (0-100)

## API Limits

### Free Tier

- 1,000 requests per day
- No commercial use
- Rate limited

### Paid Tiers

- Higher request limits
- Commercial use allowed
- Priority support

## Error Handling

The service automatically handles API errors:

```typescript
try {
  const movie = await omdbService.getMovieByImdbId('invalid_id')
} catch (error) {
  // Error: OMDb API error: Movie not found!
  console.error(error.message)
}
```

React Query hooks provide error states:

```typescript
const { data, error, isError } = useOMDbMovieByImdbId('tt0133093')

if (isError) {
  console.error('Failed to fetch movie:', error)
}
```

## Best Practices

1. **Use IMDb IDs when possible** - More reliable than title searches
2. **Cache aggressively** - React Query hooks have built-in caching
3. **Combine with TMDB** - Use both APIs for comprehensive data
4. **Handle missing data** - OMDb returns "N/A" for missing fields
5. **Parse strings** - Use provided utility methods for genres, actors, etc.
6. **Monitor API usage** - Stay within your daily limit

## Caching Strategy

React Query hooks use the following cache times:

- **Search results**: 5 minutes
- **Movie details**: 10 minutes
- **Season details**: 10 minutes

You can override these in individual hook calls:

```typescript
const { data } = useOMDbMovieByImdbId('tt0133093', 'full', {
  staleTime: 30 * 60 * 1000, // 30 minutes
  cacheTime: 60 * 60 * 1000, // 1 hour
})
```

## Troubleshooting

### API Key Not Working

1. Verify your API key is correct
2. Check if you've verified your email
3. Ensure you haven't exceeded daily limits
4. Check environment variable is set correctly

### Movie Not Found

1. Verify the IMDb ID format (e.g., "tt0133093")
2. Try searching by title instead
3. Check if the movie exists in OMDb database

### Missing Data

OMDb returns "N/A" for missing fields. Always check:

```typescript
const poster = omdbService.getPosterUrl(movie.Poster) // Returns null if "N/A"
const genres = omdbService.parseGenres(movie.Genre) // Returns [] if "N/A"
```

## Related Documentation

- [TMDB Integration](./TMDB_INTEGRATION.md)
- [OMDb API Official Docs](https://www.omdbapi.com/)

## Made with Bob
