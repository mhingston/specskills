---
description: Generate a verification report comparing implementation to specifications with completeness, correctness, and coherence checks
agent: specs
---

# /specs-verify

Verify that the implementation matches the specifications and design. This is quality assurance—checking that what was built matches what was planned.

## Usage

```
/specs-verify
/specs-verify user-authentication
/specs-verify Check completeness
```

## Input

Optionally specify a change name. If omitted, use the most recently updated change.

## Verification Dimensions

We check three key dimensions:

1. **Completeness** - Are all requirements implemented?
2. **Correctness** - Do they work as specified?
3. **Coherence** - Does implementation match design decisions?

## Workflow

1. **Select the Change**
   
   If name provided, use it. Otherwise:
   - Use most recent `.change.json` by `updatedAt`
   - If ambiguous, list active changes and ask

2. **Verify Prerequisites**
   
   Check `specs/changes/<name>/.change.json`:
   - Confirm change exists
   - Check if tasks are complete (status = "done")
   - Warn if tasks incomplete ("Implementation may not be finished")

3. **Read All Artifacts**
   
   Read everything:
   - `proposal.md` - Why and what (scope check)
   - `specs/<capability>/spec.md` - Requirements (completeness check)
   - `design.md` - How (coherence check)
   - `tasks.md` - Steps (progress check)

4. **Analyze Specifications**
   
   For each spec file, extract:
   - **Requirements**: SHALL/MUST statements (count them)
   - **Scenarios**: Given/When/Then test cases
   - **Acceptance Criteria**: Specific pass/fail conditions
   - **Files Affected**: Paths mentioned in specs/design
   
   Create a verification matrix:
   ```
   | Requirement | Status | Evidence | Notes |
   |-------------|--------|----------|-------|
   | REQ-1 | ? | - | Check implementation |
   ```

5. **Review Implementation**
   
   For each requirement/scenario:
   
   a. **Locate Code**:
      - Check files mentioned in tasks.md
      - Search for relevant functions/classes
      - Look for test files
   
   b. **Verify Implementation**:
      - Read the code
      - Check against requirement statement
      - Look for test coverage
      - Verify error handling
   
   c. **Check Scenarios**:
      - Can you trace the Given/When/Then flow?
      - Does the code handle the When condition?
      - Is the Then outcome produced?

6. **Generate Verification Report**

   Structure the report:

   ```
   ## Verification Report: <change-name>
   
   ### Summary
   - **Overall Status**: [PASS / PARTIAL / FAIL]
   - **Requirements**: X/Y implemented
   - **Scenarios**: A/B verified
   - **Tasks**: M/N complete
   
   ### Completeness Check ✓
   [Which requirements are implemented]
   
   ### Correctness Check ✓
   [Do implementations work correctly]
   
   ### Coherence Check ✓
   [Does code match design decisions]
   
   ### Issues Found
   [CRITICAL, WARNING, SUGGESTION]
   
   ### Recommendations
   [Next steps]
   ```

## Verification Heuristics

### Completeness Checks

**Requirement Tracking:**
- ✓ Found: Code exists implementing this requirement
- ⚠ Partial: Some aspects implemented, others missing
- ✗ Missing: No implementation found
- ? Unclear: Can't determine from available information

**Evidence to look for:**
- Function/method that implements requirement
- API endpoint handling the scenario
- UI component providing the feature
- Test covering the requirement
- Configuration enabling the capability

**Example:**
```
Requirement: "User SHALL authenticate via OAuth"

Checking:
- ✓ OAuth route exists: routes/auth.js
- ✓ Passport.js configured: config/passport.js  
- ✓ Google strategy implemented: auth/google.js
- ⚠ GitHub strategy: Found code but not tested
- ? Email/password: Not mentioned in spec, ignore
```

### Correctness Checks

**Scenario Verification:**
- **Given**: Is the setup/initial state correct?
- **When**: Does the trigger/action work?
- **Then**: Is the expected outcome produced?

**Code Review Points:**
- Logic matches requirement intent
- Error handling covers edge cases
- Input validation present
- Security considerations addressed
- Performance meets criteria

