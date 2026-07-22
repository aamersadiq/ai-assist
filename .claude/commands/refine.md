---
description: Start, resume, or re-run a requirement refinement session
argument-hint: [requirement folder or slug]
---

Run a requirement-refinement session using the **`refine-requirement`** skill.

Load `.claude/skills/refine-requirement/SKILL.md` and follow it. It is the authority on the
process — the notes below only cover how to start.

## Target

The requirement folder is `$1`, resolved against `requirements/` in this repo.

- **`$1` given as a slug** (e.g. `R-001-daily-withdrawal-limit`) → use `requirements/$1/`.
- **`$1` given as a path** → use it as-is.
- **No `$1`** → list the folders under `requirements/`, showing each one's phase and outstanding
  question counts from its `state.md`, and ask which to work on. If there are none, offer to
  create one — ask for a short title, allocate the next `R-<nnn>`, create the folder, and help
  write `requirement.md` before starting.

## Then decide which mode you're in

Check the target folder:

| Found | Mode |
|---|---|
| `requirement.md` only | **New session.** Start at Phase 0. |
| `state.md`, phase not `complete` | **Resume.** Never silently continue — summarise where things stand, then ask whether to work on new, parked, ignored, or blocked questions, or to review a specific `Qn`. |
| `state.md`, phase `complete` | **Re-refine.** Confirm they want a new version, then start `interview-v<n+1>.md` continuing question numbering, carrying forward everything unresolved. |
| no `requirement.md` | Stop. Ask them to write the raw ask first — it's the input and the start of the audit trail. |

## Before the first question

Do the Phase 0 loading the skill specifies, and **report the artefact freshness check** — for
each repo, whether `.ua/meta.json`'s `gitCommitHash` still matches that repo's `HEAD`. If either
is stale, say so plainly before interviewing. Stale artefacts produce confidently wrong answers,
and the user may want to re-run `/understand` first.

## Non-negotiables

- Never modify `requirement.md`, or anything under a repo's `docs/` or `.ua/`.
- Write `interview-v<n>.md` and `state.md` after **every** answer, never batched.
- Every ignored question records the assumption taken instead.
- Ask for an explicit yes before producing `requirements-v<n>.md`.
