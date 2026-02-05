---
description: Implement tasks from tasks.md, checking them off as completed with verification
agent: specs
---

# /specs-apply

Implement tasks from a change. This is where thinking becomes doing—you'll make real code changes based on the specifications and design.

## Usage

```
/specs-apply
/specs-apply user-authentication
/specs-apply Do the next task
```

## Input

Optionally specify a change name. If omitted, use the most recently updated change (check `updatedAt` in `.change.json`).

## Workflow

1. **Select the Change**
   
   If a name is provided, use it. Otherwise:
   - Check conversation context for mentioned changes
   - Auto-select if only one active change exists
   - If ambiguous, list active changes and ask user to choose
   
   Always announce: "Using change: <name>"

2. **Verify Prerequisites**
   
   Read `specs/changes/<name>/.change.json`:
   - Check schema being used
   - Verify tasks artifact exists and has status "done"
   - If tasks missing or not done: suggest `/specs-continue` or `/specs-ff`
   
   Handle states:
   - **Blocked** (missing artifacts): "Tasks not ready yet. Run `/specs-continue <name>` or `/specs-ff <name>` first."
   - **All done** (all tasks complete): "All tasks already complete! Ready to verify or archive."
   - **Ready**: Proceed to implementation

3. **Read Context Files**
   
   Read ALL context before starting:
   - `specs/changes/<name>/proposal.md` - Why and what
   - `specs/changes/<name>/specs/<capability>/spec.md` - Detailed requirements
   - `specs/changes/<name>/design.md` - How to implement
   - `specs/changes/<name>/tasks.md` - The task list
   - `specs/config.yaml` - Project rules (if exists)
   
   **Parse specs carefully:**
   - Extract requirements (SHALL/MUST statements)
   - Note scenarios (Given/When/Then)
   - Identify affected files/components
   - Understand acceptance criteria

4. **Show Current Progress**
   
   Display:
   ```
   ## Implementing: <change-name>
   
   **Schema:** <schema-name>
   **Progress:** X/Y tasks complete
   
   ### Remaining Tasks
   - [ ] Task X: <description>
   - [ ] Task Y: <description>
   ...
   ```

