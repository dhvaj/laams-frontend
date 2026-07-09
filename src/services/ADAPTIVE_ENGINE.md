# Adaptive Learning Engine

This is the frontend prototype of the LAAMS Adaptive Learning Engine described in the V1 SRD.

## Current Responsibilities

- Accept original lesson content from `src/data/lessons.ts`.
- Read the active accessibility profile from `AccessibilityContext`.
- Apply profile-specific adaptation rules in `adaptiveLearning.service.ts`.
- Return a normalized `AdaptedLesson` object for the UI.
- Expose trace metadata so testers can see what transformations were applied.

## Implemented Profiles

- `typical`: standard segmented textbook content.
- `blind`: screen-reader ordered structure and inline media descriptions.
- `low-vision`: high-contrast, free-flow content with read-aloud support.
- `deaf`: short visual content, sign-video placeholder, and vocabulary support.
- `dyslexic`: simplified bullet layout with shorter lines.
- `id`: picture-first content with concrete statements.
- `adhd-autism`: low-distraction, step-by-step content flow.

## Backend Handoff

Later, the static lesson catalog should be replaced by:

- PostgreSQL: student profile, lesson metadata, progress, and access control.
- MongoDB: source textbook content, media, adaptive variants, and adaptation logs.
- AI service: content simplification/restructuring based on the rules currently encoded here.

