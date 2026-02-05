---
description: Guided onboarding through the complete specs workflow with real codebase work
agent: specs
---

# /specs-onboard

Guide the user through their first complete specs workflow cycle. This is a teaching experience—you'll do real work in their codebase while explaining each step.

**Time:** ~15-20 minutes

## Preflight Check

Before starting, verify the specs directory exists:
- Check if `specs/` directory exists
- If not, suggest running setup first
- Check if `specs/schemas/` has at least one schema
- Verify templates exist in `specs/templates/`

If setup incomplete:
> The specs workflow isn't fully set up yet. Please ensure the specs/ directory structure is in place.

## Phase 1: Welcome

Display:

```
## Welcome to Specs Workflow!

I'll walk you through a complete change cycle—from idea to implementation—using a real task in your codebase. Along the way, you'll learn the workflow by doing it.

**What we'll do:**
1. Pick a small, real task in your codebase
2. Explore the problem briefly  
3. Create a change (the container for our work)
4. Build the artifacts: proposal → specs → design → tasks
5. Implement the tasks
6. Archive the completed change

**Time:** ~15-20 minutes

Let's start by finding something to work on.
```

## Phase 2: Task Selection

### Codebase Analysis

Scan the codebase for small improvement opportunities. Look for:

1. **TODO/FIXME comments** - Search for `TODO`, `FIXME`, `HACK`, `XXX` in code files
2. **Missing error handling** - catch blocks that swallow errors, risky operations without try-catch
3. **Functions without tests** - Cross-reference src/ with test directories
4. **Type issues** - `any` types in TypeScript files (`: any`, `as any`)
5. **Debug artifacts** - `console.log`, `console.debug`, `debugger` statements in non-debug code
6. **Missing validation** - User input handlers without validation

Check recent git activity:
```bash
git log --oneline -10 2>/dev/null || echo "No git history"
```

### Present Suggestions

From your analysis, present 3-4 specific suggestions:

```
## Task Suggestions

Based on scanning your codebase, here are some good starter tasks:

**1. [Most promising task]**
   Location: `src/path/to/file.ts:42`
   Scope: ~1-2 files, ~20-30 lines
   Why it's good: [brief reason]

**2. [Second task]**
   Location: `src/another/file.ts`
   Scope: ~1 file, ~15 lines
   Why it's good: [brief reason]

**3. [Third task]**
   Location: [location]
   Scope: [estimate]
   Why it's good: [brief reason]

**4. Something else?**
   Tell me what you'd like to work on.

Which task interests you? (Pick a number or describe your own)
```

**If nothing found:** Fall back to asking what the user wants to build:
> I didn't find obvious quick wins in your codebase. What's something small you've been meaning to add or fix?

### Scope Guardrail

If the user picks or describes something too large (major feature, multi-day work):

```
That's a valuable task, but it's probably larger than ideal for your first specs run-through.

For learning the workflow, smaller is better—it lets you see the full cycle without getting stuck in implementation details.

**Options:**
1. **Slice it smaller** - What's the smallest useful piece of [their task]? Maybe just [specific slice]?
2. **Pick something else** - One of the other suggestions, or a different small task?
3. **Do it anyway** - If you really want to tackle this, we can. Just know it'll take longer.

What would you prefer?
```

Let the user override if they insist—this is a soft guardrail.

## Phase 3: Explore Demo

Once a task is selected, briefly demonstrate explore mode:

```
Before we create a change, let me quickly show you **explore mode**—it's how you think through problems before committing to a direction.
```

Spend 1-2 minutes investigating the relevant code:
- Read the file(s) involved
- Draw a quick ASCII diagram if helpful
- Note any considerations

```
## Quick Exploration

[Your brief analysis—what you found, any considerations]

┌─────────────────────────────────────────┐
│   [Optional: ASCII diagram if helpful]  │
└─────────────────────────────────────────┘

Explore mode (/specs-explore) is for this kind of thinking—investigating before implementing. You can use it anytime you need to think through a problem.

Now let's create a change to hold our work.
```

**PAUSE** - Wait for user acknowledgment before proceeding.

## Phase 4: Create the Change

**EXPLAIN:**
```
## Creating a Change

A "change" in specs is a container for all the thinking and planning around a piece of work. It lives in `specs/changes/<name>/` and holds your artifacts—proposal, specs, design, tasks.

Let me create one for our task.
```

**DO:** Create the change with a derived kebab-case name:

1. Convert task description to kebab-case (e.g., "add user auth" → `add-user-auth`)
2. Check if name already exists in `specs/changes/`
3. Create directory structure:
   ```
   specs/changes/{name}/
   ├── .change.json
   ├── proposal.md (ready to create)
   ├── specs/ (folder)
   ├── design.md (blocked)
   └── tasks.md (blocked)
   ```

