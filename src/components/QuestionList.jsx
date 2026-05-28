function getBadgeLabel(answerRecord) {
    if (!answerRecord) {
        return 'Chưa làm';
    }

    return answerRecord.isCorrect ? 'Đúng' : 'Sai';
}

function getBadgeClass(answerRecord) {
    if (!answerRecord) {
        return 'badge neutral';
    }

    return answerRecord.isCorrect ? 'badge correct' : 'badge wrong';
}

function createPreviewText(prompt) {
    if (!prompt) {
        return '';
    }

    return prompt.length > 72 ? `${prompt.slice(0, 72).trimEnd()}...` : prompt;
}

export function QuestionList({
    questions,
    activeQuestionId,
    answerRecords,
    reviewOnly,
    onSelectQuestion,
}) {
    return (
        <aside className="panel list-panel">
            <div className="panel-header">
                <div>
                    <p className="panel-kicker">Danh sách câu hỏi</p>
                    <h2>{reviewOnly ? 'Chỉ câu sai' : 'Tất cả câu hỏi'}</h2>
                </div>
                <span className="panel-count">{questions.length}</span>
            </div>

            <div className="question-list" role="list" aria-label="Danh sách câu hỏi">
                {questions.map((question) => {
                    const answerRecord = answerRecords[question.id] ?? null;
                    const isActive = question.id === activeQuestionId;

                    return (
                        <button
                            key={question.id}
                            type="button"
                            className={`question-row ${isActive ? 'active' : ''}`}
                            onClick={() => onSelectQuestion(question.id)}
                        >
                            <span className="question-number">{question.number}</span>
                            <span className="question-summary">
                                <span className="question-title">{createPreviewText(question.prompt)}</span>
                                <span className="question-meta">{question.options.length} lựa chọn</span>
                            </span>
                            <span className={getBadgeClass(answerRecord)}>{getBadgeLabel(answerRecord)}</span>
                        </button>
                    );
                })}

                {questions.length === 0 && (
                    <div className="empty-state list-empty">
                        Không có câu hỏi nào trong chế độ xem hiện tại.
                    </div>
                )}
            </div>
        </aside>
    );
}