# AGENTS.md

## Purpose
This file defines the default engineering rules, architecture standards, and output behavior to follow for this codebase and related generated work.

## Core Defaults
- Frontend: React with the latest Vite setup by default
- Backend: Node.js, Express, MongoDB
- Styling: Tailwind CSS by default
- SCSS: use only when explicitly requested or clearly required by the project
- Global client state: Redux Toolkit only
- Server state: TanStack Query only
- Frontend testing: Vitest
- Backend testing: Jest + Supertest
- Scraping: Crawlee
- Secrets: `.env` only
- Keep `package.json` at the project root by default

## Output Rules
- Keep output concise, practical, and execution-focused
- Prefer direct implementation over explanation
- Deliver copy-paste-ready code
- When fixing pasted code, return full updated files by default
- Include companion files when needed, such as tests or config
- Avoid unnecessary back-and-forth before giving the fix
- Standard format: short changed-files list, then per-file headers with full code blocks

## Frontend Architecture

### State Management
- Use Redux Toolkit for global client-side state only
- Use TanStack Query for all server state
- Never duplicate server data into Redux

### Client Folder Structure
- `app/` for Redux store and shared providers
- `features/` for Redux Toolkit slices
- `services/` for raw API calls
- `hooks/queries/` for TanStack Query read hooks
- `hooks/mutations/` for TanStack Query write hooks
- `components/` for reusable UI components
- `pages/` for route-level pages
- `routes/` for routing and protected routes
- `lib/` for axios instance and low-level shared setup
- `utils/` for helper functions

### Component Rules
- Keep API logic out of components
- Keep components focused on rendering and interaction
- Keep route pages thin and composed from hooks plus components
- Do not turn components into containers for business logic or heavy data access

## Backend Architecture

### Server Folder Structure
- `config/` for DB and environment setup
- `controllers/` for Express controller logic
- `middleware/` for auth, error, and custom middleware
- `models/` for Mongoose models
- `routes/` for Express routes
- `utils/` for backend helpers

### Backend Package Defaults
- Do not include Helmet or Morgan by default unless explicitly requested

## Styling and UI Rules
- Tailwind CSS is the default
- Styling is a UI-layer concern only
- Keep styles near the component or page they serve
- Never couple styling with fetching, app state, or business logic
- Abstract repeated Tailwind patterns into reusable components, variants, or helpers
- Favor consistency, readability, modularity, and scalability
- Build mobile-first by default

## Copy/Paste Safety Rule
- Never trust pasted JSX blindly
- Hidden Unicode characters can break Tailwind, JSX, imports, object keys, template literals, and config files
- Before committing suspicious files, scan with regex:

```txt
/[^\x00-\x7F]/
```

- Keep all `className` values plain ASCII with normal spaces only
- If a valid line shows unexplained red errors, retype it manually
- Treat AI-generated or externally copied code as high-risk for hidden characters

## Environment and Project Hygiene
- Always use `.env` for secrets
- Never hard-code secrets into the codebase
- Always include a `.gitignore` with at least:

```gitignore
node_modules
.env
notes.txt
```

- Validate environment variables at startup

## Error Handling Rule
- Handle all async failures explicitly
- Never leave unhandled promise rejections
- Use centralized backend error middleware
- Standardize API error responses
- Frontend async flows must support loading, empty, error, and retry states
- Never swallow errors silently

## Validation and Data Contract Rule
- Validate request body, params, and query on the backend
- Never trust client input
- Validate environment variables at startup
- Keep frontend and backend validation aligned where practical
- Define request and response shapes clearly

## Authentication and Authorization Rule
- Separate authentication from authorization
- Enforce role and ownership checks on the server
- Never rely on frontend-only permission checks
- Test missing-token, invalid-token, expired-token, unauthorized, and forbidden cases
- Define token expiry and refresh strategy clearly when auth exists

## API Consistency Rule
- Use consistent route naming and response shapes
- Use correct HTTP status codes
- Paginated endpoints must return consistent metadata
- Keep success and error formats predictable

## Database and Schema Integrity Rule
- Define indexes intentionally
- Enforce required fields and constraints in schema
- Handle duplicate key cases cleanly
- Normalize or sanitize data before save when needed
- Never rely only on frontend validation for DB integrity

