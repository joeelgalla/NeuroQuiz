---
description: Git workflow, commit discipline, and deploy gating. Always load.
---

# Git Workflow Rules

## Before starting any task

1. **Run** `git status` — check for dangling changes; stash or commit if needed
2. **Run** `git log --oneline -10` — see what other agents have done recently
3. **Run** `git diff HEAD~3` if context isn't clear — see actual recent changes

This prevents redoing work the other agent already did, or breaking conventions they established.

## Commit messages

- **Be specific**: "add: toe flexion (all toes) question" — not "update data.ts"
- **Use prefixes**: `add:`, `fix:`, `refactor:`, `chore:`, `docs:`
- One logical change per commit when practical

## NEVER push without explicit approval

Auto-deploy is live on Vercel. Every `git push` to `main` triggers a production deploy in ~30 seconds.

- **NEVER `git push`** without Joe explicitly saying "push it" or equivalent
- **NEVER `git push --force`** on `main` — the team is collaborating off this branch
- **NEVER `--no-verify`** — the pre-commit hook keeps CLAUDE.md and AGENTS.md synced; bypassing breaks that

## Pre-commit hook

`/Users/joe/NeuroQuiz/.git/hooks/pre-commit` syncs CLAUDE.md ↔ AGENTS.md before every commit. Whichever was modified more recently wins. **Do not bypass it.**

## What "the other agent" can see

Antigravity has its own change tracking (Agent Manager, checkpoints) but it's only visible inside Antigravity. **Git is the cross-tool mechanism.** Both Claude Code and Antigravity Gemini can see git history; neither can see the other's internal session state.

## Multi-agent awareness

This project is edited by multiple agents (Claude Code in the terminal AND Gemini 3.1 Pro in the Antigravity sidebar) often within hours of each other.

**CLAUDE.md is NOT a changelog** — Joe will not (and should not have to) manually update it after every change. Use git for "what's changed":

```bash
git log --oneline -10           # what's changed recently
git log --since="6 hours ago"   # what's changed today
git diff HEAD~3                 # actual code changes in last 3 commits
git status                      # what's currently uncommitted (in progress)
```
