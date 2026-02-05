# Specification: {CAPABILITY_NAME}

## Purpose

<!-- Brief statement of what this capability does and why it exists -->

## Requirements

### ADDED Requirements

<!-- New requirements being added (use for changes that add capabilities) -->

#### Requirement: {REQUIREMENT_NAME}
The system SHALL {description of requirement}.

**Acceptance Criteria:**
- {Specific, testable criterion}
- {Another criterion}

**Scenarios:**

#### Scenario: {SCENARIO_NAME}
**Given** {initial context}
**When** {event occurs}
**Then** {expected outcome}

### MODIFIED Requirements

<!-- Existing requirements being updated (use for changes that modify capabilities) -->

#### Requirement: {EXISTING_REQUIREMENT_NAME}
The system MUST {updated description of requirement}.

**Previous:** {what it was before}
**Updated:** {what it is now}
**Reason:** {why it changed}

### REMOVED Requirements

<!-- Requirements being removed (use for changes that remove capabilities) -->

#### Requirement: {OLD_REQUIREMENT_NAME}
**Reason for Removal:** {explanation}

**Impact:** {what this affects}

### RENAMED Requirements

<!-- Requirements being renamed (use when refactoring without changing behavior) -->

- **FROM:** `{OLD_REQUIREMENT_NAME}`
- **TO:** `{NEW_REQUIREMENT_NAME}`

**Reason:** {why the rename}

## Dependencies

<!-- What other capabilities or systems does this depend on? -->

## Notes

<!-- Any additional context, decisions, or considerations -->

---

## Writing Guidelines

### Format Requirements

- **Requirement Headers**: Use `#### Requirement: {name}` for each requirement (exactly 4 hashtags)
- **Scenario Headers**: Use `#### Scenario: {name}` for each scenario (exactly 4 hashtags)
- **Normative Language**: Use SHALL/MUST for mandatory requirements, avoid "should/may"
- **Every Requirement**: MUST have at least one scenario
- **Scenario Format**: Use **Given/When/Then** format for clarity

### Delta Operations

When modifying existing capabilities, use these sections:

- **ADDED Requirements**: New capabilities being introduced to the system
- **MODIFIED Requirements**: Changes to existing behavior
  - **CRITICAL**: Copy the ENTIRE requirement block from the existing spec
  - Paste under `## MODIFIED Requirements` and edit to reflect new behavior
  - Header text must match exactly (whitespace-insensitive)
  - Common pitfall: Using MODIFIED with partial content loses detail at archive time
- **REMOVED Requirements**: Deprecated features
  - **MUST include**: Reason for removal
  - **MUST include**: Migration path for users
- **RENAMED Requirements**: Name changes only, no behavior change
  - Use FROM:/TO: format as shown above

### Example

```markdown
## ADDED Requirements

#### Requirement: User can export data
The system SHALL allow users to export their data in CSV format.

**Scenarios:**

#### Scenario: Successful export
**Given** the user has data in the system
**When** the user clicks the "Export" button
**Then** a CSV file is downloaded with all user data
**And** the file uses UTF-8 encoding

## MODIFIED Requirements

#### Requirement: User authentication
The system SHALL authenticate users via email and password.

**Scenarios:**

#### Scenario: Valid credentials
**Given** the user exists in the system
**When** they enter correct email and password
**Then** they are logged in
**And** a session token is created

#### Scenario: Invalid credentials (NEW)
**Given** the user exists in the system
**When** they enter incorrect password
**Then** they see an error message
**And** the login attempt is logged

## REMOVED Requirements

#### Requirement: Legacy XML export
**Reason for Removal:** Replaced by new CSV export system
**Impact:** Users previously using XML export must migrate to CSV
**Migration:** Update integrations to use `/api/v2/export/csv` instead of `/api/v1/export/xml`
```

### Common Pitfalls

- ❌ Using `###` (3 hashtags) for scenarios - will fail silently
- ❌ Using MODIFIED with only the changed parts - loses existing scenarios
- ❌ Forgetting to include scenarios - makes requirements untestable
- ❌ Using "should" instead of "SHALL" - weakens requirements
- ❌ Not providing migration path for REMOVED requirements

---

**Created**: {DATE}
**Status**: Draft
