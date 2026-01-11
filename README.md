# CTAX MVP build

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/qasim-rokeebs-projects/v0-ctax-mvp-build)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/vhbGbf1k7M4)

Modern tax audit dashboard MVP built with Next.js 16, Tailwind CSS v4, and shadcn-style UI primitives. The UI mirrors a professional revenue operations console: dark-neutral base, bold blues for primary actions, and motion for focus cues.

## Live links

- Deployed: **[https://vercel.com/qasim-rokeebs-projects/v0-ctax-mvp-build](https://vercel.com/qasim-rokeebs-projects/v0-ctax-mvp-build)**
- v0 design workspace: **[https://v0.app/chat/vhbGbf1k7M4](https://v0.app/chat/vhbGbf1k7M4)**

## Features

- Role dashboards for auditors, executives, and supervisors (see [app/dashboard](app/dashboard)).
- Taxpayer detail view with risk summaries and findings drill-down ([app/detail/[id]/page.tsx](app/detail/%5Bid%5D/page.tsx)).
- Authentication shell with protected layout and mock session handling ([components/layout/protected-layout.tsx](components/layout/protected-layout.tsx)).
- Reusable UI kit: buttons, tabs, cards, badges, alerts, and data widgets ([components/ui](components/ui)).
- Mock data source for taxpayers and findings to drive the UI without a backend ([lib/mock-data.ts](lib/mock-data.ts)).

## Quick start

Requires Node 18+ and pnpm.

1) Install deps: `pnpm install`
2) Run dev server: `pnpm dev`
3) Open: http://localhost:3000

## Available scripts

- `pnpm dev` – start Next.js in development
- `pnpm build` – production build
- `pnpm start` – serve the production build
- `pnpm lint` – run ESLint across the project

## Technology stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4, CSS variables theme, tw-animate-css
- **Icons**: lucide-react
- **UI primitives**: Radix UI + shadcn-inspired wrappers
- **Charts**: Recharts

## Project structure

- Pages: [app](app) (App Router)
- Layout: [components/layout](components/layout)
- Feature modules: [components/auditor](components/auditor), [components/executive](components/executive), [components/detail](components/detail)
- Shared UI: [components/ui](components/ui)
- Data/helpers: [lib](lib)

## Data + configuration

- Mock data lives in [lib/mock-data.ts](lib/mock-data.ts). Swap this for real APIs when wiring up backend services.
- Global theme tokens and Tailwind base styles are in [app/globals.css](app/globals.css). A light theme variant exists at [styles/globals.css](styles/globals.css).

## Notes

This repository stays in sync with deployments triggered from v0.app. Changes committed here deploy through Vercel automatically. Adjust DNS/preview settings in Vercel as needed.
