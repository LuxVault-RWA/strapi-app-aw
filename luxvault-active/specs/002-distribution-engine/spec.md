# Feature Specification: Distribution Engine

**Feature Branch**: `[002-distribution-engine]`

**Created**: 2026-06-10

**Status**: Draft

**Input**: User description: "Build the distribution engine for finalized raffle
outcomes. It defines prize payouts, fee splits, treasury routing,
failed-payment handling, rounding, dust handling, payout state tracking,
reconciliation, and audit-visible distribution outcomes."

## 1. Overview

The distribution engine turns a finalized raffle outcome into auditable payout
obligations and distribution results. It consumes final outcome information from
`001-raffle-core`, applies explicit payout, fee, treasury, rounding, dust,
failure, and reconciliation rules, and produces a traceable distribution record
for operators, auditors, and downstream policy review.

The feature defines what must be true for a distribution to be correct. It does
not define how payouts are transported, signed, stored, queued, or executed.

## Clarifications

### Session 2026-06-10

- Q: Which `001-raffle-core` final outcome states may initiate this feature? -> A: Only `Winner Selected` may initiate a distribution; no-winner, refund-eligible, canceled, expired, and recovery states are rejected or deferred outside this feature.

## 2. Scope

This feature covers:

- Distribution initiation from a finalized, valid raffle outcome.
- Prize payout obligations for eligible raffle winners.
- Fee split obligations for protocol, issuer, creator, partner, reserve, or
  other explicitly configured recipients.
- Treasury routing obligations for funds not paid directly as prizes or fees.
- Distribution lifecycle state tracking.
- Failed-payment classification, retry eligibility, escalation, and terminal
  review outcomes.
- Deterministic rounding and dust handling.
- Reconciliation between intended recipients, intended amounts, attempted
  payments, final results, and audit evidence.
- Audit-visible distribution outcomes sufficient for operators to explain what
  was paid, to whom, why, under which authority, and with what result.

## 3. Non-Goals

This feature does not define:

- Raffle lifecycle, ticketing, draw closure, winner selection, or raffle refund
  eligibility.
- Agent approval policy itself.
- Execution transport.
- Signing implementation.
- Custody implementation.
- Payment processor, vendor, relay, framework, storage, queue, API endpoint, or
  worker architecture.
- Exact smart contract ABI or deployment details.
- Production spend limits, quorum rules, signer inventory, secrets, or
  emergency-rule changes.

## 4. Actors

- **Protocol Operator**: Starts or reviews a distribution after a raffle outcome
  is finalized.
- **Winner**: Receives a prize payout or a failure/review status explaining why
  payout did not complete.
- **Fee Recipient**: Receives an explicitly configured share of the
  distribution, such as protocol, issuer, creator, partner, or reserve.
- **Treasury Owner**: Owns treasury-bound proceeds and reviews routing outcomes.
- **Verifier**: Confirms the distribution intent, policy decision, simulation,
  recipient set, amounts, and post-state reconciliation.
- **Executor**: Submits only approved, unexpired, policy-bound distribution
  actions and does not alter approved terms.
- **Auditor**: Reviews distribution records and reconstructs what happened from
  emitted events and audit artifacts.

## 5. Inputs from `001-raffle-core`

A distribution may begin only after `001-raffle-core` has produced a finalized
`Winner Selected` outcome. The distribution engine MUST reject inputs that are
not final, not valid, not attributable to exactly one raffle, not in
`Winner Selected`, or inconsistent with the published raffle rules. No-winner,
refund-eligible, canceled, expired, and recovery states are outside this
feature unless a later approved specification defines an explicit distribution
route for them.

At minimum, a finalized raffle outcome must identify:

- The raffle identifier.
- The final raffle outcome state.
- The finalized winner identity or winner entitlement.
- The eligible ticket or entitlement basis used for the final outcome.
- Confirmation that the final raffle outcome state is `Winner Selected`.
- Whether any non-winner, refund, cancellation, expiry, or recovery handling is
  governed outside this feature.
