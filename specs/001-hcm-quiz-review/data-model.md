# Data Model: HCM Quiz Review

## QuestionBank

Represents the full validated set of 270 questions loaded by the app.

### Fields
- `version`: bank version string
- `source`: source description, such as the PDF title or preparation run
- `questions`: ordered list of Question records

### Rules
- Must contain exactly 270 questions for the initial release.
- Question identifiers must be unique and stable.
- The bank must be parseable as valid JSON.

## Question

Represents one multiple-choice question displayed in the interface.

### Fields
- `id`: stable unique identifier
- `number`: display order in the bank
- `prompt`: question text in Vietnamese
- `options`: list of AnswerOption records
- `correctOptionId`: identifier of the correct option
- `explanation`: optional review note or explanation
- `tags`: optional topic markers

### Rules
- Must have one and only one correct option.
- Must include at least two answer options.
- Must preserve Vietnamese text and punctuation.
- Must be referenceable from the left-hand list and the right-hand detail panel.

## AnswerOption

Represents one selectable answer choice for a question.

### Fields
- `id`: stable unique identifier within the question
- `label`: visible answer text

### Rules
- Option identifiers must be unique within a question.
- Labels must render without truncating critical meaning.

## AnswerRecord

Represents the saved state for one question after the user answers or reviews it.

### Fields
- `questionId`: related Question identifier
- `selectedOptionId`: option selected by the user, if any
- `isCorrect`: boolean correctness result
- `answeredAt`: timestamp of the most recent selection

### Rules
- Must be stored in browser persistence.
- Must be restorable on reload.
- Must keep the latest selected option when the user revisits the question.

## StudySession

Represents the current learning session state.

### Fields
- `activeQuestionId`: currently selected question
- `answerRecords`: collection of AnswerRecord entries
- `updatedAt`: last state update timestamp

### Rules
- Must drive left-column status icons and wrong-answer filtering.
- Must be cleared by the reset action.

## ReviewFilter

A derived view, not a separately stored entity.

### Behavior
- Includes only questions with `isCorrect = false` in the current saved state.
- Must update automatically as answers change.