## Performance Rule
- Avoid unnecessary re-renders
- Memoize only when justified
- Paginate large datasets
- Avoid N+1 query patterns
- Lazy load heavy frontend sections when appropriate
- Optimize expensive lists and media-heavy components

## Accessibility Rule
- Use semantic HTML first
- Ensure keyboard accessibility
- Provide labels for inputs
- Preserve visible focus states
- Use ARIA only when needed, not as a replacement for semantics
- Test key interactive flows for keyboard and basic screen-reader accessibility

## Responsive Design Rule
- Build mobile-first by default
- Define responsive behavior intentionally
- Test small, medium, and large breakpoints
- Avoid layout decisions that only work on desktop

## Forms Rule
- Handle validation, pending submit state, success, and failure
- Disable double-submit while pending
- Preserve user input where appropriate after failure
- Show field-level and form-level errors clearly

## File Upload and Media Rule
- Validate file size, type, and upload limits
- Never trust client-provided MIME data alone
- Handle upload failures and partial failures cleanly
- Sanitize filenames when stored
- Define cleanup behavior for failed uploads

## Logging and Observability Rule
- Log meaningful server errors and critical events
- Do not log secrets or sensitive user data
- Use structured logging where practical
- Distinguish debug logs from production-critical logs

## Testing Edge Case Rule
- Test edge cases, not just happy paths
- Test permission failures
- Test invalid input
- Test empty states
- Test race conditions where relevant
- Test retry and failure behavior for async flows
- Avoid brittle tests tied to implementation details

## Third-Party Integration Rule
- Wrap external services behind service layers
- Mock external APIs in tests
- Handle rate limits, timeouts, and provider failures
- Never scatter provider-specific code across components or routes

## Naming and Consistency Rule
- Use consistent naming for files, hooks, components, routes, and env vars
- Components use PascalCase
- Hooks use `useX` naming
- Test files follow a project-wide naming standard
- Avoid inconsistent singular/plural naming

## Cleanup and Lifecycle Rule
- Clean up timers, intervals, subscriptions, and listeners
- Avoid memory leaks from effects
- Cancel stale async work where needed
- Guard against state updates after unmount

## Concurrency and Async Safety Rule
- Guard against duplicate submissions
- Prevent stale overwrite bugs in async UI
- Handle out-of-order responses
- Prefer mutation state and request guards where needed

## Documentation Rule
- Document non-obvious architecture decisions
- Document required env vars
- Document setup steps when they are not obvious
- Keep comments focused on why, not what

## Frontend Testing Folder Structure Rule
- Keep all frontend tests under a single root-level `client/test/` directory
- Do not colocate frontend tests inside `src/`
- Do not use scattered `__tests__` folders unless a toolchain requires it

Recommended structure:

```txt
client/
  src/
  test/
    setup/
    mocks/
    fixtures/
    utils/
    components/
    pages/
    routes/
    hooks/
    integration/
```

Naming examples:
- `src/routes/ProtectedRoute.jsx` -> `test/routes/ProtectedRoute.test.jsx`
- `src/pages/Home.jsx` -> `test/pages/Home.test.jsx`

## Practical Project Generation Preference
Generated code should be:
- copy-paste ready
- practical
- production-leaning
- concise
- no-fluff

## Saved Scripts Snippet
```json
{
  "scripts": {
    "dev": "your-dev-command-here",
    "test": "vitest",
    "start-server": "cd ../ && npm run server",
    "test-with-server-and-dev": "concurrently \"npm run start-server\" \"npm run dev\" \"npm run test\""
  }
}
```

## Shortcut Conventions
- `:create:server:` generates a basic Express server using CommonJS with home and auth routes
- `:create:model:[ModelName]` generates a Mongoose model schema
- `:create:crud:[ResourceName]` sets up CRUD routes for a resource
- Supported extended shortcuts:
  - `:create:model:user`
  - `:create:crud:product`
  - `:create:controller:auth`
  - `:create:test:auth`
  - `:create:component:JobCard`
  - `:create:style:header`
  - `:create:service:jobs`
  - `:create:route:dashboard`

## Memory Retrieval Behavior
- When retrieving from memory using shortcuts, return only code
- No explanations
- No fluff
