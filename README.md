# ADMN fixes — how to apply

## 1. Database (do this first)
Open the Supabase SQL editor for your project and run `001_add_date_year_filters.sql`.
It's `CREATE OR REPLACE FUNCTION`, so it's safe to run — it won't touch data,
only the two RPC functions (`get_ledger_with_balances`, `get_account_balances`).

Both new parameters are optional with `DEFAULT NULL`, so nothing breaks if a
caller doesn't pass them — this is why the code changes in step 2 are safe to
deploy independently.

## 2. Code
Apply `002_code_fixes.diff` from your repo root:

```bash
git apply 002_code_fixes.diff
```

If `git apply` complains about context mismatches (likely, since the diff was
built from a repomix export rather than your live git history — line numbers
and surrounding whitespace may not match exactly), open each `--- a/<file>`
section and apply the `-`/`+` hunks by hand in VS Code; every hunk is small
and self-contained. The plain-English before/after for each change is also in
the chat above if you want to search-and-replace directly instead.

## What each hunk does
- `app/actions.ts`
  - `importData`: adds the missing auth check (previously anyone could overwrite your data via this action)
  - `createDailyPage`, `addDailyEntry`, `deleteDailyEntry`, `transferDailyToLedger`, `updateDailyEntry`, `setYearFilter`: adds the auth check every other action already has
  - `deleteDailyEntry`: now actually checks the delete's `error` instead of swallowing it
  - `changePassword`: URL-encodes the Supabase error message before putting it in a redirect query string
- `app/account/[id]/page.tsx`: passes `from`/`to` into the ledger RPC so the date-range filter actually filters
- `app/account/[id]/LedgerClient.tsx`: removes a dead `.slice(0, 150)` that could never trigger (server already caps at 100/page)
- `app/ledger/page.tsx`: replaces the "max selected year as cutoff" hack with a real year list, fixing non-contiguous year selections (e.g. 2023 + 2025, skipping 2024)
- `app/folder/[id]/page.tsx`: adds `notFound()` guard so a bad/deleted folder ID 404s instead of crashing on `folder.name`

## Not included (needs a decision from you first)
- Whether the per-account ledger page (`account/[id]/page.tsx`) should *also*
  respect the Financial Year setting in addition to the date-range pill. Right
  now Financial Year only affects the dashboard/folder totals; the individual
  account ledger ignores it. Applying both at once raises a design question
  (what happens if they conflict) — say the word if you want it wired up too.