# Agent Operating Rules

## Source of Truth

The repository is canonical. Outline is a human-facing mirror.

Do not treat Outline content as canonical unless explicitly marked as pulled review material under `generated/outline-kb/`.

## Allowed Writes

Agents may edit:

- `memory/*.md`
- `specs/**/*.md`
- `specs/**/*.yaml`
- `specs/**/*.json`
- `policies/*.yaml`
- `policies/*.json`
- `runbooks/*.md`
- `architecture/integration-contracts/manifests/outline-sync.manifest.json`

Agents may not edit:

- secrets
- private keys
- deployment credentials
- generated Outline exports except during pull/sync operations
- production runtime configuration without explicit approval

## Required Workflow

For any spec change:

1. Read `memory/constitution.md`.
2. Read `memory/authority-model.md`.
3. Read `specs/spec-registry.yaml`.
4. Modify the minimum necessary files.
5. Run offline validation.
6. Produce a change summary.
7. Identify affected specs, policies, contracts, tests, and runbooks.
8. Never push to Outline without explicit approval.

## Required Commands

Use:

```bash
cd apps/api
OUTLINE_MANIFEST_PATH=/home/odoo-dev-admin/luxvault-active/architecture/integration-contracts/manifests/outline-sync.manifest.json pnpm outline:validate