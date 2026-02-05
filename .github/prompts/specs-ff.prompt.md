---
description: Fast-forward through artifacts until ready to apply
agent: specs
---

# /specs-ff

Fast-forward through the workflow by creating all artifacts until reaching the "apply" stage. This generates proposal, specs, design, and tasks in sequence.

## Usage

```
/specs-ff
/specs-ff Fast forward to implementation
```

## Instructions

1. **Find the Active Change**
   - Look in `specs/changes/` for existing changes
   - If multiple, ask which one to work on
   - If none, suggest creating one with `/specs-new`

2. **Check Current State**
   - Read `specs/changes/{name}/.change.json`
   - Identify current artifact statuses

3. **Loop Until Apply-Ready**
   While there are ready artifacts and tasks is not done:
   
   a. Identify the next ready artifact (following schema order)
   b. Create the artifact using appropriate template
   c. Populate content based on dependencies
   d. Update .change.json with "done" status
   e. Recompute which artifacts are now "ready"

4. **Artifact Creation Order** (for spec-driven schema)
   - proposal.md (if not done)
   - specs/ files (if proposal done)
   - design.md (if proposal done)
   - tasks.md (if specs and design done)

5. **Generate Content for Each**
   
   **Proposal:**
   - Ask user for: Why, What Changes, Impact
   - Create comprehensive proposal.md
   
   **Specs:**
   - Read proposal.md
   - Extract capabilities mentioned
   - Create one spec file per capability in `specs/changes/{name}/specs/<capability>/spec.md`
   - Use delta format (ADDED/MODIFIED/REMOVED)
   
   **Design:**
   - Read proposal.md and all `specs/changes/{name}/specs/<capability>/spec.md`
   - Create technical architecture
   - Document decisions and rationale
   
   **Tasks:**
   - Read all `specs/changes/{name}/specs/<capability>/spec.md` and design.md
   - Generate implementation checklist
   - Organize by phase
   - Include verification steps

6. **Final Status**
   - Report all artifacts created
   - Show final status
   - Confirm ready for `/specs-apply`

## Rules

- DO create multiple artifacts in one invocation
- DO follow dependency order strictly
- DO populate each artifact with meaningful content
- DO stop when tasks.md is created (apply-ready stage)
- DO update .change.json after each artifact
- DO ask user for input when creating proposal
- DO NOT create artifacts out of order
- DO NOT overwrite existing artifacts without asking
