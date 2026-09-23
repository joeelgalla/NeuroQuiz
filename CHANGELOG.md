# Change Log

Purpose: completed changes in this repo.

Use this file only for actual changes to code, configs, data, assets,
build/deploy rules, generated artifacts, or project instructions. Use
`HANDOFF.md` for reviews, plans, blockers, and coordination that do not complete
a change.

Newest entries go on top.

## Entry Template

```md
### YYYY-MM-DD HH:MM TZ - <Agent> - <short change>

- Files changed: <paths>
- What changed: <plain-English summary>
- Verification: <commands/tests/checks, or "not run">
- Next: <optional follow-up>
```

## Log

### 2026-09-07 20:40 EDT - Claude (Fable 5.1, mini) - Repo moved to the mini; mini copy is canonical

- Files changed: none in the tree itself. New on the mini: `node_modules/` (from `npm ci`),
  `dist/` (from `npm run build`), and `.git/info/exclude` now lists
  `.claude/settings.local.json` (the M3 hid it via its global gitignore; same effect here).
- What changed: Full working tree copied M3 `~/NeuroQuiz` -> mini `~/Projects/NeuroQuiz`
  (tar over SSH, excluding `node_modules/` and `dist/`). M3 copy frozen (see HANDOFF, same
  timestamp). GitHub remote untouched; nothing pushed; Vercel still serves fdd642a.
- Verification on the mini (2026-09-07 ~21:05 EDT, node v26.5.0 / npm 11.17.0):
  - md5 manifest of every copied file vs the M3: 662 / 662 identical, 0 differences.
  - `git rev-parse HEAD` = fdd642a; `git status` identical to the M3 (8 modified, 7 untracked);
    `git fsck` clean apart from two dangling trees (normal).
  - `npm ci`: OK (npm 11 held back esbuild's postinstall script; build still runs).
  - `npm run lint` (tsc --noEmit): exit 0.
  - `npm run validate:data`: 101 questions, 76 real images, 12 placeholders, 0 errors, 0 warnings.
  - `npm run build`: OK, 2076 modules, `dist/assets/index-*.js` 404.59 kB (gzip 119.69 kB).
- Next: Joe's answers to the 19:55 wiring plan; then implement here, not on the M3.

### 2026-09-07 19:55 EDT - Claude (Fable 5.1) - Imported 85 new illustrations from the shared Drive

- Files changed:
  - `public/drawings/Dermatomes Final/Demarcated/Anterior Limbs/` (15 PNG)
  - `public/drawings/Dermatomes Final/Demarcated/Posterior Limbs/` (20 PNG)
  - `public/drawings/Dermatomes Final/Demarcated/Trunk/` (13 PNG)
  - `public/drawings/Peripheral Nerves Final/Anterior Limbs/` (18 PNG)
  - `public/drawings/Peripheral Nerves Final/Posterior Limbs/` (19 PNG)
  - All untracked; no `src/` changes.
- What changed: Copied the illustrator's 2026-08-30 additions from the shared Drive
  folder "Neuro Drawings" (`1_8HI2e_9ihXmB1P8B47QoNrrTYJfLUAR`, owner nafeay2@gmail.com)
  into the repo, preserving Drive folder names. Source subfolders: Demarcated
  `1d9OzcBUiXu_3YbsTH_X1inXPs5rGTnl_`, Peripheral Nerves `1lPUp6lG8McQJWlJ97Hypu5qgnXKJfusz`.
  Drive's "Not demarcated/Trunk" was skipped (md5-identical to Demarcated/Trunk).
- Verification: 98/98 downloads passed a PNG-signature check; per-folder counts match the
  Drive listings; md5 compare of the two trunk sets = 13/13 identical; sample dimensions
  ~620x1460 (limbs), 704x1266 (trunk). Manifest + log: `~/Downloads/neuroquiz-drive-import/`.
- Next: wiring plan in `HANDOFF.md` (same timestamp), needs Joe's approval.

### 2026-05-07 20:53 EDT - Codex (GPT-5) - iOS first sprint artifacts

- Files changed:
  - `/Users/joe/NeuroQuiz/package.json`
  - `/Users/joe/NeuroQuiz/package-lock.json`
  - `/Users/joe/NeuroQuiz/capacitor.config.ts`
  - `/Users/joe/NeuroQuiz/scripts/validate-data.ts`
  - `/Users/joe/NeuroQuiz/scripts/export-ios-data.ts`
  - `/Users/joe/NeuroQuiz/src/AdminPanel.tsx`
  - `/Users/joe/NeuroQuiz/src/App.tsx`
  - `/Users/joe/NeuroQuiz/src/Game.tsx`
  - `/Users/joe/NeuroQuiz/vite.config.ts`
  - `/Users/joe/NeuroQuiz/ios/`
- What changed: Renamed the package to `neuroquiz`; added repeatable quiz data
  validation/export scripts; added JSON export at `ios/Shared/quiz-data.json`;
  installed Capacitor and generated an iOS shell; hid the local-only Asset
  Editor in native shells; made Admin Panel login validate the password before
  entering the editor; replaced external placeholder image URLs with local
  offline-safe fallbacks; and added a small SwiftUI prototype that consumes the
  same exported data and bundled drawing assets.
- Verification: `npm run validate:data`, `npm run lint`, `npm run build`,
  `npm run xcode:doctor`, `npm run ios:prepare`, Capacitor simulator
  `xcodebuild`, `npm run ios:swiftui:build`, and
  `npm audit --audit-level=moderate` all passed.
- Next: Run interactive simulator testing from Xcode before deciding whether
  the next sprint should deepen Capacitor polish or expand the SwiftUI slice.

### 2026-05-01 14:33 EDT - Codex (GPT-5) - Initialized two-ledger convention

- Files changed:
  - `/Users/joe/NeuroQuiz/AGENTS.md`
  - `/Users/joe/NeuroQuiz/CLAUDE.md`
  - `/Users/joe/NeuroQuiz/HANDOFF.md`
  - `/Users/joe/NeuroQuiz/CHANGELOG.md`
- What changed: Added the repo-level rule and files for separating live
  coordination from completed changes.
- Verification: Read back edited files and checked target file presence.
- Next: Keep `AGENTS.md` and `CLAUDE.md` aligned when changing coordination
  rules.
