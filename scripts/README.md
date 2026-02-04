# Scripts Documentation

This directory contains utility scripts for managing the database, seeding initial data, and
maintaining application health. All scripts are designed to work with the Prisma ORM and should be
run from the project root directory.

## Overview

| Script            | Purpose                                      | When to Use                              |
| ----------------- | -------------------------------------------- | ---------------------------------------- |
| `migrate.js`      | Runs Prisma migrations                       | During development and deployments       |
| `seed.js`         | Populates database with initial data         | After migrations or fresh database setup |
| `reset-db.js`     | Resets database to initial state             | For local development/testing            |
| `health-check.js` | Verifies database connectivity               | For monitoring and debugging             |
| `backfill.js`     | Updates existing records with default values | When schema changes require data updates |

---

## Scripts

### `migrate.js`

**Purpose**: Executes Prisma migrations to sync your database schema with the Prisma schema
definition.

**What it does**:

- Runs `npx prisma migrate dev --name init` which:
  - Detects schema changes since the last migration
  - Generates a new migration file with a timestamp
  - Applies the migration to your development database
  - Regenerates Prisma Client

**When to use**:

- After modifying `prisma/schema.prisma`
- During CI/CD pipeline deployments
- When setting up a fresh development environment

**Usage**:

```bash
node scripts/migrate.js
```

**Error handling**: Exits with code 1 if migration fails, preventing deployment of broken schemas.

---

### `seed.js`

**Purpose**: Populates the database with initial/required data for the application to function.

**What it does**:

- Creates an admin user with credentials:
  - Email: `admin@example.com`
  - Password: `Admin123!` (hashed)
  - Role: `ADMIN`
- Checks if the admin user already exists before creating (idempotent)
- Gracefully disconnects from the database when complete

**When to use**:

- After running migrations for the first time
- When resetting the database to a known state
- During fresh environment setup

**Usage**:

```bash
node scripts/seed.js
```

**Notes**:

- The script is **idempotent** — it won't create duplicate admin users if run multiple times
- Update the admin credentials directly in the script if you need different default values
- All passwords are hashed using bcrypt before storage

---

### `reset-db.js`

**Purpose**: Completely resets your database to a clean state, removing all data and migrations.

**What it does**:

- Executes `prisma migrate reset --force` which:
  - Drops the entire database
  - Recreates an empty database
  - Re-applies all migrations from scratch
  - Clears the migration history

**When to use**:

- During local development when you've corrupted data
- Before testing important features on a clean slate
- When you need to start from a completely fresh state

**Usage**:

```bash
node scripts/reset-db.js
```

**⚠️ Warning**:

- This script **permanently deletes all data** in your database
- Use `--force` flag to skip confirmation prompts
- Should **never** be used in production environments

**Next steps**: After running this script, run `seed.js` to populate initial data.

---

### `health-check.js`

**Purpose**: Verifies the application's database connectivity and provides basic system information.

**What it does**:

- Attempts to establish a connection to the database via Prisma
- Counts the total number of users in the database
- Reports the user count in logs
- Exits with code 1 if the connection fails

**When to use**:

- Debugging database connectivity issues
- Monitoring in production to verify the database is accessible
- As a readiness probe for Kubernetes/container deployments
- In healthcheck endpoints for load balancers

**Usage**:

```bash
node scripts/health-check.js
```

**Example output**:

```
[INFO] Checking database connection...
[INFO] Number of users: 5
```

**Exit codes**:

- `0` - Database is healthy and accessible
- `1` - Database connection failed

---

### `backfill.js`

**Purpose**: Updates existing database records with default values, typically needed when adding new
required fields to an existing schema.

**What it does**:

- Finds all accounts where the `balance` field is `null`
- Updates each account to set `balance` to `0`
- Logs the progress for each account updated
- Handles database disconnection properly

**When to use**:

- After modifying the schema to add a new required field
- When you need to populate historical data with sensible defaults
- Before adding a `NOT NULL` constraint to a column
- During data cleanup and maintenance tasks

**Usage**:

```bash
node scripts/backfill.js
```

**Example output**:

```
[INFO] Starting backfill
[INFO] Backfilled account 550e8400-e29b-41d4-a716-446655440000
[INFO] Backfilled account 6ba7b810-9dad-11d1-80b4-00c04fd430c8
[INFO] Backfill done
```

**Performance note**: For large datasets, this script processes records sequentially. For better
performance with millions of records, consider using a bulk update query instead.

---

## Running Scripts Together

A typical workflow for setting up a fresh environment:

```bash
# 1. Install dependencies
npm install

# 2. Run migrations to create schema
node scripts/migrate.js

# 3. Seed initial data (admin user, etc.)
node scripts/seed.js

# 4. Verify everything works
node scripts/health-check.js
```

For a complete reset:

```bash
# Reset database (clears all data)
node scripts/reset-db.js

# Seed with initial data
node scripts/seed.js

# Verify health
node scripts/health-check.js
```

---

## Best Practices

1. **Always backup before reset**: The `reset-db.js` script is destructive. Always backup your data
   first in production.

2. **Run migrations before seeding**: Always run `migrate.js` before `seed.js` to ensure the schema
   exists.

3. **Use in CI/CD pipelines**: Automate these scripts in your deployment pipeline for consistent
   environments.

4. **Check health after deployment**: Run `health-check.js` as part of your post-deployment
   validation.

5. **Monitor backfill operations**: For large datasets, monitor the backfill script to ensure it
   completes successfully.

6. **Version control**: Keep your Prisma migrations in version control, but `.env` files and secrets
   should not be committed.

---

## Troubleshooting

| Issue                                          | Solution                                                                 |
| ---------------------------------------------- | ------------------------------------------------------------------------ |
| `Database connection refused`                  | Check DATABASE_URL in `.env`, ensure database server is running          |
| `Migration fails with schema validation error` | Review Prisma schema syntax, ensure all changes are valid                |
| `Seed script creates duplicates`               | The seed script checks for existing users; check your database state     |
| `Backfill doesn't update records`              | Verify the field name and null condition in the script match your schema |
| `Permission denied`                            | Ensure `node_modules/.bin` scripts are executable                        |

---

## Environment Variables

All scripts require the `DATABASE_URL` environment variable to be set in your `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/scalable_rest_api"
```

Refer to your database documentation for the correct connection string format.
