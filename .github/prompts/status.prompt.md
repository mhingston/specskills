---
description: Show the current status of changes with visual indicators and next steps
agent: specs
---

# /specs-status

Display the current status of active changes. Shows progress, dependencies, and what to do next.

## Usage

```
/specs-status
/specs-status Show me where we are
/specs-status --all
```

## Output Modes

**Default:** Show most recent or single active change
**--all:** Show all active changes summary

## Status Display

### Single Change View

When one change is active:

```
## Status: user-authentication

**Schema:** spec-driven
**Created:** 2026-02-03 (2 days ago)
**Last Updated:** 2026-02-05 (today)

### Artifacts

| Artifact | Status | Dependencies | File |
|----------|--------|--------------|------|
| ✓ proposal | DONE | - | proposal.md |
| ✓ specs | DONE | proposal | specs/ |
| ✓ design | DONE | proposal | design.md |
| ⏳ tasks | READY | specs, design | tasks.md |

### Progress

███████░░░ 70% complete (3/4 artifacts)

### Next Steps

→ Run: `/specs-continue user-authentication`
   Creates: tasks.md

Alternative: `/specs-ff user-authentication`
   Creates: tasks.md (and any other ready artifacts)
```

### Multiple Changes View (--all)

```
## Active Changes: 3

| Change | Schema | Progress | Age | Next Action |
|--------|--------|----------|-----|-------------|
| user-auth | spec-driven | 3/4 (75%) | 2d | /specs-continue |
| payments | tdd | 2/5 (40%) | 5d | /specs-continue |
| dark-mode | rapid | 1/2 (50%) | 1d | /specs-continue |

Most recent: user-auth (updated today)

### Quick Actions

Continue most recent: /specs-continue user-auth
Check specific change: /specs-status payments
```

## Instructions

1. **Find Changes**
   
   Scan `specs/changes/`:
   - List all directories (excluding `archive/`)
   - Read each `.change.json`
   - Sort by `updatedAt` (most recent first)

2. **Calculate Status**
   
   For each artifact:
   - Check file existence
   - Parse `.change.json` status
   - Compute dependencies:
     - All deps done → READY
     - Any dep not done → BLOCKED
     - File exists → DONE

3. **Generate Display**
   
   **If single change:**
   - Show detailed table
   - Show dependency graph
   - Show next action
   
   **If multiple changes:**
   - Show summary table
   - Highlight most recent
   - Offer quick actions

4. **Suggest Next Action**
   
   Based on status:
   - **Has READY artifacts** → Suggest `/specs-continue`
   - **All artifacts done** → Suggest `/specs-apply`
   - **All tasks done** → Suggest `/specs-verify` or `/specs-archive`
   - **All blocked** → Explain what's blocking

## Visual Indicators

| Symbol | Meaning | Color |
|--------|---------|-------|
| ✓ | DONE - Complete | Green |
| ⏳ | READY - Can be created | Yellow |
| 🔒 | BLOCKED - Waiting on dependencies | Gray |
| ⚠️ | ISSUE - Problem detected | Red |

## Dependency Display

Show dependency chain:

```
spec-driven workflow:

proposal (✓ done)
    ├──────→ specs (✓ done)
    │            └──────→ tasks (⏳ ready)
    │                           ↑
    └──────→ design (✓ done)────┘

Next: Create tasks
```

## Status Examples

### Example 1: Just Started

```
## Status: add-payment-method

**Schema:** spec-driven
**Created:** Just now

### Artifacts

| Artifact | Status | Dependencies |
|----------|--------|--------------|
| ⏳ proposal | READY | - |
| 🔒 specs | BLOCKED | proposal |
| 🔒 design | BLOCKED | proposal |
| 🔒 tasks | BLOCKED | specs, design |

### Progress

░░░░░░░░░░ 0% complete (0/4 artifacts)

### Next Steps

→ Run: `/specs-continue add-payment-method`
   Creates: proposal.md

→ Or fast-forward: `/specs-ff add-payment-method`
   Creates: All artifacts at once
```

### Example 2: Halfway Done

