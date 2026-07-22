---
# Machine-readable session state. Everything needed to resume on another
# machine or tool lives here — no session state is held anywhere else.
schemaVersion: 1
requirement: <slug>
version: 1
phase: interviewing        # loading | interviewing | coverage | drafting | complete
started: YYYY-MM-DD
updated: YYYY-MM-DD
sessions: 1

hypothesis:
  statement: "<one sentence on what they actually want>"
  confidence: 45

questions:
  nextId: 5                # never reused, continues across versions
  totals:
    answered: 1
    parked: 1
    ignored: 1
    blocked: 1
    open: 0
  parked:  [Q2]            # re-offer on resume
  ignored: [Q3]            # re-offer with the assumption taken
  blocked: [Q4]            # re-check whether the blocker cleared

coverage:                  # all six must be true before drafting
  outcome: true
  user: true
  whyNow: false
  success: false
  constraints: false
  outOfScope: false

feasibility:
  blockedByGap: null       # null = not yet checked, "none" = checked and clear
  dependsOnIntent: null
  conflictsWithDecision: null

sources:
  knowledgeBase:
    path: ../../../bank-harness-kb
    loadedAt: YYYY-MM-DD
  repositories:
    - id: bank-harness
      discoveryDir: docs
      understandDir: .ua
      graphCommit: <gitCommitHash from .ua/meta.json>
      headCommit: <repo HEAD at load time>
      stale: false         # true when the two differ — artefacts predate the code
    - id: bank-harness-fe
      discoveryDir: docs
      understandDir: .ua
      graphCommit: <…>
      headCommit: <…>
      stale: false

outputs:
  interview: interview-v1.md
  requirements: null       # set when the version completes
---

# Session state — <requirement slug>

Human-readable mirror of the frontmatter above. **The frontmatter is authoritative** — if the
two disagree, trust it and correct this section.

## Where things stand

**Phase:** interviewing · **Version:** 1 · **Session:** 1

**Current hypothesis** (45% confidence):
> *one sentence on what they actually want*

## Outstanding

| | IDs | On resume |
|---|---|---|
| Parked | Q2 | Offer to answer now |
| Ignored | Q3 | Re-offer with the assumption taken — it may no longer be acceptable |
| Blocked | Q4 | Check whether the blocker has cleared |

## Coverage

⬜ Why now · ⬜ Success · ⬜ Constraints · ⬜ Out of scope
✅ Outcome · ✅ User

## Artefact freshness

Checked at load. If a graph's commit differs from the repo's `HEAD`, it predates the working
tree and answers drawn from it may be wrong.

| Repo | Graph commit | HEAD | Stale? |
|---|---|---|---|
| bank-harness | `<…>` | `<…>` | no |
| bank-harness-fe | `<…>` | `<…>` | no |

## To resume

Run `/refine` in this folder. It will reload context, re-check freshness, then **ask** whether to
work on new, parked, ignored, or blocked questions — or to review a specific `Qn`. It will not
silently continue where it left off.
