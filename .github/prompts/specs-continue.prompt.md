---
description: Continue a change by creating exactly one next-ready artifact (dependency-respecting)
agent: specs
---

# /specs-continue

Continue a change by creating EXACTLY ONE artifact following the dependency graph defined in the schema.

## Usage

```
/specs-continue
/specs-continue my-change-name
/specs-continue Create the proposal
```

## Workflow

1. **Determine Target Change**
   - If user specified name, use it
   - Else use most recent `.change.json` (check `updatedAt` timestamp)
   - If ambiguous or multiple active changes, ask which one to work on
   - If no changes exist, suggest creating one with `/specs-new`

2. **Read State Files**
   - `specs/changes/<name>/.change.json` - Current state
   - `specs/schemas/<schema>.yaml` - Dependency graph definition
   - If `config.yaml` exists, read for project-specific rules

3. **Compute Status from Dependencies**
   - Parse artifact dependencies from schema
   - Check file existence for each artifact output path
   - Determine status: blocked → ready → done
   
   **Status Logic:**
   - **blocked**: One or more dependencies not "done"
   - **ready**: All dependencies are "done", but artifact doesn't exist
   - **done**: Artifact file exists (regardless of .change.json status)

4. **Choose the FIRST Ready Artifact**
   - Follow schema sequence order (proposal → specs → design → tasks)
   - Select first artifact with status "ready"
   - If none ready:
     - If all artifacts done → suggest `/specs-apply` or `/specs-archive`
     - If blocked → explain what's blocked and why

5. **Read Dependency Artifacts for Context**
   - Read all completed artifacts that this one depends on
   - Parse their content to understand the change
   - Use their content to inform the new artifact

6. **Write the Artifact**
   - Read template from `specs/templates/{artifact}.md`
   - Fill based on user goal + dependency context
   - Follow template guidelines exactly
   - If critical info missing, ask up to 3 targeted questions first
   - Write to the output path defined in schema

7. **Update .change.json**
   - Update `updatedAt` timestamp
   - Mark artifact status as "done"
   - Add `completedAt` timestamp
   - Update dependent artifacts to "ready" if all their deps are now done
   - Save the file

8. **Print Progress Report**
   - Show which artifact was created
   - Show file path
   - Show current progress (N/M artifacts complete)
   - Indicate what became ready next
   - Suggest next command

## Schema-Aware Behavior

### spec-driven Schema Sequence:

```
proposal (no deps)
    ↓
    ├──→ specs (depends on proposal)
    │       ↓
    │       (parallel with design)
    │
    └──→ design (depends on proposal)
            ↓
            (both complete)
            ↓
            tasks (depends on specs AND design)
            ↓
            apply-ready
```

**Artifact Order:**
1. **proposal** → Always ready first
2. **specs** + **design** → Both become ready when proposal is done
3. **tasks** → Becomes ready when BOTH specs and design are done

### tdd Schema Sequence:

```
spec (no deps)
    ↓
    tests (depends on spec)
    ↓
    implementation (depends on spec, tests)
    ↓
    docs (depends on spec, implementation)
    ↓
    tasks (depends on spec, tests, implementation, docs)
    ↓
    apply-ready
```

**Artifact Order:**
1. **spec** → Always ready first
2. **tests** → Ready when spec is done
3. **implementation** → Ready when spec AND tests are done
4. **docs** → Ready when spec AND implementation are done
5. **tasks** → Ready when all above are done

## Artifact Creation Guidelines

### Creating proposal.md

**Dependencies:** None

**Steps:**
1. Ask user about the change if not clear from context
2. Fill in the template sections:
   - **Why**: Problem being solved (1-2 sentences)
   - **Current State**: What's happening now
   - **Desired State**: What should happen
   - **Success Criteria**: How we'll know it's done
3. **CRITICAL - Capabilities Section:**
   - List every capability that will have a spec file
   - Use kebab-case names (e.g., `user-auth`, `data-export`)
   - These names become folders: `specs/<capability>/spec.md`
   - Check `specs/specs/` for existing capabilities

**Example:**
```markdown
## Capabilities Added
1. **user-export**: Users can export their data
2. **admin-dashboard**: Admin analytics view

## Capabilities Modified
1. **authentication**: Adding OAuth support **BREAKING**
```

### Creating specs/<capability>/spec.md

**Dependencies:** proposal.md

**Steps:**
1. Read proposal.md to find Capabilities section
2. For each capability listed:
   - Use the **exact kebab-case name** from proposal
   - Create folder: `specs/changes/<name>/specs/<capability>/`
   - Create file: `specs/changes/<name>/specs/<capability>/spec.md`
