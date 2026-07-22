# R-001 — Account creation supports transaction and credit account types

> **Status:** refined
> **Raised:** 2026-07-22
> **Last updated:** 2026-07-22
> **Refined by:** [interview-v1.md](interview-v1.md)

## What the user should be able to do

When creating an account, a user chooses a **type**: **transaction** or **credit**. A transaction
account opens exactly as accounts do today — empty, at zero. A credit account opens with a
**credit limit** instead of a cash balance, and can be spent down to `-limit` before further
withdrawals or transfers out are refused. — Q1, Q2

## Why

Broadens what this training harness can teach and demonstrate — giving trainees a second account
behaviour (credit, a limit, a negative balance) to work with. Not driven by a specific reported
problem or an external stakeholder deadline. — Q4

## Rules it touches

| Rule | Effect |
|---|---|
| An account opens empty (no opening deposit) | **Unchanged** for transaction accounts. **Modified** for credit accounts: they open with a credit limit in place of a cash balance — not cash appearing from nowhere, a different kind of starting value entirely. — Q1 |
| No-overdraft — an account can never go below zero, with no exceptions | **Modified.** Gains its first-ever exception: a credit account's balance may go negative down to `-limit`. For transaction accounts the rule is fully unchanged — the zero floor still applies with no exception. — Q2 |
| Account name, 3–50 characters | **Unchanged.** — Q3 |
| Refusal wording ("Insufficient funds") | **Unchanged**, reused for a credit account refused beyond its limit. — Q6 |

Reference [business-rules.md](../../bank-harness-kb/docs/business-rules.md). This requirement
introduces one rule that doesn't exist today (a credit limit, and a balance floor below zero) and
**deliberately reopens a settled decision** — see below.

## Journey it changes

Changes **[Opening an account](../../bank-harness-kb/docs/customer-journeys.md#opening-an-account)**:
the user now also picks a type, and for a credit account, supplies a credit limit. No other
journey changes — putting money in, taking money out, and moving money between accounts keep
their existing shape; only the threshold that "taking money out" checks against changes for a
credit account (`-limit` instead of `0`).

## Can the product support this?

- **Blocked by:** nothing. — Q1–Q7
- **Depends on `[intent]`:** partially. [business-rules.md](../../bank-harness-kb/docs/business-rules.md#intended-but-not-built)
  lists **"Account types and lifecycle"** as confirmed direction, not built — but describes it as
  savings versus checking, not a credit type with a negative-balance allowance. This requirement
  goes further than the existing `[intent]` wording. It also builds account types **ahead of**
  the KB's recommended order — [open-questions.md Q-4](../../bank-harness-kb/docs/open-questions.md#open)
  recommends **account ownership** be built first, as the foundation the other `[intent]` items
  sit on. The requester confirmed proceeding without ownership deliberately. — Q1, Q2, Q5
- **Conflicts with a decision:** yes. [D-1](../../bank-harness-kb/docs/open-questions.md#settled--dont-relitigate)
  states the rules governing money "apply consistently, however a user gets there — nothing skips
  them and nothing overrides them." A credit account's negative-balance allowance is a deliberate,
  confirmed exception to that decision, not an oversight. — Q2

## Acceptance

- Creating an account requires choosing a type: transaction or credit. — Q1
- A transaction account opens at a zero balance, identical in every respect to account creation
  today. Its no-overdraft floor stays at zero, with no exception. — Q1, Q2
- A credit account requires a credit limit at creation, validated as a positive amount (mirroring
  how every other amount in the product is validated). It opens with no cash balance; its
  "balance" can range down to `-limit`. — Q1, Q3
- On a credit account, a withdrawal or an outgoing transfer that would take the balance below
  `-limit` is refused with the existing **"Insufficient funds"** wording. Nothing changes, and no
  record of the refused attempt is kept — same behaviour as every other refusal in the product
  today. — Q2, Q6
- Deposits and incoming transfers behave identically regardless of type. — inferred from Q1, Q2
  (only the floor changes; nothing else about a movement of money is type-specific)
- The account-name validation (3–50 characters) is unchanged for both types. — Q3

## Assumptions

No questions were ignored during this refinement — all seven were answered directly. No
assumptions carried forward on that basis.

| # | Assumption | Risk if wrong | From |
|---|---|---|---|
| A1 | Deposits and incoming transfers to a credit account behave exactly as they do for a transaction account today (increase the balance, no type-specific rule). This was inferred, not asked directly. | If deposits into a credit account are meant to behave differently (e.g. paying down the negative balance with different validation, or being restricted), acceptance criteria above would need revising. | Q1, Q2 (inferred) |

## Open questions

None. All seven questions raised were answered, and all six coverage dimensions are settled.

## Knowledge captured

Two facts belong in the knowledge base, not just this file:

1. **Account types are being built ahead of account ownership**, reversing the KB's own
   recommendation in Q-4 (ownership first, as the foundation for the other `[intent]` items). This
   should be recorded as a decision so Q-4 isn't read as still-current guidance once this ships.
2. **No-overdraft gains its first confirmed exception** once this ships: a credit account's floor
   is `-limit`, not `0`. D-1 ("nothing overrides the rules") needs a caveat rather than standing
   as absolute.

Both are now recorded in
[`bank-harness-kb/docs/open-questions.md`](../../bank-harness-kb/docs/open-questions.md) — a note
on **D-1** and a new **D-7**, with **Q-4** moved to Resolved. Not written into `business-rules.md`
yet: the feature isn't built, and that file's `[intent]`/`[rule]` labels must reflect what's
actually shipped, not what's agreed.

## Changelog

Not applicable — this is v1.
