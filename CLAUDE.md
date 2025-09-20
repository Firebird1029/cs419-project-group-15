# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Full Stack Development

- `npm run dev` - Start both frontend (Next.js) and backend (Flask) servers concurrently
- `npm run flask-dev` - Start only the Flask backend server on port 5328
- `npm run next-dev` - Start only the Next.js frontend server on port 3000

### Build & Deploy

- `npm run build` - Build the Next.js application for production
- `npm run start` - Start the production Next.js server

### Code Quality

- `npm run lint` - Run ESLint with auto-fix and Prettier formatting
- `npm run lint:prod` - Run linting checks without auto-fix (for CI/CD)
- `python -m pylint *.py` - Lint Python backend code (run from `api/` directory)

### Python Dependencies

- `cd api && pip install -r requirements.txt` - Install Python backend dependencies
- Use `pigar generate` (not `pip freeze`) to update `api/requirements.txt`

## Architecture Overview

This is a Next.js 14 application with a Python Flask backend, using Supabase for authentication and database operations.

### Frontend Structure

- **App Router**: Uses Next.js 13+ app directory structure (`src/app/`)
- **UI Framework**: Chakra UI for components and theming
- **Authentication**: Supabase Auth with server-side rendering support
- **State Management**: React context for auth state, server components for data fetching

### Backend Structure

- **Flask API**: RESTful API using Flask-RESTful (`api/index.py`)
- **Database**: Supabase PostgreSQL with direct client integration (`api/db.py`)
- **Authentication**: Token-based auth validation using Supabase sessions

### Key Architectural Patterns

#### Authentication Flow

- Uses Supabase SSR package for server-side auth validation
- Auth context utilities in `src/app/AuthContext.jsx`
- Protected routes check user session in layout components
- Backend validates tokens via `check_auth()` function before API operations

#### API Integration

- Development: Next.js proxies `/api/*` requests to Flask server (localhost:5328)
- Production: API routes served directly by the deployment platform
- Configuration in `next.config.mjs` handles environment-specific routing

#### Database Schema

Key tables (based on API usage):

- `games` - Game definitions with owner, name, type, details, url_tag
- `profiles` - User profiles linked to Supabase auth users
- `ratings` - User ratings/comments for games
- `scoreboard_games_profiles` - Game scoreboard entries

#### Game URL Structure

- Games accessed via `/g/[slug]` where slug is the `url_tag`
- API endpoints follow pattern `/api/g/{url_tag}/...`
- Game details at `/g/[slug]/details`

### Environment Setup

- Requires `.env.local` in root directory for frontend Supabase config
- Requires `.env` in `api/` directory for backend Supabase config
- Supabase environment variables documented in shared Google Doc (see README)

### Development Workflow

1. Install dependencies: `npm install && cd api && pip install -r requirements.txt`
2. Set up environment files with Supabase credentials
3. Run full stack: `npm run dev`
4. Frontend accessible at `localhost:3000`
5. Backend API accessible at `localhost:3000/api/` (proxied) or `127.0.0.1:5328/api/` (direct)

### Code Standards

- ESLint config extends Airbnb with React, Prettier integration
- Husky pre-commit hooks run linting and formatting
- React components use functional components with hooks
- API follows REST conventions with proper error handling
- Python code uses pylint for style checking
- Never run `npm run dev`
