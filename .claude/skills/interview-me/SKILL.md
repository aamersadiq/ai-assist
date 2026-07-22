---
name: interview-me
description: Interview the requester one question at a time to turn a vague ask into a confirmed requirement, grounded in the bank-harness knowledge base. Use when a request is underspecified — unclear who benefits, why now, or what "done" looks like — or when the user says "interview me", "stress-test this", or "help me work out what I actually want". Also use before writing any requirement into requirements/, since an unexamined ask usually smuggles in assumptions the product cannot support.
---

# Interview Me — requirement refinement

Turn a rough ask into a requirement that survives contact with the product.

Adapted from the `interview-me` skill in [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills);
the method is theirs, the grounding in this solution's knowledge base is local.

## Why this exists here

Requirements for this product go wrong in a specific, repeatable way: they assume something
exists that doesn't. There is no customer. Nothing is ever pending. Refused attempts leave no
record to inspect. A requester will use those words in perfect good faith, and the gap won't
surface until someone tries to build it.

So this interview does two things at once: it finds out what the person actually wants, **and**
it checks that against what the product can support — before anything is written down.

## What this skill assumes

That you already know the product's vocabulary, rules, constraints, and settled decisions.
**Loading that context is a separate skill, not this one** — this skill is the interview method
itself.

The method depends on it, though: guess-attached questions are only useful when the guesses are
well-informed. If you don't have that grounding, get it before starting rather than interviewing
blind.

## Step 1 — State your hypothesis

Before asking anything, write:

- **One sentence** on what you think they actually want.
- **A confidence percentage** you'd defend. Below ~70%, say what's driving the uncertainty.

Show both. Being visibly wrong early is the point — it gives them something to push against.

## Step 2 — One question at a time, each with your guess attached

**Never batch questions.** One per turn, always, and every question carries your predicted
answer and the reasoning behind it:

> *"I'm assuming this is for someone reconciling accounts at day's end, not a person using
> their own account — because you mentioned spotting discrepancies. Right?"*

Reacting is easier than generating. A wrong guess gets corrected fast; an open question gets a
vague answer.

**Ground your guesses in the knowledge base.** When the ask touches something the product can't
do, put that in the question rather than saving it for later:

> *"You've said 'show them their failed payments' — the product doesn't keep any record of a
> refused attempt, so there's nothing to show today. Is this really a request to start recording
> them, or have I misread what you're after?"*

That's not pedantry. Surfacing it in question three saves a requirement that dies in week two.

## Step 3 — Listen for the gap between what's said and what's meant

Two signals worth acting on:

**Borrowed vocabulary.** If they say *customer*, *pending*, *failed transaction*, *payment*, or
*currency*, don't correct them and move on — find out what they meant. These words have no
referent in this product, so each one is a genuine fork: either they want something that doesn't
exist, or they mean something that does and are reaching for a familiar word.

**Pattern-matched answers.** "Make it more robust", "proper audit trail", "like a real bank"
describe a feeling, not an outcome. Probe:

> *"If you didn't have to justify this to anyone, what would you actually want to happen?"*

## Step 4 — Restate in their language

When you think you have it, play it back across six dimensions — using **their** words, not
yours, except where a term needed correcting:

- **Outcome** — what a user can do that they can't today
- **User** — who benefits (and note: the product has no concept of a customer, so be concrete
  about who this person actually is)
- **Why now** — what's driving the timing
- **Success** — how they'll know it worked
- **Constraints** — what it must not break
- **Out of scope** — what they're explicitly *not* asking for

Then add the check this product needs:

- **Feasibility** — blocked by a gap? depends on an `[intent]` that isn't built? conflicts with
  a settled decision? Name it, with a link. **"None" is a real and useful answer** — say it
  plainly when it's true.

## Step 5 — Get an actual yes

"Whatever you think is best" and "sounds good" are not confirmation. Ask again, plainly, until
you get a real one.

If the interview established that the ask **isn't currently satisfiable**, confirm that instead
— that's a successful outcome, not a failed interview. Better found now than after the work.

## When to stop

Stop when **you can predict their answer to the next three questions you'd ask.**

That's a test you can actually run, unlike "am I confident enough?". If you can't predict all
three, keep going.

## What you produce

A confirmed intent statement — the six dimensions plus the feasibility check, with an explicit
yes on the record.

That maps directly onto [`templates/requirement.md`](../../../templates/requirement.md): the
restate fills the requirement's body, and the feasibility check fills "Can the product support
this?". Write it into `requirements/` as `R-<nnn>-<slug>.md` and add it to the index.

**Then capture what you learned.** If the interview established a new business fact, it belongs
in the [knowledge base](../../../../bank-harness-kb/CLAUDE.md) — not in the requirement, where it
will be lost, and never in the implementation repos, whose docs are tool-generated. A new
unresolved question goes in the KB's
[decisions document](../../../../bank-harness-kb/docs/open-questions.md).

## Don't

- Batch questions. One at a time, every time.
- Ask a question without attaching your guess.
- Accept borrowed vocabulary without finding out what was meant.
- Invent a rule. If [business-rules.md](../../../../bank-harness-kb/docs/business-rules.md)
  doesn't state it, it isn't enforced — that file lists what is deliberately *not* a rule.
- Treat an `[intent]` item as built.
- Start writing the requirement before you have an explicit yes.
