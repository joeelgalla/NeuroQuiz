# NeuroQuiz — Project Context

> **Single source of truth.** Any agent working on this project should read this file first. The top sections describe the current state; the Changelog at the bottom tracks what was done and when.

## What This Is

A mobile-friendly quiz app for medical students to practice neuroanatomy — myotomes, dermatomes, nerve roots (motor innervation), and brain regions. It uses active recall and gamification to help users learn and retain anatomical relationships.

## Tech Stack

- **React 19** + **TypeScript** (strict, `tsc --noEmit` must stay clean)
- **Vite 6** (dev server on port 3000, `npm run dev`)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **Framer Motion** (`motion/react`) for animations
- **Lucide React** for icons
- No backend. All data is in `src/data.ts`. Admin panel writes directly to filesystem via Vite server plugin.

## Project Structure

```
NeuroQuiz/
├── CLAUDE.md               ← You are here. Project context for agents.
├── .env                    # ADMIN_PASSWORD for the Asset Editor (default: neuro2026)
├── index.html              # Entry point — title is "NeuroQuiz"
├── package.json            # Client deps (react, motion, lucide, tailwind, vite)
├── vite.config.ts          # Vite config + custom admin-api server plugin
│                             (4 endpoints: list-images, upload-image, save-data, delete-image)
├── public/
│   └── drawings/
│       ├── Myotomes Final/       # 33 PNGs (29 individual actions + 4 summary sheets)
│       ├── Dermatomes Final/
│       │   ├── Anterior/         # 13 PNGs (C4-T2, L1-S1)
│       │   └── Posterior/        # 18 PNGs (C4-T2, L1-S5)
│       ├── Myotomes blank/       # Blank templates (not used in quiz)
│       └── Dermatomes blank/     # Blank templates (not used in quiz)
└── src/
    ├── main.tsx            # React entry → <App />
    ├── App.tsx             # Router: menu → config → game → review → admin
    │                         Category selection, study mode toggle, direction/display config
    ├── Game.tsx            # Quiz engine (464 lines)
    │                         Single-select + multi-select, timed + study mode,
    │                         pre-generated directions/display modes, ref-based timer
    ├── Review.tsx          # Post-game: score, missed questions, "Practice Missed" button
    ├── AdminPanel.tsx      # Password-protected asset editor (local dev only)
    │                         Upload/browse images, edit questions, explanation field
    ├── data.ts             # All question data + Question interface + shuffle helper
    │                         101 questions across 4 categories
    ├── data.backup.ts      # Auto-created backup on each Admin Panel publish
    └── index.css           # Just `@import "tailwindcss"`
```

## Question Data Architecture (`data.ts`)

```typescript
interface Question {
  id: string;
  category: Category;           // 'Myotome' | 'Dermatome' | 'Brain Region' | 'Nerve Root'
  prompt: string;               // Shown to user as the question
  answer: string;               // Correct answer (single-select) or comma-joined (multi)
  options: string[];            // Pool of possible answers (6 used per question)
  image?: string;               // Path to image, or 'placeholder' if not yet created

  // Multi-select support (nerve motor questions only)
  answers?: string[];           // Array of correct answers (e.g. ['Wrist Extension', 'Digit Extension'])
  multiSelect?: boolean;        // true = toggle/confirm UX instead of single-click
  directionLock?: 'forward' | 'reverse';  // Prevents direction swap (nerves have separate fwd/rev questions)
  studyDirection?: 'forward' | 'reverse'; // Which study direction this Q belongs to
  reverseGroup?: string;        // Dedup group — game picks ONE per group per session
  explanation?: string;         // Shown in study mode after answering (populated via Admin Panel)
}
```

### Question Counts

| Category | Forward | Reverse | Total | Images |
|---|---|---|---|---|
| Myotome | 29 | (same questions, reversed) | 29 | ✅ All 29 |
| Dermatome | 31 | (same questions, reversed) | 31 | ✅ All 31 |
| Brain Region | 12 | (same questions, reversed) | 12 | ❌ All placeholder |
| Nerve Root (fwd) | 13 multi-select | — | 13 | — (text prompt) |
| Nerve Root (rev) | — | 16 single-select | 16 | ✅ Reuses myotome imgs |
| **Total** | | | **101** | **60 real, 12 placeholder** |

### Nerve Root Special Mechanics

**Forward (Nerve → Actions):** Multi-select. Shows nerve name, user selects ALL correct motor actions, then clicks "Confirm Selection". Feedback: green = correct pick, red = wrong pick, amber/pulse = missed one.

**Reverse (Action → Nerve):** Single-select. Shows one motor action (with myotome image), user picks which nerve. For dual-action nerves (Radial, Median, Ulnar), only ONE of their two actions appears per game session via `reverseGroup` dedup to prevent pattern-based guessing.

## Game Modes

### Timed Quiz (default)
- 60-second countdown, pauses during 800ms feedback
- Auto-advances after each answer
- Score tracked, high score persisted to localStorage

