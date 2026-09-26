# NeuroQuiz iOS Spike

This folder contains two first-sprint iOS tracks:

- `App/`: Capacitor shell around the existing React/Vite quiz. Run `npm run ios:prepare` before opening or building it so the latest web bundle is copied into the native project.
- `SwiftUIPrototype/`: small native SwiftUI vertical slice. It reads `../Shared/quiz-data.json` and the existing `public/drawings` folder as bundled resources.
- `Shared/quiz-data.json`: generated from `src/data.ts` by `npm run build:app-data`. Treat `src/data.ts` as canonical for this sprint.

Use the tracks to compare time-to-TestFlight, native feel, maintenance cost, offline behavior, and how much quiz logic must be duplicated before committing to a long-term iOS direction.

> 2026-09-23: `quiz-data.json` regenerated with 146 questions (new `Sensory Nerve` category, `easyImage` field). The SwiftUI prototype lists the new category; it has no "Easier Mode" toggle and ignores `easyImage`. Capacitor shell picks both up from the web build unchanged.
