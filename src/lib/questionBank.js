export const FALLBACK_QUESTION_BANK = {
    version: '1.0.0',
    source: 'embedded-fallback',
    questions: [],
};

function isObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function validateQuestion(question, index) {
    const errors = [];

    if (!isObject(question)) {
        return [`Question at index ${index} must be an object.`];
    }

    if (typeof question.id !== 'string' || question.id.trim() === '') {
        errors.push(`Question at index ${index} is missing a valid id.`);
    }

    if (typeof question.number !== 'number' || Number.isNaN(question.number)) {
        errors.push(`Question ${question.id ?? index} must have a numeric number.`);
    }

    if (typeof question.prompt !== 'string' || question.prompt.trim() === '') {
        errors.push(`Question ${question.id ?? index} must have a non-empty prompt.`);
    }

    if (!Array.isArray(question.options) || question.options.length < 2) {
        errors.push(`Question ${question.id ?? index} must include at least two options.`);
    }

    const optionIds = new Set();
    let hasCorrectAnswer = false;

    for (const option of question.options ?? []) {
        if (!isObject(option)) {
            errors.push(`Question ${question.id ?? index} has a malformed option.`);
            continue;
        }

        if (typeof option.id !== 'string' || option.id.trim() === '') {
            errors.push(`Question ${question.id ?? index} has an option with an invalid id.`);
            continue;
        }

        if (optionIds.has(option.id)) {
            errors.push(`Question ${question.id ?? index} has duplicate option id ${option.id}.`);
        }

        optionIds.add(option.id);

        if (typeof option.label !== 'string' || option.label.trim() === '') {
            errors.push(`Question ${question.id ?? index} has an option with an empty label.`);
        }

        if (option.id === question.correctOptionId) {
            hasCorrectAnswer = true;
        }
    }

    if (typeof question.correctOptionId !== 'string' || question.correctOptionId.trim() === '') {
        errors.push(`Question ${question.id ?? index} must define correctOptionId.`);
    } else if (!optionIds.has(question.correctOptionId)) {
        errors.push(`Question ${question.id ?? index} has a correctOptionId that does not match any option.`);
    }

    if (!hasCorrectAnswer) {
        errors.push(`Question ${question.id ?? index} must have exactly one correct answer.`);
    }

    return errors;
}

function validateQuestionBank(bank) {
    const errors = [];

    if (!isObject(bank)) {
        return ['Question bank must be a JSON object.'];
    }

    if (typeof bank.version !== 'string' || bank.version.trim() === '') {
        errors.push('Question bank must include a version string.');
    }

    if (typeof bank.source !== 'string' || bank.source.trim() === '') {
        errors.push('Question bank must include a source string.');
    }

    if (!Array.isArray(bank.questions)) {
        errors.push('Question bank must include a questions array.');
    }

    const questionIds = new Set();
    for (const [index, question] of (bank.questions ?? []).entries()) {
        const questionErrors = validateQuestion(question, index);
        errors.push(...questionErrors);

        if (question && typeof question.id === 'string') {
            if (questionIds.has(question.id)) {
                errors.push(`Duplicate question id detected: ${question.id}.`);
            }
            questionIds.add(question.id);
        }
    }

    return errors;
}

export async function loadQuestionBank() {
    try {
        const response = await fetch('/questions.json', { cache: 'no-store' });

        if (!response.ok) {
            throw new Error(`Unable to load /questions.json (${response.status})`);
        }

        const parsedBank = await response.json();
        const validationErrors = validateQuestionBank(parsedBank);

        return {
            bank: parsedBank,
            usingFallback: false,
            error: validationErrors.length ? new Error(validationErrors.join(' ')) : null,
        };
    } catch (error) {
        return {
            bank: FALLBACK_QUESTION_BANK,
            usingFallback: true,
            error,
        };
    }
}