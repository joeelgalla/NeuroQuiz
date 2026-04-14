---
description: Hard NEVER rules for any agent working on NeuroQuiz. Always load.
---

# Prohibitions — NEVER do these without explicit Joe approval

- **NEVER `git push`** without Joe explicitly saying "push it" or equivalent. Local commits are fine; pushing is a deploy event (auto-deploy is live on Vercel).
- **NEVER restructure the `Question` interface** in `src/data.ts` — it's coupled to Game.tsx, AdminPanel.tsx, and the Vite server plugin.
- **NEVER delete images** from `public/drawings/` — they may be referenced by questions you haven't audited yet.
- **NEVER skip the audit checklist** before declaring a task complete (see `.claude/rules/audits.md`).
- **NEVER bypass the pre-commit hook** (no `--no-verify`) — it keeps CLAUDE.md and AGENTS.md synced.
- **NEVER commit secrets** — `.env` is gitignored, keep it that way. The default `ADMIN_PASSWORD` in code is for local dev only.
- **NEVER force-push or rewrite git history** on `main` — the team is collaborating off this branch.
- **NEVER add new top-level dependencies** (`npm install <pkg>`) without first proposing it and explaining why an existing tool can't do the job.
- **NEVER touch `data.backup.ts`** — it's auto-managed by the Admin Panel publish flow.
- **NEVER assume a user-facing claim is correct without verifying** (e.g., "all 22 nerve roots are covered") — run the audit first.