4. Create `.change.json`:
   ```json
   {
     "name": "{name}",
     "schema": "spec-driven",
     "createdAt": "{ISO_TIMESTAMP}",
     "updatedAt": "{ISO_TIMESTAMP}",
     "artifacts": {
       "proposal": {
         "status": "ready",
         "path": "proposal.md"
       },
       "specs": {
         "status": "blocked",
         "path": "specs/"
       },
       "design": {
         "status": "blocked",
         "path": "design.md"
       },
       "tasks": {
         "status": "blocked",
         "path": "tasks.md"
       }
     }
   }
   ```

**SHOW:**
```
Created: `specs/changes/{name}/`

The folder structure:
```
specs/changes/{name}/
├── .change.json     ← Tracks our progress
├── proposal.md      ← Why we're doing this (empty, we'll fill it)
├── specs/           ← Detailed requirements (empty)
├── design.md        ← How we'll build it (empty)
└── tasks.md         ← Implementation checklist (empty)
```

Now let's fill in the first artifact—the proposal.
```

## Phase 5: Proposal

**EXPLAIN:**
```
## The Proposal

The proposal captures **why** we're making this change and **what** it involves at a high level. It's the "elevator pitch" for the work.

I'll draft one based on our task.
```

**DO:** Draft the proposal content (don't save yet):

1. Read the task context from Phase 2
2. Fill in template from `specs/templates/proposal.md`:
   - **Why**: 1-2 sentences explaining the problem/opportunity
   - **Current State**: What exists now
   - **Desired State**: What should exist
   - **What Changes**: Bullet points of what will be different
   - **Capabilities**: List 1-2 capabilities this touches

**SHOW:**
```
Here's a draft proposal:

---

## Why

[1-2 sentences explaining the problem/opportunity]

## Current State

[What exists now]

## Desired State

[What should exist]

## What Changes

- [Specific change 1]
- [Specific change 2]

## Capabilities

### Capabilities Added
- `{capability-name}`: [brief description]

### Capabilities Modified
- [None]

## Impact

- `src/path/to/file.ts`: [what changes]
- [other files if applicable]

---

Does this capture the intent? I can adjust before we save it.
```

**PAUSE** - Wait for user approval/feedback.

After approval, save the proposal to `specs/changes/{name}/proposal.md`

Update `.change.json`:
- Set proposal.status to "done"
- Set specs.status and design.status to "ready"
- Update updatedAt

**SHOW:**
```
Proposal saved. This is your "why" document—you can always come back and refine it as understanding evolves.

Next up: specs.
```

## Phase 6: Specs

**EXPLAIN:**
```
## Specs

Specs define **what** we're building in precise, testable terms. They use a requirement/scenario format that makes expected behavior crystal clear.

For a small task like this, we might only need one spec file.
```

**DO:** Create the spec file:

1. Create folder: `specs/changes/{name}/specs/<capability>/`
2. Create file: `specs/changes/{name}/specs/<capability>/spec.md`
3. Draft content:
   - **Purpose**: Brief description
   - **ADDED Requirements**: 1-2 requirements with scenarios
   - Follow `specs/templates/spec.md` format

**SHOW:**
```
Here's the spec:

---

## Purpose

[Brief description of this capability]

## ADDED Requirements

#### Requirement: [Name]

The system SHALL [description of what the system should do].

#### Scenario: [Scenario name]

**Given** [initial context]
**When** [event occurs]  
**Then** [expected outcome]
**And** [additional outcome if needed]

---

This format—Given/When/Then—makes requirements testable. You can literally read them as test cases.
```

**PAUSE** - Wait for user to approve or ask questions.

After approval, save the file.

Update `.change.json`:
- Set specs.status to "done"
- If design is also done, set tasks.status to "ready"

## Phase 7: Design

**EXPLAIN:**
```
## Design

The design captures **how** we'll build it—technical decisions, tradeoffs, approach.

For small changes, this might be brief. That's fine—not every change needs deep design discussion.
```

**DO:** Draft design.md:

1. Read proposal for context
2. Read specs for requirements
3. Draft content:
   - **Overview**: Brief technical summary
   - **Decisions**: 1-2 key decisions with rationale
   - **Files to Modify**: Specific files

**SHOW:**
```
Here's the design:

---

## Overview

[Brief technical summary]

## Decisions

### Decision: [Key decision]

**Context:** [What is this about?]

**Decision:** [What was decided]

**Rationale:** [Why this choice]

**Alternatives Considered:**
- [Option A]: [Why not chosen]

## Files to Modify

- `src/path/to/file.ts`: [What will change]

---

For a small task, this captures the key decisions without over-engineering.
```

**PAUSE** - Wait for approval.

After approval, save to `specs/changes/{name}/design.md`

Update `.change.json`:
- Set design.status to "done"
- Set tasks.status to "ready"

## Phase 8: Tasks

**EXPLAIN:**
```
## Tasks

Finally, we break the work into implementation tasks—checkboxes that drive the apply phase.

These should be small, clear, and in logical order.
```

**DO:** Generate tasks based on specs and design:

1. Read specs and design
2. Break into 3-7 small tasks
3. Use checkbox format: `- [ ] {number} {description}`
4. Group by phase if helpful

**SHOW:**
```
Here are the implementation tasks:

---

## 1. Setup

- [ ] 1.1 [Specific task]
- [ ] 1.2 [Specific task]

## 2. Implementation

- [ ] 2.1 [Specific task]
- [ ] 2.2 [Specific task]

## 3. Verification

- [ ] 3.1 [Verification step]

---

Each checkbox becomes a unit of work in the apply phase. Ready to implement?
```

**PAUSE** - Wait for user to confirm they're ready to implement.

Save to `specs/changes/{name}/tasks.md`

Update `.change.json`:
- Set tasks.status to "done"

## Phase 9: Apply (Implementation)

**EXPLAIN:**
```
## Implementation

Now we implement each task, checking them off as we go. I'll announce each one and occasionally note how the specs/design informed the approach.
```

**DO:** For each task:

1. Announce: "Working on task N: [description]"
2. Make the code changes required
3. Reference specs/design naturally: "The spec says X, so I'm doing Y"
4. Mark complete in tasks.md: `- [ ]` → `- [x]`
5. Brief status: "✓ Task N complete"

Keep narration light—don't over-explain every line of code.

After all tasks:

```
## Implementation Complete

All tasks done:
- [x] Task 1
- [x] Task 2
- [x] ...

The change is implemented! One more step—let's archive it.
```

## Phase 10: Archive

**EXPLAIN:**
```
## Archiving

When a change is complete, we archive it. This moves it from `specs/changes/` to `specs/changes/archive/YYYY-MM-DD-<name>/`.

Archived changes become your project's decision history—you can always find them later to understand why something was built a certain way.
```

**DO:**
1. Create archive directory: `specs/changes/archive/YYYY-MM-DD-{name}/`
2. Move all files from `specs/changes/{name}/` to archive
3. Optionally sync specs to main specs/ (if applicable)
4. Remove the active change directory

**SHOW:**
```
Archived to: `specs/changes/archive/YYYY-MM-DD-{name}/`

The change is now part of your project's history. The code is in your codebase, the decision record is preserved.
```

## Phase 11: Recap & Next Steps

```
## Congratulations!

You just completed a full specs cycle:

1. **Explore** - Thought through the problem
2. **New** - Created a change container
3. **Proposal** - Captured WHY
4. **Specs** - Defined WHAT in detail
5. **Design** - Decided HOW
6. **Tasks** - Broke it into steps
7. **Apply** - Implemented the work
8. **Archive** - Preserved the record

This same rhythm works for any size change—a small fix or a major feature.

---

## Command Reference

| Command | What it does |
|---------|--------------|
| `/specs-explore` | Think through problems before/during work |
| `/specs-new <name>` | Start a new change, step by step |
| `/specs-ff <name>` | Fast-forward: create all artifacts at once |
| `/specs-continue <name>` | Continue an existing change |
| `/specs-apply <name>` | Implement tasks |
| `/specs-verify <name>` | Verify implementation |
| `/specs-archive <name>` | Archive when done |

---

## What's Next?

Try `/specs-new` or `/specs-ff` on something you actually want to build. You've got the rhythm now!
```

## Graceful Exit Handling

### User wants to stop mid-way

If the user says they need to stop, want to pause, or seem disengaged:

```
No problem! Your change is saved at `specs/changes/{name}/`.

To pick up where we left off later:
- `/specs-continue {name}` - Resume artifact creation
- `/specs-apply {name}` - Jump to implementation (if tasks exist)

The work won't be lost. Come back whenever you're ready.
```

Exit gracefully without pressure.

### User just wants command reference

If the user says they just want to see the commands or skip the tutorial:

```
## Specs Workflow Quick Reference

| Command | What it does |
|---------|--------------|
| `/specs-explore` | Think through problems (no code changes) |
| `/specs-new <name>` | Start a new change, step by step |
| `/specs-ff <name>` | Fast-forward: all artifacts at once |
| `/specs-continue <name>` | Continue an existing change |
| `/specs-apply <name>` | Implement tasks |
| `/specs-verify <name>` | Verify implementation |
| `/specs-archive <name>` | Archive when done |

Try `/specs-new` to start your first change, or `/specs-ff` if you want to move fast.
```

Exit gracefully.

## Guardrails

- **Follow the EXPLAIN → DO → SHOW → PAUSE pattern** at key transitions (after explore, after proposal draft, after tasks, after archive)
- **Keep narration light** during implementation—teach without lecturing
- **Don't skip phases** even if the change is small—the goal is teaching the workflow
- **Pause for acknowledgment** at marked points, but don't over-pause
- **Handle exits gracefully**—never pressure the user to continue
- **Use real codebase tasks**—don't simulate or use fake examples
- **Adjust scope gently**—guide toward smaller tasks but respect user choice
- **Update .change.json** atomically at each phase
- **Verify files exist** after writing
