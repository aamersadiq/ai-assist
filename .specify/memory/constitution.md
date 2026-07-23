<!--
Sync Impact Report
- Version change: N/A → 1.0.0 (initial ratification — first concrete content added to
  what was previously an unfilled template)
- Modified principles: none renamed (none existed before)
- Added sections:
  - Core Principles → I. Acceptance Criteria in BDD (Given/When/Then)
  - Governance (amendment procedure, versioning policy, compliance review)
- Removed sections:
  - [SECTION_2_NAME]/[SECTION_2_CONTENT] and [SECTION_3_NAME]/[SECTION_3_CONTENT] template
    slots — these are optional in the source template ("Additional Constraints",
    "Development Workflow", etc.) and nothing has been decided for them yet. Removed rather
    than left as bracket tokens; add back via a future amendment when there's real content.
- Templates requiring updates:
  - ✅ .specify/templates/spec-template.md — Functional Requirements section updated to
    require Given/When/Then with concrete example data, matching the new principle
  - ✅ .specify/templates/plan-template.md — no static edit needed; its "Constitution Check"
    section already reads this file dynamically at /speckit-plan time
  - ✅ .specify/templates/tasks-template.md — no change needed; task structure doesn't
    encode requirement phrasing
  - ✅ .claude/skills/speckit-*/SKILL.md — reviewed, no agent-specific (CLAUDE-only) names
    found that needed genericizing
- Follow-up TODOs:
  - TODO(PRINCIPLES_II_V): No further principles ratified yet. Add via a future
    `/speckit-constitution` amendment when this project's other principles (testing
    discipline, tech constraints, review process, etc.) are actually decided — not invented
    here to fill space.
-->

# ai-assist Constitution

> Bank Harness — Requirements Assistant harness. Governs artifacts produced by this repo's
> spec-kit commands (`/speckit-specify`, `/speckit-plan`, `/speckit-tasks`,
> `/speckit-implement`, and related).

## Core Principles

### I. Acceptance Criteria in BDD (Given/When/Then)

Every functional requirement and every acceptance scenario produced by `/speckit-specify` —
and carried through unchanged in intent by `/speckit-plan` and `/speckit-tasks` — MUST be
expressed as **Given/When/Then**. Each clause MUST use **concrete example data**, not an
abstract placeholder:

- **Given** names actual starting values (an account name, a balance, a limit, a type) — not
  "given an invalid input."
- **When** names an actual action with actual inputs — not "when submitted."
- **Then** names the actual, observable result, including exact wording where the product has
  fixed customer-facing copy — not "an error is shown."

This applies to the spec's **Functional Requirements** section, not only its **User Story
Acceptance Scenarios** — a requirement stated only as prose ("System MUST validate the credit
limit") is incomplete until it carries at least one concrete Given/When/Then example.

**Rationale**: Abstract requirements are unfalsifiable — nobody can tell from reading
"validate input" or "handle errors" whether a given implementation satisfies it. Concrete
example data turns every requirement into a testable claim, and doubles as the seed for
acceptance tests without waiting for a separate test-design pass.

*(Further principles — testing discipline, technical constraints, review process — are not
yet ratified. Add them via a future amendment rather than inferring them here.)*

## Governance

This constitution governs every artifact this repo's spec-kit commands produce. It
supersedes ad hoc practice for those artifacts specifically; it does not govern the
harness's separate `/refine` requirement-refinement workflow (`requirements/`), which has
its own rules in [`../../CLAUDE.md`](../../CLAUDE.md).

**Amendments**: Proposed via `/speckit-constitution` with the specific principle text to
add, change, or remove. Each amendment updates this file's version per the rule below and
triggers a propagation check across `.specify/templates/plan-template.md`,
`spec-template.md`, and `tasks-template.md`.

**Versioning**: Semantic versioning — MAJOR for backward-incompatible principle removals or
redefinitions, MINOR for new principles or materially expanded guidance, PATCH for
wording/clarification only.

**Compliance**: Every spec produced by `/speckit-specify` after a principle is ratified MUST
satisfy it. Principles marked not-yet-ratified above impose no obligation until they are.

**Version**: 1.0.0 | **Ratified**: 2026-07-23 | **Last Amended**: 2026-07-23
