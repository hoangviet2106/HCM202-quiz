<!-- Sync Impact Report
Version change: template → 1.0.0
Modified principles: all placeholder principles replaced with project-specific rules
Added sections: Content & Data Standards; Development & Quality Gates
Removed sections: placeholder template comments and tokens
Templates requiring updates: none
Deferred items: none
-->
# My Vietnam Quiz App Constitution

## Core Principles

### I. Source-First Question Bank
Every quiz item MUST come from a maintained canonical question bank for the 270-question
curriculum. Each question, answer set, and explanation MUST be traceable to an approved
source or review note. The app MUST never invent, paraphrase beyond meaning, or silently
alter the academic content.

### II. Deterministic Assessment
Scoring, answer validation, progress calculation, and completion results MUST be
deterministic for the same input state. The app MUST clearly distinguish between a user's
selected answer, the correct answer, and any post-answer explanation. Randomization may be
used for practice flows only when it does not change correctness or scoring.

### III. Learning-First UX
The product MUST optimize for exam practice and retention, not entertainment. Each feature
MUST support fast answering, immediate feedback, review of mistakes, and clear progress
signals. The default experience MUST work well on mobile screens and in low-friction study
sessions.

### IV. Accessible Vietnamese-First Experience
Primary content MUST be understandable in Vietnamese and readable on small screens. The UI
MUST maintain strong contrast, touch-friendly targets, keyboard accessibility where
applicable, and a layout that remains usable without relying on color alone.

### V. Testable Content and Behavior
Question-bank validation, scoring logic, review flows, persistence, and navigation-critical
behaviors MUST be covered by automated tests. Every user-facing increment MUST be independently
testable and must not require the entire 270-question set to be manually verified before being
usable.

## Content & Data Standards

- The canonical question set is versioned data, not embedded ad hoc in UI code.
- A question MUST have stable identifiers, one unambiguous correct answer, and review-ready
	explanation content when available.
- Content changes MUST preserve historical meaning unless a revision is explicitly approved.
- Any future expansion beyond the initial 270 questions MUST keep backward-compatible IDs so
	saved progress and analytics remain valid.
- The app MUST not collect unnecessary personal data; study progress should be stored with the
	minimum information needed to resume learning.

## Development & Quality Gates

- New quiz behaviors MUST be designed from the user journey backward: select topic, answer,
	receive feedback, review mistakes, and resume study.
- Changes to scoring, question ordering, or result summaries MUST include regression tests.
- UI changes MUST be checked for Vietnamese text overflow, mobile responsiveness, and readable
	answer states.
- If a change affects question content, the review must verify source fidelity before release.
- Features that cannot be tested independently MUST be broken into smaller increments before
	implementation.

## Governance

This constitution supersedes all informal conventions for the project. Any change to the
principles above MUST be made explicitly in this file, with a semantic version bump and a clear
reason for the amendment. Clarifications that do not change meaning use a PATCH bump; added or
materially expanded principles use a MINOR bump; backward-incompatible rule changes use a MAJOR
bump.

All implementation plans, specs, and tasks MUST comply with this constitution before work
proceeds. If a feature conflicts with source fidelity, deterministic assessment, accessibility,
or independent testability, the feature definition MUST be revised instead of weakening the
constitution.

**Version**: 1.0.0 | **Ratified**: 2026-05-26 | **Last Amended**: 2026-05-26
