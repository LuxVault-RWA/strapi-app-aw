# LuxVault ownership map

This file mirrors the critical ownership split used in `CODEOWNERS`, but in a more readable form for release triage and escalation.

## Owners

| Owner | Primary scope | Escalate for |
| --- | --- | --- |
| `eberureon` | DB/platform/config surfaces, backend runtime, secret handling, and release execution support | Anything that can affect database state, runtime config, or deployment plumbing |
| `jherold2` | Contracts, Safe ops, chain artifacts, release governance, and on-chain changes | Anything that can affect contract code, chain truth, or privileged execution |

## Component map

| Component label | Owned paths | Default owner |
| --- | --- | --- |
| `contracts` | `/protocol/packages/contracts-product/`, `/protocol/packages/contracts-infra/`, `/protocol/ops/setup-safes/`, `/protocol/ops/setup-roles/`, `/protocol/ops/safe-ops/` | `jherold2` |
| `db` | `/api/apps/api/prisma/`, `/api/apps/api/src/infra/db/` | `eberureon` |
| `indexing` | `/api/packages/indexer/`, `/api/apps/api/src/workflows/indexed-events.workflow.ts`, `/api/apps/api/src/modules/contracts/` | `jherold2` |
| `frontend` | `/docs/`, `/sdk/` | `eberureon` |
| `backend` | `/api/apps/api/src/`, `/api/packages/types/`, `/api/packages/chain-artifacts/` | `eberureon` |
| `governance` | `/architecture/`, release templates, branch protection exports, and repo-policy files | `jherold2` |
| `secrets` | Infisical sync tooling, environment wiring, and deployment token handling | `eberureon` |
| `incident` | Runbooks, alerts, and rollback procedures across all workspaces | `eberureon` |
| `release-blocker` | Anything that blocks a production release or rollback | `jherold2` |

## Escalation

If the correct owner is unclear, request both owners on the issue or PR and mark it with `release-blocker` until the scope is resolved.
