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
    filterMode,
    searchQuery,
    totalQuestions,
    visibleCount,
    totalPages,
    currentPage,
    visibleAnsweredCount,
    visibleCorrectCount,
    visibleWrongCount,
    onSelectQuestion,
    onSearchQueryChange,
    onFilterModeChange,
    onPageChange,
}) {
    const filterOptions = [
        { id: 'all', label: 'Tất cả' },
        { id: 'unanswered', label: 'Chưa làm' },
        { id: 'answered', label: 'Đã làm' },
        { id: 'correct', label: 'Đúng' },
        { id: 'wrong', label: 'Sai' },
        { id: 'review', label: 'Ôn câu sai' },
    ];

    return (
        <aside className="panel list-panel">
            <div className="panel-header">
                <div>
                    <p className="panel-kicker">Danh sách câu hỏi</p>
                    <h2>{filterMode === 'review' ? 'Ôn câu sai' : 'Tất cả câu hỏi'}</h2>
                </div>
                <span className="panel-count">{visibleCount}/{totalQuestions}</span>
            </div>

            <label className="search-field">
                <span className="field-label">Tìm câu hỏi</span>
                <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => onSearchQueryChange(event.target.value)}
                    placeholder="Nhập số câu, từ khóa hoặc chủ đề"
                    aria-label="Tìm câu hỏi"
                />
            </label>

            <div className="chip-row" role="toolbar" aria-label="Bộ lọc câu hỏi">
                {filterOptions.map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        className={`filter-chip ${filterMode === option.id ? 'active' : ''}`}
                        onClick={() => onFilterModeChange(option.id)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            <div className="summary-table-card">
                <table className="summary-table">
                    <tbody>
                        <tr>
                            <th scope="row">Đã làm</th>
                            <td>{visibleAnsweredCount}</td>
                        </tr>
                        <tr>
                            <th scope="row">Đúng</th>
                            <td>{visibleCorrectCount}</td>
                        </tr>
                        <tr>
                            <th scope="row">Sai</th>
                            <td>{visibleWrongCount}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="list-pagination">
                <button
                    type="button"
                    className="pagination-button"
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                >
                    Trước
                </button>
                <span className="pagination-status">
                    Trang {currentPage}/{totalPages}
                </span>
                <button
                    type="button"
                    className="pagination-button"
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage >= totalPages}
                >
                    Sau
                </button>
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
                        Không có câu hỏi nào trong chế độ xem hiện tại. Hãy đổi bộ lọc hoặc xóa từ khóa tìm kiếm.
                    </div>
                )}
            </div>
        </aside>
    );
}
