# AI Usage Report

## 1. AI Tools Used

- **ChatGPT (GPT-5.6 Luna)** — primary AI development assistant.
- **ChatGPT web/research capabilities** — used where current technical or deployment information was relevant.

## 2. How AI Was Used

### Architecture and technology selection
AI was used to evaluate practical choices for a small full-stack trading blotter, including React + TypeScript, Node.js + TypeScript + Express, PostgreSQL, Prisma, native WebSockets, Vitest, React Testing Library, Supertest, and Docker Compose.

The main principle was to keep the solution appropriately sized for the exercise rather than introducing unnecessary distributed-system complexity.

### Backend implementation
AI assisted with Express routing/controllers, trade services, request validation, create/amend/cancel flows, audit logging, user lookup, error handling, and WebSocket broadcasting.

### Frontend implementation
AI assisted with React/TypeScript component structure, trade forms, table behaviour, filtering/sorting, current-user selection, API services, WebSocket reconnect behaviour, and UI styling.

### Database implementation
AI assisted with the Trade, User, and AuditLog models, database indexes, seed data, test database setup, and Prisma 8-specific ORM usage.

### Unit tests implementation
AI assisted with API test cases, test database isolation, test users, idempotent test setup, and debugging test database configuration and parallelism.

### Docker and deployment
AI assisted with Docker Compose, PostgreSQL configuration, Dockerfiles, backend startup/schema initialization, local troubleshooting, and Render deployment/environment configuration.

## 3. Key Decisions Influenced by AI

### Native WebSockets
Native WebSockets were selected instead of Socket.IO because the application only required straightforward real-time trade updates and did not need Socket.IO's additional abstractions.

### Client-side filtering and sorting
For the expected dataset size of approximately 100–1,000 trades, filtering and sorting were kept on the client rather than adding unnecessary server-side query infrastructure.

### Dedicated test database
A separate `tradeblotter_test` database was introduced so automated tests do not use development data. The test command explicitly points to this database.

## 4. Suggestions Accepted

Accepted suggestions included:

- TypeScript across frontend and backend.
- PostgreSQL with an ORM.
- Native WebSockets
- Client-side filtering and sorting
- Dedicated test database.
- Automated API and frontend tests.
- A relatively simple architecture appropriate to the exercise.

## 5. Suggestions Rejected or Modified

### Non-idempotent unit tests
Some initial guidance tested some arbitrary user IDs that may not yet exist in the database so I prompted it further to create a process first that make sure they exist so that the testing process is idempotent




