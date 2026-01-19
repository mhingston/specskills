---
description: Merge change-local specs (specskills/changes/<name>/artifacts/specs/*) into specskills/specs/* (idempotent).
agent: Workflow Router
---

Sync change-local specs into main specs.

1) Resolve change.
2) For each file in specskills/changes/<name>/artifacts/specs/:
- read delta spec
- read/create specskills/specs/<capability>.md
- merge changes carefully and idempotently:
  - do not duplicate requirements
  - preserve unrelated main spec content
3) Summarize what changed.
