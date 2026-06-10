# LuxVault Glossary

## Raffle
A governed protocol workflow where eligible ticket holders participate in a
specified chance-based allocation of a prize pool or RWA-linked benefit.

## Draw
The deterministic, auditable process that closes a raffle, consumes the
specified randomness source, selects winner state, and produces settlement
obligations.

## Ticket
A protocol-recognized entry into a raffle. A ticket may be represented on-chain
or off-chain, but its eligibility rules MUST come from the raffle specification.

## Prize Pool
The assets allocated to raffle winners, refunds, fees, reserves, or other
specified recipients.

## Settlement
The authorized process that turns a completed draw or RWA workflow into final
recipient obligations, transfers, custody updates, or reconciliation records.

## Distribution
A deterministic allocation of funds or assets from a source pool to specified
recipients using a specified formula, rounding rule, and failure policy.

## RWA NFT
A tokenized representation of a real-world asset claim, right, record, or
workflow. The token is not by itself proof of custody, legal ownership,
redemption state, issuer status, or compliance state.

## Custody State
The authoritative record of who controls, holds, services, or safeguards the
real-world asset or related claim. Custody state MUST come from the specified
RWA source of truth.

## Intent
A structured description of a desired value-bearing or authority-changing
action, including affected assets, recipients, constraints, deadline, approval
requirements, simulation requirement, and recovery expectations.

## PDR
Policy Decision Record. The auditable record that binds an intent hash to a
policy decision, checks performed, approval basis, expiry, and required
attestations before execution.

## Policy Engine
The deterministic evaluation layer that decides whether an intent is allowed,
denied, delayed, or escalated under current policy.

## Executor
The component or actor that submits an approved action. Executors MUST only
execute valid, unexpired, policy-bound intents and MUST NOT modify them.

## Verifier
The component or actor that validates intent, policy, simulation, eligibility,
state assumptions, and post-execution evidence.
