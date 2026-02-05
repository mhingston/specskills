---
description: Complete a change and move it to archive with verification and metadata preservation
agent: specs
---

# /specs-archive

Complete a change and move it to the archive. This preserves the decision record while cleaning up active changes.

## Usage

```
/specs-archive
/specs-archive user-authentication
/specs-archive --force
```

## Input

Optionally specify change name. If omitted, use most recent change. Use `--force` to archive even if incomplete (not recommended).

## Archive Process

Archiving does three things:
1. **Preserves** - All artifacts are kept in archive folder
2. **Records** - Metadata about when and why
3. **Cleans up** - Removes from active changes list

## Workflow

1. **Select Change**
   
   If name provided, use it. Otherwise most recent.
   - If multiple active changes, show list and ask
   - If none found, report error

2. **Verify Completion**
   
   Read `specs/changes/<name>/.change.json`:
   - Check all artifacts status = "done"
   - Check tasks are complete
   
   **If incomplete:**
   ```
   ⚠️ Change "user-auth" is not complete
   
   Missing:
   - tasks.md (status: blocked)
   
   Options:
   1. Complete first: /specs-continue user-auth
   2. Archive anyway: /specs-archive user-auth --force
   3. Cancel and continue working
   ```

3. **Pre-Archive Checklist**
   
   Confirm these are done:
   ```
   Pre-Archive Checklist:
   
   - [ ] All tasks completed? (tasks.md)
   - [ ] Implementation done? (code changes)
   - [ ] Specs synced to main? (/specs-sync run)
   - [ ] Implementation verified? (/specs-verify passed)
   
   Ready to archive? (yes/no)
   ```

4. **Check Specs Sync Status**
   
   Compare:
   - Change specs: `specs/changes/<name>/specs/`
   - Main specs: `specs/specs/`
   
   **If not synced:**
   ```
   ⚠️ Specs not synced to main
   
   Change specs exist but not in main specs/ folder.
   
   Recommend: Run `/specs-sync <name>` first
   This ensures main specs are up to date.
   
   Archive anyway? (yes/no)
   ```

5. **Create Archive**
   
   Steps:
   - Generate timestamp: `YYYY-MM-DD` format
   - Create folder: `specs/changes/archive/YYYY-MM-DD-<name>/`
   - Copy ALL files from change folder:
     - `.change.json`
     - `proposal.md`
     - `specs/` folder
     - `design.md`
     - `tasks.md`
     - Any other files

6. **Create Archive Metadata**
   
   Create `archive-metadata.json`:
   ```json
   {
     "name": "user-authentication",
     "archivedAt": "2026-02-05T14:30:00Z",
     "originalCreatedAt": "2026-02-03T10:15:00Z",
     "schema": "spec-driven",
     "duration": "2 days",
     "artifacts": {
       "proposal": { "status": "done", "completedAt": "..." },
       "specs": { "status": "done", "completedAt": "..." },
       "design": { "status": "done", "completedAt": "..." },
       "tasks": { "status": "done", "completedAt": "..." }
     },
     "syncedSpecs": [
       "specs/user-authentication/spec.md",
       "specs/session-management/spec.md"
     ],
     "filesArchived": [
       "proposal.md",
       "specs/user-auth/spec.md",
       "specs/session/spec.md",
       "design.md",
       "tasks.md"
     ]
   }
   ```

7. **Clean Up**
   
   - Remove original folder: `specs/changes/<name>/`
   - Verify removal
   - Archive is now the only copy

8. **Confirm Archival**
   
   Display:
   ```
   ## ✓ Change Archived: user-authentication
   
   **Archive Location:**
   specs/changes/archive/2026-02-05-user-authentication/
   
   **Timeline:**
   - Created: 2026-02-03 (2 days ago)
   - Archived: 2026-02-05 (today)
   - Duration: 2 days
   
   **Artifacts Preserved:**
   - ✓ proposal.md
   - ✓ specs/ (2 capability specs)
   - ✓ design.md
   - ✓ tasks.md
   - ✓ archive-metadata.json
   
   **Specs Synced:**
   - ✓ specs/user-authentication/spec.md
   - ✓ specs/session-management/spec.md
   
   **Active Changes Remaining:** 2
   
   The decision record is preserved. The code remains in your codebase.
   ```

## Archive Structure

