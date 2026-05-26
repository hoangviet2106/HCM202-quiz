# Contract: localStorage State

## Purpose

Define the browser storage shape used to persist answer selections and restore the session.

## Storage Key

- `hcm-quiz-review-state`

## Stored Shape

```json
{
  "activeQuestionId": "string",
  "updatedAt": "2026-05-26T00:00:00.000Z",
  "answerRecords": {
    "question-001": {
      "selectedOptionId": "A",
      "isCorrect": true,
      "answeredAt": "2026-05-26T00:00:00.000Z"
    }
  }
}
```

## Validation Rules

- Saved state must be valid JSON.
- Missing or malformed state must be treated as empty state.
- Reset must remove or clear the stored data.
- Revisiting a question must restore the prior selected option if it exists.

## Consumer Expectations

- The UI must read this state on startup.
- The UI must write this state after each answer change.
- The wrong-answer view must derive from this state.
