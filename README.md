# Copilot Workflow Template (File-based)

This repository is a template for a file-based “change workflow” that recreates spec driven development-style actions purely via
GitHub Copilot (VS Code) using:
- Repo custom instructions: `.github/copilot-instructions.md`
- A custom agent: `.github/agents/workflow-router.agent.md`
- Prompt files (slash commands): `.github/prompts/wf-*.prompt.md`

## Quick start

1) Open in VS Code
2) Open Copilot Chat
3) Select the agent: **Workflow Router**
4) Run one of:
- `/wf-new add-oauth-login`
- `/wf-status`
- `/wf-continue`
- `/wf-ff add-oauth-login`
- `/wf-apply add-oauth-login`
- `/wf-verify add-oauth-login`
- `/wf-sync add-oauth-login`
- `/wf-archive add-oauth-login`

Or just say:
- “Start a change to …”
- “Continue”
- “Implement the next task”

## Example flow

1) Create a change: `/wf-new add-oauth-login`
2) Generate the first artifact: `/wf-continue add-oauth-login`
3) Fast-forward to apply-ready: `/wf-ff add-oauth-login`
4) Implement tasks: `/wf-apply add-oauth-login`
5) Verify implementation: `/wf-verify add-oauth-login`
6) Sync specs (optional): `/wf-sync add-oauth-login`
7) Archive the change: `/wf-archive add-oauth-login`

## Folder conventions

Changes live under:

```
specskills/changes/<change-name>/
.change.json
artifacts/
proposal.md
design.md
tasks.md
specs/ <capability>.md
implementation/
```

Main specs (source of truth) live under:
`specskills/specs/<capability>.md`

Schemas live under:
`specskills/schemas/<schema>.json`

## Make this a GitHub Template repo
After pushing to GitHub:
- Settings → General → check “Template repository”
