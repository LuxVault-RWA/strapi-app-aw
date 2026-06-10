# LuxVault Authority Model

This file defines the operational authority model required by the LuxVault
constitution. If this file conflicts with `.specify/memory/constitution.md`, the
constitution wins and this file MUST be amended.

## Risk Tiers

| Tier | Name | Description | Minimum Gate |
|------|------|-------------|--------------|
| Tier 0 | Read-only | Observation, reporting, and non-mutating analysis | Logs |
| Tier 1 | Non-value operational automation | Alerts, dashboard updates, previews, and simulations | Logs and source trace |
| Tier 2 | Bounded routine execution | Low-value, pre-approved, policy-capped execution | Intent, PDR, simulation |
| Tier 3 | Material fund movement | Prize payouts, refunds, treasury moves, RWA settlement, revenue splits | Human approval |
| Tier 4 | Protocol authority change | Role changes, upgrades, policy thresholds, custody changes, pause/unpause | Quorum approval |

## Agent Roles

### Observer
Reads protocol, chain, treasury, raffle, ticket, distribution, RWA, and custody
state. Observers MUST NOT recommend or execute value movement alone.

### Planner
Constructs candidate intents and execution plans. Planners MUST NOT sign,
submit, or mutate approved execution payloads.

### Verifier
Evaluates intents against policy, simulation, specification, eligibility,
distribution, custody, and compliance rules. Verifiers MAY approve, deny, delay,
or escalate according to policy.

### Executor
Submits only approved, unexpired, policy-bound actions. Executors MUST NOT alter
intent terms, recipients, amounts, calldata, signer class, or approval basis.

### Auditor
Compares intended state to executed state and records reconciliation evidence.
Auditors MUST NOT be the only authority approving the action they audit.

### Emergency Guardian
Executes pause-only or halt-only controls during emergencies. Emergency guardians
MUST NOT redirect funds, mutate raffle outcomes, change distribution formulas,
or grant long-lived authority.

## Signing Classes

| Class | Authority | Allowed Use |
|-------|-----------|-------------|
| No-sign agents | No signing authority | Observation, planning, verification, audit |
| Session-key agents | Time-boxed, allowlisted, capped signing | Tier 2 bounded execution |
| Policy-bound executors | Smart-account or signer-policy constrained authority | Tier 2 and approved Tier 3 execution |
| Quorum signers | Multisig, MPC, Safe, or equivalent quorum | Tier 3 material movement and Tier 4 changes |
| Emergency pause-only signers | Halt or pause authority only | Emergency containment |

## Human and Quorum Gates

- Tier 0 and Tier 1 actions MAY be automated when logged.
- Tier 2 actions MAY be automated only inside approved policy caps and revocable
  signer permissions.
- Tier 3 actions MUST have human approval, successful simulation, valid PDR, and
  post-state verification.
- Tier 4 actions MUST have quorum approval, explicit runbook, post-execution
  audit, and time delay unless the approved emergency path applies.
- Any action crossing multiple tiers inherits the highest tier.

## Approval Matrix

| Action Type | Required Approval | Required Simulation | Required PDR | Signer Class |
|-------------|-------------------|---------------------|--------------|--------------|
| Read-only monitoring | None | No | No | No-sign agents |
| Dashboard or alert update | None | No | No | No-sign agents |
| Payout preview | None | Yes, non-mutating | No | No-sign agents |
| Low-value capped refund | Policy approval | Yes | Yes | Session-key agents |
| Scheduled capped fee sweep | Policy approval | Yes | Yes | Session-key agents |
| Prize distribution | Human approval | Yes | Yes | Policy-bound executors or quorum signers |
| Treasury transfer | Human approval or quorum by value | Yes | Yes | Quorum signers |
| RWA settlement or custody update | Human approval or quorum by policy | Yes | Yes | Quorum signers |
| Distribution formula change | Quorum approval | Yes | Yes | Quorum signers |
| Contract upgrade or role change | Quorum approval | Yes | Yes | Quorum signers |
| Emergency halt or pause | Emergency guardian approval | Where practical | Yes after incident if not before | Emergency pause-only signers |

## Session Keys

Session keys MUST be time-boxed, revocable, and scoped by contract, method,
asset, chain, value, frequency, and purpose. Session keys MUST NOT authorize
policy changes, signer changes, treasury authority changes, RWA truth changes,
distribution formula changes, or emergency unpause.

## Smart Account Permissions

Smart accounts and signer policies MUST enforce:

- Chain ID and replay protection.
- Contract, method, and asset allowlists.
- Per-transaction and per-period limits.
- Intent hash and PDR binding.
- Simulation freshness where enforceable.
- Approval expiry.
- Emergency pause and policy halt checks.
- No self-escalation by agents or executors.

## Treasury Authority

Treasury movement MUST be tied to a specification, intent, PDR, simulation, and
approval appropriate to the highest applicable risk tier. Treasury executors
MUST NOT redirect funds, alter recipient identity, bypass spend limits, or reuse
approval for a different intent hash.

## Distribution Executor Rules

Distribution executors MUST use deterministic formulas from the governing
specification. Recipient identity, amount, rounding, dust handling, failed
payment handling, duplicate-payment checks, and reconciliation MUST be defined
before execution. Executors MUST NOT invent recipients, reinterpret payout
logic, or silently retry with changed terms.

## Emergency Guardian Powers

Emergency guardians MAY pause, halt, revoke, or freeze automated authority to
contain risk. Emergency powers MUST be narrow, auditable, and reviewed after use.
Emergency guardians MUST NOT transfer assets to arbitrary recipients, alter
raffle outcomes, rewrite distribution formulas, or permanently expand authority.

## Revocation Process

Revocation paths MUST be documented and tested for each automated authority:

- Session key revocation.
- Policy halt.
- Distribution halt.
- Raffle halt.
- Treasury halt.
- Emergency pause.

Each revocation event MUST record initiator, trigger, authority basis, affected
keys or permissions, affected workflows, recovery owner, and post-incident spec
updates.
