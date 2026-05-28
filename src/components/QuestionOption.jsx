import { AnswerCard } from './ui/AnswerCard';

export function QuestionOption({ option, isSelected, isCorrectAnswer, isWrongSelection, onClick }) {
    const state = isCorrectAnswer ? 'correct' : isWrongSelection ? 'wrong' : isSelected ? 'selected' : 'default';

    return (
        <AnswerCard
            id={option.id}
            label={option.label}
            state={state}
            onClick={onClick}
            ariaLabel={`Lựa chọn ${option.id}: ${option.label}`}
        />
    );
}
