# WMDB - Watch Movie Database

A production-ready Next.js application with authentication, built following best practices from T3 Stack, bulletproof-react, taxonomy by shadcn, and next-enterprise.

## 🚀 Features

- ✅ **Authentication System**
  - Login with email/password
  - User registration
  - JWT-based authentication with refresh tokens
  - Automatic token refresh on expiration
  - Protected routes with middleware
  - Session management

- ✅ **Modern Tech Stack**
  - Next.js 16 (App Router)
  - TypeScript
  - TanStack Query (React Query) for data fetching
  - Axios for API calls with interceptors
  - Zod for validation
  - React Hook Form for forms
  - Tailwind CSS + shadcn/ui components
  - Cookie-based token storage

- ✅ **Best Practices**
  - Type-safe API layer
  - Centralized error handling
  - Loading states and error boundaries
  - Responsive design
  - Dark mode support
  - Clean architecture with separation of concerns

## 📁 Project Structure

```
wmdb-ai-next/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes (login, register)
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Protected dashboard routes
│   │   └── dashboard/
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── auth/                     # Authentication components
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── ui/                       # shadcn/ui components
│   └── error-boundary.tsx        # Error boundary component
├── hooks/                        # Custom React hooks
│   └── use-auth.ts               # Authentication hooks
├── lib/                          # Core library code
│   ├── api/                      # API layer
│   │   ├── client.ts             # Axios client with interceptors
│   │   └── auth.service.ts       # Auth service
│   ├── auth/                     # Auth utilities
│   │   ├── auth-context.tsx      # Auth context provider
│   │   └── token-storage.ts      # Token management
│   ├── config/                   # Configuration
│   │   └── env.ts                # Environment variables
│   ├── providers/                # React providers
│   │   └── query-provider.tsx    # TanStack Query provider
│   ├── types/                    # TypeScript types
│   │   ├── auth.types.ts
│   │   └── index.ts
│   └── utils.ts                  # Utility functions
├── middleware.ts                 # Next.js middleware for route protection
├── .env.local                    # Environment variables (local)
└── .env.example                  # Environment variables template
```

## 🛠️ Setup

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wmdb-ai-next
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_AUTH_COOKIE_NAME=wmdb_auth_token
NEXT_PUBLIC_REFRESH_COOKIE_NAME=wmdb_refresh_token
```

4. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3333`

## 🔐 Authentication Flow

### Login Process

1. User submits email and password via login form
2. `authService.login()` sends credentials to `/sessions/password`
3. API returns `access_token` and `refresh_token`
4. Tokens are stored in cookies via `tokenStorage`
5. User is redirected to dashboard
6. Subsequent requests include `Authorization: Bearer <access_token>` header

### Token Refresh

1. When API returns 401 (Unauthorized), axios interceptor catches it
2. Interceptor attempts to refresh token using `/sessions/refresh`
3. New tokens are stored and original request is retried
4. If refresh fails, user is redirected to login

### Route Protection

- **Middleware** (`middleware.ts`) checks for auth token in cookies
- Unauthenticated users accessing protected routes → redirected to `/login`
- Authenticated users accessing auth pages → redirected to `/dashboard`

## 📡 API Integration

### API Endpoints

The application expects the following API endpoints:

#### Authentication
- `POST /sessions/password` - Login
  ```json
  Request: { "email": "user@example.com", "password": "password123" }
  Response: { "access_token": "...", "refresh_token": "..." }
  ```

- `POST /sessions/refresh` - Refresh token
  ```json
  Headers: { "Authorization": "Bearer <refresh_token>" }
  Response: { "access_token": "...", "refresh_token": "..." }
  ```

#### User Management
- `POST /users` - Register new user
  ```json
  Request: { "name": "John Doe", "email": "user@example.com", "password": "password123" }
  Response: { "id": "...", "name": "...", "email": "...", ... }
  ```

- `GET /users/:id` - Get user details
  ```json
  Response: { "id": "...", "name": "...", "email": "...", "preferredRating": "TMDB", ... }
  ```

### API Client Configuration

The axios client (`lib/api/client.ts`) is configured with:
- Base URL from environment variables
- Request interceptor to add auth token
- Response interceptor for automatic token refresh
- Error handling and retry logic

## 🎨 UI Components

Built with shadcn/ui components:
- Button
- Form (with React Hook Form integration)
- Input
- Label
- Loading spinners
- Error messages

## 🔧 Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm typecheck    # Run TypeScript type checking
```

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Conventional file naming (kebab-case)

## 🧪 Testing

The authentication system can be tested by:

1. **Registration Flow**
   - Navigate to `/register`
   - Fill in name, email, and password
   - Submit form
   - Verify redirect to login page

2. **Login Flow**
   - Navigate to `/login`
   - Enter credentials
   - Submit form
   - Verify redirect to dashboard with user info

3. **Protected Routes**
   - Try accessing `/dashboard` without authentication
   - Verify redirect to login page
   - Login and verify access granted

4. **Token Refresh**
   - Login and wait for token expiration
   - Make an API request
   - Verify automatic token refresh

## 🚢 Deployment

### Environment Variables

Ensure the following environment variables are set in production:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_AUTH_COOKIE_NAME=wmdb_auth_token
NEXT_PUBLIC_REFRESH_COOKIE_NAME=wmdb_refresh_token
```

### Build

```bash
pnpm build
pnpm start
```

### Deployment Platforms

This project can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Docker containers

## 📚 Key Patterns & Practices

### 1. Separation of Concerns
- API layer (`lib/api/`) - handles all HTTP requests
- Services (`lib/api/auth.service.ts`) - business logic
- Hooks (`hooks/use-auth.ts`) - React integration
- Components - UI only

### 2. Type Safety
- All API responses typed with TypeScript
- Zod schemas for runtime validation
- Type inference from schemas

### 3. Error Handling
- Centralized error handling in axios interceptors
- Error boundaries for React errors
- User-friendly error messages

### 4. State Management
- TanStack Query for server state
- React Context for auth state
- Local state for UI

### 5. Security
- HTTP-only cookies for token storage (configurable)
- Automatic token refresh
- Protected routes via middleware
- CSRF protection ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

Built with inspiration from:
- [T3 Stack](https://create.t3.gg/)
- [bulletproof-react](https://github.com/alan2207/bulletproof-react)
- [taxonomy](https://github.com/shadcn/taxonomy)
- [next-enterprise](https://github.com/Blazity/next-enterprise)
- [shadcn/ui](https://ui.shadcn.com/)

---

Made with ❤️ using Next.js and TypeScript
