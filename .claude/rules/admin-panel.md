---
paths: src/AdminPanel.tsx, vite.config.ts
description: Admin Panel rules and the Vite server plugin coupling
---

# Admin Panel Rules

## Use locally only

The Admin Panel writes to filesystem via a custom Vite server plugin. **It WILL NOT work on Vercel.** Never instruct users to access it via the deployed URL — the gear icon will load but its API calls will 404.

## Access flow

1. Run `npm run dev` (must be local, not deployed)
2. Open http://localhost:3000
3. Click the gear/wrench icon at the bottom of the menu
4. Authenticate with the `ADMIN_PASSWORD` env var (default `neuro2026`)

## What it can do

- **Drag-and-drop** image upload to `public/drawings/`
- **Browse** existing images in a modal gallery
- **Edit** all question fields inline, including the `explanation` textarea (study mode)
- **Publish** — auto-creates `data.backup.ts` before overwriting `data.ts`

## Coupling: Admin Panel ↔ Vite plugin ↔ data.ts

These three are tightly coupled:

| File | Role |
|---|---|
| `src/AdminPanel.tsx` | UI for editing questions and uploading images |
| `vite.config.ts` | Defines 4 API endpoints (`list-images`, `upload-image`, `save-data`, `delete-image`) as a custom Vite server plugin |
| `src/data.ts` | The persistent store the panel reads from and writes to |

**Any change to the `Question` interface** must be reflected in:
1. The `save-data` endpoint serializer in `vite.config.ts`
2. The Admin Panel form fields and submission logic
3. `src/Game.tsx` (which consumes the new field)

## Backup file

- `src/data.backup.ts` is auto-created by the Admin Panel on every publish
- **NEVER touch `data.backup.ts` manually** — it's auto-managed
- If a publish corrupts data.ts, restore by `cp src/data.backup.ts src/data.ts`
