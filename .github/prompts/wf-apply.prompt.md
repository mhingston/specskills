---
description: Implement tasks from artifacts/tasks.md, checking them off as completed.
agent: Workflow Router
---

Implement tasks for a change.

1) Resolve change (most recent if omitted; ask if ambiguous).
2) Load schema + .change.json.
3) Ensure applyRequires artifacts exist; if not, instruct to /wf-continue or /wf-ff.
4) Read context artifacts: proposal, design, tasks, and all specs under artifacts/specs/.
5) Parse artifacts/tasks.md checkboxes:
   - implement unchecked tasks sequentially
   - after each real change, mark task [x]
6) Stop on blockers/ambiguity and ask the user.
7) Summarize what was completed and what's next.
