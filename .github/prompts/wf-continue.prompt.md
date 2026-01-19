---
description: Create exactly one next-ready artifact for a change (dependency-respecting).
agent: Workflow Router
---

Continue a change by creating EXACTLY ONE artifact.

1) Determine target change:
- if user specified name, use it
- else use most recent .change.json (or ask if ambiguous)

2) Read:
- specskills/changes/<name>/.change.json
- specskills/schemas/<schema>.json

3) Compute status from deps + file existence.

4) Choose the FIRST ready artifact in schema sequence.
If none ready:
- if complete, say so and suggest /wf-apply or /wf-archive
- else explain what is blocked

5) Read dependency artifacts for context.

6) Write the artifact:
- use schema template
- fill based on user goal + dependency context
- if critical info missing, ask up to 3 targeted questions first

7) Update `.change.json` (updatedAt, artifact status done)

8) Print progress + what became ready next
