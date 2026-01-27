# Scalable Transaction Processing REST API

## Overview

This project is a **production-grade, scalable RESTful API** built using **Node.js** and **PostgreSQL**, designed to simulate a **financial transaction processing backend**.

The primary objective is to demonstrate:
- Backend systems design
- Concurrency safety
- Strong data consistency guarantees
- Stateless API architecture
- Production-level code organization

This is **not a CRUD demo**. It is intentionally designed to reflect the constraints and expectations of **institutional-grade systems** (e.g., investment banks).

---

## Core Design Principles

- **Statelessness** (no server-side session storage)
- **Strong consistency** (no double spending)
- **Deterministic behavior under concurrency**
- **Clear separation of concerns**
- **Operational safety**

---

## Technology Stack

- **Runtime:** Node.js (LTS)
- **Framework:** Express
- **Database:** PostgreSQL
- **ORM:** Prisma (with selective raw SQL)
- **Authentication:** JWT
- **Logging:** Pino
- **Validation:** Zod
- **Testing:** Jest + Supertest

---
## Project Structure
```text
src/
  app.js            # Express app configuration
  server.js         # Entry point

  config/           # Environment & infrastructure config
  middleware/       # Auth, error handling, rate limiting
  modules/          # Feature-based domains (users, accounts, transactions)
  utils/            # Shared helpers (async handling, hashing)
  errors/           # Typed application errors
```

---

## File & Folder Responsibilities (Initialization Scope Only)

### Root Level

- **package.json**  
  Declares project metadata, runtime dependencies, and development tooling.

- **Dockerfile**  
  Enables containerized builds for environment parity *(development ≈ production)*.

- **docker-compose.yml**  
  Local orchestration for API + PostgreSQL.

- **.env.example**  
  Template for required environment variables (never commit real secrets).

---

### `src/`

#### `src/app.js`
Initializes the Express application:
- Registers middleware
- Registers routes
- Attaches global error handler  
Does **not** start the HTTP server.

> Separation of application configuration from runtime execution.

---

#### `src/server.js`
Bootstraps the application:
- Starts HTTP server
- Handles process signals
- Enables graceful shutdown *(clean termination of in-flight requests)*

---

### `src/config/`

- **env.js**  
  Loads and validates environment variables.

- **database.js**  
  Initializes Prisma client and database connection configuration.

- **logger.js**  
  Centralized structured logging configuration using Pino.

---

### `src/modules/`

Domain-driven organization.  
Each folder represents a **business domain**, not a technical concern.

Modules are initialized empty at project start and later expanded with:
- controllers
- services
- repositories
- validators

---

### `src/middleware/`

- **auth.middleware.js**  
  JWT authentication and role extraction.

- **error.middleware.js**  
  Centralized error handling (maps internal errors to HTTP responses).

- **requestId.middleware.js**  
  Attaches a correlation ID to every request for traceability.

---

### `src/errors/`

- **AppError.js**  
  Base application error class used to standardize error handling.

---

### `src/utils/`

- **asyncHandler.js**  
  Wrapper to handle async errors cleanly without repetitive try/catch blocks.

---

### `src/constants/`

- **roles.js**  
  Central definition of authorization roles (prevents magic strings).

---

### `prisma/`

- **schema.prisma**  
  Database schema definition, indexes, and constraints.

Prisma is used for:
- Schema evolution
- Migrations
- Non-critical database access

---

### `scripts/`

Contains **operational scripts only** (no runtime logic).
Examples include database seeding and health checks.

---

### `tests/`

Reserved for:
- Unit tests
- Integration tests
- Load/concurrency tests

---

## Dependencies and Their Purpose

### Runtime Dependencies

| Dependency | Purpose |
|---------|--------|
| express | HTTP server framework |
| dotenv | Environment variable management |
| cors | Controlled cross-origin access |
| helmet | Secure HTTP headers |
| prisma | ORM and schema management |
| @prisma/client | Prisma runtime client |
| pg | PostgreSQL driver (raw SQL support) |
| jsonwebtoken | Stateless authentication |
| bcrypt | Secure password hashing |
| zod | Input schema validation |
| pino | Structured logging |
| pino-http | HTTP request logging |
| uuid | Correlation/request IDs |
| express-rate-limit | Basic abuse protection |
| http-status-codes | Standardized HTTP status constants |

---

### Development Dependencies

| Dependency | Purpose |
|---------|--------|
| nodemon | Development hot reload |
| eslint | Static code analysis |
| prettier | Code formatting |
| jest | Testing framework |
| supertest | API integration testing |
| cross-env | Cross-platform environment variables |
| autocannon | Load and concurrency testing |

---

## Concurrency & Consistency Strategy

- Database-level transactions
- Optimistic locking via version fields
- Raw SQL for balance updates and idempotency enforcement
- Stateless application layer

This ensures **deterministic behavior under concurrent requests**.

---

## What This Project Intentionally Excludes

- Frontend UI
- Session-based authentication
- External payment gateways

The focus is **backend correctness and scalability**, not presentation.

---

## Interview Positioning

This project is designed to answer:
- How do you prevent race conditions?
- How does this scale horizontally?
- What fails first under load?
- Why were these abstractions chosen?

Every architectural decision is **defensible**.

---

## License

MIT