- The prize pool or source pool available for distribution.
- Any event or audit reference that proves the outcome is final.

The distribution engine MUST NOT decide the raffle winner, reopen a raffle,
mutate raffle lifecycle state, or reinterpret raffle refund eligibility.

## 6. Distribution Lifecycle

Each distribution MUST move through explicit lifecycle states. The lifecycle
must allow operators and auditors to distinguish planned obligations, approved
obligations, attempted payments, successful payments, failed payments, partial
completion, review states, and terminal outcomes.

Required lifecycle meanings:

- **Not Started**: No distribution record exists for the finalized raffle
  outcome.
- **Drafted**: A candidate distribution has been prepared from the finalized
  raffle outcome but is not approved for value movement.
- **Pending Policy Review**: The distribution requires policy evaluation before
  value movement.
- **Approved for Execution**: Required policy decision, simulation, and approval
  evidence exist for the current distribution intent.
- **Payment Attempted**: At least one payout, fee split, or treasury route has
  been attempted.
- **Partially Complete**: One or more required distribution obligations
  succeeded while one or more remain pending, failed, or under review.
- **Failed Payment Review**: One or more required payments failed and require
  retry, manual review, correction, or escalation.
- **Reconciled**: Intended obligations and final observed outcomes have been
  compared and recorded.
- **Complete**: All required distribution obligations are fulfilled or resolved
  through an approved terminal disposition.
- **Halted**: Distribution is stopped by policy, operator review, revocation, or
  emergency control.

The distribution engine MUST prevent duplicate distribution for the same raffle
outcome unless the retry is explicitly tied to an unresolved failed obligation
and preserves idempotency.

## 7. Functional Requirements

- **FR-001**: The system MUST create at most one active distribution record for
  each finalized raffle outcome.
- **FR-002**: The system MUST reject distribution initiation for any raffle that
  lacks a finalized, valid `Winner Selected` outcome.
- **FR-003**: The system MUST preserve the finalized raffle winner or approved
  no-winner outcome without modification.
- **FR-004**: The system MUST calculate all required payout obligations from
  explicit prize, fee, treasury, rounding, and dust rules.
- **FR-005**: The system MUST identify each intended recipient, recipient role,
  source amount, net amount, and reason before any value-moving action.
- **FR-006**: The system MUST distinguish prize payouts, fee splits, treasury
  routing, reserves, dust routing, and failed-payment obligations.
- **FR-007**: The system MUST require a structured intent, Policy Decision
  Record, simulation, and required approval before value movement.
- **FR-008**: The system MUST classify distribution value movement as at least
  Tier 3 unless the approved authority model classifies a narrower bounded
  routine action.
- **FR-009**: The system MUST record each distribution attempt with its intended
  obligation, authority basis, attempt status, observed result, and audit
  reference.
- **FR-010**: The system MUST prevent duplicate payout of the same distribution
  obligation.
- **FR-011**: The system MUST support failed-payment review states that preserve
  failed recipients, failed amounts, failure reasons, retry eligibility, and
  escalation status.
- **FR-012**: The system MUST reconcile intended obligations against final
  observed outcomes before marking a distribution complete.
- **FR-013**: The system MUST make partial completion visible and MUST NOT hide
  unresolved failed or pending obligations inside a completed status.
- **FR-014**: The system MUST emit or record events that allow operators to
  reconstruct distribution drafting, approval, attempt, failure, retry,
  reconciliation, halt, and completion.
- **FR-015**: The system MUST halt distribution when required outcome,
  recipient, amount, route, approval, simulation, or audit evidence is missing,
  stale, or inconsistent.

## 8. Payout Rules

Prize payout rules MUST be deterministic, reviewable, and tied to the finalized
raffle outcome. The distribution engine MUST NOT invent winners, alter winners,
or reinterpret eligibility.

Each prize payout obligation MUST define:

- The source raffle outcome.
- The winner or approved recipient.
- The prize amount or asset obligation.
- The source pool.
- The reason the recipient is eligible.
- Whether payout is pending, attempted, successful, failed, halted, or resolved
  through review.

