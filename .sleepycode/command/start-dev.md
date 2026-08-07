---
description: Start the ShopIT dev servers (backend + frontend) in the background and verify they respond. Usage: /start-dev [backend|frontend|both] — defaults to both.
---

Start the dev servers and verify they are reachable. This is the flow used when the user says "please start the server for the frontend/backend" or wants a smoke test.

## Backend (Express, port 3000)

1. Kill any stale instance first (port conflict is the usual failure):
   ```
   pkill -f "tsx watch Backend/app.ts" || true
   ```
2. Start detached with logs:
   ```
   nohup npm run dev > /tmp/backend-dev.log 2>&1 & echo "PID: $!"
   ```
   (root `package.json` script `dev` = `tsx watch Backend/app.ts`; `.env` lives at `Backend/config/config.env`, loaded by `app.ts`)
3. Verify:
   ```
   curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/v1/products
   ```
   Any HTTP response (including 401) means the server is up. If nothing responds, tail `/tmp/backend-dev.log`.

## Frontend (Vite + React, port 5173)

1. If `Frontend/node_modules/.bin/vite` is missing, install deps first:
   ```
   npm install --no-audit --no-fund
   ```
   (run with workdir `Frontend/`)
2. Kill any stale instance:
   ```
   pkill -f "vite" || true
   ```
3. Start detached with logs:
   ```
   nohup npm run dev > /tmp/shopit-frontend.log 2>&1 & echo "PID: $!"
   ```
   (run with workdir `Frontend/`; Vite `dev` script)
4. Verify:
   ```
   curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
   ```
   Expect 200. The Vite proxy in `Frontend/vite.config.ts` forwards `/api` → `http://localhost:3000`, so the frontend can also be smoke-tested via `http://localhost:5173/api/v1/products`.

## Report

Report which servers are up, on which ports, and any log-tail errors. If a server fails to start, show the relevant lines from the log and diagnose before retrying.
