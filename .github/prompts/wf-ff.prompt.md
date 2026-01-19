---
description: Fast-forward artifact creation until apply-ready (schema applyRequires satisfied).
agent: Workflow Router
---

Fast-forward a change to apply-ready.

- If change doesn't exist yet, create it as /wf-new would.
- Then loop:
  - compute status
  - pick next ready artifact in schema sequence
  - read deps
  - write artifact
  - update .change.json
Stop as soon as all schema applyRequires artifacts are done.
Print summary and recommend /wf-apply.
