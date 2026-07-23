---
description: Feed an already-refined requirement (requirements-vN.md) into spec-kit's /speckit-specify
argument-hint: [requirement slug, folder, or path to requirements-vN.md]
---

Bridge a `/refine`-produced requirement into spec-kit. Resolves `$1` to a
`requirements-v<n>.md` file, then invokes the **`speckit-specify`** skill with that file's full
content as its feature description — no manual copy-paste. See
[`specs/README.md`](../../specs/README.md) for how this fits the wider workflow.

## Target

Resolve `$1` against `requirements/` in this repo:

- **`$1` given as a slug** (e.g. `create-account-upgrade` or `R-001`) → look in
  `requirements/$1/` for the highest-numbered `requirements-v<n>.md`.
  - If the folder has only `requirement.md` and/or `state.md` with `phase` not `complete`,
    refinement isn't finished — stop and point at `/refine $1` instead.
  - If the folder doesn't exist at all, say so and stop.
- **`$1` given as a path directly to a `requirements-v<n>.md` file** → use it as-is.
- **No `$1`** → list every folder under `requirements/` that has at least one
  `requirements-v<n>.md`, showing its slug and highest version, and ask which to feed in. If
  none exist, say so and point at `/refine` to produce one first.

## Before feeding it in

Search `specs/*/spec.md` for an `Input:` line already referencing this resolved file's path
(every spec-kit spec produced this way records its source there, e.g.
`specs/001-credit-account-types/spec.md`). If a match exists, tell the user which
`specs/<NNN>-.../` it already produced and ask whether to proceed anyway — creating a second,
independent spec from the same requirement — or stop. Don't feed it in silently a second time.

## Feed it in

Read the resolved `requirements-v<n>.md` file's full content, then invoke the
**`speckit-specify`** skill (via the Skill tool) with that content as its argument, unedited.
Don't summarise or shorten it first — `speckit-specify` does its own extraction, and this repo's
constitution requires concrete-data Given/When/Then output regardless of how the input is
phrased.

## After

Relay `speckit-specify`'s own completion report — feature directory, spec file path, checklist
result — rather than re-describing it.