```
## Status: user-authentication

**Schema:** spec-driven
**Created:** 2 days ago

### Artifacts

| Artifact | Status | Dependencies |
|----------|--------|--------------|
| ✓ proposal | DONE | - |
| ⏳ specs | READY | proposal |
| ⏳ design | READY | proposal |
| 🔒 tasks | BLOCKED | specs, design |

### Progress

██████░░░░ 25% complete (1/4 artifacts)

Ready to work on:
- specs (can be created now)
- design (can be created now)

### Next Steps

Option 1: Create one at a time
→ /specs-continue user-authentication
   Creates: specs.md

Option 2: Create both ready artifacts
→ /specs-continue user-authentication (twice)
   Or: /specs-ff user-authentication
```

### Example 3: Ready to Implement

```
## Status: api-rate-limiting

**Schema:** tdd
**Created:** 1 week ago

### Artifacts

| Artifact | Status | Dependencies |
|----------|--------|--------------|
| ✓ spec | DONE | - |
| ✓ tests | DONE | spec |
| ✓ implementation | DONE | tests |
| ✓ docs | DONE | implementation |
| ⏳ tasks | READY | all above |

### Progress

████████████████████ 80% complete (4/5 artifacts)

### Next Steps

→ Run: `/specs-continue api-rate-limiting`
   Creates: tasks.md (implementation checklist)

Then: `/specs-apply api-rate-limiting`
   Implements: All tasks
```

### Example 4: All Done

```
## Status: dark-mode

**Schema:** rapid
**Created:** 3 days ago

### Artifacts

| Artifact | Status | Dependencies |
|----------|--------|--------------|
| ✓ proposal | DONE | - |
| ✓ tasks | DONE | proposal |

### Progress

████████████████████ 100% complete (2/2 artifacts)

All tasks complete! ✓

### Next Steps

1. Verify implementation: `/specs-verify dark-mode`
2. Sync specs: `/specs-sync dark-mode`
3. Archive: `/specs-archive dark-mode`
```

### Example 5: Multiple Changes

```
User: /specs-status --all

## Active Changes Summary

| # | Change | Schema | Progress | Status | Age |
|---|--------|--------|----------|--------|-----|
| 1 | user-auth | spec-driven | 3/4 | ⏳ Ready | 2d |
| 2 | payments | tdd | 2/5 | 🔒 Blocked | 5d |
| 3 | dark-mode | rapid | 2/2 | ✓ Done | 3d |

**Total:** 3 active changes
**Completed:** 1 ready to archive
**In Progress:** 2 still working

### Quick Actions

Continue most recent:
→ /specs-continue user-auth

View specific change:
→ /specs-status payments

Archive completed:
→ /specs-archive dark-mode
```

### Example 6: Blocked Explanation

```
## Status: payment-gateway

**Schema:** spec-driven

### Artifacts

| Artifact | Status | Dependencies |
|----------|--------|--------------|
| ✓ proposal | DONE | - |
| ✓ specs | DONE | proposal |
| 🔒 design | BLOCKED | proposal |
| 🔒 tasks | BLOCKED | specs, design |

⚠️ Issue: design is marked blocked but proposal is done

**Investigation:**
- proposal.md exists ✓
- .change.json shows proposal.status = "done" ✓
- design should be READY

**Likely cause:**
.change.json not updated after proposal created.

**Fix:**
Update .change.json manually or re-run /specs-continue
```

## Reading Status

### How to interpret:

**0-25% (Just started):**
- Proposal ready or done
- Everything else blocked
- Action: Create proposal

**25-50% (Planning phase):**
- Proposal done
- Specs/design ready or in progress
- Action: Create specs and design

**50-75% (Ready to build):**
- Planning complete
- Tasks ready or in progress
- Action: Create tasks, start implementing

**75-99% (Building):**
- Tasks being implemented
- Some tasks done, some pending
- Action: Continue /specs-apply

**100% (Complete):**
- All artifacts done
- Tasks complete
- Action: Verify, sync, archive

## Rules

- DO show clear visual indicators
- DO calculate dependency status
- DO suggest next logical action
- DO show progress percentage
- DO handle multiple changes
- DO sort by most recently updated
- DO NOT modify any files
- DO NOT create artifacts
- DO explain blocking issues
