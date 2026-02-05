# Proposal: {CHANGE_NAME}

## Why

<!-- Describe the problem being solved or opportunity being addressed -->

### Current State

<!-- What is the current situation? -->

### Desired State

<!-- What should it be? -->

### Success Criteria

<!-- How will we know this is successful? -->

## What Changes

<!-- High-level summary of what will change -->

### Capabilities Added

<!-- List new capabilities being added -->

1. **Capability Name**: Brief description

### Capabilities Modified

<!-- List existing capabilities being changed -->

1. **Capability Name**: What is changing

### Capabilities Removed

<!-- List capabilities being removed -->

1. **Capability Name**: Reason for removal

## Impact

### User Impact

<!-- How will users be affected? -->

### Technical Impact

<!-- What technical changes are required? -->

### Dependencies

<!-- What depends on this change or what does this depend on? -->

### Risks

<!-- What could go wrong? -->

### Rollback Plan

<!-- How can we undo this if needed? -->

---

## Writing Guidelines

### The Capabilities Section is CRITICAL

The Capabilities section creates the **contract between proposal and specs**. It determines what spec files will be created.

**Rules:**
- List **every capability** that will have a spec file
- Use **kebab-case** names (e.g., `user-auth`, `data-export`, `payment-gateway`)
- Check `specs/` directory for existing capabilities before listing "Modified"
- Each capability listed here **MUST** have a corresponding spec file in `specs/<capability>/spec.md`

**Naming Convention:**
- ✓ `user-authentication`
- ✓ `data-export`
- ✓ `api-rate-limiting`
- ✗ `User Authentication` (use kebab-case)
- ✗ `userAuth` (use hyphens, not camelCase)

### When to Use Each Section

**Capabilities Added:**
- New features the system doesn't currently have
- Each becomes a new `specs/<capability>/spec.md` file

**Capabilities Modified:**
- Existing features changing behavior
- Only include if spec-level behavior changes (not just implementation details)
- Creates delta specs under `specs/<capability>/spec.md`

**Capabilities Removed:**
- Features being deprecated or deleted
- Include reason and migration path

### Format Best Practices

- **Keep it concise** (1-2 pages maximum)
- **Focus on "why" not "how"** (implementation details belong in design.md)
- **Use bullet lists** for clarity
- **Mark breaking changes** with **BREAKING** label
- **Be specific** about what changes (avoid vague statements)

### Example

```markdown
## What Changes

### Capabilities Added

1. **user-export**: Users can export their data in CSV and JSON formats
2. **admin-dashboard**: Administrators can view system metrics and user activity

### Capabilities Modified

1. **authentication**: Adding OAuth 2.0 support alongside existing email/password **BREAKING**
2. **rate-limiting**: Increasing limits for premium users

### Capabilities Removed

1. **legacy-xml-api**: Deprecated XML endpoints (superseded by JSON API)
```

### Sections You Can Skip

If a section doesn't apply, omit it:
- No capabilities being added? Skip "Capabilities Added"
- No breaking changes? Don't mention breaking changes
- No risks identified? Briefly state "No significant risks identified"

---

**Created**: {DATE}
**Status**: Draft
