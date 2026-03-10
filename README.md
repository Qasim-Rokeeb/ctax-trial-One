# CTAX MVP Build

CTAX is a Corporate Income Tax (CIT) risk and audit operations MVP. It simulates how a revenue authority team can triage cases, investigate taxpayers, and track audit outcomes across multiple roles.

This project focuses on the frontend experience for tax intelligence workflows, including:

- `Auditors` reviewing queues and findings.
- `Supervisors` assigning and monitoring cases.
- `Executives` viewing portfolio-level risk and performance trends.
- `Investigation teams` drilling into taxpayer records, evidence, and timeline context.

The app is built with Next.js 16, TypeScript, Tailwind CSS v4, and shadcn-style UI primitives, using mock data to model realistic audit scenarios before backend integration.

## What This Project Is About

This repository is a product prototype for a digital tax compliance workspace. It demonstrates how CIT operations can be organized in one interface, from risk identification to case management and decision support.

At a high level, the MVP provides:

- Role-based dashboards for operational and leadership users.
- Taxpayer detail pages with findings, risk indicators, and supporting context.
- Case and queue views for assignment and tracking.
- Reusable analytics components (charts, badges, tables, and status indicators).
- A modular component architecture ready for API-backed data.

## Live links

- Deployed: **[https://ctax-mvp.vercel.app/](https://ctax-mvp.vercel.app/)**
- v0 design workspace: **[https://v0.app/chat/vhbGbf1k7M4](https://v0.app/chat/vhbGbf1k7M4)**

## Features

- Role dashboards for auditors, executives, and supervisors (see [app/dashboard](app/dashboard)).
- Taxpayer detail view with risk summaries and findings drill-down ([app/detail/[id]/page.tsx](app/detail/%5Bid%5D/page.tsx)).
- Authentication shell with protected layout and mock session handling ([components/layout/protected-layout.tsx](components/layout/protected-layout.tsx)).
- Reusable UI kit: buttons, tabs, cards, badges, alerts, and data widgets ([components/ui](components/ui)).
- Mock data source for taxpayers and findings to drive the UI without a backend ([lib/mock-data.ts](lib/mock-data.ts)).
- Risk Scenario Lab for model tuning and what-if analysis with shareable scenario links ([app/mvp/lab/page.tsx](app/mvp/lab/page.tsx)).
- CSV ingestion validation pipeline with schema checks, duplicate detection, completeness scoring, and issue export ([lib/ingestion-validation.ts](lib/ingestion-validation.ts), [app/mvp/ingestion/page.tsx](app/mvp/ingestion/page.tsx)).

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
