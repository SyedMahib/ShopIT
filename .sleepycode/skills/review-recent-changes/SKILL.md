---
name: review-recent-changes
description: Triage errors in recently changed/new ShopIT backend files — find what changed, read it, run the typecheck, report root causes, and wait for approval before fixing. Use when the user says "check/fix the error in <file>", "scan recent files for errors", or reports a compile/runtime problem.
---

# Review recent changes for errors

The user frequently asks to check a specific file or scan recently changed files for errors (e.g. "authController has an error", "fix the error in orderControllers.ts", "productControllers.ts line 130", "check newly created and recently edited files"). This is the proven triage flow.

## 1. Locate the scope

- Targeted: read the named file(s) plus their model/route/middleware dependencies (`Backend/models/*`, `Backend/routes/*`, `Backend/middlewares/*`, `Backend/types/express.d.ts`).
- Broad scan: identify recent changes:
  ```
  git status
  git diff --name-only HEAD~1..HEAD
  ```
  Then read those files.

## 2. Read before judging

Read the full files (not just the reported line). Known ShopIT traps to watch for while reading (see project `MEMORY.md` for details):

- `req.body.user = req.user?._id` must be set in product create AND update controllers (Product model `user` field is required).
- `IOrderItem.price` is typed `string` — coerce with `Number()` when summing totals.
- `Model.find()` returns `[]`, never `null` — check `.length`, not `!result`.
- Mongoose subdocument push needs `as IReview` cast; `IReview.user` is a plain ObjectId — use `review.user.toString()`, never `review.user._id`.
- `review.rating` overwrite in `createProductReview` must stay inside the matching-user `if` block.
- Password field is `select: false` — explicit `.select('+password')` needed for login/updatePassword.
- Express 5 types `req.params` as `string | string[]` — cast to `string` before passing to `crypto.createHash().update()`.

## 3. Verify with the typecheck

```
npx tsc --noEmit
```

(run from `Backend/`; do NOT try `bun` — not available. See `/start-dev` companion command if servers need to be up for a runtime check.)

## 4. Report root causes — do NOT fix yet

List every error found, grouped by file, with the root cause and the fix you propose. **Wait for the user's explicit go-ahead before editing** — this is a hard project rule ("Changes require approval"). If the user only asked for diagnosis, stop after reporting.

## 5. Fix, then re-verify

After approval:

1. Apply minimal edits.
2. Re-run `npx tsc --noEmit` — must be zero errors.
3. Re-read the changed hunks to confirm the fix is complete (check for related spots with the same pattern, e.g. the sibling controller that shares the bug).

## 6. Commit

When the user's workflow has included commits (past sessions always end with commit + push), follow the existing convention:

```
git add <changed files>
git commit -m "fix: <what and why>"
git push
```

Match the repo's commit style (e.g. "fix: product review deletion not working + TypeScript type errors", "add explicit password length validation...").
