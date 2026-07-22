# Interview v1 — create-account-upgrade

> **Requirement:** [requirement.md](requirement.md)
> **Started:** 2026-07-22 · **Last updated:** 2026-07-22
> **Status:** complete
> **Produced:** [requirements-v1.md](requirements-v1.md)

## Hypothesis

| Version | Statement | Confidence | When |
|---|---|---|---|
| initial | The requester wants to expand account creation so a user can pick an account type (transaction vs credit) and fund it with an opening balance at the moment of creation, with tighter validation on the inputs — moving account opening closer to a real bank's onboarding flow. | 40% | 2026-07-22 |
| revised | Account creation gains a required type: **transaction** (opens at zero, identical to today) or **credit** (opens with a credit limit instead of a cash balance, and is deliberately allowed to go negative down to `-limit` — the first exception to no-overdraft, reopening settled decision D-1). Refusal beyond the limit reuses "Insufficient funds". The credit-limit input is validated as a positive amount. This ships without addressing the "anyone can act on any account" gap, and without interest, fees, repayment, credit checks, post-creation type changes, or converting existing accounts — all confirmed out of scope. Driven by broadening what this training harness can teach, not a specific stakeholder problem. | 95% | 2026-07-22 |

Confidence is low: the raw ask uses "credit accounts" and "opening balance", neither of which
exist in the product today — one is an undefined term, the other conflicts directly with an
enforced rule ([rule] an account opens empty — [business-rules.md](../../../bank-harness-kb/docs/business-rules.md#accounts)).

## Question index

| ID | Group | Question | Status | Updated |
|---|---|---|---|---|
| Q1 | G1 | "Opening balance" — fund at creation, or create-then-deposit in one flow? | answered | 2026-07-22 |
| Q2 | G2 | Does a credit account's balance go negative against the limit? | answered | 2026-07-22 |
| Q3 | G3 | What does "validation on creation" cover? | answered | 2026-07-22 |
| Q4 | G4 | What's driving this now? | answered | 2026-07-22 |
| Q5 | G4 | Does the "anyone can act on any account" gap need addressing first? | answered | 2026-07-22 |
| Q6 | G5 | What happens when a credit-account withdrawal would exceed the limit? | answered | 2026-07-22 |
| Q7 | G5 | What's explicitly out of scope? | answered | 2026-07-22 |

**Totals:** answered 7 · parked 0 · ignored 0 · blocked 0 · open 0

---

## G1 — Opening balance

### Q1 — What does "have opening balance" mean?

**Asked:** 2026-07-22 · **Status:** `open`

**My guess:** You want the experience of "create an account with money in it already" — but not
literally a balance conjured from nowhere. More likely: fold the first deposit into the
create-account step, so the user picks a name *and* an initial amount in one screen, and the
account lands non-empty. Under the hood it would still be a deposit-shaped movement (money from
outside the system), just triggered by the same form as creation.

**Why this guess:** [business-rules.md](../../../bank-harness-kb/docs/business-rules.md#accounts)
states **[rule] An account opens empty. There is no opening deposit, and no way to create an
account with money already in it** — this is enforced today, not a gap or an unbuilt intent. So
"have opening balance" is asking to change an active rule, not fill a gap. I want to confirm
that's really the ask before treating it as one.

**Answer:** Not a fold-in of the first deposit. It splits by account type: for a **transaction**
account the opening balance is zero (matches today's behaviour). For a **credit** account, what's
set at creation is a **credit limit**, not a cash balance.

This corrects the original guess — it's not "fund at creation", it's "account type determines
what 'opening balance' even means, and for credit it isn't cash at all." Confirms the account
also needs a **type** (transaction / credit) as a new concept at creation. Carried into Q2.

---

## G2 — Credit accounts and no-overdraft

### Q2 — Does a credit account's balance go negative against the limit?

**Asked:** 2026-07-22 · **Status:** `open`

**My guess:** Yes — the way a real credit card works, a credit account can be spent down to
`-limit`, i.e. it can go negative up to the credit limit, then refuse further spending. That's
the standard meaning of "credit limit" and probably what's intended.

**Why I'm asking rather than assuming:** this would create an **exception** to the no-overdraft
rule, and today there isn't one. [business-rules.md](../../../bank-harness-kb/docs/business-rules.md#no-overdraft--the-central-rule)
is explicit: *"An account can never go below zero... There are no exceptions. No approved
overdraft, no arranged limit, no override, no authority level, no manual release. Nobody can
permit it."* [open-questions.md](../../../bank-harness-kb/docs/open-questions.md#settled--dont-relitigate)
also records this as **D-1, a settled decision**: *"The rules governing money apply consistently,
however a user gets there. Nothing skips them and nothing overrides them."*

So if the answer is yes, this requirement doesn't just add a feature — it deliberately reopens a
settled decision and puts the first-ever exception into the single most important rule in the
product. That's not disqualifying, but it needs to be explicit and deliberate, not something that
falls out of the word "credit limit" by default. If that's *not* what's wanted, what should
"credit limit" constrain instead — e.g. a cap on transaction size, with the balance still never
going below zero?

**Answer:** Yes — a credit account's balance can go negative, down to `-limit`.

This confirms the requirement deliberately reopens **D-1** (settled: rules apply consistently,
nothing overrides them) and creates the first-ever exception to no-overdraft. Recorded as a
**conflict with a settled decision** in Feasibility below — not disqualifying, but must be stated
plainly in the requirement, not buried.

---

## G3 — Validation on creation

### Q3 — What does "validation on creation" cover?

**Asked:** 2026-07-22 · **Status:** `open`

**My guess:** It's about the *new* fields this adds, not the existing ones. Account creation
currently validates one thing — a name, 3–50 characters. This requirement adds a type choice
(transaction / credit) and, for credit accounts, a credit-limit amount. I'd guess "validation on
creation" means: the limit must be a positive amount (mirroring how every other amount in the
product is validated — positive, two decimal places), and it's required for credit accounts but
not applicable to transaction accounts. Not a request to change the existing name rule.

**Why this guess:** every other amount-shaped input in the product (deposit, withdrawal, transfer)
already follows "positive, two decimal places" — [business-rules.md](../../../bank-harness-kb/docs/business-rules.md#every-movement-of-money).
Applying the same shape to a credit limit is the path of least surprise. But "validation" is
vague enough that it could also mean something about the name field, so I want to confirm rather
than assume.

**Answer:** Confirmed — validation applies to the new fields (type, and credit limit for credit
accounts), not a change to the existing name rule.

---

## G4 — Why, who, and what this must not break

### Q4 — What's driving this now?

**Asked:** 2026-07-22 · **Status:** `open`

**My guess:** Since this is a training/practice harness rather than a live product, I'd guess this
is about broadening what the harness can *demonstrate* — giving trainees a second account
behaviour (credit, negative balances, a limit) to work with, rather than a specific reported
problem or an external deadline. Not driven by a particular stakeholder complaint.

**Why this guess:** [`bank-harness-kb/CLAUDE.md`](../../../bank-harness-kb/CLAUDE.md) frames the
whole product as "a training and practice banking system — a teaching reference, not a production
banking product." Feature requests here tend to be about widening what can be taught or tested,
not fixing something broken for a real user.

**Answer:** Confirmed — this is about broadening what the harness can teach, not a specific
reported problem or stakeholder deadline.

---

### Q5 — Does the "anyone can act on any account" gap need addressing first?

**Asked:** 2026-07-22 · **Status:** `open`

**My guess:** No — acceptable as-is, same as today. Accounts have no owner at all right now
([constraints-and-gaps.md](../../../bank-harness-kb/docs/constraints-and-gaps.md#anyone-can-do-anything-to-any-account) —
"anyone who can reach the application can see every account and move money in or out of any of
them", confirmed acceptable for a training harness). A credit account just makes that existing
gap more visible — anyone can withdraw any credit account down to `-limit`, including one they
didn't create — but it isn't a *new* gap, just the same accepted one with real (if unnamed-unit)
value attached to it now. I'd guess you want this shipped without waiting on ownership.

**Why I'm asking rather than assuming:** the KB is explicit that this gap is "an absolute blocker
for any use beyond practice and demonstration" — worth a deliberate yes, not a default, especially
since a credit account is the first feature where the no-owner gap lets someone extract something
of value rather than just view or move existing money. The KB's own recommendation ([Q-4](../../../bank-harness-kb/docs/open-questions.md#open))
is that **ownership** should be built before the other `[intent]` items (limits, account types) —
this requirement would build account types ahead of that recommended order. Worth being explicit
that you're choosing to proceed anyway, if that's the case.

**Answer:** Confirmed — ship without addressing ownership first. Recorded as a deliberate choice
to build account types ahead of the KB's recommended order (ownership first), not an oversight.

---

## G5 — Success and scope

### Q6 — What happens when a credit-account withdrawal would exceed the limit?

**Asked:** 2026-07-22 · **Status:** `open`

**My guess:** Refused with the same **"Insufficient funds"** wording used today, not new copy.
The mechanism is the same shape as no-overdraft — refused at the moment of the movement, nothing
changes, no record kept — just the threshold moves from `0` to `-limit` for a credit account.

**Why this guess:** [D-6](../../../bank-harness-kb/docs/open-questions.md#settled--dont-relitigate)
records that refusal wording is **fixed and business-owned, treated as customer-facing copy** —
changing it is a bigger decision than this requirement is trying to make, so reusing it is the
path of least new decision-making. But the semantics differ slightly (a credit account holds
*capacity*, not funds), so worth confirming rather than assuming silently.

**Answer:** Confirmed — same "Insufficient funds" wording, threshold just moves to `-limit` for a
credit account.

---

### Q7 — What's explicitly out of scope?

**Asked:** 2026-07-22 · **Status:** `open`

**My guess:** No interest or fees on a negative credit balance, no repayment terms or minimum
payments, no credit check or approval step before granting a limit, no changing an account's type
after creation, and no converting existing accounts to the new types. Just: pick a type at
creation, set a limit for credit accounts, and the modified no-overdraft threshold. Everything
else about a real credit product stays out.

**Why this guess:** none of interest, fees, repayment, or credit checks appear anywhere in
[business-rules.md](../../../bank-harness-kb/docs/business-rules.md#what-is-deliberately-not-a-rule)
— they're explicitly confirmed absent from the product today, so bundling any of them into this
requirement would be a much larger change than "update account creation" suggests.

**Answer:** Confirmed — interest/fees, repayment terms, credit checks, changing type after
creation, and converting existing accounts are all out of scope.

---

## Coverage

| Dimension | Settled? | From |
|---|---|---|
| Outcome | ✅ | Q1, Q2, Q3 |
| User | ✅ | Product has no customer/owner concept — "user" is anyone using the application, same as every existing journey ([glossary.md](../../../bank-harness-kb/docs/glossary.md), [domain-concepts.md](../../../bank-harness-kb/docs/domain-concepts.md#the-account-model)); nothing in this ask changes that |
| Why now | ✅ | Q4 |
| Success | ✅ | Q1, Q2, Q3, Q6 |
| Constraints | ✅ | Q1 (transaction accounts unchanged), Q5 (ownership gap not addressed, deliberately) |
| Out of scope | ✅ | Q7 |

## Feasibility

| Check | Result | Reference |
|---|---|---|
| Blocked by a gap | *pending* | — |
| Depends on an `[intent]` | **partial** — account types is [intent], not built ([business-rules.md](../../../bank-harness-kb/docs/business-rules.md#intended-but-not-built)); but that intent describes savings/checking, not a credit type with negative balances, and KB's Q-4 recommends **ownership** be built first as the foundation | Q1, Q2 |
| Conflicts with a decision | **yes** — reopens **D-1** (no exception to any rule, however reached) by making no-overdraft conditional on account type | Q2 |

## Knowledge captured

| Fact | Moved to KB? |
|---|---|
| A stakeholder has confirmed direction to build **account types ahead of account ownership**, reversing the KB's Q-4 recommendation (ownership first). Recorded as [D-7](../../../bank-harness-kb/docs/open-questions.md#settled--dont-relitigate); Q-4 moved to Resolved. | ✅ |
| **No-overdraft gains its first exception** once this ships (credit accounts, threshold `-limit` instead of `0`) — a note added to [D-1](../../../bank-harness-kb/docs/open-questions.md#settled--dont-relitigate) rather than treating it as absolute. | ✅ |

## Session log

| When | Session | What happened |
|---|---|---|
| 2026-07-22 | 1 | Loaded context, confirmed artefacts fresh, renamed `requirements.md` → `requirement.md`, stated hypothesis, ran Q1–Q7, all answered, all six coverage dimensions settled. Ready to draft requirements-v1.md pending explicit confirmation. |
