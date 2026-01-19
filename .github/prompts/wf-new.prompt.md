---
description: Create a new change (folder + .change.json) and show the first ready artifact template.
agent: Workflow Router
---

Create a new change in `specskills/changes/<name>/` without using any specskills CLI.

Steps:
1) Get a change name (kebab-case). If missing, ask the user what they want to build and derive a kebab-case name.
2) Choose schema:
   - default: spec-driven
   - if user asks, list `specskills/schemas/` and let them choose.
3) Create folders:
   - specskills/changes/<name>/artifacts/specs/
   - specskills/changes/<name>/implementation/
4) Create `.change.json` with:
   - name, schema, createdAt, updatedAt
   - artifacts populated from schema (proposal/specs/design/tasks etc.)
   - mark artifacts with no deps as ready; others blocked
5) Print status (done/ready/blocked) and show the first ready artifact template.
Do not write the first artifact yet.
