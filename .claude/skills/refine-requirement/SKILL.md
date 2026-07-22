---
name: refine-requirement
description: Run a resumable requirement-refinement session. Loads the product knowledge base and each repo's generated artefacts (/codebase-discovery docs and /understand .ua graphs), interviews the requester using interview-me, and records every question and answer in a versioned interview file with a portable session state. Use when refining a requirement.md into an agreed requirements-v<n>.md, or when resuming or re-refining an earlier session. Invoked by the /refine command.
---

# refine-requirement — resumable requirement refinement

> Invoked by the **`/refine`** command. The command is the entry point; this skill is the method.

Turns a rough `requirement.md` into an agreed `requirements-v1.md`, by interview, with every
question and answer on the record and the session resumable from anywhere.

## Inputs

**1. The harness config** — [`harness.config.json`](../../../harness.config.json). Read it first.
For every entry in `repositories`, it declares two generated artefact sets:

| Artefact | Location | Produced by | Use it for |
|---|---|---|---|
| Discovery docs | `artefacts.discovery.dir` (`docs/`) | `/codebase-discovery` | Domain model, business rules, workflows, architecture — written prose |
| Understand graph | `artefacts.understand.dir` (`.ua/`) | `/understand` | `knowledge-graph.json` — nodes, edges, layers, tour. Structural reality |

Both are **read-only** and listed under `doNotEdit`. Never write to them.

**2. The knowledge base** — `knowledgeBases[].path`, canonical for business language and rules.

**3. The requirement folder** — a directory under `requirements/` containing `requirement.md`,
the raw ask. Everything this skill produces goes in that same folder.

## Outputs

```
requirements/<slug>/
  requirement.md         the original ask — never modified
  interview-v1.md        every question and answer, with history
  state.md               session state — portable, resumable
  requirements-v1.md     the agreed requirement
```

Re-refining produces `interview-v2.md` and `requirements-v2.md` alongside. **Earlier versions
are never edited or deleted.**

## Phase 0 — Load and check

Before the first question:

1. Read the config, the knowledge base, and `requirement.md`.
2. For each repo, load the discovery docs and the understand graph.
3. **Check artefact freshness.** Compare `.ua/meta.json`'s `gitCommitHash` against that repo's
   current `HEAD`. If they differ, the graph predates the working tree — say so up front and
   note it in `state.md`. Refining against stale artefacts silently produces wrong answers.
4. Write `state.md` with phase `loading` → `interviewing`.

If `state.md` already exists, **you are resuming** — jump to [Resuming](#resuming-a-session).

## Phase 1 — Hypothesis

Per [`interview-me`](../interview-me/SKILL.md): one sentence on what you think they want, plus a
confidence percentage you'd defend. Record both in `interview-v<n>.md` and `state.md`.

## Phase 2 — The interview loop

Run [`interview-me`](../interview-me/SKILL.md). This skill supplies the grounding it assumes and
records what it produces.

### Question model

- **IDs** — `Q1`, `Q2`, … allocated in order, **globally across the whole session and across
  versions**, never reused. The user can say "go to Q7" at any time.
- **Groups** — related questions and follow-ups belong to a numbered group `G1`, `G2`, … with a
  short theme. Ask a group's questions together when they only make sense together; otherwise
  keep to interview-me's one-at-a-time discipline.
- **Every question carries your guess** and the reasoning behind it. That's the method — a
  question without an attached guess is a worse question.

### What the user can do with any question

| They say | Status | What you do |
|---|---|---|
| an answer | `answered` | Record it. Ask a follow-up if it opened one. |
| "park it" / "later" | `parked` | Record it, move on. Re-offer on resume. |
| "ignore" / "skip" | `ignored` | **Record the assumption you'll proceed with instead.** |
| "I don't know / ask X" | `blocked` | Record who or what unblocks it. |
| "go to Q7" | — | Jump there. |
| "re-answer Q3" | `superseded` → new answer | Keep the old answer in history. Never overwrite. |
| "status" | — | Show counts and what's outstanding. |
| "pause" / leaves | — | Flush `state.md` and `interview-v<n>.md`, confirm it's safe to leave. |

> **An ignored question is not a free pass.** Every `ignored` question must record the assumption
> you will proceed on. Those assumptions carry into `requirements-v<n>.md` as stated risks —
> that's what makes ignoring safe rather than silent.

### Write as you go

After **every** answer, update `interview-v<n>.md` and `state.md`. Never batch writes to the end
— the session must survive the user closing the terminal mid-question.

## Phase 3 — Coverage and feasibility

Don't finish on question count. Finish on coverage. Check all six interview-me dimensions are
genuinely settled:

`Outcome` · `User` · `Why now` · `Success` · `Constraints` · `Out of scope`

Then the check this product needs — against the knowledge base:

- **Blocked by a gap?** Something the product can't support today.
- **Depends on an `[intent]`?** Something confirmed as direction but not built.
- **Conflicts with a settled decision?** Reopening one is fine, but must be deliberate.

Record the result even when it's "none" — that's a meaningful finding, not an empty field.

Apply interview-me's stopping test: **stop when you can predict the answers to the next three
questions you'd ask.** If parked or blocked questions remain, ask whether to resolve them now or
proceed and carry them as stated assumptions.

## Phase 4 — Produce the requirement

**Ask before writing.** Confirm they're ready — "whatever you think" is not a yes.

Then write `requirements-v<n>.md` from [`templates/requirement.md`](../../../templates/requirement.md),
with every statement traceable to the question that settled it (`— Q4, Q7`). Set `state.md` phase
to `complete`.

Finally, **push knowledge outward**: new business facts belong in the knowledge base, new
unresolved questions in its decisions document. Never in the implementation repos.

## Resuming a session

`state.md` is the source of truth, and carries everything needed to resume on a different machine
or tool. On resume:

1. Read `state.md` and `interview-v<n>.md`.
2. Reload context (Phase 0) and **re-check artefact freshness** — the code may have moved since.
3. Summarise where things stand: answered / parked / ignored / blocked counts, and the current
   hypothesis and confidence.
4. **Ask what they want to work on:**
   - new questions (continue the interview)
   - **parked** questions
   - **ignored** questions — and their recorded assumptions, which may no longer be acceptable
   - **blocked** questions — has the blocker cleared?
   - review or re-answer a specific `Qn`

Never silently resume where you left off. Always offer the choice.

## Re-refining — producing v2

When the user wants to refine again after a completed version:

1. Read the previous `interview-v<n>.md` and `requirements-v<n>.md`.
2. Start `interview-v<n+1>.md`, **continuing question numbering** — if v1 ended at Q23, v2 starts
   at Q24. IDs stay unique for the life of the requirement.
3. Carry forward every unresolved question — parked, ignored, blocked — and re-offer them.
4. Ask what changed: new information, a rejected assumption, or a changed ask.
5. Produce `requirements-v<n+1>.md` with a **changelog** against the previous version: what
   changed, and which questions drove it.

Earlier versions stay exactly as they were.

## Rules

- **Never modify `requirement.md`.** It's the original ask and the audit trail's starting point.
- **Never edit the repos' `docs/` or `.ua/`.** Generated; see `doNotEdit` in the config.
- **Never overwrite an answer.** Re-answering supersedes and keeps history.
- **Never lose a question.** Ignored and parked questions stay visible to the end.
- **Never assume without recording it.** Every ignored question yields a written assumption.
- **Write after every answer**, not at the end.
- **Don't invent rules.** If the knowledge base doesn't state it, it isn't enforced.
- **`[intent]` is not built.** Never write a requirement that assumes one is in place.