If the finalized outcome is an approved no-winner outcome, refund-eligible
failure, canceled state, expired state, or recovery state handled by
`001-raffle-core`, the distribution engine MUST reject distribution initiation
and MUST NOT create a winner payout unless a later approved specification
explicitly authorizes that path.

## 9. Fee Split and Treasury Routing Rules

Fee split and treasury routing rules MUST be explicit and reviewable before any
value movement. The distribution engine MUST NOT infer fee recipients, treasury
destinations, route type, chain, contract, source pool, or payout policy from
defaults or operator memory.

Each fee or treasury obligation MUST define:

- Recipient role.
- Recipient identity or source of recipient identity.
- Allocation formula or fixed amount.
- Source pool.
- Route purpose.
- Approval basis.
- Expected audit or reconciliation evidence.

Prize custody and claim settlement MUST remain separate from ordinary treasury
routing. Treasury routing MAY use approved recurring route records where the
recipient set and allocation rule are known before execution, but prize custody,
claim redemption, fulfillment, provenance, draw selection, random winner
selection, and prize assignment state machines remain outside treasury-only
routing.

## 10. Failed Payment Handling

Failed payouts MUST be distinguishable from successful payouts. A failed
payment MUST NOT be silently retried, silently re-routed, or hidden inside a
completed distribution.

For each failed payment, the distribution engine MUST record:

- The affected obligation.
- The intended recipient and amount.
- The failure reason or unresolved failure category.
- Whether retry is allowed.
- Whether retry requires policy review, human approval, or quorum approval.
- Whether recipient correction, route correction, or treasury review is needed.
- The current review or terminal state.

Retries MUST preserve the original obligation identity and MUST NOT create a
duplicate payout. A retry that changes recipient, amount, route, or authority
basis MUST be treated as a new approval-sensitive action.

## 11. Rounding and Dust Handling

Rounding and dust handling MUST be deterministic, auditable, and defined before
distribution. The distribution engine MUST NOT discard, hide, or silently route
dust.

Rounding rules MUST define:

- The precision used for allocation.
- The order in which allocations are calculated.
- How indivisible remainder is assigned.
- Whether dust is routed to treasury, reserve, a specified recipient, or held
  for review.
- How dust routing appears in audit and reconciliation records.

If no rounding or dust rule exists for a distribution, the distribution MUST
halt before value movement and enter review.

## 12. Reconciliation Requirements

Reconciliation MUST compare intended obligations with observed final outcomes.
A distribution MUST NOT be marked complete until reconciliation has recorded
whether every required obligation succeeded, failed, remains pending, was
halted, or was resolved through approved review.

Reconciliation MUST answer:

- Which finalized raffle outcome authorized this distribution?
- Which recipients were expected?
- Which amounts or assets were expected?
- Which obligations were attempted?
- Which obligations succeeded?
- Which obligations failed or remain pending?
- Which policy decision, simulation, and approval authorized each value-moving
  action?
- What evidence proves the final result?
- What recovery or escalation remains open?

## 13. Audit and Event Requirements

The distribution engine MUST produce audit-visible records for all meaningful
distribution activity. These records MUST allow an operator or auditor to
reconstruct what was paid, to whom, why, under which authority, and with what
final result.

At minimum, audit records MUST cover:

- Distribution drafted.
- Policy review requested.
- Distribution approved or denied.
- Payment obligation attempted.
- Payment obligation succeeded.
- Payment obligation failed.
- Retry requested.
- Retry approved or denied.
- Distribution partially complete.
- Distribution halted.
- Distribution reconciled.
- Distribution completed.

Audit records MUST preserve the governing specification, finalized raffle
outcome reference, intent reference, policy decision reference, simulation
reference, approval evidence, recipient set, amount set, observed outcome, and
reconciliation result where applicable.

## 14. Policy and Approval Touchpoints

The distribution engine defines payout obligations and review states, not the
agent approval policy itself. Any state-changing or value-moving distribution
action MUST respect the boundary of `003-agent-policy-engine` when that feature
is available.

