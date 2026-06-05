# LuxVault Active Workspace

This directory contains the active LuxVault repos checked out side by side.
It is not one deployable monorepo, so package ownership and deployment paths
are per-repo, not shared globally.

## Tree

```txt
luxvault-active/
├── architecture/  decision truth, repo boundaries, ADRs, runbooks
├── api/           off-chain business/data workspace and generated chain artifacts
├── docs/          public documentation workspace
├── mcp/           local MCP and agent-operation tooling
├── protocol/      contract source, deployment orchestration, and on-chain ops
└── sdk/           published client/integration facade
```

## Ownership

| Path | Owns | Notes |
| --- | --- | --- |
| `architecture/` | Decision truth, repo boundaries, architecture notes, runbooks, and integration contracts | Not a deployable app. Keep this repo as the source of policy and system decisions. |
| `api/` | Fastify + Prisma backend, shared domain types, indexer code, and consumer-facing `packages/chain-artifacts` | This is the off-chain business/data workspace. It also owns the stable chain-artifact surface consumed by the SDK and other apps. |
| `protocol/` | Solidity source, protocol rules, contract deployment orchestration, Safe/role setup, generated protocol outputs, and deployer/operator registries | This is the blockchain-truth workspace. Package-specific deployment commands live in the protocol repo docs and package READMEs. |
| `docs/` | Public documentation site content and build pipeline | The docs site is a separate workspace and is built from `docs/docs`. |
| `sdk/` | The published LuxVault client facade and re-exports | This package wraps the API and canonical LuxVault packages without owning protocol truth. |
| `mcp/` | Local MCP servers, installers, and Codex/Desktop integration helpers | This is operational tooling for agents and staff, not a public runtime service. |

The detailed owner map lives in [OWNERS.md](./OWNERS.md). GitHub labels for release triage are `contracts`, `db`, `indexing`, `frontend`, `backend`, `governance`, `secrets`, `incident`, and `release-blocker`.

## Local Setup

There is no single root install command here. Set up the repo you are working on from the repo directory.

| Repo | Install | Build / Check |
| --- | --- | --- |
| `architecture/` | No dependency install required | Markdown-only repo |
| `api/` | `infisical run --env=dev --path=/ --recursive -- pnpm install` | `pnpm build`, `pnpm test`, `pnpm boot:check` |
| `protocol/` | `pnpm install` | `pnpm -r build`, `pnpm -r test` |
| `docs/docs/` | `pnpm install` | `pnpm build` |
| `sdk/` | `pnpm install` | `pnpm build`, `pnpm ci` |
| `mcp/` | `pnpm install` | `pnpm build`, `pnpm test` |

For clean-checkout CI, the rule is simple: install and build each repo from
inside that repo, without relying on state from sibling directories.

## Deploy Paths

| Surface | Deploy path |
| --- | --- |
| `api/` | Railway service build/start path via `pnpm railway:build` and `pnpm railway:start`; contract plan and execute flows via `pnpm deploy:contracts` and `pnpm deploy:contracts:execute`. |
| `protocol/` | Hardhat/Foundry deployment and reconciliation flows in the protocol workspace, including Base Sepolia/Base mainnet and Ethereum Sepolia/Ethereum mainnet targets; Safe setup runs through the protocol ops scripts. |
| `docs/docs/` | Public docs site build pipeline from the Next/Nextra workspace. |
| `sdk/` | Published package boundary via GitHub Packages. |
| `mcp/` | Local client installation through the installer scripts, not a production deploy. |

## Boundary Rule

Treat each repo as its own source of truth:

- `architecture/` documents decisions.
- `api/` owns off-chain business logic and consumer-facing chain artifacts.
- `protocol/` owns chain truth and deployment mechanics.
- `docs/` owns published documentation.
- `sdk/` owns the integration facade.
- `mcp/` owns local agent tooling.
