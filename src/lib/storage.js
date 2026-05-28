export const STORAGE_KEY = 'hcm-quiz-review-state';

function isObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function loadStudyState() {
    try {
        const serializedState = window.localStorage.getItem(STORAGE_KEY);

        if (!serializedState) {
            return null;
        }

        const parsedState = JSON.parse(serializedState);
        if (!isObject(parsedState) || !isObject(parsedState.answerRecords)) {
            return null;
        }

        return {
            activeQuestionId: typeof parsedState.activeQuestionId === 'string' ? parsedState.activeQuestionId : null,
            updatedAt: typeof parsedState.updatedAt === 'string' ? parsedState.updatedAt : null,
            answerRecords: parsedState.answerRecords,
        };
    } catch {
        return null;
    }
}

export function saveStudyState(state) {
    try {
        const payload = {
            activeQuestionId: state.activeQuestionId ?? null,
            updatedAt: new Date().toISOString(),
            answerRecords: state.answerRecords ?? {},
        };

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
        // Ignore storage failures in private mode or restricted browsers.
    }
}

export function clearStudyState() {
    try {
        window.localStorage.removeItem(STORAGE_KEY);
    } catch {
        // Ignore storage failures in private mode or restricted browsers.
    }
}