Policy and approval touchpoints include:

- Distribution approval before prize payout or treasury movement.
- Fee split approval when allocation rules or recipients are not already
  approved.
- Retry approval for failed payments when retry changes risk, recipient, amount,
  route, or authority basis.
- Human approval for material fund movement.
- Quorum approval for distribution formula changes, treasury authority changes,
  custody changes, or protocol authority changes.
- Emergency halt or pause when policy, outcome, route, signer, or
  reconciliation evidence is unsafe.

## 15. Dependencies

- `001-raffle-core`: Provides finalized, valid raffle outcomes; only final
  `Winner Selected` outcomes may initiate this feature.
- `003-agent-policy-engine`: Provides policy review, PDR expectations, approval
  classification, and execution-boundary constraints for value-moving actions.
- `.specify/memory/constitution.md`: Provides binding requirements for
  specification sovereignty, intent/PDR/simulation, scoped authority, signing
  isolation, auditability, recovery, and RWA truth.
- `.specify/memory/authority-model.md`: Provides risk tiers, agent roles,
  signer classes, human/quorum gates, treasury authority, distribution executor
  rules, emergency powers, and revocation requirements.
- Architecture treasury-routing guidance: prize custody and claim settlement
  stay separate from ordinary treasury routing; money-moving automation must not
  infer missing route state.

## 16. Acceptance Criteria

### Scenario 1 - Create distribution from finalized winner outcome

**Given** a raffle has a finalized, valid winner outcome, **When** a protocol
operator requests distribution, **Then** the system creates a distribution record
that preserves the raffle outcome and identifies all required payout, fee,
treasury, rounding, dust, approval, and audit obligations.

### Scenario 2 - Reject non-final raffle outcome

**Given** a raffle is open, closed, unresolved, no-winner, refund-eligible,
canceled, expired, in recovery, or otherwise not finalized as `Winner Selected`,
**When** distribution is requested, **Then** the request is rejected and no
payout obligation is created.

### Scenario 3 - Prevent duplicate distribution

**Given** a distribution already exists for a finalized raffle outcome, **When**
another distribution is requested for the same outcome, **Then** the system
rejects the duplicate unless it is an approved retry for a specific unresolved
failed obligation.

### Scenario 4 - Track failed payment distinctly

**Given** a payout obligation fails, **When** the failure is recorded, **Then**
the distribution remains incomplete or in review, the failed obligation is
visible, and retry or escalation requirements are recorded.

### Scenario 5 - Reconcile before completion

**Given** all payout, fee, treasury, rounding, and dust obligations have final
observed outcomes, **When** reconciliation is performed, **Then** the system
marks the distribution complete only if every obligation is fulfilled or
resolved through an approved terminal disposition.

### Scenario 6 - Halt on missing authority or route evidence

**Given** a distribution lacks required policy decision, simulation, approval,
recipient, amount, route, or audit evidence, **When** a value-moving action is
requested, **Then** the system halts the distribution action and records the
missing evidence for review.

### Measurable Outcomes

- 100% of non-final or invalid raffle outcomes are rejected during acceptance
  testing.
- 100% of duplicate distribution attempts are rejected unless tied to an
  unresolved failed obligation.
- 100% of distribution obligations have a recipient, role, amount or asset,
  reason, authority basis, and audit reference before value movement.
- 100% of failed payment attempts remain visible as failed, pending, halted, or
  review-required until resolved.
- 100% of completed distributions can be reconstructed from finalized raffle
  outcome, intent, policy decision, simulation, approval, attempt, and
  reconciliation evidence.

### Edge Cases

- A finalized raffle outcome has no winner because the raffle ended in an
  approved no-winner, refund/failure, cancellation, expiry, or recovery path.
- A distribution is requested twice for the same finalized raffle outcome.
- A fee split produces indivisible remainder or dust.
- One recipient succeeds while another recipient fails.
- A retry changes recipient, route, amount, or approval basis.
- A required route, approval, simulation, or audit reference is stale or missing.
- A payout involves RWA-linked custody, redemption, issuer, or metadata truth.

