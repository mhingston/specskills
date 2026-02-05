# Design: {CHANGE_NAME}

## Overview

<!-- Brief summary of the technical approach -->

## Architecture

<!-- High-level architecture diagram or description -->

### Components

<!-- List the main components and their responsibilities -->

1. **Component A**: Responsibility
2. **Component B**: Responsibility

### Data Flow

<!-- How does data flow through the system? -->

```
[Input] → [Process A] → [Process B] → [Output]
```

## Decisions

<!-- Key technical decisions and rationale -->

### Decision: {DECISION_NAME}

**Context:** {What is the decision about?}

**Decision:** {What was decided?}

**Rationale:** {Why this choice?}

**Consequences:** {What are the implications?}

**Alternatives Considered:**
- {Alternative 1}: {Why not chosen}
- {Alternative 2}: {Why not chosen}

## Implementation Details

### Files to Create/Modify

<!-- List specific files that will be changed -->

- `path/to/file.ts`: {What will change}

### API Changes

<!-- Any API modifications -->

### Database Changes

<!-- Any schema or data changes -->

### Configuration Changes

<!-- Any config file changes -->

## Testing Strategy

<!-- How will this be tested? -->

### Unit Tests

<!-- What needs unit testing? -->

### Integration Tests

<!-- What needs integration testing? -->

### Manual Testing

<!-- What needs manual verification? -->

## Rollback Plan

<!-- How to undo these changes if needed -->

---

## Writing Guidelines

### When to Create design.md

Create a design document **only if any of these apply**:

1. **Cross-cutting change** - affects multiple services/modules or introduces new architectural patterns
2. **New external dependency** - adding libraries, services, or APIs
3. **Significant data model changes** - database schema modifications
4. **Security implications** - authentication, authorization, data protection
5. **Performance considerations** - optimization, caching, scaling
6. **Migration complexity** - requires coordination or has rollback concerns
7. **Ambiguity exists** - unclear how to implement, needs technical decisions

**Don't create design.md if:**
- It's a simple change with clear implementation path
- No significant technical decisions needed
- The "how" is obvious from the specs

### The Decisions Section

This is the **most important section**. Document:

**Format:**
```markdown
### Decision: {Name}

**Context:** What problem are we solving?

**Decision:** What did we decide?

**Rationale:** Why this choice? (Be specific)

**Consequences:** Trade-offs, limitations, future implications

**Alternatives Considered:**
- Option A: Why not chosen
- Option B: Why not chosen
```

**Example:**
```markdown
### Decision: Use PostgreSQL over SQLite

**Context:** Need a database for the analytics dashboard that can handle concurrent writes from multiple workers

**Decision:** Use PostgreSQL with connection pooling

**Rationale:**
- SQLite doesn't handle concurrent writes well (file locks)
- PostgreSQL has better JSON support for flexible schema
- Team already has operational experience with PostgreSQL

**Consequences:**
- Requires PostgreSQL in development environment (Docker)
- Adds operational complexity for backups
- Better long-term scalability

**Alternatives Considered:**
- SQLite: Rejected due to concurrent write limitations
- MySQL: Similar to PostgreSQL but team lacks experience
```

### Architecture Section

Use **ASCII diagrams** liberally:

```
┌─────────────────────────────────────────┐
│           System Architecture           │
└─────────────────────────────────────────┘
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│  API     │ │  Worker  │ │  Cache   │
│  Layer   │ │  Queue   │ │  Layer   │
└────┬─────┘ └────┬─────┘ └────┬─────┘
     │            │            │
     └────────────┼────────────┘
                  ▼
           ┌──────────┐
           │ Database │
           └──────────┘
```

Tools for ASCII diagrams:
- ASCII flowcharts for component relationships
- Tables for comparing options
- Lists for sequential flows

### Content Guidelines

- **Reference the proposal** for motivation (the "why")
- **Reference the specs** for requirements (the "what")
- **Focus on the "how"** - architecture and approach
- **Document the "why behind the how"** - decision rationale
- **Be specific** about file paths and component names
- **Include code snippets** for critical interfaces

### Example Structure

```markdown
## Overview
Implement OAuth 2.0 authentication alongside existing email/password auth

## Architecture

### Components
1. **AuthService**: Handles OAuth flow and token management
2. **UserRepository**: Stores user credentials and OAuth tokens
3. **Middleware**: Validates JWT tokens on protected routes

### Data Flow
```
User → OAuth Provider → Callback Handler → JWT Token → API Requests
```

## Decisions

### Decision: Store OAuth tokens encrypted
**Context:** OAuth tokens are sensitive credentials
**Decision:** Encrypt tokens at rest using AES-256
**Rationale:** Compliance requirements + security best practice
**Alternatives:** Plain text (rejected), Hash only (insufficient for token refresh)

## Implementation Details

### Files to Create/Modify
- `src/auth/oauth-service.ts`: New OAuth flow implementation
- `src/middleware/auth.ts`: Add JWT validation
- `src/models/user.ts`: Add oauth_tokens field
```

---

**Created**: {DATE}
**Status**: Draft
