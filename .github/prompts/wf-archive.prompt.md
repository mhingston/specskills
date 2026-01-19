---
description: Archive a change by moving it to specskills/changes/archive/YYYY-MM-DD-<name>/, optionally syncing specs first.
agent: Workflow Router
---

Archive a change.

1) Resolve change.
2) Warn if tasks incomplete.
3) If change-local specs exist, offer /wf-sync (recommended) before archiving.
4) Move folder to specskills/changes/archive/YYYY-MM-DD-<name>/
5) Summarize archive location and any warnings.
