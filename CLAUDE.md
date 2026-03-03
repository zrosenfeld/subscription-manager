# Subscription Manager

A web app that helps users optimize their subscriptions by identifying overlapping benefits, bundle perks, and family plan opportunities.

## Stack
- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Auth**: Clerk
- **Database**: Supabase (Postgres)
- **Payments**: Stripe
- **Hosting**: Vercel

## Project Structure
- `src/app/` — App Router pages and layouts
- `src/components/` — Reusable UI components
- `src/lib/` — Utility functions, DB clients, helpers

## Conventions
- Use TypeScript strictly — no `any`
- Use Tailwind for all styling — no separate CSS files
- Use the App Router — no Pages Router patterns
- Keep components small and focused
- Use server components by default, client components only when needed (`"use client"`)

## Key Features (Roadmap)
1. Onboarding: user lists their subscriptions + credit cards + carrier plan + household size
2. Optimization engine: cross-references against a matrix of known perks/bundles
3. Recommendations: ranked list of concrete changes to save money
4. v2: PDF credit card statement parsing, AI chat interface, continuous monitoring
