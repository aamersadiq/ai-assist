# Feature Specification: Transaction and Credit Account Types

**Feature Branch**: `001-credit-account-types`

**Created**: 2026-07-23

**Status**: Draft

**Input**: User description: "R-001 — Account creation supports transaction and credit account
types (fed from requirements/create-account-upgrade/requirements-v1.md, produced by this repo's
`/refine` workflow)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a transaction account (Priority: P1)

A user creates an everyday transaction account, which opens exactly as accounts do today —
empty, at a zero balance, with no credit behaviour.

**Why this priority**: This is the account type that already exists in the product. It must
keep working completely unchanged once account type becomes a required choice at creation,
otherwise every existing account-creation flow breaks. It's also the baseline the credit-account
story is contrasted against.

**Independent Test**: Can be fully tested by creating an account, choosing "transaction" as the
type, and confirming it opens with a $0.00 balance and behaves identically to today's account
creation — deliverable and demonstrable without the credit-account story existing.

**Acceptance Scenarios**:

1. **Given** the account-creation form is open, **When** the user enters the name "Jordan
   Everyday", selects type "transaction", and submits, **Then** an account named "Jordan
   Everyday" is created with a balance of $0.00 and no credit limit.
2. **Given** a transaction account "Jordan Everyday" with a balance of $0.00, **When** the user
   attempts to withdraw $10.00, **Then** the withdrawal is refused with "Insufficient funds" and
   the balance remains $0.00.

---

### User Story 2 - Create a credit account with a credit limit (Priority: P1)

A user creates a credit account by choosing type "credit" and supplying a credit limit instead
of a cash balance; the account opens able to be spent down to the negative of that limit.

**Why this priority**: This is the core of the request — without it, "account creation supports
credit accounts" doesn't exist. Equal priority to User Story 1: both must ship together for
account type to be a real choice, since there's no useful increment with only one type
selectable.

**Independent Test**: Can be fully tested by creating an account, choosing "credit" as the type,
entering a credit limit (e.g. $500.00), and confirming the account opens with a $0.00 balance
and a $500.00 limit — distinct from a transaction account, which has no limit field at all.

**Acceptance Scenarios**:

1. **Given** the account-creation form is open, **When** the user enters the name "Sam Credit
   Line", selects type "credit", and enters a credit limit of $500.00, **Then** an account named
   "Sam Credit Line" is created with a balance of $0.00 and a credit limit of $500.00.
2. **Given** the account-creation form is open with type "credit" selected, **When** the user
   submits without entering a credit limit, **Then** creation is refused with "Credit limit is
   required" and no account is created.
3. **Given** the account-creation form is open with type "credit" selected, **When** the user
   enters a credit limit of -$50.00, **Then** creation is refused with "Credit limit must be a
   positive amount" and no account is created.

---

### User Story 3 - Spend a credit account into its limit, and get refused beyond it (Priority: P1)

A user withdraws from, or transfers out of, a credit account, taking its balance negative — but
only down to the credit limit, never beyond.

**Why this priority**: This is what makes a credit account behave differently from a transaction
account after creation — without it, the credit limit field is decorative. Equal priority: the
feature has no observable value if a credit account merely opens differently but behaves
identically to a transaction account afterward.

**Independent Test**: Can be fully tested independently of Stories 1 and 2's creation UI by
taking an already-created credit account (balance $0.00, limit $500.00) and performing
withdrawals against it directly — confirms the modified no-overdraft threshold on its own.

**Acceptance Scenarios**:

1. **Given** a credit account "Sam Credit Line" with a $500.00 limit and a $0.00 balance,
   **When** the user withdraws $500.00 with description "Groceries", **Then** the withdrawal
   succeeds, the balance becomes -$500.00, and the movement appears in the account's history.
2. **Given** a credit account "Sam Credit Line" with a $500.00 limit and a balance of -$500.00,
   **When** the user attempts to withdraw $0.01 more, **Then** the withdrawal is refused with
   "Insufficient funds" and the balance remains -$500.00.
3. **Given** a transaction account "Jordan Everyday" with a $0.00 balance, **When** the user
   attempts to withdraw $0.01, **Then** the withdrawal is refused with "Insufficient funds" and
   the balance remains $0.00 — the zero floor is unchanged for transaction accounts.

---

### Edge Cases

- What happens when a user deposits into a credit account? Deposits behave identically
  regardless of type — a $200.00 deposit into "Sam Credit Line" at -$500.00 raises its balance
  to -$300.00, the same mechanism as a deposit into any account today.
- What happens on a transfer between two credit accounts, or from a credit account to a
  transaction account? The existing transfer rule applies unchanged — refused if the source
  doesn't hold enough (i.e., would take a credit account below -limit, or a transaction account
  below $0.00); succeeds and is recorded as one shared movement otherwise.
