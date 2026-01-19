---
description: Generate a verification report comparing artifacts (tasks/specs/design) to implementation.
agent: Workflow Router
---

Verify implementation against artifacts.

1) Resolve change.
2) Read proposal/specs/design/tasks.
3) Report:
- Completeness: unchecked tasks; missing artifact sections
- Correctness: requirements/scenarios -> evidence in code/tests (best-effort heuristics)
- Coherence: design decisions vs code patterns
4) Output CRITICAL/WARNING/SUGGESTION with file references where possible.
