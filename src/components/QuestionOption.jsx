export function QuestionOption({ option, isSelected, isCorrectAnswer, isWrongSelection, onClick }) {
    const className = [
        'option-button',
        isSelected ? 'selected' : '',
        isCorrectAnswer ? 'correct-answer' : '',
        isWrongSelection ? 'wrong-answer' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type="button"
            className={className}
            onClick={onClick}
            aria-pressed={isSelected}
            aria-label={`Lựa chọn ${option.id}: ${option.label}`}
        >
            <span className="option-id" aria-hidden>
                {option.id}
            </span>

            <span className="option-label">{option.label}</span>
        </button>
    );
}
