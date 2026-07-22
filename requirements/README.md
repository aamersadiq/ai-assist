# Requirements

Refined requirements for the banking product. One file per requirement.

## Layout

**One folder per requirement**, named `R-<nnn>-<short-slug>` — e.g.
`R-001-daily-withdrawal-limit`. Numbers are allocated in order and never reused, so a rejected
requirement keeps its number.

```
R-001-daily-withdrawal-limit/
  requirement.md         the raw ask — you write this, and it is never modified
  interview-v1.md        every question and answer, with history
  state.md               session state — resumable from any machine or tool
  requirements-v1.md     the agreed requirement
```

Re-refining adds `interview-v2.md` and `requirements-v2.md`. **Earlier versions are never edited
or deleted** — the point is to see how the thinking moved.

## Running a refinement

Create the folder with a `requirement.md` in it, then run
[`/refine`](../.claude/commands/refine.md). It handles the interview, the record-keeping, and
the state.

Run it with a slug — `/refine R-001-daily-withdrawal-limit` — or bare, to pick from a list of
folders showing each one's phase and outstanding questions.

Questions are numbered `Q1`, `Q2`, … globally and never reused. You can answer, **park**,
**ignore**, or mark one **blocked**; jump to any question by ID; and re-answer anything later
with the earlier answer kept in history. Ignoring a question is fine — it records the assumption
taken instead, which carries into the requirement as a stated risk.

## Lifecycle

| Status | Meaning |
|---|---|
| `draft` | Captured, not yet checked against the knowledge base |
| `refined` | Vocabulary, rules, journey, and feasibility all checked |
| `blocked` | Cannot proceed — a gap or an undecided question is in the way |
| `accepted` | Agreed to be built |
| `rejected` | Decided against. **Keep the file** — the reasoning is the value |

Start from [`../templates/requirement.md`](../templates/requirement.md).

## Before writing one

Read [`../CLAUDE.md`](../CLAUDE.md). The short version:

- Business language only. If it needs a file open to understand, it's a task, not a requirement.
- Check the [glossary](../../bank-harness-kb/docs/glossary.md) first — the product has no
  customer, nothing is ever pending, and there are no failed transactions to inspect. Requirements
  assuming otherwise are common and go wrong quietly.
- Check [constraints-and-gaps.md](../../bank-harness-kb/docs/constraints-and-gaps.md) early.
  Finding out something is unsatisfiable is a **successful** outcome of refinement, not a failure
  — it just needs to happen before effort is spent, not after.
- `[intent]` items in the KB are **not built**. Don't assume limits, account types, or account
  ownership exist.

## Index

*None yet.* Add a row per requirement as they are written.

| # | Title | Status | Updated |
|---|---|---|---|
