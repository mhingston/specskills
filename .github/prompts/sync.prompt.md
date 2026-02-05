---
description: Merge change-local specs into main specs with intelligent delta merging and conflict resolution
agent: specs
---

# /specs-sync

Merge delta specs from a change into the main specs folder. This is an **agent-driven** operation—you intelligently merge changes rather than blindly copying files.

## Usage

```
/specs-sync
/specs-sync user-authentication
/specs-sync --dry-run
```

## Input

Optionally specify change name. If omitted, use most recent change. Use `--dry-run` to preview without making changes.

## Why Intelligent Merging?

Unlike simple file copying, you can apply **partial updates**:
- Add a new scenario without copying existing ones
- Modify a requirement without affecting others
- Preserve unrelated content in main specs
- Handle conflicts intelligently

## Delta Operations

The delta spec format tells you what to do:

### ADDED Requirements

**When:** New capability or new requirements to existing capability

**Strategy:**
- If capability doesn't exist → Create new spec file
- If capability exists → Add requirements to existing spec
- Preserve existing requirements, scenarios, and structure

**Example:**
```markdown
## ADDED Requirements

### Requirement: User can export data
The system SHALL allow CSV export.

#### Scenario: Basic export
**Given** user has data
**When** they click export
**Then** CSV downloads
```

**Merge:**
```
Main spec (before):
## ADDED Requirements
### Requirement: User login
...

After merge:
## ADDED Requirements
### Requirement: User login
...

### Requirement: User can export data  ← NEW
The system SHALL allow CSV export.

#### Scenario: Basic export
...
```

### MODIFIED Requirements

**When:** Changing existing behavior

**Strategy:**
- Locate the requirement in main spec by exact name match
- Apply changes carefully:
  - Update the requirement description
  - Add/modify scenarios as specified
  - Preserve scenarios NOT mentioned in delta
- **Don't** remove unrelated content

**Example:**
```markdown
## MODIFIED Requirements

### Requirement: User authentication
(Updated description)

#### Scenario: Valid credentials
(Updated steps)

#### Scenario: Invalid credentials  ← NEW
...
```

**Merge:**
```
Main spec (before):
### Requirement: User authentication
The system SHALL authenticate users.

#### Scenario: Valid credentials
...
#### Scenario: Session expiry
...

After merge:
### Requirement: User authentication
The system SHALL authenticate users via OAuth.  ← UPDATED

#### Scenario: Valid credentials
(Updated steps)  ← UPDATED

#### Scenario: Invalid credentials  ← NEW
...

#### Scenario: Session expiry  ← PRESERVED
...
```

### REMOVED Requirements

**When:** Deprecating or deleting functionality

**Strategy:**
- Remove the requirement block entirely
- Or keep with deprecation notice
- Always document reason and migration path

**Example:**
```markdown
## REMOVED Requirements

### Requirement: Legacy XML export
**Reason:** Replaced by CSV export
**Migration:** Update integrations to use /api/v2/export/csv
```

**Merge Options:**

Option A - Remove completely:
```
Before: Has XML export requirement
After: Requirement removed
```

Option B - Deprecation notice:
```
## REMOVED Requirements

### Requirement: Legacy XML export [DEPRECATED 2026-02-05]
**Status:** Removed
**Reason:** Replaced by CSV export
**Migration:** Update to /api/v2/export/csv
```

### RENAMED Requirements

**When:** Refactoring without behavior change

**Strategy:**
- Find requirement by FROM name
- Rename to TO name
- Preserve all scenarios and content
- Update any references

**Example:**
```markdown
## RENAMED Requirements

- **FROM:** `User login`
- **TO:** `User authentication`
**Reason:** Consistency with OAuth terminology
```

**Merge:**
```
Before: ### Requirement: User login
After:  ### Requirement: User authentication  ← RENAMED
       (Content preserved)
```

## Workflow

1. **Select Change**
   
   If name provided, use it. Otherwise most recent by `updatedAt`.

2. **Check Prerequisites**
   
   Read `.change.json`:
   - Verify change exists
   - Check specs artifact status
   - Warn if specs not complete

3. **Preview Changes (if not --dry-run)**
   
   Show what will be synced:
   ```
   ## Sync Preview: user-authentication
   
   Capabilities to sync:
   1. **session-management** (NEW)
      - ADDED: 2 requirements
   
   2. **user-login** (MODIFIED)
      - MODIFIED: 1 requirement
      - ADDED: 1 scenario
   
   3. **legacy-auth** (REMOVED)
      - REMOVED: 1 requirement
   
   Proceed? (yes/no)
   ```

4. **Process Each Capability**
   
   For each `specs/changes/<name>/specs/<capability>/spec.md`:
   
   a. **Read Delta Spec**
      - Parse ADDED/MODIFIED/REMOVED/RENAMED sections
      - Note requirements and scenarios
   
   b. **Read Main Spec (if exists)**
      - Path: `specs/<capability>/spec.md`
      - May not exist for new capabilities
   
   c. **Apply Changes**
      - ADDED: Add requirements to appropriate section
      - MODIFIED: Update existing requirements
      - REMOVED: Remove or deprecate
      - RENAMED: Rename requirement
   
   d. **Handle Conflicts**
      - Check if main spec changed since change created
      - Show conflicts if found
      - Ask for resolution
   
   e. **Write Main Spec**
      - Save merged content
      - Preserve formatting

