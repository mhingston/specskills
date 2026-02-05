# SpecSkills - Native GitHub Copilot Spec-Driven Development

A spec-driven development workflow using native GitHub Copilot standards (.github/agents/, prompts, copilot-instructions.md). Inspired by OpenSpec but implemented purely with Copilot's native extension points.

## Quick Start

```bash
# 0. Initialize project context (first time only)
/specs-project-init

# 1. First time? Take the guided tour
/specs-onboard

# 2. Explore an idea
/specs-explore I want to add user authentication

# 3. Create a new change
/specs-new user-authentication

# 4. Generate all artifacts quickly
/specs-ff

# 5. Implement the tasks
/specs-apply

# 6. Verify the implementation
/specs-verify

# 7. Archive when complete
/specs-archive
```

## Install Into an Existing Repo

Run the setup wizard to install the workflow:

```bash
npx specskills
```

Options:
- `--yes` or `-y` to use defaults without prompts
- `--dry-run` to preview without making changes

## Directory Structure

```
specs/
├── config.yaml                    # Project configuration (optional)
├── .github/
│   ├── agents/                    # Agent definitions
│   │   └── specs.agent.md
│   ├── copilot-instructions.md   # Repo-level Copilot instructions
│   └── prompts/                   # Slash commands
│       ├── explore.prompt.md
│       ├── new.prompt.md
│       ├── status.prompt.md
│       ├── continue.prompt.md
│       ├── ff.prompt.md
│       ├── apply.prompt.md
│       ├── verify.prompt.md
│       ├── sync.prompt.md
│       ├── archive.prompt.md
│       ├── bulk-archive.prompt.md
│       ├── validate.prompt.md
│       ├── project-init.prompt.md
│       └── onboard.prompt.md
├── schemas/                       # Workflow schemas
│   ├── spec-driven.yaml          # Default: proposal→specs→design→tasks
│   └── tdd.yaml                  # Alternative: TDD workflow
├── templates/                     # Artifact templates
│   ├── proposal.md
│   ├── spec.md
│   ├── design.md
│   └── tasks.md
├── specs/                         # Source of truth - current capabilities (capability specs)
└── changes/                       # Active changes
    └── archive/                   # Completed changes
```

## Commands

All commands use `/` prefix (native Copilot slash commands):

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/specs-explore` | Think through ideas without creating files | Early ideation |
| `/specs-new <name>` | Create a new change workspace | Starting work |
| `/specs-status` | Check current change status | Any time |
| `/specs-continue` | Generate the next ready artifact | Step-by-step |
| `/specs-ff` | Fast-forward all artifacts | Quick setup |
| `/specs-apply` | Implement tasks from tasks.md | Building |
| `/specs-verify` | Verify implementation matches specs | Quality check |
| `/specs-sync` | Merge specs to main specs/ | Before archiving |
| `/specs-archive` | Complete and archive change | When done |
| `/specs-bulk-archive` | Archive multiple completed changes | Batch cleanup |
| `/specs-validate` | Validate specs/changes format | Before commit |
| `/specs-project-init` | Generate/update PROJECT.md | Project setup |
| `/specs-onboard` | Guided tutorial for first-time users | Learning |

Or use natural language with @specs agent:
```
@specs Create a new change for user authentication
@specs What's the status?
@specs Continue to the next step
```

## Workflow

The spec-driven workflow follows this artifact dependency graph:

```
proposal → specs → design → tasks → apply → verify → archive
   ↓          ↓       ↓       ↓
 (why)      (what)  (how)  (steps)
```

1. **Proposal** - Define why we're making this change
2. **Specs** - Specify what capabilities are added/modified/removed
3. **Design** - Document how to implement technically
4. **Tasks** - Create implementation checklist
5. **Apply** - Execute the tasks
6. **Verify** - Confirm implementation matches specs
7. **Sync** - Merge specs to main specs/ folder
8. **Archive** - Complete the change

## Change Workspace

Each change lives in `specs/changes/{name}/`:

```
changes/user-authentication/
├── .change.json          # State file tracking artifacts
├── proposal.md           # Why/What/Impact
├── specs/                # Capability specifications
│   ├── capability-1/
│   │   └── spec.md
│   └── capability-2/
│       └── spec.md
├── design.md             # Technical architecture
└── tasks.md              # Implementation checklist
```

## Spec Folder Layout

Main specs live at the repo root under `specs/`, one capability per folder:

```
specs/
├── user-authentication/
│   └── spec.md
├── payment-processing/
│   └── spec.md
└── changes/
```

Change-local specs follow the same pattern under the change workspace:

```
specs/changes/{name}/specs/
├── user-authentication/
│   └── spec.md
└── payment-processing/
    └── spec.md
