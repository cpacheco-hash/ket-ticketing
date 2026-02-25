# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**KET** is a fan-first ticketing platform for the Chilean market (MVP stage). Built as a Next.js 14 monolith with App Router, deployed on Vercel with Vercel Postgres.

## Commands

```bash
# Development
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build (runs prisma generate first)
npm run lint         # ESLint
npm run type-check   # TypeScript check (tsc --noEmit)
npm run format       # Prettier auto-format

# Database
npm run db:push      # Apply schema changes to DB (dev, no migration file)
npm run db:migrate   # Create and apply migration (for production changes)
npm run db:seed      # Seed admin user (admin@ket.cl / admin)
npm run db:studio    # Open Prisma Studio GUI
npm run db:generate  # Regenerate Prisma client after schema changes
```

## Environment Setup

Copy `.env.example` to `.env.local`. Minimum required variables for local dev:
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` — `http://localhost:3000`
- `NEXT_PUBLIC_APP_URL` — `http://localhost:3000`

OAuth (Spotify, Google) and payment providers (Fintoc, Stripe, MercadoPago) are optional for local dev.

## Architecture

### Tech Stack
- **Next.js 14** with App Router — all routing is file-based under `src/app/`
- **NextAuth.js 4** — JWT strategy; supports Credentials, Google, and Spotify OAuth
- **Prisma 5 + PostgreSQL** — 15 models, all prices stored in CLP cents
- **Zustand** — cart state (`ket-cart-storage` in localStorage) and event filters
- **Zod** — validation schemas live in `src/lib/validations/`
- **Radix UI + TailwindCSS** — UI primitives in `src/components/ui/`

### Key Architectural Decisions

**Prices in cents**: All monetary values (ticket prices, fees, wallet balances) are stored as integers in CLP cents. The platform fee is 5% + CLP $500 fixed (see `src/lib/constants.ts`).

**QR Codes**: Tickets have HMAC-SHA256-signed QR codes with 15-minute rotation intervals. Logic in `src/lib/qr.ts`. The `QR_SECRET_KEY` env var must be set consistently across deployments.

**Auth session shape**: NextAuth JWT is extended with `firstName`, `lastName`, `avatar`, `role`, and Spotify tokens. The extended types are in `src/types/next-auth.d.ts`. Access via `useSession()` on the client or `getServerSession(authOptions)` on the server.

**Prisma client singleton**: Import from `src/lib/db.ts` (not directly from `@prisma/client`) to avoid multiple instances during hot reload.

**API routes pattern**: All routes return `NextResponse.json()`. Auth is checked via `getServerSession(authOptions)` at the top of each handler. Zod schemas validate request bodies.

### Roles
Users have one of three roles: `USER`, `ORGANIZER`, `ADMIN`. Organizers can create/manage events and access `/dashboard`. Only enforce role checks server-side in API routes.

### Payment Flow (partially implemented)
Three providers configured: Fintoc (A2A transfers, primary for Chile), Stripe, MercadoPago. Payment records live in the `Payment` model linked to `Order`. The checkout flow is: cart → `/checkout` → `/payment` → `/checkout/confirmation`.

### Event Lifecycle
Events go through: `UPCOMING → ON_SALE → SOLD_OUT → COMPLETED` (or `CANCELLED`). The `availableTickets` field is decremented on order creation — note there is no DB-level locking yet (MVP limitation).

### Ticket Transfers
Transfers are tracked in the `Transfer` model with a `PENDING → ACCEPTED/REJECTED/CANCELLED` flow. API at `/api/tickets/[id]/transfer`.

## Deployment

Hosted on Vercel. The `vercel.json` sets `buildCommand: "prisma generate && next build"`. Vercel Postgres is used for the database. See `DESPLIEGUE_RAPIDO.md` for quick deployment steps and `docs/DEPLOYMENT.md` for full details.
