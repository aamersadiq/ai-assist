---
schemaVersion: 1
requirement: create-account-upgrade
version: 1
phase: complete
started: 2026-07-22
updated: 2026-07-22
sessions: 1

hypothesis:
  statement: "The requester wants account creation to support two account types — transaction and credit. Transaction accounts still open at zero. Credit accounts are created with a credit limit and are deliberately allowed to go negative down to -limit, a first-ever exception to no-overdraft. Also adds validation for the new credit-limit input."
  confidence: 95

questions:
  nextId: 8
  totals:
    answered: 7
    parked: 0
    ignored: 0
    blocked: 0
    open: 0
  parked: []
  ignored: []
  blocked: []

coverage:
  outcome: true
  user: true
  whyNow: true
  success: true
  constraints: true
  outOfScope: true

feasibility:
  blockedByGap: null
  dependsOnIntent: "partial — account types is [intent] not built, but described as savings/checking not credit-with-negative-balance; KB recommends ownership be built first (Q-4), user deliberately chose to proceed ahead of that order (Q5)"
  conflictsWithDecision: "D-1 — reopens 'nothing overrides the rules' by making no-overdraft conditional on account type (Q2). User confirmed proceeding without addressing the ownership gap first (Q5)."

sources:
  knowledgeBase:
    path: ../../../bank-harness-kb
    loadedAt: 2026-07-22
  repositories:
    - id: bank-harness
      discoveryDir: docs
      understandDir: .ua
      graphCommit: df256bf535d2b0a0e50d5d65db8d8e6b0a354c9e
      headCommit: 61b13dfc27666444f3a48022a6b4f5468f978747
      stale: false
    - id: bank-harness-fe
      discoveryDir: docs
      understandDir: .ua
      graphCommit: 91fc49213488763173a1d432346b78bc20f19dbe
      headCommit: c65b44fae828b4470edd1e087dcf3f841153abad
      stale: false

outputs:
  interview: interview-v1.md
  requirements: requirements-v1.md
---

# Session state — create-account-upgrade

Human-readable mirror of the frontmatter above. **The frontmatter is authoritative** — if the
two disagree, trust it and correct this section.

## Where things stand

**Phase:** complete · **Version:** 1 · **Session:** 1

**Final hypothesis** (95% confidence):
> Account creation gains a required type: transaction (opens at zero, identical to today) or
> credit (opens with a credit limit instead of a cash balance, allowed to go negative down to
> `-limit` — the first exception to no-overdraft, reopening D-1). Ships without addressing
> account ownership, and without interest, fees, repayment, credit checks, or type changes —
> all confirmed out of scope.

Produced [requirements-v1.md](requirements-v1.md).

## Outstanding

| | IDs | On resume |
|---|---|---|
| Parked | — | — |
| Ignored | — | — |
| Blocked | — | — |

## Coverage

⬜ Outcome · ⬜ User · ⬜ Why now · ⬜ Success · ⬜ Constraints · ⬜ Out of scope

## Artefact freshness

Checked at load. Both repos' `.ua` graph commit differs from current `HEAD`, but no `src/` files
changed between the graph commit and `HEAD` in either repo — graphs are fresh.

| Repo | Graph commit | HEAD | Stale? |
|---|---|---|---|
| bank-harness | `df256bf5` | `61b13dfc` | no (no src/ changes since) |
| bank-harness-fe | `91fc4921` | `c65b44fa` | no (no src/ changes since) |

## To resume

Run `/refine create-account-upgrade`. It will reload context, re-check freshness, then **ask**
whether to work on new, parked, ignored, or blocked questions — or to review a specific `Qn`. It
will not silently continue where it left off.
