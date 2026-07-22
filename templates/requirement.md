# R-000 — <short title in business language>

> **Status:** draft | refined | accepted | rejected | blocked
> **Raised:** YYYY-MM-DD
> **Last updated:** YYYY-MM-DD
> **Refined by:** [interview-v1.md](interview-v1.md) *(when produced by `/refine`)*

When `/refine` produces this file, **every statement should cite the question that settled it** —
`— Q4, Q7`. That's what makes the requirement auditable back to the interview.

## What the user should be able to do

One or two sentences, in the product's own vocabulary, describing the outcome for a user.
State the outcome, not the mechanism.

> Check every term against the [glossary](../../bank-harness-kb/docs/glossary.md), including
> its "words we deliberately don't use" list. Delete this note when done.

## Why

The problem this solves, or the value it adds. If this came from someone specific, say who.

## Rules it touches

| Rule | Effect |
|---|---|
| *e.g. no-overdraft* | unchanged / modified / new |

Reference [business-rules.md](../../bank-harness-kb/docs/business-rules.md). If this introduces
a rule that doesn't exist yet, say so plainly — the KB's "what is deliberately NOT a rule" list
is where to check.

## Journey it changes

Which of the existing [journeys](../../bank-harness-kb/docs/customer-journeys.md) this affects,
or whether it introduces a new one. Note if it touches a journey that doesn't exist today.

## Can the product support this?

Check [constraints-and-gaps.md](../../bank-harness-kb/docs/constraints-and-gaps.md) and answer
honestly:

- **Blocked by:** *any gap that makes this unsatisfiable today — e.g. no concept of a customer,
  no record of refused attempts, single currency*
- **Depends on `[intent]`:** *any not-yet-built direction this assumes — say which*
- **Conflicts with a decision:** *reference the decision in
  [open-questions.md](../../bank-harness-kb/docs/open-questions.md) — reopening a settled
  decision is fine, but must be deliberate*

If all three are empty, say so — that's a meaningful result.

## Acceptance

What must be true for this to be considered done, in business terms. Include the unhappy paths:
what happens when the user gets it wrong, and what they are told.

## Assumptions

Every question that was **ignored** during refinement leaves an assumption here. This is what
makes ignoring a question safe rather than silent — the risk is stated, not buried.

| # | Assumption | Risk if wrong | From |
|---|---|---|---|
| A1 | *what we proceeded on* | *what breaks* | Q3 |

## Open questions

Anything that needs a decision before this can proceed — including questions still **parked** or
**blocked** when the version was produced.

| ID | Question | Why unresolved |
|---|---|---|
| Q2 | *…* | parked — awaiting a decision from … |
| Q4 | *…* | blocked on … |

Move anything of lasting significance into the KB's
[decisions document](../../bank-harness-kb/docs/open-questions.md) rather than leaving it here.

## Knowledge captured

New business facts established while refining this. **These belong in the knowledge base** —
list them here, then move them across and link back.

## Changelog

Only for v2 and later. What changed against the previous version, and which questions drove it.

| Version | Changed | Driven by |
|---|---|---|
| v2 | *…* | Q24, Q27 |
