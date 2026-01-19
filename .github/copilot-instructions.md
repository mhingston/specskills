# File-based Workflow (no specskills CLI)

We use a file-based “change workflow”. Do NOT assume specskills CLI exists.

## Where things go
Changes:
- specskills/changes/<change-name>/
  - .change.json
  - artifacts/{proposal.md, design.md, tasks.md, specs/*}
  - implementation/

Main specs (source of truth):
- specskills/specs/<capability>.md

Schemas (artifact DAG + templates):
- specskills/schemas/<schema>.json

## Naming
- change names MUST be kebab-case (e.g., add-oauth-login)

## Behavior rules
- `/wf-continue` creates EXACTLY ONE next-ready artifact
- `/wf-ff` creates artifacts until apply-ready (schema applyRequires satisfied)
- `/wf-apply` implements tasks and checks them off
- `/wf-status` computes done/ready/blocked from schema deps + file existence
- If user says “continue” with no change specified:
  - choose most recently updated specskills/changes/*/.change.json
  - if ambiguous, ask the user to pick

## State
Each change has `specskills/changes/<name>/.change.json` with:
- name, schema, createdAt, updatedAt
- artifact statuses and paths

## Artifact status semantics
- done: artifact file/folder exists and satisfies dependencies
- ready: dependencies are done, but artifact output does not exist yet
- blocked: one or more dependencies are not done