**Example:**
```
Scenario: "Given valid credentials, When login, Then JWT returned"

Verification:
- ✓ Valid credentials accepted (tested)
- ✓ JWT generated with correct payload
- ✓ Token has expiry (24h as specified)
- ⚠ Missing: Refresh token not implemented
- ✗ Issue: Error message exposes user exists (security)
```

### Coherence Checks

**Design Decision Compliance:**
- Architecture matches design document
- Patterns match design choices
- Dependencies match design
- API contracts match design

**Example:**
```
Design Decision: "Use Redis for caching"

Checking:
- ✓ Redis client imported: services/cache.js
- ✓ Cache middleware uses Redis: middleware/cache.js
- ✗ Issue: Some routes use in-memory cache instead
  - File: routes/users.js line 45
  - Should: Use Redis consistent with design
```

## Issue Classification

### CRITICAL 🔴

Issues that must be fixed:
- Missing critical requirements
- Security vulnerabilities
- Broken core functionality
- Data loss risks
- Non-compliance with MUST/SHALL requirements

**Format:**
```
🔴 CRITICAL: Requirement "User data SHALL be encrypted" not implemented
   Location: models/user.js
   Impact: User passwords stored in plain text
   Fix: Add bcrypt hashing before save
```

### WARNING ⚠️

Issues that should be addressed:
- Missing error handling
- Partial implementations
- Performance concerns
- Deviation from design without reason
- Missing test coverage

**Format:**
```
⚠️ WARNING: Scenario "Invalid login" not handled
   Spec: specs/auth/spec.md line 24
   Current: Returns generic 500 error
   Should: Return 401 with "Invalid credentials" message
```

### SUGGESTION 💡

Improvements to consider:
- Code style improvements
- Additional test coverage
- Documentation additions
- Refactoring opportunities
- Performance optimizations

**Format:**
```
💡 SUGGESTION: Add input validation for email format
   Location: routes/auth.js line 12
   Current: Accepts any string as email
   Consider: Add regex validation or use validator library
```

## Examples

### Example 1: PASS Report

```
## Verification Report: user-authentication

### Summary
- **Overall Status**: ✅ PASS
- **Requirements**: 5/5 implemented
- **Scenarios**: 8/8 verified
- **Tasks**: 7/7 complete

### Completeness Check ✓
✓ REQ-1: OAuth authentication (routes/auth.js)
✓ REQ-2: Session management (services/session.js)
✓ REQ-3: Password hashing (models/user.js)
✓ REQ-4: Rate limiting (middleware/rate-limit.js)
✓ REQ-5: JWT generation (services/jwt.js)

### Correctness Check ✓
✓ All scenarios execute correctly
✓ Error handling covers edge cases
✓ Security best practices followed
✓ Tests pass (14/14)

### Coherence Check ✓
✓ Architecture matches design.md
✓ Uses specified Passport.js strategy
✓ Follows established patterns

### Issues Found
None

### Recommendations
Ready for archive. Run `/specs-archive user-authentication`
```

### Example 2: PARTIAL Report

```
## Verification Report: payment-gateway

### Summary
- **Overall Status**: ⚠️ PARTIAL
- **Requirements**: 4/6 implemented
- **Scenarios**: 5/8 verified
- **Tasks**: 5/7 complete

### Completeness Check
✓ REQ-1: Stripe integration
✓ REQ-2: Card validation
✓ REQ-3: Payment processing
⚠ REQ-4: Webhook handling (partial - no retry logic)
✗ REQ-5: Refund processing (not found)
✗ REQ-6: Payment history (not found)

### Issues Found

🔴 CRITICAL: REQ-5 missing
   Spec: "System SHALL process refunds"
   Status: No implementation found
   Required for: MVP release
   Fix: Add refund endpoint and logic

⚠️ WARNING: REQ-4 incomplete
   Spec: "Webhook SHALL retry on failure"
   Current: Webhook received but no retry mechanism
   Location: webhooks/stripe.js
   Fix: Add exponential backoff retry

💡 SUGGESTION: Add idempotency keys
   Location: services/payment.js
   Benefit: Prevent duplicate charges

### Recommendations
1. Implement REQ-5 (refunds) - required
2. Add webhook retry logic - recommended
3. Consider idempotency keys - nice to have

Continue with `/specs-apply payment-gateway` to complete remaining tasks
```