```
specs/changes/archive/
├── 2026-02-05-user-authentication/
│   ├── archive-metadata.json    ← Archive info
│   ├── .change.json            ← Original state
│   ├── proposal.md
│   ├── specs/
│   │   ├── user-auth/
│   │   │   └── spec.md
│   │   └── session/
│   │       └── spec.md
│   ├── design.md
│   └── tasks.md
│
├── 2026-02-04-payment-gateway/
│   └── ...
│
└── 2026-02-03-dark-mode/
    └── ...
```

## Examples

### Example 1: Successful Archive

```
User: /specs-archive user-authentication

Checking completion... ✓ All artifacts done
Checking sync status... ✓ Specs synced
Confirm archive? yes

Creating archive folder...
Copying files...
Creating metadata...
Removing original...

## ✓ Change Archived: user-authentication

**Archive Location:**
specs/changes/archive/2026-02-05-user-authentication/

**Preserved:**
- All 4 artifacts
- 2 capability specs
- Decision history
- Implementation notes

**Next:** Create a new change with /specs-new
```

### Example 2: Not Complete

```
User: /specs-archive payment-gateway

⚠️ Change not complete

Incomplete artifacts:
- tasks.md (status: blocked)
- specs/ (only 1 of 2 specs done)

Options:
1. Complete first: /specs-continue payment-gateway
2. Force archive: /specs-archive payment-gateway --force
3. Cancel

Recommendation: Complete before archiving
```

### Example 3: Specs Not Synced

```
User: /specs-archive api-v2

Checking completion... ✓ All done
Checking sync status... ⚠️ Not synced

Change has unsynced specs:
- specs/changes/api-v2/specs/rate-limit/spec.md
- specs/changes/api-v2/specs/auth/spec.md

Main specs folder:
- specs/rate-limit/spec.md (different version)
- specs/auth/spec.md (missing)

Recommend: /specs-sync api-v2 first

Archive anyway? (specs won't be in main) no
```

### Example 4: Recent Change

```
User: /specs-archive

Multiple changes found:
1. user-authentication (updated today)
2. payment-gateway (updated yesterday)
3. dark-mode (updated 3 days ago)

Which to archive? 1

## ✓ Change Archived: user-authentication

**Archive Location:**
specs/changes/archive/2026-02-05-user-authentication/

**Duration:** 2 days from creation to archive
```

## Why Archive?

**Decision History:**
- Why did we build X this way?
- What alternatives were considered?
- Look in archive: design.md has decisions

**Audit Trail:**
- When was feature Y added?
- What was the scope originally?
- Look in archive: proposal.md has scope

**Knowledge Preservation:**
- Team member left, why is Z implemented oddly?
- Look in archive: tasks.md shows reasoning

## Finding Old Archives

```
specs/changes/archive/
├── 2026-02-05-user-authentication/     ← Date prefixed, easy to sort
├── 2026-02-04-payment-gateway/
├── 2026-02-01-dark-mode/
└── 2026-01-28-legacy-cleanup/

Sort by date, search by name
```

## Restoring from Archive

If needed, you can restore:

```bash
# Copy from archive back to active
cp -r specs/changes/archive/2026-02-05-user-authentication \
      specs/changes/user-authentication

# Remove archive-metadata.json (optional)
rm specs/changes/user-authentication/archive-metadata.json
```

Then update `.change.json` timestamps if needed.

## Bulk Archive

To archive multiple changes at once:

```
/specs-bulk-archive --all-completed
```

See `/specs-bulk-archive` prompt for details.

## Guardrails

- **Verify completion** - Don't archive incomplete work
- **Check sync status** - Ensure specs are in main
- **Confirm intent** - Ask before archiving
- **Preserve everything** - Don't lose artifacts
- **Timestamp clearly** - Use YYYY-MM-DD format
- **Keep metadata** - Record what was archived
- **Clean up** - Remove original after copy verified
- **Allow force** - But warn when using it

## Rules

- DO verify all artifacts complete (unless --force)
- DO check specs synced before archiving
- DO create timestamped archive folder
- DO preserve all files and structure
- DO create archive-metadata.json
- DO remove original after successful archive
- DO ask for confirmation
- DO NOT lose data (copy first, remove after verify)
- DO NOT archive without user confirmation
- DO report what was archived and where
