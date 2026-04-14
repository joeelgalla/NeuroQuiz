---
paths: src/data.ts
description: Question interface, data conventions, and special mechanics for src/data.ts
---

# Data Schema Rules (src/data.ts)

## The `Question` interface

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

## Current question counts

| Category | Count | Images |
|---|---|---|
| Myotome | 29 | All 29 ✅ |
| Dermatome | 31 | All 31 ✅ |
| Brain Region | 12 | All placeholder ❌ |
| Nerve Root (forward) | 13 multi-select | text prompts |
| Nerve Root (reverse) | 16 single-select | reuses myotome images |
| **Total** | **101** | 60 real + 12 placeholder |

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