### Example 3: FAIL Report

```
## Verification Report: data-export

### Summary
- **Overall Status**: ❌ FAIL
- **Requirements**: 1/4 implemented
- **Scenarios**: 0/4 verified
- **Tasks**: 2/5 complete

### Critical Issues

🔴 CRITICAL: Core requirement missing
   Spec: "User SHALL export data as CSV"
   Status: No export functionality found
   Impact: Feature doesn't exist
   Fix: Implement export endpoint and CSV generation

🔴 CRITICAL: Design not followed
   Design: "Use streaming for large datasets"
   Current: Loads entire dataset into memory
   Location: routes/export.js line 23
   Risk: Memory crashes on large exports
   Fix: Implement stream-based CSV generation

🔴 SECURITY: Data exposure
   Spec: "User SHALL only export their own data"
   Current: No authorization check
   Location: routes/export.js
   Risk: Users can export others' data
   Fix: Add user ID filter to query

### Recommendations
Major issues found. Recommend:
1. Complete remaining tasks
2. Fix critical security issue (priority 1)
3. Implement streaming approach per design
4. Re-verify after fixes

Run `/specs-apply data-export` to continue implementation
```

## Verification Patterns

### Pattern 1: Trace Scenario

```
Scenario: "Given logged in user, When click export, Then download starts"

Trace:
1. ✓ Route exists: GET /api/export
2. ✓ Auth middleware applied: routes/export.js
3. ✓ Handler calls export service
4. ⚠ Service generates file but doesn't stream
5. ✓ Response sets download headers
6. ? Browser behavior not verified

Issue: Step 4 deviates from design (streaming)
```

### Pattern 2: Requirement Mapping

```
Requirement: "System SHALL validate email format"

Map to code:
- ✓ Validation exists: models/user.js validateEmail()
- ✓ Regex pattern used: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
- ✓ Used in: POST /api/users, PUT /api/users/:id
- ✓ Test coverage: test/user-validation.test.js

Status: Fully implemented ✓
```

### Pattern 3: Design Compliance

```
Design Decision: "Use Repository pattern for data access"

Check:
- ✓ UserRepository exists: repositories/user.js
- ✓ Abstracts database queries
- ⚠ Some controllers bypass repository
  - File: controllers/admin.js lines 34-45
  - Directly queries User model
- ? Inconsistent with design

Recommendation: Refactor to use repository consistently
```

## Edge Cases

### What if implementation is missing?

```
## Verification Report: feature-x

### Summary
- **Overall Status**: ❌ NOT IMPLEMENTED

No implementation found for this change.

Tasks status shows done, but:
- No code changes detected in expected files
- No new files created
- tasks.md may be incorrectly marked complete

Recommendations:
1. Check if tasks were actually implemented
2. Run `/specs-apply feature-x` to implement
3. Verify files exist after implementation
```

### What if specs are unclear?

```
## Verification Report: feature-y

### Summary
- **Overall Status**: ❓ UNCLEAR

Unable to verify due to specification issues:

⚠️ Unclear requirements:
- REQ-3: "System SHALL handle errors" (too vague)
- No acceptance criteria provided
- Missing scenarios for edge cases

Recommendations:
1. Update specs with specific requirements
2. Add Given/When/Then scenarios
3. Define acceptance criteria
4. Re-verify after spec updates
```

## Guardrails

- **Be specific** - Point to exact files and lines
- **Evidence-based** - Don't guess, check the code
- **Prioritize** - Critical issues first
- **Actionable** - Every issue should have a fix suggestion
- **Complete coverage** - Check all requirements, not just some
- **Be honest** - If you can't verify something, say so
- **Suggest next steps** - Always provide clear recommendations