5. **Implement Tasks (Loop)**
   
   For each incomplete task:
   
   a. **Announce**: "Working on task X/Y: <description>"
   
   b. **Understand the Task**:
      - Read the task description carefully
      - Check if it references specific specs
      - Note any file paths mentioned
      - Identify dependencies on previous tasks
   
   c. **Check for Context**:
      - If task references a spec requirement, re-read that requirement
      - If task references a design decision, check design.md
      - Look at existing code if modifying (don't break what works)
   
   d. **Implement**:
      - Make code changes following the design approach
      - Keep changes focused and minimal
      - Follow existing code patterns in the codebase
      - Add/update tests as specified
      
   e. **Verify**:
      - Run any tests mentioned in the task
      - Manually verify if needed (e.g., "Test the login flow")
      - Check against acceptance criteria from specs
   
   f. **Update Task**:
      - Mark complete in tasks.md: `- [ ]` → `- [x]`
      - Save the file
   
   g. **Report**: "✓ Task X complete"
   
   **Pause if:**
   - Task is unclear → Ask for clarification
   - Implementation reveals design issue → Suggest updating artifacts
   - Error or blocker encountered → Report and wait for guidance
   - User interrupts

6. **On Completion or Pause**
   
   Display:
   ```
   ## Implementation Status
   
   **Change:** <name>
   **Progress:** X/Y tasks complete
   
   ### Completed This Session
   - [x] Task X: <description>
   - [x] Task Y: <description>
   
   ### Remaining
   - [ ] Task Z: <description>
   
   **Next Steps:**
   - Continue: `/specs-apply <name>`
   - Verify: `/specs-verify <name>`
   - Archive: `/specs-archive <name>` (when all done)
   ```

## Implementation Guidelines

### Task Types

**Setup Tasks** (Phase 1):
- Install dependencies
- Create file structure
- Add configuration
- Set up databases/tables

**Implementation Tasks** (Phase 2):
- Write core logic
- Implement API endpoints
- Create UI components
- Add business rules

**Testing Tasks** (Phase 3):
- Write unit tests
- Add integration tests
- Manual testing steps
- Performance benchmarks

**Documentation Tasks** (Phase 4):
- Code comments
- API documentation
- README updates
- Deployment guides

### Reference Specs Naturally

When implementing, tie back to specifications:

```
Working on task 2.1: "Implement user authentication"

The spec says: "The system SHALL authenticate users via OAuth 2.0"
So I'll add OAuth middleware...

The design specifies using Passport.js with Google strategy,
so I'll configure that now...
```

### Code Change Principles

- **Minimal changes** - Only what's needed for the task
- **Follow patterns** - Match existing code style
- **Don't refactor** - Unless the task explicitly says to
- **Test as you go** - Don't skip verification
- **Atomic commits** - One task = one logical change

### Verification Checklist

After each task:
- [ ] Code compiles/runs without errors
- [ ] Tests pass (if specified)
- [ ] Acceptance criteria met
- [ ] No console errors
- [ ] Follows design approach

## Examples

### Example 1: Database Setup Task

```
Working on task 1.2: "Create users table migration"

Reading design.md: "Using PostgreSQL with knex.js migrations"

Implementation:
- Created migration file: migrations/20240205_create_users.js
- Added columns: id, email, password_hash, created_at
- Added indexes on email (unique)

✓ Task 1.2 complete
```

### Example 2: API Implementation

```
Working on task 2.1: "Implement POST /api/auth/login"

From spec: "WHEN user submits valid credentials THEN return JWT token"
From design: "Use bcrypt for password comparison, JWT for tokens"

Implementation:
- Added login route in routes/auth.js
- Implemented password validation with bcrypt.compare()
- Generate JWT with 24h expiry
- Return token in response body

Verification:
- Tested with valid credentials: ✓ Returns token
- Tested with invalid password: ✓ Returns 401
- Tested missing fields: ✓ Returns 400

✓ Task 2.1 complete
```

### Example 3: Unclear Task

```
Working on task 3.2: "Add error handling"

This is vague. I need clarification:
- Which specific errors? (validation, database, network?)
- What error format? (JSON, HTML, specific schema?)
- Should errors be logged? Where?

**Options:**
1. I can implement basic try-catch with generic errors
2. Wait for you to clarify the requirements
3. Check if there's more detail in the design doc I missed

What would you prefer?
```

### Example 4: Design Issue Discovered

```
Working on task 2.3: "Implement caching layer"

Issue discovered: The design specifies Redis, but I see the project 
doesn't have Redis configured and uses in-memory cache elsewhere.

**Options:**
1. Add Redis dependency (matches design)
2. Use existing in-memory cache pattern (matches codebase)
3. Update design.md to reflect in-memory approach

Which should I do?
```

## Error Handling

### If Task is Unclear

Ask specific questions:
- "Task 2.1 says 'Implement validation' - which fields need validation?"
- "Should I use the existing validation library or add a new one?"
- "What should happen when validation fails?"

### If Implementation Reveals Issue

Pause and suggest:
- "This task requires X but the design says Y - should I update the design?"
- "I notice the spec doesn't cover error cases - add to spec?"
- "The existing code uses Pattern A but design specifies Pattern B - which to use?"

### If Error Encountered

Don't guess:
- Report the error clearly
- Show relevant code/context
- Suggest options if you have ideas
- Wait for user guidance

### If Dependencies Missing

Check and report:
- "Task 2.1 depends on Task 1.3 which isn't done yet"
- "This requires the database migration from Task 1.1"
- Suggest doing dependencies first

## Guardrails

- **Read all context first** - Don't start coding blind
- **One task at a time** - Complete before moving to next
- **Verify as you go** - Don't batch all verification
- **Update immediately** - Mark task done right after implementation
- **Keep user informed** - Announce what you're doing
- **Pause on ambiguity** - Don't guess on unclear requirements
- **Suggest artifact updates** - If design/spec issues found
- **Minimal changes** - Don't refactor beyond task scope
- **Follow existing patterns** - Match codebase style
- **Don't skip tests** - If task specifies testing, do it

## Fluid Workflow Support

The apply phase supports fluid workflow:

- **Can start anytime** - Even if not all artifacts done
- **Allows interruptions** - Pause and resume later
- **Supports partial work** - Do some tasks, come back
- **Permits artifact updates** - If issues found, suggest updates
- **Interleaves with other actions** - Can run verify, then apply more

Example:
```
User: /specs-apply auth-feature
[implements 3 tasks]

User: Wait, I need to update the spec for task 4
[User updates spec]

User: /specs-apply auth-feature
[continues with updated spec]
```
