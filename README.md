# GifDay [![Netlify Status](https://api.netlify.com/api/v1/badges/247e6813-9ceb-4aa0-81e0-a7a57ef145d0/deploy-status)](https://app.netlify.com/sites/gifday/deploys)

> Your year in gifs...

[https://gifday.netlify.com](https://gifday.netlify.com)

## Motivation

I take advantage of this little project to test out a bit more [React Hooks](https://reactjs.org/docs/hooks-intro.html), I hope I didn't make any mess 😅 and to (finally) give a spin to [Playwright](https://playwright.dev/) for the integration tests.
Probably having a lot of gifs at the same time is not the best for page performance, using videos instead of images is improving the experience but it is still not good enough. Ideally, it would be better paginating them in month views, but this is going to lose a bit the "_wow effect_" on seeing a page crowded by gifs.
Another idea could be serving static images and animating the gif on `hover` or having a sort of switch for "unleashing the beast" and activating all the gifs at the same time. But also this is losing a bit the "wow effect" mentioned ☝️

## The stack

- WebApp scaffolded via [Vite](https://vite.dev)
- Syntax and formatting via [Biome](https://biomejs.dev/)
- Styling with [Tailwind](https://tailwindcss.com/)
- [Giphy APIs](https://developers.giphy.com/docs/) for GIF data
- Auth and database via [Supabase](https://supabase.com) (email OTP + Postgres)
- Unit tests with [Vitest](https://vitest.dev) and [react-testing-library](https://testing-library.com/docs/react-testing-library/intro)
- Integration tests with [Playwright](https://playwright.dev/)
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
- **Site URL**: `https://gifday.netlify.com`
- **Redirect URLs**: `https://gifday.netlify.com/**`

## Previous version (tag 0.1)

A version with the old stack is available at git tag `0.1`: [https://github.com/sirlisko/gifday/tree/0.1](https://github.com/sirlisko/gifday/tree/0.1)

Old stack: Create React App, ESLint + Prettier, Emotion, Jest, Cypress.
