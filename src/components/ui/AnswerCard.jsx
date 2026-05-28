import React from 'react';

export function AnswerCard({ id, label, state = 'default', onClick, ariaLabel }) {
    const className = ['option-button', state === 'selected' ? 'selected' : '', state === 'correct' ? 'correct-answer' : '', state === 'wrong' ? 'wrong-answer' : '']
        .filter(Boolean)
        .join(' ');

    return (
        <button type="button" className={className} onClick={onClick} aria-label={ariaLabel}>
            <span className="option-id" aria-hidden>
                {id}
            </span>
            <span className="option-label">{label}</span>
        </button>
    );
}
