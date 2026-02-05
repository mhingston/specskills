---
description: Archive multiple completed changes at once
agent: specs
---

# /specs-bulk-archive

Archive multiple completed changes in a single operation. Useful for cleaning up finished work or batch processing.

## Usage

```
/specs-bulk-archive change-1 change-2 change-3
/specs-bulk-archive --all-completed
/specs-bulk-archive --all-completed --sync
/specs-bulk-archive --dry-run
```

## Parameters

- `change-names...` (optional): Space-separated list of change names to archive
- `--all-completed`: Archive all changes with all artifacts done
- `--sync`: Sync specs to main before archiving (default: true)
- `--dry-run`: Show what would be archived without moving files
- `--no-sync`: Skip syncing specs before archive

## Instructions

1. **Identify Target Changes**
   
   If change names provided:
   - Validate each exists in `specs/changes/`
   - Verify each is complete (all artifacts done)
   - Report any that aren't complete
   
   If `--all-completed` flag:
   - Scan `specs/changes/*/.change.json`
   - Find all changes where all artifacts have status "done"
   - List them for confirmation (unless `--dry-run`)

2. **Confirm Operation (if --all-completed)**
   
   Show list of changes to be archived:
   ```
   The following changes will be archived:
   
   1. user-authentication (completed 2026-02-05)
   2. payment-gateway (completed 2026-02-04)
   3. dark-mode (completed 2026-02-03)
   
   Proceed? (yes/no)
   ```

3. **For Each Change**
   
   a. **Sync Specs (if --sync or default)**
      - Read `specs/changes/<name>/specs/`
      - For each capability spec:
        - Read delta spec
        - Read/create main spec at `specs/specs/<capability>/spec.md`
        - Merge changes intelligently
      - See `/specs-sync` for detailed merge logic
   
   b. **Create Archive Directory**
      - Format: `specs/changes/archive/YYYY-MM-DD-<name>/`
      - Use today's date
   
   c. **Move Files**
      - Copy `.change.json` to archive
      - Copy all artifacts (proposal.md, specs/, design.md, tasks.md)
      - Preserve directory structure
   
   d. **Remove Active Change**
      - Delete `specs/changes/<name>/`

4. **Generate Report**
   
   After processing all changes:
   ```
   ## Bulk Archive Complete
   
   **Archived:** {N} changes
   
   | Change | Archive Location |
   |--------|-----------------|
   | user-auth | specs/changes/archive/2026-02-05-user-auth/ |
   | payments | specs/changes/archive/2026-02-05-payments/ |
   
   **Specs Synced:** Yes (3 capabilities updated)
   
   **Active Changes Remaining:** {M}
   ```

## Error Handling

- **If change doesn't exist:**
  - Report: "Change '{name}' not found in specs/changes/"
  - Continue with other changes
  - Include in error summary

- **If change is not complete:**
  - Report: "Change '{name}' is not complete (missing: {artifacts})"
  - Skip this change
  - Suggest: "Complete with /specs-continue {name} or /specs-apply {name}"

- **If archive directory already exists:**
  - Append counter: `specs/changes/archive/YYYY-MM-DD-<name>-1/`
  - Report the adjusted path

- **If no changes to archive:**
  - Report: "No completed changes found to archive"
  - Suggest: "Run /specs-status to see active changes"

## Rules

- **DO validate** all changes before starting
- **DO sync specs** before archive (unless --no-sync)
- **DO preserve** all artifacts and .change.json
- **DO report** what was archived and where
- **DO handle errors** gracefully (continue with other changes)
- **DO NOT archive** incomplete changes
- **DO NOT delete** files until copy is verified
- **DO NOT overwrite** existing archives (use counter suffix)

## Examples

### Archive specific changes:
```
/specs-bulk-archive user-auth payment-gateway

## Bulk Archive Complete

**Archived:** 2 changes

| Change | Archive Location |
|--------|-----------------|
| user-auth | specs/changes/archive/2026-02-05-user-auth/ |
| payment-gateway | specs/changes/archive/2026-02-05-payment-gateway/ |
```

### Archive all completed:
```
/specs-bulk-archive --all-completed

The following changes will be archived:

1. user-authentication (completed 2026-02-05)
2. payment-gateway (completed 2026-02-04)
3. dark-mode (completed 2026-02-03)

Proceed? (yes/no)

## Bulk Archive Complete

**Archived:** 3 changes

| Change | Archive Location |
|--------|-----------------|
| user-authentication | specs/changes/archive/2026-02-05-user-authentication/ |
| payment-gateway | specs/changes/archive/2026-02-05-payment-gateway/ |
| dark-mode | specs/changes/archive/2026-02-05-dark-mode/ |

**Specs Synced:** Yes (5 capabilities updated)

**Active Changes Remaining:** 1
```

### Dry run:
```
/specs-bulk-archive --all-completed --dry-run

## Dry Run - Would Archive:

1. user-authentication
2. payment-gateway
3. dark-mode

(No files will be moved)
```

## Comparison with /specs-archive

| Command | Use Case | Changes |
|---------|----------|---------|
| `/specs-archive <name>` | Archive single change | 1 |
| `/specs-bulk-archive` | Archive multiple specific changes | N |
| `/specs-bulk-archive --all-completed` | Archive all finished changes | All ready |

Use `/specs-archive` for individual changes, `/specs-bulk-archive` for batch operations.