### Study Mode
- No timer — shows question counter ("3 / 29") instead
- After answering: explanation card slides up with correct/incorrect, correct answer, and explanation text (if populated)
- User manually clicks "Next Question →" to advance
- Practice Missed: after any game, Review screen offers "Practice Missed (N)" button → forces study mode with only the missed questions

## Config Options (per game session)

- **Mode**: Timed Quiz / Study Mode (toggle switch)
- **Direction**: Standard / Reverse / Alternating (labels are context-aware per category)
- **Display Mode**: Text Only / Image Only / Alternating / Combined

## Admin Panel (`/` → gear icon at bottom)

- Password-gated (env var `ADMIN_PASSWORD`, default `neuro2026`)
- **Local dev only** — writes to filesystem, will NOT work on static hosting
- Drag-and-drop image upload to `public/drawings/`
- Browse existing images in a modal gallery
- Edit all question fields inline, including the new `explanation` textarea
- Publish creates `data.backup.ts` before overwriting `data.ts`

## Known Gaps / Upcoming Work

- ❌ **Brain Region images** — 12 questions still have `placeholder` images
- ❌ **Sensory nerve images** — not yet created or integrated
- ❌ **Explanations** — field exists but no questions have explanations populated yet
- ❌ **Spaced repetition** — no per-question performance tracking (Phase 2 plan)
- ❌ **Analytics** — no accuracy-by-category or trends over time (Phase 2 plan)
- ❌ **PWA** — no manifest.json, favicon, or theme-color (Phase 3 plan)
- ❌ **Dermatome option pools** — some posterior dermatomes have too-narrow option sets (Phase 2)
- ❌ **No automated tests** — data integrity could be validated with a test script

## Development Notes

- Run `npm run dev` → starts on port 3000
- Run `npx tsc --noEmit` to type-check without building
- Admin API endpoints are defined in `vite.config.ts` as a custom Vite server plugin
- The `data.backup.ts` file is auto-created and can be used to roll back bad edits
- Image paths in data.ts use `/drawings/...` (public directory root)

---

## Changelog

### 2026-04-13 (Evening) — Phase 1: Foundational Fixes

**Study Mode:**
- Added untimed study mode with explanation cards and manual question advance
- Toggle on config screen with visual switch ("Timed Quiz" ↔ "Study Mode")
- `explanation` field added to Question interface — populated incrementally via Admin Panel
- Admin Panel now has an "Explanation (Study Mode)" textarea per question

**Bug Fixes:**
- Fixed stale closure in Game.tsx timer effect — used `useRef` for score/missed/currentIndex/onGameOver so the timer callback always has fresh values
- Fixed `Math.random()` inside `useMemo` — directions and display modes are now pre-generated as arrays during question initialization, stored in `questionDirections[]` and `questionDisplayModes[]`

**UX Improvements:**
- Config screen direction labels are now context-aware (Nerve Root shows "Nerve → Actions" / "Action → Nerve", Brain Region shows "Function → Region", etc.)
- Added "Practice Missed" button on Review screen — launches study mode with only the missed questions

**Dependency Cleanup:**
- Moved `express` and `dotenv` to devDependencies (server-plugin only)
- Removed unused `xlsx` dependency

### 2026-04-13 (Afternoon) — Nerve Motor Quiz System

- Replaced old reflex/plexus nerve root questions (n1-n13) with 29 new nerve motor questions
- 13 forward questions: multi-select mechanic (toggle options, click Confirm)
- 16 reverse questions: single-select, reuse myotome images
- `reverseGroup` dedup system for dual-action nerves (Radial, Median, Ulnar)
- `directionLock` + `studyDirection` fields keep forward/reverse questions separate
- Updated vite.config.ts save endpoint to serialize all new fields

### 2026-04-13 (Afternoon) — Admin Panel / Asset Editor

- Built password-protected admin dashboard (`AdminPanel.tsx`)
- Custom Vite server plugin with 4 API endpoints (list-images, upload-image, save-data, delete-image)
- Drag-and-drop image upload, modal image browser, inline question editing
- Auto-backup system (`data.backup.ts`) on every publish
- `ADMIN_PASSWORD` env var for access control

### 2026-04-12 — Dermatome Integration & Image Parsing

- Parsed and integrated 31 dermatome images (Anterior + Posterior) with text-based anatomical landmark prompts
- Mapped each image to its nerve root via filename conventions
- Resolved the challenge of generating accurate prompts for granular dermatome regions

### 2026-04-12 — Initial Build

- Scaffolded React/Vite/TypeScript app (originally from Google AI Studio)
- Built core quiz engine: timed gameplay, shuffled options, instant feedback
- Created category system (Myotome, Dermatome, Brain Region, Nerve Root)
- Integrated 29 myotome images from `public/drawings/Myotomes Final/`
- Added config screen: direction (forward/reverse/alternating), display mode (text/image/combined/alternating)
- Score tracking with localStorage persistence
- Review screen with missed questions list
