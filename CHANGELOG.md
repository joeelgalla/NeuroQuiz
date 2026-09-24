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

### 2026-09-24 20:25 EDT - Claude (Fable 5.1, mini) - Audit-round content fixes + reverse-mode overlap rule

- Files changed: `src/data.ts` (22 questions reworded/relabelled per council + Codex image pass; Intercostobrachial
  and Ilioinguinal added as distractors; s5/s11 `reverseGroup`), `src/Game.tsx` (`answerAtoms`/`answersOverlap`:
  reverse pool excludes any question whose answer shares a root or equals the current answer),
  `ios/Shared/quiz-data.json` regenerated. (No image edited: the stray label fragment in `Lateral Sural.png` is
  left for the illustrator to re-export.)
- What changed: see HANDOFF 20:25 for the audit outcomes behind each edit.
- Verification: tsc clean · validate:data 145 q, 120 real + 12 placeholder, 0/0 · build OK · mechanical
  reverse-mode check clean · live E2E sweep clean (pre-fix build).

### 2026-09-24 18:55 EDT - Claude (Fable 5.1, mini) - Naming decisions settled with two advisors; trunk T1 question dropped

- Files changed: `src/data.ts` (d59 removed → 145 questions; s5 answer "Medial Cutaneous Nerves of Arm & Forearm",
  upper-limb option pools rebuilt around the two medial labels; fibular buttons "Superficial Fibular (Superficial
  Peroneal) Nerve" / "Deep Fibular (Deep Peroneal) Nerve"; study-mode explanations on s5, s11, s21, s22, s28, s32,
  s33), `ios/Shared/quiz-data.json` regenerated, `.claude/rules/data-schema.md`, `CLAUDE.md`/`AGENTS.md`.
- What changed: Joe's rule = modern name first, clinical/older name in brackets, and decide anatomy questions with
  references + advisors instead of asking him. Codex partner (PubMed-cited) and Kimi K3 (independent one-shot)
  both endorsed: fibular pair as above; heel = tibial (medial calcaneal branches), sole = medial & lateral plantar;
  front-view medial drawing = arm + forearm (medial brachial + antebrachial cutaneous), back view = forearm only;
  the drawn band directly below the clavicles is T2 on every standard map (Keegan & Garrett, Foerster, Lee 2008,
  ASIA), so the "T1" trunk question is removed rather than relabelled (relabelling would duplicate T2). Image
  `Demarcated/Trunk/T1.png` stays on disk, unreferenced.
- Verification: tsc clean · validate:data 145 q, 120 real + 12 placeholder, 0/0 · build OK · reference audit 0 missing.

### 2026-09-23 21:10 EDT - Claude (Fable 5.1, mini) - Sensory Nerve category, trunk dermatomes, Easier Mode

- Files changed: `src/data.ts` (Category union + `easyImage` field; `easyImage` on d28-d58; +12 trunk
  dermatomes d59-d70; +33 sensory nerve questions s1-s33 → 146 questions), `src/Game.tsx` (easyMode
  threading incl. reverse image tiles; reverse pool excludes same-answer prompts), `src/App.tsx`
  (Easier Mode toggle + localStorage `neuroquiz_easy_dermatomes`; Sensory button live; direction labels
  + config header for 'Sensory Nerve'), `src/AdminPanel.tsx` (category list/colours, id prefix `s`,
  upload subfolder, Easy-Mode Image input), `vite.config.ts` (serializer emits `easyImage`; emitted
  Category union + interface updated), `scripts/validate-data.ts` (category, easyImage path check,
  duplicate-prompt warning), `.claude/rules/data-schema.md`, `.claude/rules/question-authoring.md`,
  `CLAUDE.md`/`AGENTS.md` (structure, gaps, changelog). New tracked assets: the 85 drawings imported
  2026-09-07 under `public/drawings/Dermatomes Final/Demarcated/` and `public/drawings/Peripheral Nerves Final/`.
- What changed: the three items the illustrator delivered on Aug 30 are wired in. Demarcated dermatomes
  are an opt-in "Easier Mode" (his words: "if users want an easier mode"), not a replacement.
- Verification (mini): `npx tsc --noEmit` clean · `npm run validate:data` 146 questions, 121 real +
  12 placeholder images, 0 errors 0 warnings · reference audit: 0 missing paths, 31/31 easyImage paths
  resolve, 146 unique ids, 0 answer/option mismatches · `npm run build` OK (424.7 kB JS) · Codex partner
  read-only audit (see HANDOFF, same timestamp).
- Post-audit fixes (Codex partner, see HANDOFF 21:10): sensory labels "Tibial Nerve (medial calcaneal
  branches)" / "Medial & Lateral Plantar Nerves" (s32/s33 no longer compete); prompts s5, s10, s11, s14, s30, s32
  corrected against the drawings; reverse image lookup category-scoped in `src/Game.tsx`; reverse distractors
  now prefer questions sharing an option pool (same limb); config toggle off-state renamed "Target Only".
  SwiftUI prototype: `ios/SwiftUIPrototype/.../AppView.swift` lists Sensory Nerve, `QuizData.swift` decodes
  `easyImage`; `ios/Shared/quiz-data.json` regenerated (146 questions); `ios/README.md` note.
- Not done at the time: push (done 2026-09-24 19:22 after Joe's "push it"); Brain Region art (still 12 placeholders); Dermatome config-screen
  direction labels still read "Movement → Nerve Root" (pre-existing).

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
