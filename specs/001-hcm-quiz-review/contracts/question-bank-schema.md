# Contract: Question Bank JSON

## Purpose

Define the JSON shape used by the front end and the PDF-to-JSON extraction script.

## Root Shape

```json
{
  "version": "string",
  "source": "string",
  "questions": [
    {
      "id": "string",
      "number": 1,
      "prompt": "string",
      "options": [
        {
          "id": "A",
          "label": "string"
        }
      ],
      "correctOptionId": "A",
      "explanation": "string",
      "tags": ["string"]
    }
  ]
}
```

## Validation Rules

- `questions` must contain 270 entries for the first release.
- `id` must be unique and stable.
- `number` must be sequential and human-readable.
- `prompt` and every `options[].label` must be non-empty.
- `correctOptionId` must match one of the provided option IDs.
- Each question must have exactly one correct answer.
- `explanation` is optional but preferred for review quality.

## Consumer Expectations

- The web app reads this file only; it does not parse the PDF at runtime.
- The extraction script is responsible for producing a valid file that satisfies these rules.
