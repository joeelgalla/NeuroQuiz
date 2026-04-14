# NeuroQuiz — Project Context

> **Single source of truth.** Any agent working on this project MUST read this file first. Detailed rules are in `.claude/rules/`. The Changelog at the bottom tracks major milestones.

## Plan-First Safety (READ THIS BEFORE EDITING ANY FILE)

For any task that touches multiple files, changes data structures, modifies the build/deploy pipeline, or alters shared conventions: **first generate a written plan** (which files, what changes, why) and **wait for Joe's approval** before editing. Single-file bug fixes and small UI tweaks may proceed directly, but everything else MUST be planned first.

This rule overrides any "agent enthusiasm" to start coding immediately. **If you find yourself about to edit 3+ files, stop and write the plan instead.**

## Modular Rules — Load What You Need

Detailed rules live in `.claude/rules/` and load conditionally based on what files you're touching:

| File | Always-load? | Loads when working on |
|---|---|---|
| `.claude/rules/prohibitions.md` | ✅ Always | The "NEVER do X" list |
| `.claude/rules/git-workflow.md` | ✅ Always | Commits, pushes, multi-agent awareness |
| `.claude/rules/data-schema.md` | Conditional | `src/data.ts` |
| `.claude/rules/question-authoring.md` | Conditional | `src/data.ts` (adding/editing questions) |
| `.claude/rules/audits.md` | Conditional | `src/data.ts`, `src/Game.tsx`, `src/AdminPanel.tsx`, `vite.config.ts` |
| `.claude/rules/admin-panel.md` | Conditional | `src/AdminPanel.tsx`, `vite.config.ts` |

**Read the always-load files NOW.** Read the conditional ones when you touch the relevant code.

## What This Is

A mobile-friendly quiz app for medical students to practice neuroanatomy — myotomes, dermatomes, nerve roots (motor innervation), and brain regions. Fast rounds, visual multiple choice, instant feedback, timer, score tracking. Modeled after "Amino Acid Quiz."

**Long-term goal:** App Store publication (iOS + Android via Capacitor). **Near-term:** shareable web app for Joe's medical school team.

## Who's Working On This

- **Joseph Elgallad** — Y2 MD student at UofT Temerty. Owns the project, curates anatomical accuracy.
- **Joe's friend** — drew all illustration assets (myotome action drawings + dermatome zone overlays).
- **Med school team** — collaborating colleagues being added as GitHub collaborators.
- **AI agents** — Claude Code (terminal) + Gemini 3.1 Pro (Antigravity sidebar). See workflow below.

## Development Environment: Antigravity IDE

Built inside **Google's Antigravity IDE** (a VS Code fork with an agent sidebar running Gemini 3.1 Pro). Multi-agent workflow:

- **Claude Code in the integrated terminal** — planning, auditing, data integrity checks, architectural decisions, CLI commands
- **Gemini agent in the Antigravity sidebar** — rapid code generation, UI iteration, bulk file edits, visual preview
- **They cannot directly communicate.** No MCP bridge between them. The filesystem IS the bridge.
- **CLAUDE.md and AGENTS.md are the shared brain.** Antigravity reads `AGENTS.md`; Claude Code reads `CLAUDE.md`. A pre-commit hook keeps them in sync.
- **Common workflow:** Claude Code plans → Gemini implements → Claude Code audits.

## Tech Stack — Use These, Not Alternatives

- **Use React 19 + TypeScript strict.** Do not switch frameworks.
- **Use Vite 6.** Do not switch to Webpack, Next.js, or anything else.
- **Use Tailwind CSS v4** (via `@tailwindcss/vite`). Do not introduce CSS modules, styled-components, or other CSS-in-JS libraries.
- **Use Framer Motion** (`motion/react`) for animations. No other animation libraries.
- **Use Lucide React** for icons. No other icon libraries.
- **Do not add a backend.** All data in `src/data.ts`. The Admin Panel writes to filesystem via the Vite server plugin — that's the only "server" we have.

