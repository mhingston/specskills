---
description: Create a new change workspace with schema selection support
agent: specs
---

# /specs-new

Create a new change workspace with the proper folder structure and state file. This initializes the change but does not create any artifacts yet.

## Usage

```
/specs-new user-authentication
/specs-new add-payment-gateway --schema tdd
/specs-new my-feature --schema rapid
/specs-new
```

## Parameters

- `name` (required if not provided interactively): The change name in kebab-case format
- `--schema <name>` (optional): The workflow schema to use. If omitted, uses default from config.yaml or "spec-driven"
- `--list-schemas` (optional): Show available schemas and exit

## Schema Resolution Order

When determining which schema to use:

1. **CLI flag**: `--schema <name>` (highest priority)
2. **Config file**: `schema` field in `specs/config.yaml`
3. **Default**: `"spec-driven"` (lowest priority)

## Instructions

1. **Get Change Name**
   
   If name provided as argument, use it.
   
   If no name provided:
   - Ask: "What would you like to call this change?"
   - Provide guidance: "Use kebab-case (e.g., 'add-user-auth', 'fix-login-bug')"
   - Derive from description if user gives a sentence

2. **Validate the Name**
   
   Check:
   - Kebab-case format: `^[a-z0-9]+(-[a-z0-9]+)*$`
   - No spaces or special characters except hyphens
   - Unique within `specs/changes/` (check for existing)
   
   **Invalid name handling:**
   ```
   Error: "Add User Auth" is not valid
   
   Names must be kebab-case:
   ✓ add-user-auth
   ✓ fix-login-bug  
   ✓ update-api-v2
   
   ✗ Add User Auth (spaces)
   ✗ addUserAuth (camelCase)
   ✗ add_user_auth (underscores)
   
   Try: /specs-new add-user-auth
   ```

3. **Determine Schema**
   
   **Option A - Explicit flag:**
   ```
   /specs-new my-feature --schema tdd
   ```
   → Use "tdd" schema
   
   **Option B - Config file:**
   Check `specs/config.yaml`:
   ```yaml
   schema: rapid
   ```
   → Use "rapid" schema
   
   **Option C - Interactive selection:**
   If no schema specified and no config default:
   ```
   Available schemas:
   
   1. spec-driven (default)
      proposal → specs → design → tasks
      Best for: Most features, comprehensive planning
   
   2. tdd
      spec → tests → implementation → docs → tasks
      Best for: Test-driven development
   
   3. rapid
      proposal → tasks
      Best for: Quick fixes, minimal overhead
   
   Which schema would you like? (1/2/3)
   ```
   
   **Option D - Default:**
   → Use "spec-driven"

4. **Validate Schema**
   
   Check `specs/schemas/{schema}.yaml` exists:
   - If yes: Proceed
   - If no: Report error and list available schemas
   
   ```
   Error: Schema "custom" not found
   
   Available schemas:
   - spec-driven
   - tdd
   - rapid
   
   Create new schema: Add YAML file to specs/schemas/
   ```

5. **Create Directory Structure**
   
   Create:
   ```
   specs/changes/{name}/
   ├── .change.json
   ├── proposal.md (ready to create)
   ├── specs/ (folder)
   ├── design.md (blocked) [if schema has design]
   └── tasks.md (blocked) [if schema has tasks]
   ```
   
   Note: Structure depends on schema. Some schemas may have:
   - Different artifact types
   - Different folder structure
   - Additional files

6. **Create .change.json State File**
   
   ```json
   {
     "name": "{name}",
     "schema": "{schema-name}",
     "createdAt": "{ISO_TIMESTAMP}",
     "updatedAt": "{ISO_TIMESTAMP}",
     "artifacts": {
       "{artifact-1}": {
         "status": "ready",
         "path": "{artifact-1-path}"
       },
       "{artifact-2}": {
         "status": "blocked",
         "path": "{artifact-2-path}"
       }
     }
   }
   ```
   
   Populate artifacts from schema definition:
   - Artifacts with no dependencies → status "ready"
   - Artifacts with dependencies → status "blocked"

7. **Confirm Creation**
   
   Display:
   ```
   ## ✓ Change Created: {name}
   
   **Location:** specs/changes/{name}/
   **Schema:** {schema-name}
   
   **Artifacts:**
   ⏳ {artifact-1} (ready) ← Start here
   🔒 {artifact-2} (blocked)
   🔒 {artifact-3} (blocked)
   
   **Next Steps:**
   - Create first artifact: /specs-continue {name}
   - Or fast-forward all: /specs-ff {name}
   - Check status anytime: /specs-status
   ```

## Schema-Aware Creation

### spec-driven Schema

```
specs/changes/{name}/
├── .change.json
├── proposal.md (ready)
├── specs/ (blocked until proposal done)
├── design.md (blocked until proposal done)
└── tasks.md (blocked until specs and design done)
```

**Artifact statuses:**
- proposal: ready (no deps)
- specs: blocked (requires proposal)
- design: blocked (requires proposal)
- tasks: blocked (requires specs + design)

### tdd Schema

```
specs/changes/{name}/
├── .change.json
├── spec.md (ready)
├── tests.md (blocked until spec done)
├── implementation.md (blocked until tests done)
├── docs.md (blocked until implementation done)
└── tasks.md (blocked until all above done)
```

**Artifact statuses:**
- spec: ready
- tests: blocked (requires spec)
- implementation: blocked (requires tests)
- docs: blocked (requires implementation)
- tasks: blocked (requires all)

