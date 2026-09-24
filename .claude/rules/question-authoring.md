---
paths: src/data.ts
description: How to add or edit quiz questions correctly
---

# Question Authoring Rules

## Adding a new question

1. **Use the existing ID prefix pattern**: `m` (Myotome), `d` (Dermatome), `b` (Brain Region), `nf` (Nerve forward), `nr` (Nerve reverse), `s` (Sensory Nerve). New IDs continue the existing numeric sequence.
2. **Place the image first** in `public/drawings/<Category> Final/<optional subfolder>/`, then reference it from `data.ts` with a `/drawings/...` path.
3. **If no image exists yet**, set `image: 'placeholder'` — the game will fall back to text display.
4. **Always provide 6 options** in the `options` array (including the correct answer) for forward-direction questions.
5. **Dermatome questions with a demarcated variant** set `easyImage` to the matching file under `public/drawings/Dermatomes Final/Demarcated/<Anterior|Posterior> Limbs/` (same name with a `D` suffix, e.g. `AArmC6D.png`). Sensory Nerve prompts must be unique within the category (reverse image mode looks images up by prompt).

## Adding a Nerve Root question

**Forward (Nerve → Actions, multi-select):**
- Set `multiSelect: true`
- Set `directionLock: 'forward'`
- Set `studyDirection: 'forward'`
- Use the `answers` array (string[]) — one entry per correct action
- The `answer` string is just the comma-joined display version

**Reverse (Action → Nerve, single-select):**
- Set `directionLock: 'forward'` (yes, this looks inverted)
- Set `studyDirection: 'reverse'`
- The UI direction is locked but the question is semantically a reverse-lookup
- Reuse a myotome image via the `image` field
- For dual-action nerves (Radial, Median, Ulnar), set `reverseGroup` to the nerve's name so only ONE variant shows per session

## Adding a new image

- Drop into `public/drawings/<Category> Final/<optional subfolder>/`
- Filenames may contain spaces or underscores — both work
- The Admin Panel can upload images interactively, but only on localhost (`npm run dev`)

## Editing an existing question

- Prefer using the Admin Panel locally — it auto-creates `data.backup.ts` before saving
- If editing `data.ts` directly, run the audit checklist (`.claude/rules/audits.md`) before declaring done

## After authoring — ALWAYS run the audit

See `.claude/rules/audits.md`. Do not declare a question-authoring task complete until all 5 audits pass.
