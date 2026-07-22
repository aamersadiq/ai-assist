# Interview v<n> — <requirement slug>

> **Requirement:** [requirement.md](requirement.md)
> **Started:** YYYY-MM-DD · **Last updated:** YYYY-MM-DD
> **Status:** in progress | complete
> **Produced:** [requirements-v<n>.md](requirements-v<n>.md) *(once complete)*

## Hypothesis

| Version | Statement | Confidence | When |
|---|---|---|---|
| initial | *one sentence on what they actually want* | 45% | YYYY-MM-DD |
| revised | *updated after Q1–Q4* | 80% | YYYY-MM-DD |

Confidence is what you'd defend, not what sounds good. Below ~70%, say what's driving it.

## Question index

Jump to any question by ID. Statuses: `answered` · `parked` · `ignored` · `blocked` ·
`superseded` · `open`

| ID | Group | Question | Status | Updated |
|---|---|---|---|---|
| Q1 | G1 | *short form of the question* | answered | YYYY-MM-DD |
| Q2 | G1 | *…* | parked | YYYY-MM-DD |
| Q3 | G2 | *…* | ignored | YYYY-MM-DD |
| Q4 | G2 | *…* | blocked | YYYY-MM-DD |

**Totals:** answered 1 · parked 1 · ignored 1 · blocked 1 · open 0

---

## G1 — <group theme>

### Q1 — <the question>

**Asked:** YYYY-MM-DD · **Status:** `answered`

**My guess:** *what you predicted the answer would be.*
**Why:** *the reasoning that produced that guess — this is what they're correcting.*

**Answer:** *what they said, in their words.*

<details>
<summary>History (1 earlier answer)</summary>

| When | Answer | Superseded by |
|---|---|---|
| YYYY-MM-DD | *the original answer* | Q1 current |

</details>

---

### Q2 — <the question>

**Asked:** YYYY-MM-DD · **Status:** `parked`
**Parked because:** *why they deferred it — needed to check with someone, not decided yet.*
**Re-offer on resume:** yes

---

## G2 — <group theme>

### Q3 — <the question>

**Asked:** YYYY-MM-DD · **Status:** `ignored`

> **Assumption taken instead:** *what you will proceed on, stated plainly.*
> **Risk if wrong:** *what breaks.*
> **Carried into:** requirements-v<n>.md → Assumptions

Every ignored question **must** carry an assumption. That's what makes ignoring safe rather than
silent.

---

### Q4 — <the question>

**Asked:** YYYY-MM-DD · **Status:** `blocked`
**Blocked on:** *who or what unblocks this.*
**Re-check on resume:** yes

---

## Coverage

Filled as the interview proceeds. All six must be settled before producing the requirement.

| Dimension | Settled? | From |
|---|---|---|
| Outcome | ✅ | Q1 |
| User | ✅ | Q1, Q5 |
| Why now | ⬜ | — |
| Success | ⬜ | — |
| Constraints | ⬜ | — |
| Out of scope | ⬜ | — |

## Feasibility

Checked against the knowledge base. **"None" is a real finding — record it.**

| Check | Result | Reference |
|---|---|---|
| Blocked by a gap | none / *what* | *link* |
| Depends on an `[intent]` | none / *which* | *link* |
| Conflicts with a decision | none / *which* | *link* |

## Knowledge captured

Business facts established here that belong in the knowledge base, not in this file.

| Fact | Moved to KB? |
|---|---|
| *…* | ⬜ |

## Session log

Append-only. One line per session, so a reader can see how the thinking developed.

| When | Session | What happened |
|---|---|---|
| YYYY-MM-DD | 1 | Started. Q1–Q4 asked, Q1 answered, Q2 parked. |
