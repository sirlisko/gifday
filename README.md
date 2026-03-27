# GifDay [![Netlify Status](https://api.netlify.com/api/v1/badges/247e6813-9ceb-4aa0-81e0-a7a57ef145d0/deploy-status)](https://app.netlify.com/sites/gifday/deploys)

> Your year in gifs...

[https://gifday.sirlisko.com](https://gifday.sirlisko.com)

## What it does

Assign one GIF to each of the 365 days of the year and build your personal year in gifs. Click an empty day to search GIPHY and pick a GIF. Click a saved GIF to view it full-size or delete it. GIFs are stored locally or synced to your account across devices.

## The stack

- [Vite](https://vite.dev) + [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org/)
- [Biome](https://biomejs.dev/) for linting and formatting
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [GIPHY API](https://developers.giphy.com/docs/) for GIF data (proxied via Netlify function)
- [Supabase](https://supabase.com) for auth (email OTP) and database (Postgres + RLS)
- [Vitest](https://vitest.dev) + [react-testing-library](https://testing-library.com/docs/react-testing-library/intro) for unit tests
- [Playwright](https://playwright.dev/) for integration tests
- Hosted on [Netlify](https://netlify.com)

## Local development

### Environment variables

Create a `.env.local` file:

```sh
VITE_GIF_API_GET_RANDOM=https://api.giphy.com/v1/gifs/random?api_key={your_giphy_key}&rating=g
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

- **GIPHY API key**: [https://developers.giphy.com/dashboard/](https://developers.giphy.com/dashboard/)
- **Supabase keys**: Project → Settings → API

### Database setup

Run this in the Supabase SQL editor:

```sql
create table public.daily_gifs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  day_key    text not null,
  gif_data   jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, day_key)
);

alter table public.daily_gifs enable row level security;

create policy "Users manage their own gifs"
  on public.daily_gifs for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

### Commands

```bash
pnpm dev          # Start dev server (http://localhost:5173)
pnpm build        # TypeScript check + Vite build
pnpm lint         # Run Biome linter
pnpm format       # Auto-format with Biome
pnpm unit         # Run unit tests
pnpm integration  # Run Playwright E2E tests
pnpm test         # Run lint + unit + integration
```

## Deployment

The app deploys automatically to Netlify on push to `main`. Set the following environment variables in the Netlify dashboard:

```
VITE_GIF_API_GET_RANDOM
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

In Supabase → Authentication → URL Configuration, set:
- **Site URL**: `https://gifday.sirlisko.com`
- **Redirect URLs**: `https://gifday.sirlisko.com/**`

## Previous version (tag 0.1)

A version with the old stack is available at git tag `0.1`: [https://github.com/sirlisko/gifday/tree/0.1](https://github.com/sirlisko/gifday/tree/0.1)

Old stack: Create React App, ESLint + Prettier, Emotion, Jest, Cypress.
