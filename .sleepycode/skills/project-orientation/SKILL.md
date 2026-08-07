---
name: project-orientation
description: Read the full ShopIT codebase (Backend + Frontend + root configs) to build a complete architecture picture, skipping all .env files. Use when the user says "read the full backend folder", "read my project", or "do you have the full picture of the project".
---

# Project orientation — read the whole codebase

The user has asked to "read the full backend folder" / "read my project" / "do you have the full picture of the project?" and expects the agent to carry a complete architecture map afterward. This is the proven reading order.

## Hard rule: never read .env files

`Backend/config/config.env` contains SMTP credentials and secrets — never read it, never cat it, never grep it. In one past session the agent read it before the user had to correct: "dont read any .env file". If you need an env value, ask the user to provide it.

## Reading order

1. **Backend structure** — glob `Backend/**/*`, then read:
   - `Backend/app.ts` (entry, dotenv path, global error handlers — note the `process.exit(1)` on uncaught errors)
   - `Backend/routes/*` (products, auth, orders — route wiring + guards)
   - `Backend/controllers/*` (productControllers, authControllers, orderControllers)
   - `Backend/models/*` (product, user, order — schemas + TS interfaces)
   - `Backend/middlewares/*` (error, catchAsyncErrors, auth)
   - `Backend/types/express.d.ts` (global `Express.Request.user`)
   - `Backend/utils/*` (emailTemplates, sendEmail, sendToken, apiFilters, errorHandler)
   - `Backend/seeder/*` (seeder.ts, data.ts) — note the hardcoded DB URI
   - **Skip**: `Backend/config/config.env` (secrets), `node_modules`, `dist/`
2. **Root configs** — `.gitignore`, `package.json` (backend-only scripts: dev/build/prod/seeder), `tsconfig.json` (NodeNext, rootDir `./Backend`, strict), `README.md` (placeholder).
3. **Frontend** (if present / requested) — `Frontend/package.json`, `Frontend/vite.config.ts` (proxy `/api` → `:3000`), `Frontend/src/**` (App.tsx, main.tsx), tsconfigs.
4. **package-lock.json** — read only the header (~100 lines) if needed; the rest is per-package metadata. Do not read `node_modules` (generated; the lockfile records the tree).

## Deliverable

Produce a structured summary:
- Architecture (Express + TS + Mongoose; cookie JWT auth; ESM `.js` import specifiers)
- File map with one-line purpose per file (mirror the `## §6` style used in past checkpoints)
- Known gotchas/durable facts that affect future work (seeder hardcoded URI, `TokenExpiredError` check, apiFilters keyword case mismatch, password `select: false`)
- Explicitly note what was skipped (config.env, node_modules) and why

This is a read-only workflow: no edits, no fixes, no commits unless the user asks.