### rapid Schema

```
specs/changes/{name}/
├── .change.json
├── proposal.md (ready)
└── tasks.md (blocked until proposal done)
```

**Artifact statuses:**
- proposal: ready
- tasks: blocked (requires proposal)

## Examples

### Example 1: Default Schema

```
User: /specs-new user-authentication

Checking config.yaml... no default schema
Using default: spec-driven

## ✓ Change Created: user-authentication

**Location:** specs/changes/user-authentication/
**Schema:** spec-driven

**Artifacts:**
⏳ proposal (ready) ← Start here
🔒 specs (blocked)
🔒 design (blocked)
🔒 tasks (blocked)

**Next Steps:**
/specs-continue user-authentication
```

### Example 2: Explicit Schema

```
User: /specs-new payment-api --schema tdd

Validating schema: tdd ✓

## ✓ Change Created: payment-api

**Location:** specs/changes/payment-api/
**Schema:** tdd

**Artifacts:**
⏳ spec (ready) ← Start here
🔒 tests (blocked)
🔒 implementation (blocked)
🔒 docs (blocked)
🔒 tasks (blocked)

**Next Steps:**
/specs-continue payment-api
```

### Example 3: Config Default

```
specs/config.yaml contains:
  schema: rapid

User: /specs-new hotfix-login

Using schema from config: rapid

## ✓ Change Created: hotfix-login

**Location:** specs/changes/hotfix-login/
**Schema:** rapid

**Artifacts:**
⏳ proposal (ready) ← Start here
🔒 tasks (blocked)

**Next Steps:**
/specs-continue hotfix-login
```

### Example 4: Interactive Schema Selection

```
User: /specs-new new-feature

No schema specified and no config default.

Available schemas:

1. spec-driven (default)
   proposal → specs → design → tasks
   Best for: Most features, comprehensive planning

2. tdd
   spec → tests → implementation → docs → tasks
   Best for: Test-driven development

3. rapid
   proposal → tasks
   Best for: Quick fixes, minimal overhead

Which schema would you like? 2

Selected: tdd

## ✓ Change Created: new-feature

**Location:** specs/changes/new-feature/
**Schema:** tdd

**Artifacts:**
⏳ spec (ready) ← Start here
...
```

### Example 5: Invalid Schema

```
User: /specs-new my-feature --schema custom

Error: Schema "custom" not found

Available schemas:
- spec-driven (specs/schemas/spec-driven.yaml)
- tdd (specs/schemas/tdd.yaml)

Create a custom schema:
1. Copy an existing schema: cp specs/schemas/spec-driven.yaml specs/schemas/custom.yaml
2. Edit specs/schemas/custom.yaml to define your workflow
3. Run again: /specs-new my-feature --schema custom
```

### Example 6: Name Correction

```
User: /specs-new Add User Auth

Error: "Add User Auth" is not a valid name

Names must be kebab-case (lowercase with hyphens):
✓ add-user-auth
✓ fix-login-bug
✓ update-api-v2

✗ Add User Auth (spaces, uppercase)
✗ addUserAuth (camelCase)
✗ add_user_auth (underscores)

Suggested: add-user-auth

Try: /specs-new add-user-auth
```

## Error Handling

### Name Already Exists

```
Error: Change "user-auth" already exists

Location: specs/changes/user-auth/
Created: 2026-02-05

Options:
1. Continue existing: /specs-continue user-auth
2. Choose different name: /specs-new user-auth-v2
3. Archive first: /specs-archive user-auth
```

### Invalid Schema

```
Error: Schema "foo" not found

Available schemas:
- spec-driven
- tdd
- rapid

To create "foo":
- Add specs/schemas/foo.yaml
- Or choose from available schemas above
```

### Schema File Missing

```
Error: Schema file missing

Schema "custom" is referenced in config.yaml but file not found:
- Missing: specs/schemas/custom.yaml

Fix:
- Create the schema file, or
- Update config.yaml to use existing schema
```

## Schema Discovery

To see all available schemas:

```
/specs-new --list-schemas

Available schemas in specs/schemas/:

1. spec-driven (default)
   File: specs/schemas/spec-driven.yaml
   Description: Standard spec-driven workflow
   Artifacts: proposal → specs → design → tasks

2. tdd
   File: specs/schemas/tdd.yaml
   Description: Test-driven development workflow
   Artifacts: spec → tests → implementation → docs → tasks

3. rapid
   File: specs/schemas/rapid.yaml
   Description: Fast iteration workflow
   Artifacts: proposal → tasks

4. security-review (custom)
   File: specs/schemas/security-review.yaml
   Description: Security-focused workflow
   Artifacts: threat-model → review → tasks
```

## Rules

- DO accept --schema flag for explicit schema selection
- DO read default schema from config.yaml
- DO prompt interactively if no schema specified
- DO validate schema exists before creating change
- DO create artifact structure based on schema definition
- DO set correct initial statuses (ready/blocked) per dependencies
- DO validate name is kebab-case and unique
- DO NOT create change if schema invalid
- DO NOT create artifacts, only the workspace
- DO NOT silently use wrong schema

## Best Practices

1. **Use explicit schema** for clarity: `/specs-new feature --schema tdd`
2. **Set default in config** for consistency: `schema: spec-driven`
3. **Choose schema based on work type:**
   - New feature → spec-driven
   - Bug fix → rapid
   - Refactoring → tdd
4. **Create custom schemas** for team-specific workflows
5. **Validate schema exists** before referencing in config
