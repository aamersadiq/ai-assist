# Specs (spec-kit)

Where a `/refine`-produced requirement becomes a spec-kit spec, then — in the implementation
repos — an implementation plan, a task list, and code. This is [github/spec-kit](https://github.com/github/spec-kit)'s
own workflow; this file just shows where it starts and stops in this harness.

## The pipeline

```
requirements/<slug>/requirement.md            the raw ask, written by hand
        │
        │   /refine   (this repo's own workflow — see ../requirements/README.md)
        ▼
requirements/<slug>/requirements-v<n>.md      agreed requirement, business language
        │
        │   /specify-requirement <slug>       reads the file above, feeds its content
        │                                      to speckit-specify — no copy/paste needed
        ▼
specs/<NNN>-<name>/spec.md                    User Stories, Acceptance Scenarios, and
                                                Functional Requirements — every one in
                                                Given/When/Then with concrete example data
                                                (required by the constitution — see below)
        │
        │   /speckit-clarify   (optional — only if spec.md still has real gaps)
        ▼
specs/<NNN>-<name>/plan.md                    /speckit-plan: tech stack, storage, file layout
        │
        │   /speckit-tasks
        ▼
specs/<NNN>-<name>/tasks.md                   ordered, dependency-aware task list
        │
        │   /speckit-implement
        ▼
                                               code — in bank-harness / bank-harness-fe,
                                                not in this repo (see note below)
```

`/speckit-analyze`, `/speckit-checklist`, and `/speckit-converge` are optional quality passes
usable at various points in the pipeline above — see each skill's own description.

## What lives in `specs/<NNN>-<name>/`

- `spec.md` — the feature spec. Always produced by `/speckit-specify` (or via
  `/specify-requirement`, which is the same thing with its input pre-filled).
- `checklists/requirements.md` — a spec-quality checklist, generated and self-validated by
  `/speckit-specify` at the same time as `spec.md`.
- `plan.md`, `tasks.md` — added later by `/speckit-plan` and `/speckit-tasks`, once a feature is
  actually being built.

## The one manual handoff: `/specify-requirement`

`/speckit-specify` takes whatever text follows the command as the feature description — it has
no way to reach into `requirements/<slug>/requirements-v<n>.md` on its own. `/specify-requirement
<slug>` closes that gap: it resolves the slug to the right file, reads it, and calls
`speckit-specify` with that content directly. See
[`.claude/commands/specify-requirement.md`](../.claude/commands/specify-requirement.md) for
exactly how it resolves a slug and guards against feeding the same requirement in twice.

## `ai-assist` has no codebase of its own

This harness only carries a feature as far as `spec.md` (and, if run here, `plan.md`/
`tasks.md`) — it has no `src/` to build against. When a feature under spec is actually going to
be built, `/speckit-plan` needs pointing at the real target repo's conventions —
[`bank-harness`](../../bank-harness/CLAUDE.md) for the service, or
[`bank-harness-fe`](../../bank-harness-fe/CLAUDE.md) for the customer application — rather than
guessing from anything in `ai-assist`.

## Acceptance-criteria style is governed by the constitution

Every spec produced here follows [`.specify/memory/constitution.md`](../.specify/memory/constitution.md)'s
**Acceptance Criteria in BDD** principle: every Functional Requirement and every Acceptance
Scenario must be Given/When/Then, with concrete example data — not abstract placeholders. Amend
that file (via `/speckit-constitution`) if this project's requirements style needs to change;
don't drift from it spec-by-spec.
