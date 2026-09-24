---
paths: src/data.ts
description: Question interface, data conventions, and special mechanics for src/data.ts
---

# Data Schema Rules (src/data.ts)

## The `Question` interface

```typescript
interface Question {
  id: string;
  category: Category;           // 'Myotome' | 'Dermatome' | 'Brain Region' | 'Nerve Root' | 'Sensory Nerve'
  prompt: string;               // Shown to user as the question
  answer: string;               // Correct answer (single-select) or comma-joined (multi)
  options: string[];            // Pool of possible answers (6 used per question)
  image?: string;               // Path to image, or 'placeholder' if not yet created
  easyImage?: string;           // Optional easier variant of image, used when "Easier Mode" is on (dermatomes: neighbouring borders drawn)

  // Multi-select support (nerve motor questions only)
  answers?: string[];           // Array of correct answers (e.g. ['Wrist Extension', 'Digit Extension'])
  multiSelect?: boolean;        // true = toggle/confirm UX instead of single-click
  directionLock?: 'forward' | 'reverse';  // Prevents direction swap (nerves have separate fwd/rev questions)
  studyDirection?: 'forward' | 'reverse'; // Which study direction this Q belongs to
  reverseGroup?: string;        // Dedup group — game picks ONE per group per session
  explanation?: string;         // Shown in study mode after answering (populated via Admin Panel)
}
```

## Current question counts

| Category | Count | Images |
|---|---|---|
| Myotome | 29 | All 29 ✅ |
| Dermatome | 43 | All 43 ✅ (31 limb + 12 trunk); the 31 limb ones also carry `easyImage` (demarcated variant) |
| Brain Region | 12 | All placeholder ❌ |
| Nerve Root (forward) | 13 multi-select | text prompts |
| Nerve Root (reverse) | 16 single-select | reuses myotome images |
| Sensory Nerve | 33 | All 33 ✅ (cutaneous distributions, anterior + posterior views) |
| **Total** | **146** | 121 real + 12 placeholder |

## Sensory Nerve mechanics

Same shape as Dermatome: `prompt` = text description of the highlighted skin area (with the view in
parentheses), `answer` = nerve name, `image` = the drawing. Forward = area → nerve, reverse = nerve →
area. Prompts must be unique within the category because reverse image mode looks images up by prompt.
The reverse option pool excludes prompts whose question has the same `answer` (one nerve drawn from two
views must not appear as a "wrong" option). Nerve names follow the motor section where the nerve exists
there (e.g. "Superficial Fibular (Peroneal) Nerve", "Deep Fibular (Peroneal) Nerve").

## Easier Mode (dermatomes)

The config screen toggle "Dermatome Images: Easier Mode" (shown for Dermatome and All Topics; persisted
in `localStorage` key `neuroquiz_easy_dermatomes`) makes `Game.tsx` render `easyImage` instead of
`image` wherever it is set. Only the 31 limb dermatome questions set it; trunk images are identical in
both sets, so they don't.

## Nerve Root special mechanics

**Forward (Nerve → Actions):** Multi-select. Show nerve name, user selects ALL correct motor actions, then clicks "Confirm Selection". Feedback: green = correct pick, red = wrong pick, amber/pulse = missed one.

**Reverse (Action → Nerve):** Single-select. Show one motor action (with myotome image), user picks which nerve. For dual-action nerves (Radial, Median, Ulnar), only ONE of their two actions appears per game session via `reverseGroup` dedup to prevent pattern-based guessing.

## Image path convention

- Image paths in `data.ts` use `/drawings/...` (resolves to `public/drawings/...` at build time)
- Spaces in filenames work — the browser URL-encodes them automatically
- Use `image: 'placeholder'` if no image exists yet; the game falls back to text display

## Coupling warning

`src/data.ts` is coupled to three other files. **Any schema change must be coordinated with all of these:**
1. `src/Game.tsx` — reads questions, handles multi-select / directionLock / reverseGroup logic
2. `src/AdminPanel.tsx` — edits questions inline, including all optional fields
3. `vite.config.ts` — the `/api/save-data` endpoint serializes questions back to disk
