<!--
Sync Impact Report
Version change: 0.1.0 -> 1.0.0
Modified principles:
- Article I Specification Sovereignty -> I. Specification Sovereignty
- Articles II, III, VI -> II. Intent, Policy, and Simulation Before Value Movement
- Articles IV, V, VII, IX, XIX -> III. Scoped Agent Authority
- Articles VII, IX -> IV. Human Gates and Signing Isolation
- Articles XI, XII, XX -> V. Auditability and Recovery
- Article XVI -> VI. RWA Truth Is Not Token State
Added sections:
- Constitutional Compliance Gates
- Binding companion memory references
Removed sections:
- Detailed authority roles, risk tiers, signing classes, approval matrix, and
  revocation rules moved to .specify/memory/authority-model.md
- Terminology moved to .specify/memory/glossary.md
- Short operating philosophy moved to .specify/memory/doctrine.md
- Minimal project structure and starter-spec backlog removed from constitution
Templates requiring updates:
- [updated] .specify/templates/plan-template.md
- [updated] .specify/templates/spec-template.md
- [updated] .specify/templates/tasks-template.md
- [reviewed] .specify/templates/checklist-template.md; no constitution-specific update required
- [not present] .specify/templates/commands/*.md
Follow-up TODOs: None
-->

# Constitution - Protocol Automation

**Version:** 1.0.0
**Status:** Ratified
**Scope:** Automated management of raffle, RWA NFT, treasury, prize-pool,
distribution, settlement, and protocol-operation workflows.
**Primary Principle:** No autonomous system may move value unless the intended
action, authorization basis, execution path, and recovery plan are explicit,
testable, auditable, and policy-approved.

---

## Preamble

This protocol automates high-stakes workflows for raffle and RWA NFT operations.
Because these workflows touch irreversible on-chain state, real funds, and
real-world asset claims, specifications are the source of truth. Code, agents,
smart contracts, policies, prompts, dashboards, and runbooks serve the
specification.

This constitution governs the non-negotiable principles and compliance gates for
all LuxVault protocol automation. Operational authority details live in
`.specify/memory/authority-model.md`; terminology lives in
`.specify/memory/glossary.md`; short operating doctrine lives in
`.specify/memory/doctrine.md`.

---

# Article I - Specification Sovereignty

Every feature, agent workflow, contract module, treasury function, raffle
operation, distribution rule, RWA workflow, and protocol authority change MUST
begin as a written specification.

No implementation may proceed from informal intent, chat-only instructions,
undocumented operator preference, prompt memory, or assumed business logic.
Specifications MUST identify the goal, affected assets, authorized actors,
allowed and disallowed state transitions, value at risk, acceptance criteria,
failure modes, recovery path, and audit artifacts.

Specifications MUST remain implementation-neutral until the planning phase. The
feature specification defines what the protocol must guarantee and why. The
implementation plan defines how the system will satisfy those guarantees.

**Violation:** Any code, contract, script, agent behavior, or admin flow that
cannot be traced back to a specification is unconstitutional.

---

# Article II - Intent, Policy, and Simulation Before Value Movement

Every value-bearing or authority-changing action MUST have a structured intent,
a valid Policy Decision Record, and a successful simulation before signing or
submission. These artifacts MUST bind to the same intent hash.

Raw calldata, ad hoc scripts, free-form agent output, or manual operator memory
MUST NOT be treated as authority to move value. A signer or executor MUST refuse
an action when the intent, policy decision, simulation, approval, or expiry is
missing, stale, mismatched, or out of scope.

**Violation:** Any value-bearing transaction or authority-changing action signed
without intent, policy decision, and simulation is a critical incident.

---

# Article III - Scoped Agent Authority

Agents MUST operate under least privilege. Their authority MUST be bounded by the
risk tiers, roles, signing classes, approval gates, session-key rules,
smart-account permissions, treasury rules, distribution rules, emergency powers,
and revocation paths defined in `.specify/memory/authority-model.md`.

Agents MUST NOT hold unrestricted private keys, grant themselves authority,
change policy thresholds, alter payout formulas, change custody rules, or bypass
human/quorum gates. Automation MAY expand only through an approved specification,
updated authority model, tests, and operational evidence.

**Violation:** Any agent or runtime with broad, unrevocable authority over
raffle, treasury, distribution, signer, or RWA custody workflows is
unconstitutional.

---

# Article IV - Human Gates and Signing Isolation

High-risk actions MUST require human or quorum approval according to the
authority model. Planning, verification, signing, execution, and auditing MUST
remain separable responsibilities for high-risk value movement and protocol
authority changes.

A planner MUST NOT sign. A signer MUST NOT rewrite the approved intent. An
executor MUST NOT alter recipients, values, calldata, signer class, or approval
basis. An auditor MUST verify the executed state against the approved intent and
policy decision.

**Violation:** Any architecture that allows one unattended agent or compromised
runtime to plan, approve, sign, execute, and verify a high-risk action end to end
is unconstitutional.

---

# Article V - Auditability and Recovery

All meaningful protocol actions MUST produce durable audit artifacts, including
the request, governing specification, intent, policy decision, approval evidence,
simulation, execution record, post-state verification, reconciliation result,
and recovery outcome where applicable.

Every automated authority MUST have a documented and tested stop, halt, revoke,
pause, escalation, or recovery path. Operational incidents MUST trigger review
of the relevant specification, plan, policy, tests, and runbooks.

**Violation:** A transaction that cannot be explained, verified, or recovered
from is a protocol failure even if it succeeded technically.

---

# Article VI - RWA Truth Is Not Token State

RWA workflows MUST preserve the distinction between token movement and
real-world asset truth. Token ownership or transfer events alone MUST NOT be
used as proof of custody state, legal ownership, issuer status, redemption
rights, compliance status, metadata authority, or dispute status.

RWA specifications MUST identify the authoritative source for custody, issuer,
metadata, compliance, redemption, dispute, freeze, and update state. RWA status
or metadata mutation MUST require policy approval and audit evidence.

**Violation:** Any system that lets token state alone define RWA truth, or lets
an agent mutate RWA status without explicit policy authority, is
unconstitutional.

---

# Article VII - Constitutional Compliance Gates

Every `/speckit.plan` output MUST include a constitutional compliance section.
The plan MUST pass these gates before implementation. A failed gate MUST block
implementation unless the plan records an explicit constitution exception,
approval basis, and mitigation in complexity tracking.

## Gate 1 - Specification Gate

* [ ] Feature has a written spec with measurable acceptance criteria.
* [ ] Affected assets, authority surfaces, truth domains, and state transitions
      are identified.
* [ ] No unresolved clarification marker remains for value movement, authority,
      custody, settlement, raffle fairness, distribution, or RWA truth.

## Gate 2 - Value-Movement Gate

* [ ] Value-bearing or authority-changing actions produce structured intents.
* [ ] Policy Decision Records are required before signing.
* [ ] Simulation is required and bound to the current intent hash.
* [ ] Raw transaction construction is not the source of operational authority.

## Gate 3 - Authority Gate

* [ ] Actions are classified by risk tier using
      `.specify/memory/authority-model.md`.
* [ ] Agent roles, human gates, quorum gates, and signer classes are identified.
* [ ] Session keys, smart-account permissions, treasury authority,
      distribution executor rules, and emergency powers are scoped where
      applicable.

## Gate 4 - Signing Isolation Gate

* [ ] Planning, verification, signing, execution, and auditing are separated for
      high-risk actions.
* [ ] Signing authority is least-privilege, policy-bound, and revocable.
* [ ] Signers cannot modify the approved intent, recipient set, value, or
      authority change.

## Gate 5 - Audit and Recovery Gate

* [ ] Required audit artifacts are named before implementation.
* [ ] Post-state verification and reconciliation are defined.
* [ ] Revocation, halt, emergency pause, failed execution, and incident review
      paths are defined for automated authority.

## Gate 6 - RWA Truth Gate

* [ ] RWA workflows identify the authoritative source for custody, issuer,
      metadata, compliance, redemption, and dispute state.
* [ ] Token state is not used as the sole source of real-world asset truth.
* [ ] RWA status or metadata mutation requires policy approval and auditability.

---

# Article VIII - Amendment Process

This constitution may evolve, but not casually. Amendments MUST include written
rationale, risk assessment, backwards-compatibility review, security impact
review, test impact review, version update, migration notes, and approval by the
project maintainer or governance quorum.

Emergency amendments MAY halt risk immediately, but they MUST be reviewed after
the incident and either ratified, revised, or reverted.

Versioning follows semantic versioning:

* **MAJOR:** Principle redefinition, principle removal, or governance model
  change.
* **MINOR:** New principle, compliance gate, or binding operational requirement.
* **PATCH:** Clarification that does not change obligations.

Specs, plans, tasks, policies, tests, templates, and runbooks MUST be updated
when an amendment changes their obligations.

**Ratified:** 2026-06-10
**Last Amended:** 2026-06-10