## Deployment

- **Live URL**: https://neuroquiz-rho.vercel.app (Vercel, production)
- **Vercel project**: `joeelgallas-projects/neuroquiz`
- **GitHub repo**: https://github.com/joeelgalla/NeuroQuiz (branch: `main`)
- **✅ Auto-deploy is LIVE.** Every `git push` to `main` rebuilds and deploys in ~30 seconds. Manual `vercel --prod` is no longer needed.
- **Admin Panel does NOT work on Vercel** — it needs filesystem writes. Local-only (`npm run dev`). See `.claude/rules/admin-panel.md`.

## Local Development

- **Dev server**: `npm run dev` → http://localhost:3000 (Vite, HMR enabled, `--host=0.0.0.0` so accessible on local network)
- **Type check**: `npx tsc --noEmit` — **Run before every commit. Fix all errors.** Zero TypeScript errors is a hard requirement.
- **Build**: `npm run build` → outputs to `dist/` (Vercel runs this on deploy)
- **Preview built site**: `npm run preview`
- **HMR off**: `DISABLE_HMR=true npm run dev` — used when Gemini is doing rapid file edits to prevent flicker

## Project Structure

```
NeuroQuiz/
├── CLAUDE.md / AGENTS.md   # This file (and its synced twin). Pre-commit hook keeps them in sync.
├── .claude/rules/          # Modular rules — see table above
├── .env                    # ADMIN_PASSWORD for the Asset Editor
├── index.html              # Title: "NeuroQuiz"
├── package.json            # Client deps (react, motion, lucide, tailwind, vite)
├── vite.config.ts          # Vite config + custom admin-api server plugin (4 endpoints)
├── public/drawings/
│   ├── Myotomes Final/         # 33 PNGs (29 individual actions + 4 summary sheets)
│   ├── Dermatomes Final/
│   │   ├── Anterior/           # 13 PNGs (C4-T2, L1-S1)
│   │   └── Posterior/          # 18 PNGs (C4-T2, L1-S5)
│   ├── Myotomes blank/         # Blank templates (not used in quiz)
│   └── Dermatomes blank/       # Blank templates (not used in quiz)
└── src/
    ├── main.tsx            # React entry → <App />
    ├── App.tsx             # Router: menu → config → game → review → admin
    ├── Game.tsx            # Quiz engine (single + multi-select, timed + study mode)
    ├── Review.tsx          # Post-game: score, missed questions, "Practice Missed"
    ├── AdminPanel.tsx      # Password-protected asset editor (local only)
    ├── data.ts             # 101 questions across 4 categories + Question interface
    ├── data.backup.ts      # Auto-created backup on Admin Panel publish — DO NOT TOUCH
    └── index.css           # @import "tailwindcss"
```

## Game Modes & Config

**Modes:** Timed Quiz (60s sprint, auto-advance) / Study Mode (untimed, explanation cards, manual advance).

**Direction:** Standard / Reverse / Alternating (labels are context-aware per category).

**Display Mode:** Text Only / Image Only / Alternating / Combined.

**Practice Missed:** Review screen offers a button → relaunch in study mode with only the missed questions.

## Known Gaps / Upcoming Work

- ❌ **Brain Region images** — 12 questions still use `placeholder`
- ❌ **Sensory nerve images** — not yet created or integrated
- ❌ **Explanations** — field exists but no questions populated yet (use Admin Panel to add)
- ❌ **Spaced repetition** — no per-question performance tracking (Phase 2)
- ❌ **Analytics** — no accuracy-by-category or trends over time (Phase 2)
- ❌ **PWA** — no manifest.json, favicon, or theme-color (Phase 3)
- ❌ **Dermatome option pools** — some posterior dermatomes have too-narrow option sets (Phase 2)
- ❌ **No automated tests** — audits are manual (see `.claude/rules/audits.md`)

## Operational Gotchas