5. **Generate Report**
   
   ```
   ## Sync Complete: user-authentication
   
   **Capabilities Updated:** 3
   
   | Capability | Operation | Details |
   |------------|-----------|---------|
   | session-management | ADDED | 2 requirements, 4 scenarios |
   | user-login | MODIFIED | 1 req updated, 1 scenario added |
   | legacy-auth | REMOVED | 1 requirement (with migration) |
   
   **Files Modified:**
   - specs/session-management/spec.md (created)
   - specs/user-login/spec.md (updated)
   - specs/legacy-auth/spec.md (deprecated)
   
   **Next Steps:**
   - Archive change: `/specs-archive user-authentication`
   ```

## Conflict Resolution

### Detecting Conflicts

A conflict occurs when:
1. Main spec was modified after change was created
2. Delta tries to modify a requirement that no longer exists
3. Delta tries to add a requirement that now exists

### Conflict Resolution Strategies

**Strategy 1: Show Diff**
```
⚠️ CONFLICT: specs/user-login/spec.md

Main spec has changed since change was created.

Option 1: Review and merge manually
Option 2: Overwrite with change version
Option 3: Keep main spec version
Option 4: Cancel sync

Which would you like?
```

**Strategy 2: Intelligent Merge**
If requirements don't overlap:
```
Main spec added: "Password reset" requirement
Change modifies: "Login" requirement

✓ No overlap - can merge automatically
```

**Strategy 3: Ask User**
If requirements overlap:
```
⚠️ OVERLAP DETECTED

Both modify: "User authentication" requirement

Main version: Uses JWT tokens
Change version: Uses session cookies

Please resolve:
1. Use main version
2. Use change version  
3. Show me both to decide
```

## Examples

### Example 1: Simple Add

```
Change: user-profile
Delta spec: specs/changes/user-profile/specs/profile/spec.md

ADDED Requirements:
- User can update profile
- User can upload avatar

Main specs: profile/spec.md doesn't exist

Result: Create specs/profile/spec.md with ADDED requirements
```

### Example 2: Modify with Preserve

```
Change: auth-enhancement

MODIFIED Requirements:
### Requirement: User authentication
- Added: 2FA support scenario
- (Existing scenarios not mentioned)

Main spec has:
- Valid credentials scenario
- Invalid credentials scenario  
- Session timeout scenario

Merge:
- Keep all existing scenarios
- Add 2FA support scenario
- Update requirement text if changed
```

### Example 3: Complex Merge

```
Change: api-v2

Capabilities affected:
1. users (MODIFIED)
   - Modified: Pagination requirements
   - Added: Filter parameters
   
2. orders (ADDED)
   - New capability entirely
   
3. legacy-webhook (REMOVED)
   - Deprecated feature

Sync process:
- Update specs/users/spec.md
- Create specs/orders/spec.md
- Deprecate specs/legacy-webhook/spec.md
```

### Example 4: Conflict Scenario

```
Change created: 2026-01-15
Main spec modified: 2026-01-20

Conflict: Both modified "Rate limiting" requirement

Delta (change):
- Limit: 100 requests/minute

Main (current):
- Limit: 50 requests/minute

Resolution options:
1. Use change: 100/min (might break existing clients)
2. Use main: 50/min (change request ignored)
3. Compromise: Ask user for value
4. Skip: Don't sync this requirement
```

## Idempotency

Sync should be **idempotent**—running twice produces the same result:

```
First sync:
- Adds requirement "Export data"

Second sync:
- Requirement "Export data" already exists
- No duplicate added
- Result: Same as first sync
```

**Implementation:**
- Check if requirement already exists before adding
- Use exact name matching
- Skip if already present

## Rollback Strategy

If sync goes wrong:

1. **Git rollback** (if using git):
   ```bash
   git checkout specs/<capability>/spec.md
   ```

2. **Manual revert**:
   - Restore from backup
   - Or manually undo changes

3. **Re-sync**:
   - Fix delta spec
   - Re-run `/specs-sync`

## Guardrails

- **Never silently overwrite** - Always show what's changing
- **Preserve existing content** - Don't remove unrelated requirements
- **Document removals** - Always include reason and migration
- **Handle conflicts** - Ask user when main spec changed
- **Be idempotent** - Running twice = same result
- **Validate after** - Check merged spec is valid
- **Show summary** - Report what was changed
- **Allow dry-run** - Preview before committing

## Best Practices

1. **Sync before archive** - Keep main specs current
2. **Verify first** - Run `/specs-verify` before syncing
3. **One capability at a time** - Easier to review
4. **Commit after sync** - Version control the changes
5. **Update tests** - Sync specs → update tests
6. **Review conflicts** - Don't auto-resolve complex conflicts
7. **Document migrations** - Help users transition
