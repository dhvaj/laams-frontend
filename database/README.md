# LAAMS Database Layer

This folder translates the LAAMS V1 SRD database guidance into implementation-ready database artifacts.

The SRD defines:

- PostgreSQL for structured data: users, roles, classes, assignments, exams, grades, results, attendance, progress.
- MongoDB for flexible learning content: textbook sections, adaptive lesson variants, media metadata, adaptation logs.
- Redis later for session and cache storage.

## Files

- `postgresql/schema.sql`: relational schema for the core LAAMS platform workflows.
- `postgresql/seed.sql`: seed data matching the current prototype users and dashboards.
- `mongodb/lesson-content.seed.json`: MongoDB-style seed document for original and adapted lesson content.
- `../scripts/seed-laams-mock-db.mjs`: regenerates the JSON Server mock database used by the current React prototype.

## Current App Compatibility

The React prototype still uses `db.json` and the fallback demo data in `src/services`. Run this whenever the mock data needs to be reset:

```bash
npm run db:seed
npm run api
```

The SQL and MongoDB files are the target structure for the backend/API layer when the project moves from JSON Server mocks to PostgreSQL + MongoDB.

The schema covers the SRD Phase 1 workflows:

- Authentication and RBAC.
- Sessions and forgot-password token storage.
- Student profile and accessibility needs.
- Classes, subjects, lessons, study materials, assignments, submissions, grading.
- Exams, questions, attempts, answers, scores, feedback.
- Attendance, progress analytics, parent links, messaging, notifications.
- File assets for assignment uploads, study materials, captions/transcripts, and media alt text.
- Adaptive learning events and analytics events for time spent, downloads, exam activity, and profile changes.
- Audit logs for admin/security traceability.

## PostgreSQL Setup

Create a database and run the schema followed by the seed:

```bash
psql "$DATABASE_URL" -f database/postgresql/schema.sql
psql "$DATABASE_URL" -f database/postgresql/seed.sql
```

Important implementation notes:

- `users.password_hash` is seeded with demo placeholders. Replace these with bcrypt hashes from the backend auth service.
- `user_sessions` stores token hashes only, not raw JWT/session tokens.
- Accessibility details are split between `student_profiles` for the main profile and `student_accessibility_needs` for specific support settings.
- `v_student_dashboard_summary`, `v_teacher_accessibility_breakdown`, and `v_parent_student_progress` provide backend-ready reporting views for dashboard APIs.

## MongoDB Content Setup

Import the lesson seed into the content database:

```bash
mongoimport --db laams --collection lesson_contents --file database/mongodb/lesson-content.seed.json --jsonArray
```

MongoDB stores original lesson content, lesson segments, media metadata, vocabulary links, adaptive variants, and adaptation logs because those documents vary by subject and accessibility profile.

## Redis Scope

Redis is not represented as a file seed because it is runtime cache/session infrastructure. Use it for:

- Adapted content cache keys like `lesson_solar_system_v1:dyslexic:en`.
- Short-lived session or rate-limit keys.
- Notification queue/cache metadata.
