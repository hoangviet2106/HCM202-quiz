# Quickstart: HCM Quiz Review

## Prerequisites

- A modern browser.
- Node.js installed for running Vite.
- The prepared JSON question bank at `public/questions.json`.

## Setup

1. Place the extracted question bank in `public/questions.json`.
2. Install dependencies for the React + Vite app.
3. Ensure the browser can load the Vite entry at `index.html` and the React app from `src/main.jsx`.

## Run the App

1. Start the Vite development server from the repository root.
2. Open the app in a browser.
3. Verify that the left column lists all 270 questions.
4. Click a question and confirm the right panel shows the prompt and answer options.
5. Select an answer and confirm the left-side status icon updates immediately.

## Verify Persistence

1. Answer several questions.
2. Reload the page.
3. Confirm the previous selections are restored.
4. Open a previously answered question and confirm the prior choice remains visible.

## Verify Review and Reset

1. Make at least one wrong answer.
2. Switch to the wrong-answer review view and confirm only missed questions appear.
3. Click `Reset all answers`.
4. Confirm all saved answers are cleared and the UI returns to a blank state.