- What happens if account type is omitted entirely at creation? Refused — type is now a required
  field, the same class of refusal as a missing or invalid name today.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST require a type (transaction or credit) to be chosen when creating an
  account. **Given** the account-creation form, **When** the user submits without selecting a
  type, **Then** creation is refused with a message indicating a type is required, and no
  account is created.
- **FR-002**: System MUST open a transaction account with a balance of $0.00 and no credit
  limit, unchanged from today's account creation. **Given** a submitted creation with type
  "transaction" and name "Jordan Everyday", **When** the account is created, **Then** it exists
  with balance $0.00 and no credit-limit value stored.
- **FR-003**: System MUST require a positive credit limit when the chosen type is credit.
  **Given** type "credit" with the credit-limit field left blank, **When** the user submits,
  **Then** creation is refused with "Credit limit is required" and no account is created.
- **FR-004**: System MUST refuse a non-positive credit limit. **Given** type "credit" and a
  credit limit of $0.00, **When** the user submits, **Then** creation is refused with "Credit
  limit must be a positive amount" and no account is created.
- **FR-005**: System MUST open a credit account with a balance of $0.00 and the entered credit
  limit stored against it. **Given** type "credit", name "Sam Credit Line", and credit limit
  $500.00, **When** the account is created, **Then** it exists with balance $0.00 and credit
  limit $500.00.
- **FR-006**: System MUST allow a credit account's balance to go negative, down to the negative
  of its credit limit, on a withdrawal or the outgoing side of a transfer. **Given** credit
  account "Sam Credit Line" (limit $500.00, balance $0.00), **When** a $500.00 withdrawal is
  requested, **Then** it succeeds and the balance becomes -$500.00.
- **FR-007**: System MUST refuse a withdrawal or outgoing transfer on a credit account that
  would take its balance below the negative of its limit. **Given** credit account "Sam Credit
  Line" (limit $500.00, balance -$500.00), **When** a further $0.01 withdrawal is requested,
  **Then** it is refused with "Insufficient funds" and the balance stays -$500.00.
- **FR-008**: System MUST continue to refuse a withdrawal or outgoing transfer on a transaction
  account that would take its balance below $0.00, with no exception. **Given** transaction
  account "Jordan Everyday" (balance $0.00), **When** a $0.01 withdrawal is requested, **Then**
  it is refused with "Insufficient funds" and the balance stays $0.00.
- **FR-009**: System MUST NOT keep a record of a refused withdrawal or transfer attempt, on
  either account type — matching today's behaviour for every refusal. **Given** the refusal in
  FR-007, **When** the account's history is viewed afterward, **Then** no entry for the refused
  attempt appears.
- **FR-010**: System MUST apply the existing account-name validation (3–50 characters)
  identically to both account types. **Given** type "credit" and a 2-character name, **When**
  the user submits, **Then** creation is refused with the existing name-length message, and no
  account is created.
- **FR-011**: System MUST treat deposits and incoming transfers identically regardless of
  account type — no type-specific rule on money coming in. **Given** credit account "Sam Credit
  Line" at balance -$500.00, **When** a $200.00 deposit with description "Payment" is made,
  **Then** the balance becomes -$300.00.

### Key Entities *(include if feature involves data)*

- **Account**: now carries a **type** (transaction or credit) in addition to its existing name
  and balance. A credit account also carries a **credit limit**; a transaction account does not.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can create either a transaction or a credit account in a single
  account-creation step, with no separate step required afterward to set a credit limit.
- **SC-002**: 100% of withdrawals or outgoing transfers that would take a transaction account
  below $0.00 are refused, with zero exceptions — matching today's behaviour exactly.
- **SC-003**: 100% of withdrawals or outgoing transfers that would take a credit account below
  its negative credit limit are refused; every amount down to and including the limit succeeds.
- **SC-004**: Every refusal under SC-002 or SC-003 shows the existing "Insufficient funds"
  wording and leaves no trace in the account's history — no new refusal-handling behaviour is
  introduced.

## Assumptions

- Deposits and incoming transfers into a credit account behave exactly as they do for a
  transaction account today (increase the balance, no type-specific rule) — inferred during
  requirement refinement, not explicitly confirmed against an implementation.
- Accounts remain ownerless under this feature — anyone can create, view, or act on any account
  of either type, including drawing a credit account someone else created down to its limit.
  This is an existing, deliberately accepted product gap; this feature doesn't change or worsen
  it beyond making it apply to credit accounts too.
- Only two account types exist after this feature: transaction and credit. No further types
  (e.g. savings) are in scope.
