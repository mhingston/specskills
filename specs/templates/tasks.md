# Tasks: {CHANGE_NAME}

## Overview

<!-- Brief summary of what needs to be implemented -->

## Implementation Checklist

### Phase 1: Setup

- [ ] {Task description}
- [ ] {Task description}

### Phase 2: Core Implementation

- [ ] {Task description}
- [ ] {Task description}

### Phase 3: Testing

- [ ] {Task description}
- [ ] {Task description}

### Phase 4: Documentation

- [ ] {Task description}
- [ ] {Task description}

### Phase 5: Verification

- [ ] {Task description}
- [ ] {Task description}

## Verification Steps

<!-- How to verify each task is complete -->

### Task: {TASK_NAME}

**Verification:**
- [ ] {Check that X works}
- [ ] {Check that Y is correct}

## Dependencies

<!-- What must be done before starting? -->

## Risks & Blockers

<!-- What could block progress? -->

---

## Writing Guidelines

### Task Format

**Use checkboxes with numbering:**
```markdown
- [ ] 1.1 Create User model with email and password fields
- [ ] 1.2 Add password hashing using bcrypt
- [ ] 1.3 Implement login endpoint
```

**Format rules:**
- Use `- [ ]` for unchecked tasks
- Use `- [x]` for completed tasks
- Number as `{phase}.{task}` (e.g., `1.1`, `1.2`, `2.1`)
- Be specific - include file names or component names
- One action per task (avoid compound tasks)

### Task Size Guidelines

**Good task size:**
- Can be completed in 15-60 minutes
- Has clear "done" criteria
- Focused on one component or file

**Example good tasks:**
- ✅ Create `User` model with email validation
- ✅ Add bcrypt password hashing to `AuthService`
- ✅ Write unit tests for `login()` function
- ✅ Update API documentation with new endpoints

**Example bad tasks:**
- ❌ Implement authentication (too broad)
- ❌ Create user model and login and tests (compound)
- ❌ Make it work (not specific)

### Grouping Tasks

Organize into **logical phases**:

1. **Setup** - Dependencies, configuration, scaffolding
2. **Core Implementation** - Main functionality
3. **Testing** - Unit tests, integration tests
4. **Documentation** - Code comments, README updates
5. **Verification** - Manual testing, final checks

**Alternative groupings by component:**
```markdown
### User Model
- [ ] 1.1 Create User schema
- [ ] 1.2 Add validation methods

### Authentication Service  
- [ ] 2.1 Implement login logic
- [ ] 2.2 Implement token generation

### API Endpoints
- [ ] 3.1 Create POST /login endpoint
- [ ] 3.2 Create POST /register endpoint
```

### Task Content Guidelines

**Reference specs by name:**
```markdown
- [ ] 1.1 Implement "User can export data" requirement
- [ ] 1.2 Handle CSV format from "export formats" spec
```

**Include specific file paths:**
```markdown
- [ ] 2.1 Update `src/services/auth.ts` to use new OAuth flow
- [ ] 2.2 Modify `src/middleware/auth.ts` for JWT validation
```

**Mention edge cases:**
```markdown
- [ ] 3.1 Handle valid email/password
- [ ] 3.2 Handle invalid password (error message)
- [ ] 3.3 Handle non-existent user (error message)
- [ ] 3.4 Handle rate limiting (429 response)
```

### Verification Section

For complex tasks, add verification steps:

```markdown
### Task: 2.3 Implement login endpoint

**Verification:**
- [ ] POST /api/login with valid credentials returns 200 + JWT
- [ ] POST /api/login with invalid password returns 401
- [ ] POST /api/login with missing fields returns 400
- [ ] Token expires after 24 hours
- [ ] Rate limiting prevents brute force (5 attempts/minute)
```

### Complete Example

```markdown
# Tasks: user-authentication

## Overview
Implement OAuth 2.0 authentication with Google and GitHub providers

## Implementation Checklist

### 1. Database Setup

- [ ] 1.1 Add `oauth_provider` and `oauth_id` fields to User model
- [ ] 1.2 Create migration script
- [ ] 1.3 Run migration in staging

### 2. OAuth Integration

- [ ] 2.1 Install `passport-google-oauth20` and `passport-github2`
- [ ] 2.2 Configure Google OAuth credentials
- [ ] 2.3 Configure GitHub OAuth credentials
- [ ] 2.4 Implement OAuth callback handlers

### 3. API Endpoints

- [ ] 3.1 Create GET /auth/google endpoint
- [ ] 3.2 Create GET /auth/github endpoint
- [ ] 3.3 Create GET /auth/callback/:provider endpoint
- [ ] 3.4 Update user session handling

### 4. Frontend Integration

- [ ] 4.1 Add "Sign in with Google" button
- [ ] 4.2 Add "Sign in with GitHub" button
- [ ] 4.3 Handle OAuth callback in frontend

### 5. Testing

- [ ] 5.1 Unit tests for OAuth service
- [ ] 5.2 Integration tests for auth flow
- [ ] 5.3 Test error handling (denied permissions)

### 6. Verification

- [ ] 6.1 User can sign in with Google
- [ ] 6.2 User can sign in with GitHub
- [ ] 6.3 Existing email/password still works
- [ ] 6.4 OAuth users linked to existing accounts by email
```

### Common Pitfalls

- ❌ Tasks too large ("Implement authentication")
- ❌ Tasks too vague ("Make it work")
- ❌ Compound tasks ("Create model AND service")
- ❌ Missing verification criteria
- ❌ No reference to specs
- ❌ Out of order (implementation before setup)

---

**Created**: {DATE}
**Status**: Draft
