## Developer Ecosystem workflow (read first)

This repo belongs to a Developer Ecosystem pod (DevEx: MCP, CLI, SDK, Starters including the SAP connector; Marketplace; Mkt Apps; Developer Hub).
New features and changes go through the deveco workflow before any code is written here:

1. Find the work's DSCDX idea and where it is in the flow. No idea yet: write one with the `brief` skill in `contentstack/product-wiki`.
2. The PRD, TRD, test cases, tickets and code come from your own routines (PM, Architect, QA agent, Dev), gate by gate. Do not plan, draft or build them in this session. No routine for a step yet: set it up with the `deveco-aisdlc-onboarding` skill in `contentstack/agent-skills`.
3. The order, gates and intake: https://github.com/contentstack/agent-skills/blob/main/skills/deveco-aisdlc-onboarding/references/run-protocol.md

Bug fixes and support cases keep this repo's usual path. Not sure which applies? Ask before building.

## This repo

Quick Info Dashboard: a Marketplace stack dashboard widget (Tier 1, UI-only). It shows counts of content types, entries and assets, read through the App SDK CMA adapter (`@contentstack/management` with `include_count`). Entries are counted per content type, and a content type the user cannot read is skipped (counted as 0). Wiki: `marketplace-apps/quickinfodashboard/` in `contentstack/product-wiki` if present.

| Task             | Command (Node >=22.12)                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------- |
| Install          | `npm ci`                                                                                                |
| Run locally      | `npm run dev` (http://localhost:3000; the widget only works inside Contentstack, at `/stack-dashboard`) |
| Lint / typecheck | `npm run lint` · `npm run typecheck`                                                                    |
| Unit tests       | `npm test` · `npm run test:coverage` (fails under 90%)                                                  |
| Build            | `npm run build` (output `dist/`, git-ignored)                                                           |

- Routing is `BrowserRouter`; the manifest path is `/stack-dashboard`.
- `manifest.json` is a placeholder (localhost URLs, `your-cdn` icon). Do not treat it as the production manifest.
- Tests are Vitest specs next to the code (`*.spec.tsx`). Expected values come from the spec, not from running the code.
- The in-repo Playwright suite (`e2e/`) needs the `.env.sample` variables and a Contentstack account; it is not part of CI.
- Branches `claude/<type>/<KEY>-<slug>`, conventional commits (commitlint), PRs into `main`.