- `@google/genai` is in `package.json` but unused (AI Studio scaffold leftover). Safe to remove.
- `metadata.json` is an AI Studio leftover. Safe to delete.

## When NOT to update CLAUDE.md or AGENTS.md

**Update only when:**
- A new convention is established
- The data schema changes (new field on Question interface)
- A new architectural decision is made
- An operational fact changes (deploy URL, password, new dependency)

**Do NOT update for:**
- Adding/editing/removing individual questions (git log shows that)
- Routine bug fixes (git log shows that)
- Visual/styling changes (git log shows that)
- Refactors that don't change conventions (git log shows that)

The Changelog below is for **major milestones only** — a new system being added, a paradigm shift in how something works. Not a list of every commit. Use `git log` for that.

---

## Changelog

### 2026-04-14 — Modular Rules Migration

- Split CLAUDE.md into `.claude/rules/*.md` modular files with YAML frontmatter for path-based loading
- Main CLAUDE.md slimmed to project overview + always-load rules + structure
- Topic-specific rules (data schema, question authoring, audits, admin panel, git workflow) moved to `.claude/rules/`
- Goal: keep CLAUDE.md under 200 lines (per Anthropic's frontend-design notebook guidance — files >200 lines start being ignored by agents)

### 2026-04-14 — Vercel Deploy & Multi-Agent Setup

- Deployed to Vercel at https://neuroquiz-rho.vercel.app
- Connected GitHub repo to Vercel for auto-deploy on every push to `main`
- Added pre-commit hook to keep CLAUDE.md ↔ AGENTS.md in sync (whichever was modified most recently wins)
- Established multi-agent workflow conventions for Claude Code + Antigravity Gemini collaboration

### 2026-04-13 (Evening) — Phase 1: Foundational Fixes

**Study Mode:**
- Added untimed study mode with explanation cards and manual question advance
- Toggle on config screen with visual switch ("Timed Quiz" ↔ "Study Mode")
- `explanation` field added to Question interface — populated incrementally via Admin Panel
- Admin Panel now has an "Explanation (Study Mode)" textarea per question

**Bug Fixes:**
- Fixed stale closure in Game.tsx timer effect — used `useRef` for score/missed/currentIndex/onGameOver
- Fixed `Math.random()` inside `useMemo` — directions and display modes pre-generated as arrays during question initialization

**UX Improvements:**
- Config screen direction labels are now context-aware (Nerve Root → "Nerve → Actions", Brain Region → "Function → Region", etc.)
- Added "Practice Missed" button on Review screen — launches study mode with only missed questions

**Dependency Cleanup:**
- Moved `express` and `dotenv` to devDependencies (server-plugin only)
- Removed unused `xlsx` dependency

### 2026-04-13 (Afternoon) — Nerve Motor Quiz System

- Replaced old reflex/plexus nerve root questions with 29 new nerve motor questions (13 forward multi-select + 16 reverse single-select)
- `reverseGroup` dedup system for dual-action nerves (Radial, Median, Ulnar)
- `directionLock` + `studyDirection` fields keep forward/reverse questions separate

### 2026-04-13 (Afternoon) — Admin Panel / Asset Editor

- Built password-protected admin dashboard (`AdminPanel.tsx`)
- Custom Vite server plugin with 4 API endpoints (list-images, upload-image, save-data, delete-image)
- Drag-and-drop image upload, modal image browser, inline question editing
- Auto-backup system (`data.backup.ts`) on every publish

### 2026-04-12 — Dermatome Integration & Image Parsing

- Parsed and integrated 31 dermatome images (Anterior + Posterior) with text-based anatomical landmark prompts
- Mapped each image to its nerve root via filename conventions

### 2026-04-12 — Initial Build

- Scaffolded React/Vite/TypeScript app (originally from Google AI Studio)
- Built core quiz engine: timed gameplay, shuffled options, instant feedback
- Created category system (Myotome, Dermatome, Brain Region, Nerve Root)
- Integrated 29 myotome images
