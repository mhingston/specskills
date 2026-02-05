---
description: Validate specs, changes, and schemas for format compliance
agent: specs
---

# /specs-validate

Run deterministic validation on specs, changes, and schemas using the built-in validation script. No LLM involved - pure rule-based checking.

## Usage

```
/specs-validate                    # Validate all
/specs-validate --specs            # Validate specs only
/specs-validate --changes          # Validate changes only
/specs-validate --json             # JSON output
```

## Instructions

1. **Run Validation Script**
   Execute from repo root: `node specs/scripts/validate.js [options]`

2. **Parse Results**
   - Parse output from validation script
   - Display in user-friendly format

3. **Show Results**
   
   **Success:**
   ```
   ✅ Validation passed
   
   12 files checked:
   - 2 schemas
   - 5 specs
   - 5 changes
   
   No errors or warnings found.
   ```
   
   **With Issues:**
   ```
   ⚠️ Validation completed with issues
   
   specs/specs/user-authentication/spec.md:
     ✗ [ERROR] Missing required header: ## Purpose
     ✗ [ERROR] No requirements found (must use SHALL, MUST, or SHOULD)
     ⚠ [WARNING:42] Requirement 2 missing Given/When/Then scenario
   
   changes/my-change/.change.json:
     ✗ [ERROR] Missing "name" field
   
   Total: 3 errors, 1 warning in 2 files
   ```

## Validation Rules

**Spec Files:**
- Must have ## Purpose header
- Must have ## Requirements header
- Requirements must use SHALL/MUST/SHOULD
- Must have #### Scenario blocks
- Scenarios should use Given/When/Then format

**Change Files:**
- Must have .change.json with required fields
- Must use delta format (ADDED/MODIFIED/REMOVED)
- ADDED/MODIFIED requirements must have scenarios

**Schema Files:**
- Valid YAML structure
- Must have name and artifacts array
- No duplicate artifact IDs

## CI/CD Integration

Use in GitHub Actions:
```yaml
- name: Validate Specs
  run: node specs/scripts/validate.js --json
```

## When to Run

- Before committing changes
- In CI/CD pipelines
- After editing specs manually
- Before archiving a change

## Rules

- DO run the validation script (no LLM validation)
- DO show clear error/warning messages
- DO suggest fixes for common issues
- DO NOT skip validation in CI/CD
- DO treat errors as blocking (exit code 1)
