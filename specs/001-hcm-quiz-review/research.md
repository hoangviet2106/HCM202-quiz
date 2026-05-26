# Research: HCM Quiz Review

## Decision 1: Use plain HTML, CSS, and JavaScript

- Decision: Build the app with HTML5, CSS3, and vanilla JavaScript only.
- Rationale: The requested product is a static quiz interface with a small, well-bounded feature set. A framework would add setup and bundle overhead without improving the core user flow.
- Alternatives considered: React, Vue, or a build tool based SPA. Rejected because the user explicitly requested a non-framework stack and the feature scope does not justify the extra complexity.

## Decision 2: Store state in browser localStorage

- Decision: Persist user answers and review state in `localStorage`.
- Rationale: The app must restore progress when the user returns, and localStorage is sufficient for a single-user browser-based study tool.
- Alternatives considered: Server-side storage, IndexedDB, or cookies. Rejected because the app is static, should not require a backend, and needs a simpler persistence model.

## Decision 3: Represent the question bank as a JSON file

- Decision: Convert the PDF source into a validated JSON file before the web app loads it.
- Rationale: A JSON question bank is easy for the front end to consume, validate, and render consistently. It also keeps PDF parsing separate from runtime UI behavior.
- Alternatives considered: Parse the PDF directly in the browser or add an import UI. Rejected because the spec now requires a separate preparation script and no in-app import flow.

## Decision 4: Use a two-column responsive layout

- Decision: Implement the main quiz screen as a left question list and a right detail panel.
- Rationale: The two-column layout supports quick navigation across all 270 questions while keeping the active question visible and easy to answer.
- Alternatives considered: Single-column paging or modal-based navigation. Rejected because they make revisiting questions and reviewing wrong answers slower.

## Decision 5: Filter wrong answers from saved state

- Decision: Derive the wrong-answer review view from stored answer results rather than storing a separate manual list.
- Rationale: This keeps the review view synchronized with the answer history and reduces duplicated state.
- Alternatives considered: A manually curated review list or tagging system. Rejected because it adds extra user actions and complexity without clear benefit for the first version.
