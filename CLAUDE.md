# CLAUDE.md

This file provides guidance for AI assistants working with this codebase.

## Project Overview

Smart Personal Finance Management Application (Ứng dụng Quản lý Tài chính Cá nhân Thông minh) — a Vietnamese-language SPA for tracking expenses, managing budgets, analyzing income/expenses, generating financial reports, and providing AI-powered financial coaching.

## Tech Stack

- **Language:** TypeScript (~5.8.2, strict mode, ES2022 target)
- **Framework:** React 19.2.0 (hooks-based, no class components)
- **Build Tool:** Vite 6.2.0
- **Styling:** Tailwind CSS (loaded via CDN in `index.html`)
- **Icons:** Lucide React
- **Charts:** Recharts 3.4.1
- **Backend:** Supabase (PostgreSQL BaaS — auth, profiles, subscriptions)
- **AI Integration:** Google Generative AI (Gemini 1.5 Pro) for AI Coach
- **Analytics:** Vercel Analytics + Speed Insights
- **Deployment:** Vercel
- **Package Manager:** pnpm 10.26.0 (required, lock file is `pnpm-lock.yaml`)
- **Node.js:** >=20.0.0

## Commands

```bash
pnpm run dev        # Start dev server on port 3000
pnpm run build      # Production build to dist/
pnpm run preview    # Preview production build
pnpm run typecheck  # TypeScript type checking (tsc --noEmit)
pnpm run lint       # ESLint with zero warnings allowed
pnpm run check      # Full validation: typecheck + lint + build
```

Always run `pnpm run check` before committing to catch type errors, lint violations, and build failures.

## Project Structure

```
/
├── App.tsx               # Main app component — view routing via useState
├── AuthGate.tsx          # Authentication wrapper (Supabase auth flow)
├── index.tsx             # React entry point
├── index.html            # HTML template (Tailwind CDN, fonts)
├── types.ts              # All TypeScript type definitions
├── constants.ts          # Default data and seed constants
├── components/           # React UI components (23 files)
│   ├── api/              # API handler (ai-coach.ts — Gemini serverless function)
│   ├── Dashboard.tsx     # Financial overview
│   ├── Transactions.tsx  # Transaction list and management
│   ├── AddTransactionForm.tsx  # Transaction input form
│   ├── Budgets.tsx       # Budget management
│   ├── Reports.tsx       # Financial analytics with charts
│   ├── AICoach.tsx       # AI coaching interface
│   ├── Journey.tsx       # 90-day financial discipline journey
│   ├── ThirtyDayJourney.tsx  # 30-day micro-habits
│   ├── NetWorth.tsx      # Net worth tracking
│   ├── WealthPlaybookPanel.tsx  # Financial playbook (6-jar system)
│   ├── GoldenRules.tsx   # 11 Golden Rules display
│   ├── IncomeLadder.tsx  # Investment ladder education
│   ├── Sidebar.tsx       # Navigation sidebar
│   ├── Icons.tsx         # Custom icon wrappers
│   ├── Modal.tsx         # Reusable modal dialog
│   ├── LoginCard.tsx     # Login/signup UI
│   ├── CategorySettings.tsx  # Custom category management
│   ├── UpgradePlan.tsx   # Premium subscription UI
│   ├── PricingModal.tsx  # Pricing information
│   └── ...
├── lib/                  # Business logic and utilities
│   ├── financeEngine.ts  # Income tiers, pyramid levels, jar allocation
│   ├── pyramidLogic.ts   # 7-level wealth pyramid engine
│   ├── aiCoach.ts        # AI coaching logic (Gemini integration, retry, demo fallback)
│   ├── supabaseClient.ts # Singleton Supabase client, auth helpers
│   ├── planStore.ts      # LocalStorage persistence for plan/playbook state
│   ├── expertKnowledge.ts  # Embedded financial knowledge base
│   └── logout.ts         # User logout handler
├── knowledge/            # Financial knowledge base content
│   ├── financialPlaybook.ts  # Principles, jar allocations, pyramid, ladder
│   ├── financial_summary.md  # Vietnamese financial education guide
│   └── financial_deep_dive.md  # Detailed financial analysis
├── vite.config.ts        # Vite configuration (aliases, env injection, build)
├── tsconfig.json         # TypeScript config (ES2022, JSX, path aliases)
├── eslint.config.js      # ESLint flat config (strict, import rules)
└── package.json          # Dependencies and scripts
```

