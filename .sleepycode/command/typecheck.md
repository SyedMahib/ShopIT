---
description: Run the ShopIT backend TypeScript typecheck (npx tsc --noEmit) and report errors. Use after any Backend/ code change.
---

Run the TypeScript compiler in no-emit mode from the `Backend/` directory and report the result:

```
npx tsc --noEmit
```

Rules that have proven out across sessions:

- **Do not use `bun`.** `bun run typecheck`, `bun run build`, and `bun typecheck` all fail in this project (bun is not available here). Skip straight to `npx tsc --noEmit`. (Past sessions wasted cycles trying bun first — ses_0b91312a5, ses_09b60605b, ses_08b7d9164.)
- Running from the repo root also works (the root `tsconfig.json` includes `Backend/**/*`), but the documented convention is to run from `Backend/`.
- Expected success: zero errors.
- On errors: group them by file, diagnose the root cause (check `MEMORY.md` Gotchas/Patterns for known traps), and report before fixing — the project rule is "diagnose first, wait for approval, then fix".

For a one-shot check of a single file, pass it explicitly:

```
npx tsc --noEmit path/to/file.ts
```
