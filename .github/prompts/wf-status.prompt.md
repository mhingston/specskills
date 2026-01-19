---
description: Show computed status (done/ready/blocked) for a change and the next ready artifact.
agent: Workflow Router
---

Show status for a change.

If change name not provided:
- choose the most recently updated specskills/changes/*/.change.json
- if ambiguous, list 3–5 and ask user to pick

Then:
- read .change.json
- read schema file specskills/schemas/<schema>.json
- compute done/ready/blocked from deps + file/dir existence
- print a small table + next ready artifact
- show whether apply-ready is satisfied (schema applyRequires)
