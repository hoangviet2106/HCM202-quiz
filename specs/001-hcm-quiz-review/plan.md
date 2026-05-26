# Implementation Plan: HCM Quiz Review

**Branch**: `[001-hcm-quiz-review]` | **Date**: 2026-05-26 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-hcm-quiz-review/spec.md`

## Summary

Build a static web application for reviewing 270 multiple-choice questions on Tư tưởng Hồ Chí Minh with a two-column layout: a question list on the left, a detail panel on the right, immediate correctness feedback, wrong-answer review, and answer persistence in `localStorage`. The front-end will be built with React + Vite, and the question bank will be prepared from PDF into JSON before the web app loads it.

## Technical Context

**Language/Version**: React 18+, Vite, JavaScript (ES2020+), HTML5, CSS3

**Primary Dependencies**: React, React DOM, Vite

**Storage**: Browser `localStorage` for saved answers and session state; static JSON file for question bank

**Testing**: Manual browser checks, data validation checks for JSON import output, and scripted smoke checks for persistence/reset behavior

**Target Platform**: Modern desktop and mobile browsers

**Project Type**: Static web application (SPA front-end)

**Performance Goals**: Render the question list and initial detail view in under 2 seconds on a typical browser; answer feedback should appear immediately after selection

**Constraints**: No backend, must remain usable on mobile, Vietnamese text must render correctly, question state must survive page reloads, front-end should stay lightweight within Vite

**Scale/Scope**: 270 question items, single subject area, one primary question bank, one local persistence layer

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Source fidelity: question content comes from one approved JSON bank derived from the PDF source.
- Deterministic assessment: answer choice, correctness, and left-side status indicators must be stable for the same saved state.
- Learning-first UX: the two-column flow supports fast review, mistake tracking, and reset/retry behavior.
- Vietnamese-first accessibility: layout and content must stay readable on smaller screens and preserve Vietnamese accents.
- Testable content and behavior: data validation, selection state, wrong-answer filtering, localStorage restore, and reset behavior are all independently checkable.

## Project Structure

### Documentation (this feature)

```text
specs/001-hcm-quiz-review/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── components/
├── hooks/
├── styles/
└── main.jsx
public/
└── questions.json
scripts/
└── extract-questions-from-pdf.js
index.html
vite.config.js
```

**Structure Decision**: A Vite-powered React front-end with the quiz UI implemented in `src/`, plus a standalone script that converts the PDF source into `public/questions.json`. The app reads only JSON and does not implement PDF import UI.

## Execution Phases

### Phase 1: Prepare JSON Data from PDF

**Goal**: Produce a validated `questions.json` file from the provided PDF source.

**Tasks**:
- Define the expected question JSON shape and validation rules.
- Build a standalone extraction script that reads the PDF and emits one record per question.
- Validate 270 question records, answer options, correct answer presence, and unique question IDs.
- Export the cleaned JSON into `public/questions.json`.
- Verify the output by spot-checking multiple questions against the PDF source.

**Checkpoints**:
- JSON file exists and is parseable.
- Exactly 270 questions are present.
- Every question has one correct answer and a stable identifier.
- Duplicate, missing, or malformed entries are reported by the script.

### Phase 2: Build Static Front End with React + Vite

**Goal**: Implement the two-column user interface and base question navigation with React components before persistence complexity.

**Tasks**:
- Bootstrap the Vite app shell and root React rendering entry.
- Create reusable React components for the question list, detail panel, and answer option items.
- Use Flexbox/Grid and component layout rules to keep the two-column design responsive on desktop and stacked or compressed on smaller screens.
- Render all 270 question entries in the left column as numbered items or short summaries.
- Show the selected question prompt and answer options in the right column.
- Add clear visual states for selected question, answered question, correct/incorrect preview states, and disabled/empty states.
- Add Vietnamese typography, spacing, and contrast rules suitable for study use.

**Checkpoints**:
- The page loads with the full question list visible.
- Clicking any list item updates the right panel correctly.
- Layout remains usable on mobile and desktop widths.
- Basic visual states are distinct and readable.

### Phase 3: Integrate Answer Logic and Storage

**Goal**: Make answer selection, wrong-answer filtering, and persistence work across reloads.

**Tasks**:
- Implement answer selection and immediate correct/incorrect feedback.
- Update the left column with status icons such as ✓ and ✗.
- Save answer state to `localStorage` after each change.
- Restore state automatically on page load.
- Ensure revisiting a question shows the previously selected answer.
- Add a "Reset all answers" control that clears storage and refreshes all statuses.
- Implement the wrong-answer review filter so only missed questions can be reviewed.
- Recompute counts and summary indicators from saved state after reload.

**Checkpoints**:
- Answer choices persist after refresh.
- Revisiting a question shows the same prior selection.
- Wrong-answer filter returns the correct subset.
- Reset clears all stored answers and returns the app to a clean state.

## Complexity Tracking

> Fill only if a constitution gate requires a justified exception.

No exceptions required.
