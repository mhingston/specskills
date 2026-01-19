# Workflow Data

This folder holds schemas and (optionally) main specs.

- `schemas/` define artifact graphs + templates
- `specs/` are “source of truth” specs (synced from change-local specs when desired)
- `changes/` are active and archived change workspaces

## Example .change.json

```json
{
  "name": "add-oauth-login",
  "schema": "spec-driven",
  "createdAt": "2026-01-19T00:00:00Z",
  "updatedAt": "2026-01-19T00:00:00Z",
  "artifacts": {
    "proposal": {
      "status": "done",
      "path": "artifacts/proposal.md"
    },
    "specs": {
      "status": "ready",
      "path": "artifacts/specs/"
    },
    "design": {
      "status": "blocked",
      "path": "artifacts/design.md"
    },
    "tasks": {
      "status": "blocked",
      "path": "artifacts/tasks.md"
    }
  }
}
```

## Schemas

- Workflow schemas live in `specskills/schemas/` (for example: `spec-driven.json`).
- The `.change.json` shape is documented in `specskills/schemas/change.json`.
