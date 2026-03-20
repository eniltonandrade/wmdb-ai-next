# OMDb API Setup Guide

This guide will help you set up the OMDb API integration in your WMDB application.

## What is OMDb?

The Open Movie Database (OMDb) API provides additional movie data including:

- IMDb ratings and vote counts
- Rotten Tomatoes scores
- Metacritic scores
- Awards information
- Box office data
- And more!

## Setup Instructions

### Step 1: Get Your OMDb API Key

1. Visit [OMDb API Key Registration](https://www.omdbapi.com/apikey.aspx)
2. Choose a plan:
   - **Free**: 1,000 daily requests (perfect for personal use)
   - **Paid**: Higher limits for production use
3. Enter your email address
4. Check your email and click the activation link
5. Copy your API key from the confirmation email

### Step 2: Configure Environment Variables

1. Create a `.env.local` file in the root of your project (if it doesn't exist)
2. Add your OMDb API key:

```bash
# OMDb API Configuration
NEXT_PUBLIC_OMDB_API_KEY=your_api_key_here
NEXT_PUBLIC_OMDB_API_URL=https://www.omdbapi.com/
```

Replace `your_api_key_here` with the actual API key you received.

### Step 3: Verify the Integration

1. Start your development server:

```bash
npm run dev
# or
pnpm dev
```

2. Navigate to any movie details page
3. You should now see a "Avaliações" (Ratings) section with:
   - TMDB rating with progress bar
   - IMDb rating with progress bar
   - Metacritic score (if available)
   - Rotten Tomatoes score (if available)

## Features

### Ratings Bar Component

The movie details page now displays a comprehensive ratings bar showing:

- **TMDB Rating**: From The Movie Database with vote count
- **IMDb Rating**: From the Internet Movie Database
- **Metacritic Score**: Color-coded based on score (green ≥61, yellow ≥40, red <40)
- **Rotten Tomatoes**: Tomatometer score

Each rating includes:

- Provider logo/icon
- Rating value
- Visual progress bar with provider-specific colors
- Additional context (like vote counts for TMDB)

### Additional Data

The integration also enriches movie details with:

- Box office information
- Awards and nominations
- More detailed metadata

## API Limits

### Free Tier

- 1,000 requests per day
- Resets at midnight UTC
- No commercial use

### Monitoring Usage

The integration uses React Query caching to minimize API calls:

- Search results: cached for 5 minutes
- Movie details: cached for 10 minutes

## Troubleshooting

### "OMDb API key is not configured" Error

**Solution**: Make sure you've added the API key to your `.env.local` file and restarted your development server.

### No Ratings Showing

**Possible causes**:

1. The movie doesn't have an IMDb ID in TMDB
2. The movie is not in the OMDb database
3. API key is invalid or expired
4. Daily request limit exceeded

**Solution**: Check the browser console for error messages and verify your API key is active.

### Rate Limit Exceeded

**Solution**:

- Wait until midnight UTC for the limit to reset
- Consider upgrading to a paid plan
- Implement additional caching strategies

## Development

### Using the OMDb Service Directly

```typescript
import { omdbService } from '@/lib/api/omdb-service'

// Search movies
const results = await omdbService.searchMovies('Inception', 1, 'movie')

// Get movie by IMDb ID
const movie = await omdbService.getMovieByImdbId('tt1375666', 'full')

// Get movie by title
const movie = await omdbService.getMovieByTitle('The Matrix', '1999')
```

### Using React Query Hooks

```typescript
import { useOMDbMovieByImdbId } from '@/hooks/useOMDB'

function MovieComponent({ imdbId }: { imdbId: string }) {
  const { data, isLoading, error } = useOMDbMovieByImdbId(imdbId, 'full')

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data</div>

  return <div>{data?.Title}</div>
}
```

## Documentation

For more detailed information, see:

- [OMDb Integration Documentation](./docs/OMDB_INTEGRATION.md)
- [OMDb API Official Documentation](https://www.omdbapi.com/)

## Support

If you encounter any issues:

1. Check the [OMDb API FAQ](https://www.omdbapi.com/#faq)
2. Verify your API key is active
3. Check the browser console for error messages
4. Review the integration documentation

## Made with Bob
