import { QuestionOption } from './QuestionOption';

function renderFeedback(answerRecord, question) {
    if (!answerRecord) {
        return <p className="feedback neutral">Chọn một đáp án để nhận phản hồi ngay lập tức.</p>;
    }

    if (answerRecord.isCorrect) {
        return <p className="feedback correct">Đúng rồi. Lựa chọn của bạn khớp với đáp án chuẩn.</p>;
    }

    const correctOption = question.options.find((option) => option.id === question.correctOptionId);
    const selectedOption = question.options.find((option) => option.id === answerRecord.selectedOptionId);

    return (
        <div className="feedback wrong">
            <p>Sai rồi. Bạn đã chọn {selectedOption?.id ?? 'không rõ'}, đáp án đúng là {correctOption?.id ?? question.correctOptionId}.</p>
            {question.explanation ? <p className="feedback-note">{question.explanation}</p> : null}
        </div>
    );
}

export function QuestionDetail({
    question,
    answerRecord,
    onChooseOption,
    totalQuestions,
    answeredCount,
    reviewOnly,
    emptyState,
}) {
    if (!question) {
        return (
            <section className="panel detail-panel">
                <div className="empty-state detail-empty">
                    {emptyState
                        ? 'Không còn câu nào trong chế độ xem này. Hãy tắt lọc câu sai hoặc reset để quay về toàn bộ bộ câu hỏi.'
                        : 'Chọn một câu ở cột trái để bắt đầu ôn tập.'}
                </div>
            </section>
        );
    }

    return (
        <section className="panel detail-panel">
            <div className="panel-header detail-header">
                <div>
                    <p className="panel-kicker">Câu {question.number}</p>
                    <h2>{question.prompt}</h2>
                </div>
                <div className="detail-stats">
                    <span>{answeredCount}/{totalQuestions} đã làm</span>
                    {reviewOnly ? <span className="detail-chip">Chế độ câu sai</span> : null}
                </div>
            </div>

            <div className="option-grid" role="list" aria-label={`Các lựa chọn cho câu ${question.number}`}>
                {question.options.map((option) => (
                    <QuestionOption
                        key={option.id}
                        option={option}
                        isSelected={answerRecord?.selectedOptionId === option.id}
                        isCorrectAnswer={answerRecord ? question.correctOptionId === option.id : false}
                        isWrongSelection={answerRecord ? answerRecord.selectedOptionId === option.id && !answerRecord.isCorrect : false}
                        onClick={() => onChooseOption(question, option.id)}
                    />
                ))}
            </div>

            <div className="feedback-panel">{renderFeedback(answerRecord, question)}</div>

            {question.explanation ? (
                <section className="explanation-box">
                    <p className="panel-kicker">Ghi chú ôn tập</p>
                    <p>{question.explanation}</p>
                </section>
            ) : null}

            {question.tags?.length ? (
                <div className="tag-row" aria-label="Từ khóa liên quan">
                    {question.tags.map((tag) => (
                        <span key={tag} className="tag-pill">
                            {tag}
                        </span>
                    ))}
                </div>
            ) : null}
        </section>
    );
}