# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Application Overview

Bdash Server is a web application for sharing SQL queries and data analysis results from [Bdash](https://github.com/bdash-app/bdash), originally developed at Cookpad during a hackathon. 

### Purpose & Problem Solved
- **Knowledge Sharing**: Enables data analysts to share SQL analysis techniques across teams and roles (engineers, directors, designers)
- **Efficiency**: Prevents repeatedly writing SQL from scratch by creating a searchable repository of past analysis queries
- **Collaboration**: Supports data-driven service development by making analytical knowledge accessible organization-wide

### Key Capabilities
1. **Query Sharing**: Share SQL queries, execution results, and charts from Bdash client as web pages
2. **Documentation**: Add explanatory descriptions to queries for context and learning
3. **Search & Discovery**: Search across query titles, descriptions, and SQL content to find relevant past analysis
4. **User Pages**: Individual user profile pages showing their contributed queries
5. **Favorites**: Personal collections of frequently-used queries

### MCP Integration (Model Context Protocol)
Recent addition that transforms Bdash Server into an AI-accessible data source:
- **AI-Powered Query Generation**: AI can search historical queries and generate new SQL based on past patterns
- **Safe Data Access**: Provides query structures and logic without exposing actual customer data
- **Integrated Workflow**: Works with AI development environments to dramatically reduce SQL writing time
- **`search_bdash_queries` Tool**: MCP endpoint that enables AI agents to search and reference past queries

## Common Development Commands

### Development Setup
```bash
# Start Docker environment
docker compose -f docker-compose-dev.yml up

# Push database schema
yarn db:push

# Start development server
yarn dev
```

### Build and Test
```bash
# Production build
yarn build

# Run linting
yarn lint

# Run tests
yarn test
yarn test:watch
```

### Database Operations
```bash
# Run migrations (development)
yarn db:migrate

# Run migrations (production)
yarn db:migrate:production

# Open Prisma Studio
yarn studio
```

### Service Key Management
```bash
# Create service key
DATABASE_URL=mysql://... npm run task task/create_service_key.ts -- --name "my-app"

# Delete service key
DATABASE_URL=mysql://... npm run task task/delete_service_key.ts -- --name "my-app"
```

## Architecture

### Tech Stack
- **Framework**: Blitz.js (Next.js + Prisma)
- **Database**: MySQL
- **UI**: Chakra UI + Emotion
- **Charts**: Plotly.js
- **Authentication**: Google OAuth + Passport
- **MCP Server**: Model Context Protocol over HTTP

### Core Models (Prisma Schema)
- **User**: User information with Google OAuth authentication
- **BdashQuery**: SQL queries with results, charts, and metadata
- **Favorite**: User's favorited queries
- **ServiceKey**: Service keys for MCP API access
- **Session/Token**: Blitz session management

### Directory Structure
- `app/api/`: API endpoints (REST + MCP server)
- `app/bdash-queries/`: Query-related mutations/queries
- `app/core/`: Shared components, hooks, and libraries
- `app/pages/`: Next.js page components
- `app/users/`, `app/favorites/`: User and favorites-related functionality
- `db/`: Prisma schema and migrations
- `task/`: Batch task scripts

### Authentication Flow
- **Web UI**: Google OAuth (via Passport.js)
- **MCP API**: Bearer token (User access token or Service key)

## Environment Variables

Required environment variables (set in `.env.local`):
- `DATABASE_URL`: MySQL connection string
- `GOOGLE_CLIENT_ID`: Google OAuth client ID  
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `WEB_HOST`: Application base URL
- `SESSION_SECRET_KEY`: Session encryption key

## Development Notes

- Requires Node.js 22 (managed via Volta)
- `NODE_OPTIONS='--openssl-legacy-provider'` required for OpenSSL compatibility
- MySQL must be running via Docker
- Uses Blitz file-based routing conventions
- TypeScript + Zod for validation