3. For **new capabilities**:
   - Write full spec with ADDED Requirements
4. For **modified capabilities**:
   - Read existing spec from `specs/specs/<capability>/spec.md`
   - Create **delta spec** with MODIFIED/ADDED/REMOVED sections
   - **CRITICAL**: Copy ENTIRE requirement blocks when modifying
5. Follow template guidelines (see `specs/templates/spec.md`)

**Delta Format:**
```markdown
## ADDED Requirements
#### Requirement: New Feature
The system SHALL ...

#### Scenario: Basic case
**Given** ...
**When** ...
**Then** ...

## MODIFIED Requirements
#### Requirement: Existing Feature
(Copy full requirement from main spec, then modify)

## REMOVED Requirements
#### Requirement: Old Feature
**Reason**: Why being removed
**Migration**: How to migrate
```

### Creating design.md

**Dependencies:** proposal.md (and optionally specs)

**Steps:**
1. Read proposal.md for context (Why, What Changes)
2. Read specs if available (detailed requirements)
3. Document technical approach:
   - **Overview**: Brief summary
   - **Architecture**: Components and data flow (use ASCII diagrams)
   - **Decisions**: Key choices with rationale
     - Context: What are we deciding?
     - Decision: What was chosen?
     - Rationale: Why?
     - Alternatives: What else was considered?
4. Follow template guidelines (see `specs/templates/design.md`)

**Decision Format:**
```markdown
### Decision: Use Redis for caching

**Context:** Need to cache API responses to reduce database load

**Decision:** Use Redis with 1-hour TTL

**Rationale:** 
- Team familiarity with Redis
- Supports automatic expiration
- Can scale horizontally

**Alternatives Considered:**
- In-memory cache: Doesn't scale across instances
- Memcached: No persistence, less flexible
```

### Creating tasks.md

**Dependencies:** specs AND design

**Steps:**
1. Read all specs to understand WHAT needs to be built
2. Read design.md to understand HOW to build it
3. Break implementation into small, specific tasks:
   - Use checkbox format: `- [ ] {number} {description}`
   - Group by phase or component
   - Reference specific files and specs
   - Include verification steps
4. Follow template guidelines (see `specs/templates/tasks.md`)

**Task Format:**
```markdown
### Phase 1: Setup
- [ ] 1.1 Install Redis client library
- [ ] 1.2 Configure Redis connection

### Phase 2: Core Implementation
- [ ] 2.1 Implement cache middleware
- [ ] 2.2 Add cache to user endpoints

### Phase 3: Testing
- [ ] 3.1 Write unit tests for cache layer
- [ ] 3.2 Test cache expiration
```

## Error Handling

- **If no artifacts are ready:**
  - Show status table of all artifacts
  - Explain which dependencies are blocking each artifact
  - Suggest running `/specs-status` for full details

- **If artifact already exists:**
  - Ask if user wants to:
    1. Overwrite (replace existing)
    2. Skip (leave as-is)
    3. View (show current content)

- **If template is missing:**
  - Report error: "Template not found: specs/templates/{artifact}.md"
  - Use minimal generic structure
  - Suggest checking installation

- **If dependencies are unclear:**
  - Ask user for clarification
  - Show what we know from existing artifacts
  - Don't guess on critical information

## Guardrails

- **Create ONE artifact per invocation** (never multiple)
- **Always read dependency artifacts** before creating a new one
- **Never skip artifacts** or create out of order
- **If context is unclear**, ask the user before creating
- **Verify the artifact file exists** after writing before marking progress
- **Use the schema's artifact sequence**, don't assume specific artifact names
- **Follow template guidelines** in the Writing Guidelines section
- **Update .change.json atomically** (read, modify, write)

## Output Format

After creating an artifact:

```
## ✓ Created: {artifact-id}

**File:** specs/changes/{name}/{path}
**Schema:** {schema-name}
**Progress:** {N}/{M} artifacts complete

### What's Next

✓ proposal (done)
✓ specs (done)
✓ design (done)
⏳ tasks (ready) ← Next

**Suggested next step:**
- Continue: /specs-continue
- Fast-forward: /specs-ff
- View status: /specs-status
```

If all artifacts complete:

```
## ✓ All Artifacts Complete

**Change:** {name}
**Schema:** {schema-name}

All artifacts created! Ready for implementation.

**Next steps:**
- Start implementing: /specs-apply
- Archive change: /specs-archive
```