## Architecture

**Single-Page Application** with string-based view routing (no React Router in practice — views are toggled via `useState` in `App.tsx`).

**View types:** `dashboard`, `transactions`, `budgets`, `reports`, `journey`, `rules`, `income-ladder`, `net-worth`, `30-day-journey`, `ai-coach`, `playbook`, `category-settings`, `upgrade-plan`, `pyramid`, `portfolio`

**Layer structure:**
- UI Layer — React components in `components/`
- Business Logic — engines and utilities in `lib/`
- Data Layer — Supabase (remote) + LocalStorage (client-side persistence)

**State management:** React built-in (`useState`, `useContext`). No Redux/Zustand. Plan progress and playbook state are persisted to LocalStorage via `lib/planStore.ts`.

**Authentication:** Supabase Auth (email/password, session persistence, auto-refresh tokens). `AuthGate.tsx` wraps the entire app and gates access.

**Premium features:** Free vs Premium plan distinction. Components check `isPremium` and show upgrade modals for gated features. Plans stored in `profiles` table (`free`, `premium`, `vip_monthly`, `vip_yearly`).

## Code Conventions

- **Language in code:** Variable names, comments, and UI strings are primarily in Vietnamese.
- **Currency:** Vietnamese Dong (VNĐ) — format numbers accordingly.
- **Component files:** One component per file in `components/`, PascalCase filenames (e.g., `Dashboard.tsx`).
- **Types:** All shared types are centralized in `types.ts` at the project root.
- **Path aliases:** Use `@/` to reference the project root (e.g., `import { supabase } from "@/lib/supabaseClient"`).
- **Styling:** Tailwind CSS classes exclusively. No custom CSS files. Responsive design required.
- **Icons:** Import from `lucide-react` or use wrappers from `components/Icons.tsx`.
- **State:** `useState` for component-local state, `useContext` for shared state. No external state libraries.
- **No test framework:** Tests are not currently set up. There is no test runner or test files.

## Environment Variables

Required in `.env` (see `.env.example`):

```
VITE_GEMINI_API_KEY=...       # Google Generative AI API key
GEMINI_API_KEY=...            # Fallback Gemini key (injected via Vite define)
VITE_SUPABASE_URL=...         # Supabase project URL
VITE_SUPABASE_ANON_KEY=...    # Supabase anonymous/public key
```

Environment variables prefixed with `VITE_` are available in client code via `import.meta.env`. `GEMINI_API_KEY` (without prefix) is injected through `vite.config.ts` `define` as `process.env.GEMINI_API_KEY`.

Never commit `.env` files. Only `.env.example` is tracked.

## ESLint Configuration

- Flat config format (`eslint.config.js`)
- Extends: `@eslint/js` recommended + `typescript-eslint` recommended (type-checked)
- Import plugin with TypeScript resolver
- Rules enforced: `import/no-unresolved`, `import/named`, `import/default`, `import/no-named-as-default`
- **Zero warnings policy** (`--max-warnings=0`) — all warnings are treated as errors

## Key Domain Concepts

- **6-Jar System:** Allocates income into Essential, Education, Emergency, Invest, Fun, Give
- **7-Level Wealth Pyramid:** Survival → Stability → Growth → Safety → Financial Independence → Financial Freedom → Prosperity
- **11 Golden Rules:** Core financial principles tracked for compliance scoring
- **Income Ladder:** Step-by-step investment education progression
- **30-Day Journey:** Daily micro-habit financial challenges
- **90-Day Journey:** Longer financial discipline program
- **AI Coach:** Gemini-powered conversational financial advisor (max 700 tokens, temp 0.6)