## 17. Constitutional Constraints

- Specifications are the source of truth for distribution behavior.
- No value movement may occur without structured intent, PDR, simulation, and
  required approval.
- Distribution value movement is high risk unless explicitly classified
  otherwise by the authority model.
- Planning, verification, signing, execution, and auditing must remain isolated
  for high-risk distribution actions.
- Signing and execution details are outside this spec and must remain bounded by
  scoped authority.
- All distribution actions must be auditable and recoverable.
- RWA truth must not be inferred from token state alone when a distribution
  involves RWA-linked claims, custody, redemption, or issuer state.

## 18. Assumptions

- `001-raffle-core` produces a final raffle outcome record that can be cited by
  the distribution engine.
- A finalized `Winner Selected` outcome is the only distribution-eligible
  outcome for this feature.
- Refund-eligible raffle failures remain governed by `001-raffle-core` unless a
  later approved specification creates a distribution-specific refund path.
- Distribution may be partially complete from an operator perspective when some
  obligations succeed and others fail or require review.
- Rounding and dust rules must be approved before distribution, but the exact
  default dust destination remains unresolved.
- Treasury and fee routes require explicit route records or equivalent approved
  authority evidence before value movement.
- `003-agent-policy-engine` is expected to define policy decision mechanics, but
  this feature must still state where policy and approval are required.

## 19. Needs Clarification

The following questions must be answered before or during clarification. Use
the planning-blocker group first; the first five are the highest-priority
questions for unblocking `plan.md`.

### Planning Blockers

- **NC-PB-002 - Required raffle outcome handoff payload**: What exact final
  outcome fields from `001-raffle-core` are mandatory before drafting a
  distribution?
  - **Why it matters**: Missing handoff fields would make payout calculation,
    duplicate prevention, policy binding, and audit reconstruction unreliable.
  - **Affects**: Inputs from `001-raffle-core`, FR-001 through FR-005,
    reconciliation requirements, audit requirements, data model planning.
  - **Blocks planning**: Yes.
- **NC-PB-003 - Single-winner versus multi-winner support**: Must this feature
  support only the current single-winner raffle outcome, or must it support
  multiple winners when published raffle rules explicitly allow them?
  - **Why it matters**: Winner cardinality changes obligation identity,
    allocation formulas, rounding, duplicate-payment checks, reconciliation,
    and acceptance tests.
  - **Affects**: Payout Rules, FR-003, FR-004, FR-010, Scenario 1, Edge Cases,
    future compatibility with `001-raffle-core`.
  - **Blocks planning**: Yes.
- **NC-PB-004 - Allowed payout recipient classes**: Which recipient classes are
  allowed in one distribution besides winners, treasury, protocol, issuer,
  creator, partner, reserve, and dust recipients?
  - **Why it matters**: Recipient classes determine which obligations may exist,
    which recipient identities are valid, and which policy gates apply before
    value movement.
  - **Affects**: Actors, FR-005, FR-006, Fee Split and Treasury Routing Rules,
    Policy and Approval Touchpoints, acceptance scenarios.
  - **Blocks planning**: Yes.
- **NC-PB-005 - Terminal distribution states**: What terminal states must be
  visible to operators and auditors, and which states count as final but not
  successful?
  - **Why it matters**: Completion, halt, unresolved failure, forfeiture,
    correction, rejection, and approved terminal disposition must not collapse
    into a single misleading `Complete` state.
  - **Affects**: Distribution Lifecycle, Failed Payment Handling,
    Reconciliation Requirements, Audit and Event Requirements, Scenario 5.
  - **Blocks planning**: Yes.
