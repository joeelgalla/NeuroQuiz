# Handoff Log

Purpose: live coordination for this repo.

Use this file for reviews, plans, non-code-changing communication, route
results, blockers, and cross-agent notes. Use `CHANGELOG.md` for actual
completed changes to code, configs, data, assets, build/deploy rules, or
project instructions.

Newest entries go on top.

## Entry Template

```md
### YYYY-MM-DD HH:MM TZ - <Agent> - <short topic>

- Context: <why this note exists>
- Communication: <plan, review, blocker, route result, or handoff>
- Output location: <chat, file path, command result, or other location>
- Next: <who should do what next>
```

## Log

### 2026-09-24 18:55 EDT - Claude (Fable 5.1, mini) - Review items CLOSED (no Joe input needed); one ask for the illustrator

- Context: Joe (2026-09-24): decide naming/anatomy with references and advisors, don't ask him; modern term first,
  clinical term in brackets.
- Communication: the four open items from the 09-23 entry are settled (detail + sources in CHANGELOG 18:55):
  1 fibular brackets · 2 heel vs sole · 3 medial cutaneous arm+forearm vs forearm · 4 sub-clavicular "T1" band
  dropped from the quiz. Advisors: Codex partner `neuroquiz` (read-only audit, PubMed citations) + Kimi K3
  one-shot (`kimi_advisor.sh`, both agreed; Kimi corrected the bracket wording and Codex's biceps rationale).
- For the illustrator, when Joe sends the link: his trunk map has one band too many between the clavicle and the
  nipple (T1 + T2 + T3 + T4 where standard maps have T2, T3, T4). The app skips his "T1" band. If he wants to
  redraw, the fix is to remove that band, not relabel it.
- Output location: commit on `main` (mini). Not pushed.
- Next: Joe says "push it".

### 2026-09-23 21:10 EDT - Claude (Fable 5.1, mini) - Wiring done + Codex-audited, committed on main (not pushed); review notes for Joe + the illustrator

- Context: Joe said "go" on the 2026-09-07 19:55 plan and asked for a Codex partner audit. The illustrator's
  Sep 7 WhatsApp reply settled item 1: demarcated images = an easier mode, so they are a toggle, not a swap.
- Communication: content decisions that deserve a human check before the classmate test (none block the build):
  1. Nerve labels follow the existing motor section: illustrator's "Peroneal" → "Superficial Fibular (Peroneal)
     Nerve" (his drawing = anterolateral leg + dorsum of foot minus the first web space), "Deep Fibular" →
     "Deep Fibular (Peroneal) Nerve". "Plantar" → "Plantar Nerves (Medial & Lateral)". "Lateral Sural" →
     "Lateral Sural Cutaneous Nerve". "Medial Cutaneous" kept as his label "Medial Cutaneous Nerve of Forearm"
     although the drawing also covers the medial upper arm (medial brachial cutaneous territory).
  2. Trunk T1 is drawn as the band directly below the clavicles (Trunk Master.png) and the T1 question follows
     the drawing. Many charts give that band to T2/C4; Joe to confirm with the illustrator or re-label.
  3. Sensory prompts describe the highlighted skin as drawn, with the view in parentheses; the labelled
     master sheets (4) are reference only and are not quiz questions.
  4. Explanations were added only for the canonical trunk landmarks (T2 sternal angle, T4 nipple, T6 xiphoid,
     T10 umbilicus, T12 above the inguinal ligament). Everything else stays empty, as before.
- Verified in the built app (headless Chrome, 390x844 + 1280x800, `vite preview`): Sensory button live; sensory
  forward shows the drawing with 6 nerve options; Easier Mode toggle appears for Dermatome/All only, persists in
  localStorage, and swaps in the demarcated image; sensory reverse shows 4 image tiles from the same limb; zero
  page errors (only the pre-existing favicon 404).
- Follow-ups noticed, NOT done (out of scope tonight): the Dermatome config screen still shows the generic
  direction labels "Movement → Nerve Root" (should read "Area → Nerve Root"); no favicon/PWA manifest.
- Codex partner audit (partnership `neuroquiz`, seat codex, read-only, via
  `~/AgentConfig/shared/interop/scripts/partner.sh`; ~2.2M input tokens, one turn). It re-ran tsc, the validator
  (directly with node; `npm run validate:data` hit a tsx IPC `listen EPERM` inside its sandbox, not a repo bug),
  the build, an in-memory round-trip of the Admin Panel serializer (146/146 preserved, emitted source type-checks),
  the iOS exporter, and 912 mocked-hook gameplay cases. Findings and what was done:
  1. BLOCKER: "Tibial Nerve" and "Plantar Nerves" competed as answers for the sole/heel (plantar nerves ARE tibial
     branches). FIXED: heel question answers "Tibial Nerve (medial calcaneal branches)", sole answers "Medial &
     Lateral Plantar Nerves"; plain "Tibial Nerve" no longer appears in any sensory option list.
  2. SHOULD-FIX: s11 prompt said upper arm + forearm but `Medial CutaneousP.png` shades the forearm only. FIXED
     ("Medial forearm (posterior view)"); s5 now says "medial arm over the biceps and medial forearm".
  3. SHOULD-FIX: s30 "medial side of the heel" over-claimed a saphenous territory. FIXED ("narrow strip over the
     medial ankle and medial border of the foot"); s32 heel prompt now says "posteromedial".
  4. SHOULD-FIX (SwiftUI prototype only): hardcoded 4-category list hid Sensory Nerve; `QuizQuestion` lacked
     `easyImage`. FIXED in `AppView.swift` + `QuizData.swift`, `ios/Shared/quiz-data.json` regenerated (146 q);
     the prototype has no Easier Mode toggle (documented in `ios/README.md`); `xcodebuild` (Xcode 27.0 beta 5,
     simulator, no signing) BUILD SUCCEEDED on the mini. Not affecting the Capacitor shell.
  5. NIT: s14 omitted the dorsal thumb tip shown in `MedianP.png`. FIXED; s10 now says "base of the thumb".
  6. NIT: reverse image tiles looked prompts up globally while the validator checks per category. FIXED: lookup
     is category-scoped first, with the global fallback kept for motor-action tiles that reuse Myotome images.
  7. NIT: records overstated completion (this entry's old title) and CLAUDE.md's explanation claim. FIXED.
  T1: Codex agrees it should stay a documented anatomy-review question (drawing-faithful), not an auto relabel.
  Verdict after fixes (self-verified, not re-audited): tsc clean, validator 0/0, build OK, headless walkthrough
  green.
- Output location: working tree → commit on `main` (mini). Nothing pushed.
- Next: Joe says "push it" → Vercel deploys → send the illustrator the link with the QA asks above.

### 2026-09-23 18:40 EDT - Claude (Fable 5.1, mini) - Image inventory VERIFIED against Drive and the live sheet

- Context: Joe asked exactly which images the illustrator changed, with evidence, not inference.
- Communication: Drive listing (190 PNG, owner nafeay2) vs repo `public/drawings`: every file matches
  by name and byte size. Old sets (Myotomes Final, non-demarcated limbs, blanks; created Mar 29 / Jan 7)
  were never modified after the Apr 14 commit. New = 85 files created Aug 30-31 = the three additions
  the illustrator listed on WhatsApp Sep 7 (sensory nerve distributions, trunk T1-T12, demarcated
  variants "if users want an easier mode"). Nothing in Drive changed after Sep 7.
  Live "Dermatomes & Myotomes" sheet exported via the browser export URL (API export is capped at
  10 MB): 78 embedded images vs 76 in the April copy; all 76 identical; the 2 additions are textbook
  reference diagrams on the Peripheral nerves tab (lower-limb cutaneous nerve map, sole-of-foot map),
  alongside notes ("and T4 and T10", "For master leg outlines, make thinner") and a quiz-format column
  sketch (Choice 1-4 / Answer). No new quiz art lives in the sheet. Sheet revisions after Joe's April
  download: Apr 13 (Joe), Apr 17, May 13, Aug 6 (three different collaborator accounts).
- Output location: snapshot `~/Downloads/neuroquiz-drive-import/sheet_live_2026-09-23.xlsx` (mini).
- Next: unchanged. Wiring plan (2026-09-07 19:55 entry) with the illustrator's answer applied:
  demarcated images = an easier-mode toggle, not a replacement.

### 2026-09-07 20:40 EDT - Claude (Fable 5.1, mini) - MACHINE HANDOFF: canonical copy moves to the MINI

- Context: Joe's instruction 2026-09-07: "copy it to the mini and make the mini canonical."
  Same pattern as rx-rush (2026-08-25).
- Communication: The full working tree (git history, the uncommitted 2026-05-07 iOS sprint,
  tonight's imported drawings, ledgers, `.env`, `.vercel`, `.claude/`) is copied
  M3 `~/NeuroQuiz` -> mini `~/Projects/NeuroQuiz` via tar over SSH, excluding only
  `node_modules/` (reinstalled from `package-lock.json` on the mini) and `dist/` (build
  output). Verification (md5 manifest diff of every copied file, then `npm ci`,
  `npm run lint`, `npm run validate:data`, `npm run build` on the mini) is recorded in the
  mini copy's CHANGELOG entry of the same timestamp.
- FROM NOW ON THE MINI COPY IS CANONICAL. The M3 copy at `~/NeuroQuiz` is a frozen snapshot
  as of this entry (marker file `_FROZEN_SNAPSHOT_2026-09-07.md` in its root): do not edit
  it without re-syncing from the mini first. The M3 launchers in `~/Projects`
  ("NeuroQuiz Admin (Local).command", "NeuroQuiz (Live).webloc") still point at the M3
  path; the Admin Panel now runs from the mini (`npm run dev` there).
- Xcode / Capacitor: the `ios/` tree travels, but simulator or device testing needs Xcode on
  the machine doing it. Per vault `Agent/hot.md` (2026-09-07) the mini has Xcode 27 and the
  Desktop simulator pane is blocked until a 26.x install sits alongside it.
- Output location: mini `~/Projects/NeuroQuiz`. GitHub remote unchanged
  (`joeelgalla/NeuroQuiz`, HEAD fdd642a, nothing pushed).
- Next: all NeuroQuiz work happens on the mini. First task there: Joe's answers to the
  19:55 wiring plan.

### 2026-09-07 19:55 EDT - Claude (Fable 5.1, from the mini via SSH) - Drive image import + wiring plan (AWAITING JOE'S APPROVAL)

- Context: The illustrator (Drive owner nafeay2@gmail.com, "Joe's friend" in CLAUDE.md)
  added new art to the shared "Neuro Drawings" folder on 2026-08-30 (night) and messaged
  Joe on Aug 31. Joe pointed this session at the shared spreadsheet/folder. Read-only
  download via `gws` on the M3, staged in `~/Downloads/neuroquiz-drive-import/`
  (`manifest.tsv` = Drive file ID -> path, `download.log`), then copied into
  `public/drawings/`. Untracked files only; nothing under `src/` was touched.
- What is new vs the April import (verified by Drive listing, file counts, md5):
  - Myotomes Final: unchanged (33/33). Dermatomes Final/Anterior + Posterior: unchanged
    (they equal Drive's "Not demarcated" limb sets).
  - NEW `Dermatomes Final/Demarcated/{Anterior Limbs 15, Posterior Limbs 20, Trunk 13}`:
    same red zone as before, plus the neighbouring dermatome boundaries drawn in black,
    no labels. Trunk = T1-T12 + `Trunk Master.png`. Drive's "Not demarcated/Trunk" is
    byte-identical to Demarcated/Trunk, so it was not imported.
  - NEW `Peripheral Nerves Final/{Anterior Limbs 18, Posterior Limbs 19}`: one nerve's
    cutaneous distribution in red per image, no labels. The four `* Peripheral Master.png`
    files are LABELLED reference maps: study/reference use only, never a quiz prompt.
  - Still missing from Drive: any Brain Region art (12 placeholders remain).
- Communication (PLAN - Plan-First rule, needs Joe's OK before any `src/` edit):
  1. Dermatomes: repoint the 31 existing `d28-d58` images to the Demarcated equivalents
     (`Anterior/AArmC6.png` -> `Demarcated/Anterior Limbs/AArmC6D.png`; posterior leg
     names lose the space: `Posterior/PLeg L4.png` -> `Demarcated/Posterior Limbs/PLegL4D.png`,
     `PLeg L5 Part 1.png` -> `PLegL5D Part 1.png`). Keep the originals on disk.
     Trade-off for Joe: boundary lines give context but let a user count bands.
  2. Trunk dermatomes: 12 new questions `d59-d70` (T1-T12, `Demarcated/Trunk/T{n}.png`)
     with landmark prompts (T4 nipple line, T6 xiphoid, T10 umbilicus, T12 suprapubic).
     Joe verifies wording. Trunk T1/T2 vs the existing arm T1/T2 questions
     (d33/d34/d46/d47) need an accuracy check and distinct prompts. Options = six
     thoracic levels.
  3. Sensory nerves: new `Category` value `'Sensory Nerve'` (`src/data.ts` type,
     `App.tsx` direction-title switch, `AdminPanel.tsx` category list, check the
     `vite.config.ts` serializer). 33 questions `s1-s33`: forward = image -> nerve name
     (single-select, six options from the same limb pool); reverse = nerve name -> image
     (existing image-option UI). Enable the disabled "Sensory" button in the Peripheral
     Nerves sub-menu. Naming to settle with Joe: `Peroneal` vs `Superficial Fibular`,
     `Plantar` (tibial branches), `SaphenousP1/P2`, `Lateral Sural`.
  4. Masters: surface as Study-mode reference images (optional, phase 2).
  5. Then: the 5 audits, `npm run validate:data`, `npm run build`; commit (the May 7 iOS
     sprint is still uncommitted alongside; Joe decides whether it commits first); push
     only on Joe's OK (push auto-deploys Vercel).
  6. Cleanup candidates (NOT done): `public/drawings/Dermatomes blank`, `Myotomes blank`
     and the xlsx are unreferenced by `data.ts` and ship in every build.
- Output location: `public/drawings/Dermatomes Final/Demarcated/`,
  `public/drawings/Peripheral Nerves Final/`; staging + manifest in
  `~/Downloads/neuroquiz-drive-import/`.
- Next: Joe approves or edits items 1-3 (naming, accuracy) -> implement in one pass on
  the M3 -> audits -> build -> Joe pushes.

### 2026-05-07 20:53 EDT - Codex (GPT-5) - NeuroQuiz iOS first sprint handoff

- Context: Joe approved the iOS-direction sprint plan: keep React/Vite as the
  live product, harden it, and compare Capacitor against a tiny SwiftUI
  vertical slice using the same exported quiz data.
- Communication: The React hardening, data validation/export, Capacitor iOS
  shell, SwiftUI prototype, and local Xcode/Codex bridge checks are complete.
  `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer` and
  `sudo xcodebuild -license accept` still require Joe's password, but all
  Xcode commands used here pass by setting
  `DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer`. The Codex `xcode`
  MCP server was re-added with that `DEVELOPER_DIR` env so it does not depend
  on the current Command Line Tools selection.
- Output location: `/Users/joe/NeuroQuiz` working tree; key entry points are
  `npm run validate:data`, `npm run ios:prepare`, `npm run ios:cap:open`, and
  `npm run ios:swiftui:build`.
- Next: Open the Capacitor shell in Xcode with `npm run ios:cap:open` for
  interactive simulator testing. In Xcode, enable Settings -> Intelligence ->
  "Allow external agents to use Xcode tools" if it is not already enabled.
  Default decision remains Capacitor first unless the SwiftUI slice proves a
  clearly better study experience worth duplicating quiz logic.

### 2026-05-01 14:33 EDT - Codex (GPT-5) - Initialized coordination ledger

- Context: Joe requested consistent two-file coordination in every
  instruction-root folder.
- Communication: This file is the live coordination log for NeuroQuiz. Actual
  completed changes belong in `CHANGELOG.md`.
- Output location: `/Users/joe/NeuroQuiz/HANDOFF.md`
- Next: Future agents should read this and `CHANGELOG.md` before non-trivial
  NeuroQuiz work.