```

## Delta Spec Format

When modifying existing capabilities, use this format:

```markdown
## ADDED Requirements
### Requirement: New Feature
Description of what is being added.

## MODIFIED Requirements
### Requirement: Existing Feature
Updated description of the requirement.

## REMOVED Requirements
### Requirement: Old Feature
**Reason:** Why this is being removed
**Migration:** How to migrate

## RENAMED Requirements
- **FROM:** `Old Requirement Name`
- **TO:** `New Requirement Name`
**Reason:** Why the rename
```

## Artifact Status

Each artifact has one of three statuses:

- **blocked** - Dependencies not complete, cannot be created yet
- **ready** - All dependencies done, safe to create
- **done** - Artifact created and complete

Status flows: `blocked → ready → done`

## Configuration

Project-wide settings can be customized in `specs/config.yaml`:

```yaml
schema: spec-driven

context: |
  Project-specific context for all artifacts

rules:
  specs:
    - Include error scenarios for all requirements
  tasks:
    - Break tasks into 15-60 minute chunks

defaults:
  archiveOnComplete: true
  syncBeforeArchive: true
```

Additional conventions are defined in `.github/copilot-instructions.md`.

## Schemas

Define custom workflows in `specs/schemas/`:

**Default: spec-driven**
```yaml
artifacts:
  - id: proposal
    requires: []
  - id: specs
    requires: [proposal]
  - id: design
    requires: [proposal]
  - id: tasks
    requires: [specs, design]
```

## Requirements Format

Use RFC-style keywords:

- **SHALL** - Mandatory requirement
- **MUST** - Absolute requirement
- **SHOULD** - Recommendation

Example:
```markdown
### Requirement: User Login
The system SHALL authenticate users via OAuth 2.0.

**Acceptance Criteria:**
- Users can log in with Google, GitHub, or email
- Session expires after 24 hours of inactivity
- Failed attempts are rate-limited
```

## Scenarios

Use Given/When/Then format:

```markdown
#### Scenario: Successful Login
**Given** a registered user with valid credentials
**When** they submit the login form
**Then** they are authenticated and redirected to dashboard
**And** a session is created
```

## Best Practices

1. **Always check status** before continuing (`/specs-status`)
2. **Complete one artifact at a time** unless using fast-forward
3. **Review specs** before implementing tasks
4. **Verify implementation** matches specs before archiving
5. **Archive promptly** when changes are complete
6. **Keep specs focused** - one capability per file
7. **Use checkboxes** consistently in task lists

## Comparison with OpenSpec

| Feature | OpenSpec | Specs (Native Copilot) |
|---------|----------|----------------------|
| CLI Tool | Required (@fission-ai/openspec) | Not needed |
| AI Tools | 20+ adapters | Native Copilot only |
| Validation | Zod schemas | Copilot-enforced conventions |
| Commands | `/opsx:` | `/specs-` |
| Agents | Tool-specific | `.github/agents/*.agent.md` standard |
| Extensibility | Custom schemas via CLI | YAML schema files |

## Migration from OpenSpec

1. Copy `openspec/specs/` → `specs/`
2. Copy `openspec/changes/` → `specs/changes/`
3. Convert `.openspec.yaml` → `.change.json`
4. Update to use `/specs-*` commands instead of `/opsx:`

## Contributing

This is a native GitHub Copilot implementation using:
- `.github/agents/*.agent.md` for agent definitions
- `.github/prompts/*.prompt.md` for slash commands
- `.github/copilot-instructions.md` for repo context
- YAML schemas for workflow definitions

## License

MIT