- **NC-PB-006 - Partial versus atomic completion**: May a distribution become
  partially complete when some obligations succeed and others fail or remain
  under review, or must user-facing settlement be atomic until every obligation
  has a terminal disposition?
  - **Why it matters**: Partial completion changes payout finality, operator
    status, retry scope, reconciliation, and what winners and recipients may be
    told.
  - **Affects**: Distribution Lifecycle, FR-013, Failed Payment Handling,
    Reconciliation Requirements, Scenario 4, Scenario 5, Measurable Outcomes.
  - **Blocks planning**: Yes.
- **NC-PB-007 - Winner cannot receive payment**: What is the required outcome
  when a final winner cannot receive payment because of invalid recipient data,
  failed eligibility, KYC or claim gating, expired claim window, custody issue,
  or unreachable route?
  - **Why it matters**: The spec must define whether value is held, retried,
    corrected, escalated, forfeited, recycled, routed to treasury, or sent to
    refund/recovery review.
  - **Affects**: Payout Rules, Failed Payment Handling, Policy and Approval
    Touchpoints, Edge Cases, RWA truth constraints.
  - **Blocks planning**: Yes.
- **NC-PB-008 - Retry and escalation authority**: For each failed-payment
  category, are retries automatic, operator-requested, policy-approved,
  human-approved, or quorum-approved?
  - **Why it matters**: Silent retries are forbidden by the authority model, and
    retry rules determine whether the executor may act or must halt for review.
  - **Affects**: Failed Payment Handling, FR-007, FR-008, FR-011, audit events,
    authority classification.
  - **Blocks planning**: Yes.
- **NC-PB-009 - Changed recipient or route on retry**: When retry changes
  recipient identity, amount, route, asset, or authority basis, is that a
  corrected attempt on the original obligation, a replacement obligation, or a
  new distribution obligation?
  - **Why it matters**: This determines idempotency, duplicate-payout
    prevention, audit lineage, approval scope, and whether prior failures remain
    open.
  - **Affects**: FR-001, FR-009, FR-010, Failed Payment Handling,
    Reconciliation Requirements, Scenario 3.
  - **Blocks planning**: Yes.
- **NC-PB-010 - Rounding precision and dust destination**: What precision,
  calculation order, tie-break rule, and default dust destination apply when
  fee splits or allocations do not divide evenly?
  - **Why it matters**: Dust cannot be hidden or silently routed, and rounding
    affects recipient amounts, treasury balances, reconciliation, and tests.
  - **Affects**: Rounding and Dust Handling, FR-004, FR-006, Scenario 1, Edge
    Cases, Measurable Outcomes.
  - **Blocks planning**: Yes.
- **NC-PB-011 - Fee split and treasury route authority**: Which distribution
  actions may use pre-approved recurring route records, and which require
  per-distribution human approval or quorum approval?
  - **Why it matters**: The authority model treats prize distribution and
    treasury movement as Tier 3 by default and formula or authority changes as
    Tier 4; the spec must decide where those gates attach.
  - **Affects**: Fee Split and Treasury Routing Rules, FR-007, FR-008, Policy
    and Approval Touchpoints, Constitutional Constraints.
  - **Blocks planning**: Yes.
- **NC-PB-012 - Completion audit artifact set**: What evidence must exist
  before an obligation and the overall distribution may be considered complete?
  - **Why it matters**: Completion must be reconstructable from final outcome,
    intent, PDR, simulation, approval, attempt, post-state verification, and
    reconciliation evidence rather than operator memory.
  - **Affects**: Reconciliation Requirements, Audit and Event Requirements,
    Scenario 5, Measurable Outcomes, constitutional audit gate.
  - **Blocks planning**: Yes.

### Important Clarifications

- **NC-IC-002 - Source pool authority**: Which source pools may fund prize
  payouts, fee splits, treasury routing, dust routing, recycle routing, or
  reserves?
  - **Why it matters**: The distribution engine must not infer source funds or
    commingle prize custody with ordinary treasury routing.
  - **Affects**: Scope, Payout Rules, Fee Split and Treasury Routing Rules,
    reconciliation.
  - **Blocks planning**: No, unless multiple source pools are required in the
    first plan.
