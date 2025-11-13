# Pikzee — Developer README

Short summary
- Pikzee is a unified content-creation platform that combines asset management, AI-driven media transformations, a Notion-style editor, one-click publishing integrations, and team/workspace controls.
- This README focuses on how to get the project running locally, what each part of the stack does, and where to configure essential services.

Table of contents
- Project overview
- Key features
- Tech stack (high level)
- Prerequisites
- Environment variables (example)
- Local setup (dev)
- Database & migrations
- Background workers & queues
- Running with Docker
- Deploy hints
- Troubleshooting
- Contributing
- Useful links

Project overview
Pikzee aims to remove tool fragmentation for content creators by offering an end-to-end workflow: authoring, media transformations, asset storage, team collaboration, and publishing endpoints for social platforms. The system is split into frontend (SPA) and backend services with a data tier (Postgres + Redis) and background workers for heavy/async processing (media, notifications, publish jobs).

Key features
- Centralized file + asset management with search and transformations
- AI-powered image/video transformations (resize, crop, format, repurpose)
- Rich block-based editor for script and content composition
- One-click publishing integrations (YouTube, X/Twitter, LinkedIn, etc.)
- Role-based authentication & user management (Clerk)
- Collaborative workspace support and project scoping
- Job queue for media processing and scheduled publishing (BullMQ + Redis)

Tech stack (high level)
- Frontend: Vite + React (TypeScript), Tailwind CSS, shadcn components, Tiptap rich editor
- Backend: Node.js + Express, Drizzle ORM, Zod validation
- Data & infra: PostgreSQL, Redis, BullMQ, Docker, Nginx
- Integrations: Clerk (auth), ImageKit / AWS S3 (storage), Google / Twitter / LinkedIn APIs, SendGrid, Novu

Prerequisites
- Node.js (recommended LTS matching project; 18+ or the version specified in project)
- pnpm, yarn or npm (pnpm recommended if used in repo)
- PostgreSQL (local or remote)
- Redis
- Docker & Docker Compose (for containerized local setup)
- Optional: AWS credentials (S3), ImageKit keys, Clerk keys, SendGrid/Novu keys

Environment variables (example)
Create a .env.local or .env file in the backend root. Example keys (names may vary in repo — check server code/config):
- NODE_ENV=development
- PORT=4000
- DATABASE_URL=postgresql://user:pass@localhost:5432/pikzee_db
- REDIS_URL=redis://localhost:6379
- CLERK_FRONTEND_API=...
- CLERK_API_KEY=...
- IMAGEKIT_PUBLIC_KEY=...
- IMAGEKIT_PRIVATE_KEY=...
- AWS_ACCESS_KEY_ID=...
- AWS_SECRET_ACCESS_KEY=...
- S3_BUCKET=your-bucket
- SENDGRID_API_KEY=...
- NOVU_API_KEY=...
- GOOGLE_CLIENT_ID=...
- GOOGLE_CLIENT_SECRET=...
- X_API_KEY (Twitter/X)...
- LINKEDIN_CLIENT_ID & SECRET...

Always keep secrets out of version control and use a secrets manager in production.

Local setup — quick start
1. Clone:
    git clone <repo-url>
    cd <repo-root>

2. Install dependencies (example using pnpm):
    pnpm install

3. Backend:
    - Create .env (use example above)
    - Install packages: pnpm --filter backend install (if mono-repo)
    - Run migrations (see Database & migrations)
    - Start dev server:
      pnpm --filter backend dev
      or
      npm run dev (depending on repo scripts)

4. Frontend:
    - Create .env for frontend (Clerk frontend keys, API base URL)
    - Install packages: pnpm --filter web install
    - Start dev:
      pnpm --filter web dev
    - Open http://localhost:5173 (or configured port)

Database & migrations
- Database: PostgreSQL
- ORM: Drizzle — use the provided migration scripts.
Common commands (adjust for repo scripts/tooling):
- Create DB (if needed): createdb pikzee_db
- Run migrations:
  pnpm --filter backend run migrate
  or
  node ./packages/backend/dist/scripts/migrate.js
- Create seed data (if available):
  pnpm --filter backend run seed

Background workers & queues
- BullMQ + Redis is used for long-running jobs (media transformations, publish workflows, scheduled notifications).
- Start worker process:
  pnpm --filter worker dev
- Make sure REDIS_URL is set and Redis is running.
- Common worker commands: worker:start, worker:dev, worker:queue:clean (see package.json)

Image storage & media processing
- ImageKit or S3 is used for storage & CDN.
- Configure IMAGEKIT and/or AWS credentials in env.
- Media transformations happen in background jobs; configure concurrency/limits in worker config.

Running with Docker (recommended for parity)
- The repo contains Dockerfiles and a docker-compose.yml (or provide your own).
Basic steps:
1. docker compose up --build
2. This will start backend, frontend (if containerized), Postgres, Redis, and workers depending on compose file.
3. To rebuild after env changes: docker compose up --build --force-recreate

Production & deployment hints
- Containerize services and use a managed Postgres and Redis in production.
- Use a secret store for API keys.
- Use object storage (S3) for media and a CDN in front for delivery.
- Configure an autoscaling policy and horizontal worker scaling for heavy media workloads.
- Use rate-limiting and request validation on API endpoints.

Testing
- Unit tests: run npm test or pnpm test in respective packages.
- Integration tests may require a test DB and Redis instance — check test configuration.
- Linting & formatting: pnpm lint, pnpm format

Common scripts (adjust to the repo)
- dev: start dev servers (frontend & backend)
- build: build for production
- start: start production server
- migrate: run DB migrations
- seed: seed DB
- worker: start background worker
Check package.json files in root and packages for exact script names.

Troubleshooting
- 500s on auth-protected routes: ensure Clerk keys are present and Clerk is configured for backend domain.
- Media fails to upload: confirm ImageKit/S3 keys and correct bucket permissions.
- Jobs stuck in queue: inspect Redis, restart workers, and check queue concurrency/lock settings.
- CORS issues: confirm frontend API_BASE_URL and backend CORS configuration.

Contributing
- Follow the repo's CONTRIBUTING.md if present.
- Create feature branches, open PRs with clear descriptions, and include tests for new behavior.
- For infra changes, provide docker-compose examples and CI changes.

Security & best practices
- Rotate API keys regularly and never commit secrets.
- Validate input using Zod before hitting the database.
- Sanitize and scan uploaded assets.
- Enforce RBAC at route/service boundary (Clerk roles + server checks).

Useful links
- Project architecture docs (look for /architecture in docs folder)
- Tech references: Clerk, Drizzle, BullMQ, ImageKit, SendGrid, Novu

License
- See LICENSE file in repository root.

