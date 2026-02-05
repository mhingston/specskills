<!-- specs-workflow-start -->

# Specs Workflow

File-based spec-driven development workflow (no CLI required).

## Where Things Go

**Changes (active work):**
- `specs/changes/<change-name>/`
  - `.change.json` - State tracking
  - `proposal.md`, `specs/`, `design.md`, `tasks.md` - Artifacts
  - `implementation/` - Work output

**Main Specs (source of truth):**
- `specs/<capability>/spec.md`

**Schemas & Templates:**
- `specs/schemas/` - Workflow definitions
- `specs/templates/` - Artifact templates

## Naming

- **Change names:** kebab-case (e.g., `add-oauth-login`)
- **Capabilities:** kebab-case folder + spec.md

## Command Behavior

| Command | Behavior |
|---------|----------|
| `/specs-new <name>` | Create change workspace |
| `/specs-status` | Show artifact statuses |
| `/specs-continue` | Create ONE next-ready artifact |
| `/specs-ff` | Fast-forward all artifacts to apply-ready |
| `/specs-apply` | Implement tasks and check them off |
| `/specs-verify` | Verify implementation matches specs |
| `/specs-sync` | Merge change specs to main specs/ |
| `/specs-archive` | Complete and move to archive/ |
| `/specs-validate` | Validate format and structure |

## Artifact Status

- **blocked:** Dependencies incomplete
- **ready:** Dependencies done, artifact not created
- **done:** Artifact exists

Status flows: `blocked → ready → done`

## Delta Spec Format

When modifying specs:

```markdown
## ADDED Requirements
### Requirement: New Feature
Description...

## MODIFIED Requirements  
### Requirement: Existing Feature
Updated description...

## REMOVED Requirements
### Requirement: Old Feature
**Reason:** Why removed
**Migration:** How to migrate
```

## Key Rules

1. **One capability per folder** in specs/
2. **Check status before continue**
3. **Use checkboxes** in tasks.md: `- [ ] Task description`
4. **Verify before archive** - ensure implementation matches specs
5. **Sync then archive** - promote specs before completing
<!-- specs-workflow-end -->