- **NC-IC-003 - Recipient identity authority**: What source of truth establishes
  recipient identity for winners, fee recipients, treasury owners, reserves,
  route records, and corrected recipients?
  - **Why it matters**: Payment to the wrong wallet, account, claim holder, or
    custody route is a value-movement failure even if the transfer succeeds.
  - **Affects**: FR-005, Fee Split and Treasury Routing Rules, Failed Payment
    Handling, audit requirements.
  - **Blocks planning**: No, unless recipient identity is not already covered by
    the handoff payload answer.
- **NC-IC-004 - Refund after distribution failure**: If distribution rejects,
  fails, partially completes, or cannot resolve a winner payout, when may
  recovery return to `001-raffle-core` refund eligibility?
  - **Why it matters**: Raffle Core says the winning outcome remains recorded
    unless an approved recovery path exists; distribution must not invent that
    path.
  - **Affects**: Dependencies, Failed Payment Handling, Edge Cases, recovery
    boundaries with `001-raffle-core`.
  - **Blocks planning**: No, unless refund recovery is in first release scope.
- **NC-IC-005 - RWA-linked prize completion**: For RWA-linked payouts, what
  non-token custody, claim, fulfillment, redemption, or issuer evidence is
  required before completion?
  - **Why it matters**: Token transfer alone is not proof of RWA truth under the
    constitution.
  - **Affects**: Payout Rules, Reconciliation Requirements, Audit and Event
    Requirements, Constitutional Constraints, Edge Cases.
  - **Blocks planning**: No, unless RWA-linked payouts are in first release
    scope.
- **NC-IC-006 - Reconciliation mismatch disposition**: If intended obligations
  and observed outcomes do not match, must the distribution enter halted,
  failed-payment review, policy review, incident review, or another named state?
  - **Why it matters**: Reconciliation failures need an explicit outcome and
    recovery owner instead of being treated as ordinary incomplete work.
  - **Affects**: Distribution Lifecycle, Reconciliation Requirements, Audit and
    Event Requirements, Scenario 5.
  - **Blocks planning**: No, if terminal states already cover mismatch handling.
- **NC-IC-007 - Approval expiry and stale evidence**: What makes a policy
  decision, simulation, route record, or audit reference stale for a
  distribution attempt or retry?
  - **Why it matters**: The spec requires halting on stale evidence but does not
    define the product-level stale condition.
  - **Affects**: FR-007, FR-015, Policy and Approval Touchpoints, Scenario 6.
  - **Blocks planning**: No, unless expiry behavior is needed for first release
    acceptance tests.

### Deferred / Plan-Phase Questions

- **NC-DP-001 - Canonical environment route records**: Which treasury, fee,
  reserve, recycle, split, and payout route records are canonical for each
  environment?
  - **Why it matters**: Operators need route records before execution, but the
    exact environment inventory belongs in planning or runbooks.
  - **Affects**: Plan, runbooks, route registry or manifests, deployment
    readiness checks.
  - **Blocks planning**: No.
- **NC-DP-002 - Reconciliation artifact format**: What exact report, receipt,
  event, ledger, or manifest format should store reconciliation evidence?
  - **Why it matters**: The spec needs required evidence semantics, while the
    storage/report shape can be selected during planning.
  - **Affects**: Plan, data model, runbooks, audit report format.
  - **Blocks planning**: No.
- **NC-DP-003 - Event and status naming**: What exact event names, status enum
  labels, and operator-facing labels should represent the lifecycle and
  terminal states?
  - **Why it matters**: Naming affects implementation consistency and
    observability, but not the core product decision if state meanings are
    clarified first.
  - **Affects**: Plan, data model, event catalog, UI copy.
  - **Blocks planning**: No.
- **NC-DP-004 - External execution provider boundaries**: Which payment
  processor, relay, chain service, split provider, signer service, queue, or
  worker system will execute approved obligations?
  - **Why it matters**: Execution tooling must honor the spec, but vendor or
    architecture choice is out of scope for this specify-phase document.
  - **Affects**: Plan, architecture, vendor review, runbooks.
  - **Blocks planning**: No.
